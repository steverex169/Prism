from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    text,
    Numeric,
    Text,
)

from Database import base


class OrderModel(base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    order_number = Column(
        String(50),
        nullable=False,
        unique=True
    )

    customer_name = Column(
        String(100),
        nullable=False
    )

    customer_email = Column(
        String(100),
        nullable=False
    )
    
    research_field = Column(
    String(100),
    nullable=False
    )

    items = Column(
        Integer,
        nullable=False
    )

    total = Column(
        Numeric(12, 2),
        nullable=False
    )

    payment = Column(
        String(20),
        nullable=False
    )

    payment_method = Column(
        String(50),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    email_details = Column(Text, nullable=True)
    user_id = Column(Integer, nullable=True, index=True)
    refunded_total = Column(Numeric(12, 2), nullable=False, default=0, server_default=text("0"))
    delivered_at = Column(DateTime, nullable=True)

    date = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )
