from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    text,
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

    items = Column(
        Integer,
        nullable=False
    )

    total = Column(
        Integer,
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

    promotion = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    date = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )