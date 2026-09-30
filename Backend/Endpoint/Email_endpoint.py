from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel

from Model import Email_model
from Database import get_db


router = APIRouter(
    prefix="/email",
    tags=["Email"]
)

class Email(BaseModel):
    email_address: str

@router.post("/save-email")
async def save_email(email: Email, db: Session = Depends(get_db)):
    try:
        new_email = Email_model.Email(email_address=email.email_address)
        db.add(new_email)
        db.commit()
        db.refresh(new_email)
        return {"message": "Email saved successfully", "email_id": new_email.id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save email")