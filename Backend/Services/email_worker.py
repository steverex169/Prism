import asyncio
import json
import logging
import os
from datetime import timedelta

from Database import session_local
from Model.User_model import User
from Model.order_model import OrderModel
from Model.abandoned_cart_model import AbandonedCartModel
from Model.notification_model import EmailOutbox
from Services.email_service import queue_email, deliver_pending, first_name, site_url, money, utcnow
from Services.account_service import cleanup_unverified
from Services.order_email_service import queue_order_event

logger = logging.getLogger(__name__)


def maintenance_tick():
    with session_local() as db:
        cleanup_unverified(db)
        for cart in db.query(AbandonedCartModel).filter(
            AbandonedCartModel.status == "pending", AbandonedCartModel.items > 0,
            AbandonedCartModel.last_active <= utcnow() - timedelta(hours=1),
            AbandonedCartModel.last_active >= utcnow() - timedelta(days=2),
        ).all():
            user = db.query(User).filter_by(email=cart.customer_email, email_verified=True, is_active=True).first()
            if user:
                try:
                    raw_items = json.loads(cart.cart_items)
                    items = [{"name": i.get("name", "Product"), "quantity": i.get("quantity", 1),
                          "total": money(float(i.get("price", 0)) * int(i.get("quantity", 1))),
                          "imageUrl": site_url(i.get("image", "")) if str(i.get("image", "")).startswith("/") else i.get("image", "")}
                             for i in raw_items]
                except (ValueError, TypeError, AttributeError, OverflowError):
                    logger.warning("Skipping invalid legacy abandoned cart %s", cart.id)
                    continue
                queue_email(db, "AbandonedCart", user.email, {"firstName": first_name(user.full_name),
                            "items": items, "cartUrl": site_url("/checkout")}, f"abandoned:{cart.id}:{cart.created_at.isoformat()}")
        for order in db.query(OrderModel).filter(
            OrderModel.delivered_at <= utcnow() - timedelta(days=3),
            OrderModel.status.in_(["delivered", "completed"]),
            OrderModel.payment.notin_(["refunded", "Refunded"]),
        ).all():
            queue_order_event(db, order, "ReviewRequest")
        db.commit()
        deliver_pending(db)


async def run_worker():
    if os.getenv("EMAIL_WORKER_ENABLED", "true").lower() != "true":
        return
    while True:
        try:
            await asyncio.to_thread(maintenance_tick)
        except Exception:
            logger.exception("Email maintenance failed")
        await asyncio.sleep(30)
