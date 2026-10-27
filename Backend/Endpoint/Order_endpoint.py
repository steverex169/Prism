from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from Database import get_db
from Model.order_model import OrderModel
from Model.abandoned_cart_model import AbandonedCartModel
from Endpoint.User_endpoint import get_user_from_request, compliance_complete
from Endpoint.Admin_endpoint import admin_status
from Services.order_email_service import queue_transition
from Model.notification_model import EmailOutbox
import json


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# =========================
# Pydantic Schemas
# =========================

class OrderCreate(BaseModel):
    order_number: str = Field(min_length=1, max_length=50)
    customer_name: str
    customer_email: str
    items: int = Field(ge=1, le=10000)
    total: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    payment: str
    payment_method: str
    status: Optional[str] = "pending"
    research_field: str
    email_details: dict = Field(default_factory=dict)

    @field_validator("email_details")
    @classmethod
    def validate_email_snapshot(cls, details):
        allowed = {"items", "totals", "shippingAddress", "billingAddress", "shippingMethod"}
        if set(details) - allowed:
            raise ValueError("Unsupported order email details.")
        if len(json.dumps(details)) > 60000:
            raise ValueError("Order email details are too large.")
        if "items" in details:
            if not isinstance(details["items"], list) or len(details["items"]) > 100:
                raise ValueError("Invalid order items.")
            for item in details["items"]:
                if not isinstance(item, dict) or not all(key in item for key in ("name", "quantity", "total", "imageUrl")):
                    raise ValueError("Order item details are incomplete.")
        for name in ("shippingAddress", "billingAddress"):
            if name in details and (not isinstance(details[name], list) or any(not isinstance(line, str) for line in details[name])):
                raise ValueError("Invalid order address.")
        if "totals" in details and (not isinstance(details["totals"], dict) or not all(key in details["totals"] for key in ("subtotal", "shipping", "total"))):
            raise ValueError("Order totals are incomplete.")
        return details


class OrderUpdate(BaseModel):
    order_number: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    research_field: str
    items: Optional[int] = None
    total: Optional[Decimal] = Field(None, ge=0, max_digits=12, decimal_places=2)
    payment: Optional[str] = None
    payment_method: Optional[str] = None
    status: Optional[str] = None


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    research_field: str
    items: int
    total: float
    payment: str
    payment_method: str
    status: str
    date: Optional[datetime] = None



#========================
# Get All Orders
#=======================
@router.get("/", response_model=List[OrderResponse], dependencies=[Depends(admin_status)])
def get_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(OrderModel)
        .order_by(OrderModel.id.asc())
        .all()
    )

    return orders


#========================
# Search Orders by Customer Name
#=======================
@router.get("/search", response_model=List[OrderResponse], dependencies=[Depends(admin_status)])
def search_orders(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(OrderModel)
        .filter(
            OrderModel.customer_name.ilike(
                f"%{name}%"
            )
        )
        .order_by(OrderModel.id.asc())
        .all()
    )

    return orders


# =========================
# Get Order By ID
# =========================

@router.get("/{order_id}", response_model=OrderResponse, dependencies=[Depends(admin_status)])
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(OrderModel)
        .filter(OrderModel.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order

# =========================
# Create Order
# =========================
@router.post(
    "/",
    response_model=OrderResponse,
    status_code=201
)
def create_order(
    order_data: OrderCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_user_from_request(request, db)

    if order_data.payment.lower() != "unpaid" or order_data.status not in {None, "pending"}:
        raise HTTPException(400, "Payment and fulfillment must be confirmed by the store.")

    if not compliance_complete(user):
        raise HTTPException(
            status_code=403,
            detail="Complete your qualified researcher account before placing an order."
        )

    existing_order = (
        db.query(OrderModel)
        .filter(
            OrderModel.order_number ==
            order_data.order_number
        )
        .first()
    )

    if existing_order:
        raise HTTPException(
            status_code=400,
            detail="Order number already exists"
        )

    new_order = OrderModel(
        order_number=order_data.order_number,
        customer_name=user.full_name,
        customer_email=user.email,
        research_field=user.research_field,
        items=order_data.items,
        total=order_data.total,
        payment=order_data.payment,
        payment_method=order_data.payment_method,
        status=order_data.status or "pending",
        email_details=json.dumps(order_data.email_details),
        user_id=user.id,
    )

    db.add(new_order)
    db.flush()
    queue_transition(db, new_order)
    db.refresh(new_order)
    abandoned_cart = (
        db.query(AbandonedCartModel)
        .filter(
            AbandonedCartModel.customer_email ==
            user.email.strip().lower()
        )
        .filter(
            AbandonedCartModel.status.in_(
                ["pending", "followed_up"]
            )
        )
        .order_by(
            AbandonedCartModel.id.desc()
        )
        .first()
    )

    if abandoned_cart:
        abandoned_cart.status = "ordered"
        abandoned_cart.order_id = new_order.id
        pending = db.query(EmailOutbox).filter_by(
            event_key=f"abandoned:{abandoned_cart.id}:{abandoned_cart.created_at.isoformat()}", status="pending").first()
        if pending:
            pending.status = "cancelled"
    db.commit()
    db.refresh(new_order)

    return new_order

# =========================
# Update Order
# =========================

@router.put("/{order_id}", response_model=OrderResponse, dependencies=[Depends(admin_status)])
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: Session = Depends(get_db)
):
    order = (
        db.query(OrderModel)
        .filter(OrderModel.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    update_data = order_data.model_dump(
        exclude_unset=True
    )

    if "order_number" in update_data:
        existing_order = (
            db.query(OrderModel)
            .filter(
                OrderModel.order_number == update_data["order_number"],
                OrderModel.id != order_id
            )
            .first()
        )

        if existing_order:
            raise HTTPException(
                status_code=400,
                detail="Order number already exists"
            )

    previous_payment, previous_status = order.payment, order.status
    for field, value in update_data.items():
        setattr(order, field, value)

    queue_transition(db, order, previous_payment, previous_status)

    db.commit()
    db.refresh(order)

    return order


# =========================
# Delete Order
# =========================

@router.delete("/{order_id}", dependencies=[Depends(admin_status)])
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(OrderModel)
        .filter(OrderModel.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully",
        "id": order_id
    }
