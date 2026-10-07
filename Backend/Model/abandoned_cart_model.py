from sqlalchemy import Column, Integer, String, Text, DateTime, text

from Database import base


class AbandonedCartModel(base):
    __tablename__ = "abandoned_carts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_name = Column(
        String(100),
        nullable=False
    )

    customer_email = Column(
        String(100),
        nullable=False,
        index=True
    )

    customer_phone = Column(
        String(50),
        nullable=False
    )

    research_field = Column(
        String(100),
        nullable=True
    )

    cart_items = Column(
        Text,
        nullable=False
    )

    items = Column(
        Integer,
        nullable=False,
        default=0
    )

    total = Column(
        Integer,
        nullable=False,
        default=0
    )

    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    order_id = Column(
        Integer,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )

    last_active = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )