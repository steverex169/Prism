from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from Database import base


class ShippingModel(base):
    __tablename__ = "shipping"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)

    research_field = Column(String(100), nullable=False)

    street_address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    zip_code = Column(String(20), nullable=False)
    state = Column(String(100), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )