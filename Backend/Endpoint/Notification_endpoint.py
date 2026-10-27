"""Staff-confirmed fulfillment events and the customer's account tools."""
import json
from decimal import Decimal
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from Database import get_db
from Model.order_model import OrderModel
from Model.product_model import ProductModel
from Model.notification_model import EmailOutbox, StockSubscription, OrderReview, EmailChallenge
from Endpoint.Admin_endpoint import admin_status
from Endpoint.User_endpoint import get_user_from_request
from Services.order_email_service import queue_order_event, event_key
from Services.email_service import utcnow

router = APIRouter(tags=["Notifications"])


class OrderEvent(BaseModel):
    event: Literal["OrderShipped", "OutForDelivery", "OrderDelivered", "OrderCancelled", "RefundIssued",
                   "PaymentFailed", "OrderOnHold", "OrderConfirmation", "ReturnReceived", "CustomerNote"]
    reference: str = Field(min_length=1, max_length=100)
    details: dict[str, str] = Field(default_factory=dict)


class ReviewRequest(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=3, max_length=3000)


@router.get("/user/orders")
def customer_orders(request: Request, db: Session = Depends(get_db)):
    user = get_user_from_request(request, db)
    orders = db.query(OrderModel).filter(or_(OrderModel.user_id == user.id,
        and_(OrderModel.user_id.is_(None), OrderModel.customer_email == user.email))).order_by(OrderModel.id.desc()).all()
    return [{"id": o.id, "order_number": o.order_number, "total": float(o.total), "payment": o.payment,
             "status": o.status, "date": o.date, "details": json.loads(o.email_details or "{}")}
            for o in orders]


@router.post("/user/orders/{order_id}/review")
def review_order(order_id: int, data: ReviewRequest, request: Request, db: Session = Depends(get_db)):
    user = get_user_from_request(request, db)
    order = db.query(OrderModel).filter(OrderModel.id == order_id, or_(OrderModel.user_id == user.id,
        and_(OrderModel.user_id.is_(None), OrderModel.customer_email == user.email))).first()
    if not order:
        raise HTTPException(404, "Order not found.")
    if order.status.lower() not in {"delivered", "completed"}:
        raise HTTPException(400, "Reviews are available after delivery.")
    review = db.query(OrderReview).filter_by(order_id=order_id).first()
    if review:
        review.rating, review.comment = data.rating, data.comment.strip()
    else:
        db.add(OrderReview(order_id=order_id, user_id=user.id, rating=data.rating,
                           comment=data.comment.strip(), created_at=utcnow()))
    db.commit()
    return {"message": "Thank you. Your review has been saved."}


@router.post("/products/{product_id}/stock-alert")
def subscribe_stock(product_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_user_from_request(request, db)
    product = db.query(ProductModel).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(404, "Product not found.")
    if product.available:
        raise HTTPException(400, "This product is already available.")
    alert = db.query(StockSubscription).filter_by(user_id=user.id, product_id=product_id).first()
    if alert:
        alert.notified = False
    else:
        db.add(StockSubscription(user_id=user.id, product_id=product_id))
    db.commit()
    return {"message": "We'll email you when this product is back in stock."}


@router.post("/admin/orders/{order_id}/events", dependencies=[Depends(admin_status)])
def record_order_event(order_id: int, data: OrderEvent, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter_by(id=order_id).with_for_update().first()
    if not order:
        raise HTTPException(404, "Order not found.")
    states = {"OrderShipped": "shipped", "OutForDelivery": "out_for_delivery", "OrderDelivered": "delivered",
              "OrderCancelled": "cancelled", "OrderOnHold": "on_hold"}
    # Prevent duplicate confirmations from changing state a second time.
    key = event_key(order, data.event, data.reference if data.event in {'RefundIssued', 'ReturnReceived', 'CustomerNote'} else None)
    existing = db.query(EmailOutbox).filter_by(event_key=key).first()
    if existing:
        return {"message": "This event was already recorded.", "email_id": existing.id}
    allowed = {"carrier", "trackingNumber", "trackingUrl", "estimatedDelivery", "refundAmount",
               "returnNumber", "returnLabelUrl", "note", "reason"}
    details = {key: value for key, value in data.details.items() if key in allowed}
    # Tracking data is persisted so delivery updates can reuse it.
    snapshot = json.loads(order.email_details or "{}")
    details = {**{k: snapshot[k] for k in allowed if k in snapshot}, **details}
    email = queue_order_event(db, order, data.event, details, data.reference)
    if data.event in states:
        order.status = states[data.event]
    if data.event == "OrderConfirmation":
        order.payment = "Paid"
    elif data.event == "PaymentFailed":
        order.payment = "Failed"
    elif data.event == "RefundIssued":
        order.refunded_total = Decimal(str(order.refunded_total or 0)) + Decimal(details["refundAmount"].replace("$", "").replace(",", ""))
        order.payment = "Refunded" if order.refunded_total >= order.total else "Partially Refunded"
    order.email_details = json.dumps({**snapshot, **{k: v for k, v in details.items()
                                                   if k in {"carrier", "trackingNumber", "trackingUrl", "estimatedDelivery"}}})
    db.flush()
    db.commit()
    return {"message": "Event recorded and customer email queued.", "email_id": email.id}


@router.get("/admin/emails", dependencies=[Depends(admin_status)])
def email_status(db: Session = Depends(get_db)):
    return [{"id": e.id, "template": e.template, "recipient": e.recipient, "status": e.status,
             "attempts": e.attempts, "last_error": e.last_error, "created_at": e.created_at,
             "sent_at": e.sent_at} for e in db.query(EmailOutbox).order_by(EmailOutbox.id.desc()).limit(200).all()]


@router.post("/admin/emails/{email_id}/retry", dependencies=[Depends(admin_status)])
def retry_email(email_id: int, db: Session = Depends(get_db)):
    email = db.query(EmailOutbox).filter_by(id=email_id).first()
    if not email or email.status != "failed":
        raise HTTPException(400, "Only failed emails can be retried.")
    if email.event_key.startswith("challenge:"):
        cid = int(email.event_key.split(":")[1])
        challenge = db.query(EmailChallenge).filter_by(id=cid).first()
        if not challenge or challenge.consumed_at or challenge.expires_at <= utcnow():
            raise HTTPException(400, "This verification link has expired. Request a new one.")
    email.status, email.attempts, email.available_at = "pending", 0, utcnow()
    db.commit()
    return {"message": "Email queued for retry."}
