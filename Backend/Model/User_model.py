from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    text,
)

from sqlalchemy.sql import func
from Database import base


class User(base):
    __tablename__ = "Users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(255),
        nullable=False
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    # Compliance fields.
    # Server defaults keep existing rows valid when these columns are added.
    age_verified = Column(
        Boolean,
        default=False,
        server_default=text("0"),
        nullable=False
    )

    qualified_researcher = Column(
        Boolean,
        default=False,
        server_default=text("0"),
        nullable=False
    )

    research_field = Column(
        String(255),
        nullable=True
    )

    research_use_acknowledged = Column(
        Boolean,
        default=False,
        server_default=text("0"),
        nullable=False
    )

    terms_accepted = Column(
        Boolean,
        default=False,
        server_default=text("0"),
        nullable=False
    )

    terms_accepted_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )
