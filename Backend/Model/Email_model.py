from sqlalchemy import Column, String, Integer
from Database import base

class Email(base):
    __tablename__ = "Email"

    id = Column(Integer, primary_key=True, index=True)
    email_address = Column(String(255), nullable=False, unique=True)