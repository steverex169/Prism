from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from Database import base


class ProductModel(base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    price = Column(Integer, nullable=False)
    image = Column(String(500), nullable=True)

    available = Column(Boolean, nullable=False, default=True)
    featured = Column(Boolean, nullable=False, default=False)
    sales = Column(Integer, nullable=False, default=0)
    relevance = Column(Integer, nullable=False, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )