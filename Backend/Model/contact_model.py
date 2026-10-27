
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.dialects.mysql import CHAR
import uuid

from Database import base  # Import Base from your existing database module


class Contact(base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id = Column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    full_name = Column(String(150), nullable=False)
    email = Column(String(254), nullable=False, index=True)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    email_sent = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None),
    )
