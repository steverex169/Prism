"""Persistent transactional mail, one-time challenges and stock subscriptions."""
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, UniqueConstraint
from Database import base


class EmailChallenge(base):
    __tablename__ = "email_challenges"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    purpose = Column(String(30), nullable=False)
    email = Column(String(255), nullable=False)
    token_hash = Column(String(64), nullable=False, unique=True)
    code_hash = Column(String(64), nullable=True)
    attempts = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    consumed_at = Column(DateTime, nullable=True)


class EmailOutbox(base):
    __tablename__ = "email_outbox"
    id = Column(Integer, primary_key=True)
    event_key = Column(String(255), nullable=False, unique=True)
    template = Column(String(60), nullable=False)
    recipient = Column(String(255), nullable=False)
    props = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending", index=True)
    attempts = Column(Integer, nullable=False, default=0)
    available_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    provider_id = Column(String(255), nullable=True)
    last_error = Column(String(255), nullable=True)


class StockSubscription(base):
    __tablename__ = "stock_subscriptions"
    __table_args__ = (UniqueConstraint("user_id", "product_id"),)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False, index=True)
    notified = Column(Boolean, nullable=False, default=False)


class OrderReview(base):
    __tablename__ = "order_reviews"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, nullable=False, unique=True)
    user_id = Column(Integer, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
