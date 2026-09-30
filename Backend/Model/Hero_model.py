from sqlalchemy import Column, Integer, String
from Database import base


class HeroImages(base):
    __tablename__ = "HeroImages"

    id = Column(Integer, primary_key=True, index=True)
    section_name = Column(String(255), nullable=True, index=True)
    image_url = Column(String(255), nullable=False)
    alt_text = Column(String(255), nullable=True)