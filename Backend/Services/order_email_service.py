"""Translate recorded order transitions into deduplicated transactional messages."""
import json
from decimal import Decimal, InvalidOperation
from fastapi import HTTPException
from Services.email_service import queue_email, first_name, site_url, money, utcnow
from Model.notification_model import EmailOutbox

EVENTS = {"OrderShipped", "OutForDelivery", "OrderDelivered", "OrderCancelled",
          "RefundIssued", "PaymentFailed", "OrderOnHold", "OrderConfirmation",
          "ReturnReceived", "CustomerNote", "ReviewRequest"}


def event_key(order, event, reference=None):
    return f"order:{order.id}:{event}:{reference or 'once'}"


def order_props(order):
    details = json.loads(order.email_details or "{}")
    # Older orders only stored item counts. Do not insert sample products into real mail.
    items = [{**i, "imageUrl": site_url(i["imageUrl"]) if str(i.get("imageUrl", "")).startswith("/") else i.get("imageUrl", "")}
             for i in details.get("items", [])]
    return {"firstName": first_name(order.customer_name), "orderNumber": order.order_number,
            "orderDate": (order.date or utcnow()).strftime("%d %b %Y"),
            "paymentMethod": order.payment_method, "shippingMethod": details.get("shippingMethod", "Standard"),
            "totals": details.get("totals", {"subtotal": money(order.total), "shipping": money(0), "total": money(order.total)}),
            "shippingAddress": details.get("shippingAddress", []),
            "billingAddress": details.get("billingAddress", []),
            "orderUrl": site_url(f"/account?order={order.id}"), **details, "items": items}


def queue_order_event(db, order, event, metadata=None, event_id=None):
    if event not in EVENTS:
        raise HTTPException(400, "Unsupported order email event.")
    data = metadata or {}
    required = {"OrderShipped": ["carrier", "trackingNumber", "trackingUrl", "estimatedDelivery"],
                "OutForDelivery": ["carrier", "trackingNumber", "trackingUrl"],
                "RefundIssued": ["refundAmount"], "ReturnReceived": ["returnNumber", "carrier", "returnLabelUrl"],
                "CustomerNote": ["note"]}.get(event, [])
    for field in required:
        if not data.get(field):
            raise HTTPException(422, f"{field} is required for {event}.")
    if event in {"CustomerNote", "RefundIssued", "ReturnReceived"} and not event_id:
        raise HTTPException(422, "A unique event reference is required.")
    for field in ("trackingUrl", "returnLabelUrl"):
        if field in data and not str(data[field]).startswith("https://"):
            raise HTTPException(422, f"{field} must be an HTTPS URL.")
    if event == "RefundIssued":
        try:
            amount = Decimal(str(data["refundAmount"]).replace("$", "").replace(",", ""))
        except InvalidOperation:
            raise HTTPException(422, "Enter a valid refund amount.")
        if not amount.is_finite() or amount.as_tuple().exponent < -2 or not 0 < amount <= Decimal(str(order.total)) - Decimal(str(order.refunded_total or 0)):
            raise HTTPException(422, "Refund amount must be positive, have at most two decimals, and cannot exceed the remaining order total.")
        data = {**data, "refundAmount": money(amount)}
    props = {**order_props(order), "deliveredAt": utcnow().strftime("%d %b %Y"),
             "cancelledAt": utcnow().strftime("%d %b %Y"), "reason": "Order cancelled by the store.",
             "refundedAt": utcnow().strftime("%d %b %Y"), "amountDue": money(order.total),
             "paymentUrl": site_url(f"/account?order={order.id}"),
             "reviewUrl": site_url(f"/account?review={order.id}"), "refundMethod": order.payment_method, **data}
    # Metadata may fill event details, never change order identity or link recipients elsewhere.
    props.update({"firstName": first_name(order.customer_name), "orderNumber": order.order_number})
    key = event_key(order, event, event_id if event in {"CustomerNote", "RefundIssued", "ReturnReceived"} else None)
    queued = queue_email(db, event, order.customer_email, props, key)
    if event == "OrderDelivered":
        order.delivered_at = order.delivered_at or utcnow()
    if event in {"OrderCancelled", "RefundIssued"}:
        pending = db.query(EmailOutbox).filter_by(event_key=event_key(order, "ReviewRequest"), status="pending").first()
        if pending:
            pending.status = "cancelled"
    return queued


def queue_transition(db, order, previous_payment=None, previous_status=None):
    payment, state = order.payment.lower(), order.status.lower().replace(" ", "_")
    if previous_payment != order.payment and payment in {"paid", "completed"}:
        queue_order_event(db, order, "OrderConfirmation")
    elif previous_payment != order.payment and payment in {"failed", "declined"}:
        queue_order_event(db, order, "PaymentFailed")
    elif previous_payment is None and payment not in {"paid", "completed"}:
        queue_order_event(db, order, "OrderOnHold")
    if previous_status != order.status:
        event = {"cancelled": "OrderCancelled", "canceled": "OrderCancelled", "delivered": "OrderDelivered",
                 "completed": "OrderDelivered", "on_hold": "OrderOnHold", "pending": "OrderOnHold",
                 "shipped": "OrderShipped", "out_for_delivery": "OutForDelivery"}.get(state)
        if event:
            queue_order_event(db, order, event, json.loads(order.email_details or "{}"))
