
import re
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field, AliasChoices, field_validator
from sqlalchemy.orm import Session

from Database import get_db  # Use your existing database session dependency
from Model.contact_model import Contact
from Services.email_service import send_contact_confirmation


router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(
        validation_alias=AliasChoices("fullName", "full_name"),
        min_length=2,
        max_length=150,
    )
    email: EmailStr = Field(max_length=254)
    subject: str = Field(min_length=2, max_length=200)
    message: str = Field(min_length=5, max_length=10000)

    @field_validator("full_name", "subject", "message")
    @classmethod
    def strip_and_validate_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty.")
        return value


class ContactResponse(BaseModel):
    success: bool
    message: str
    reference_id: str


@router.post("/", response_model=ContactResponse, status_code=201)
def submit_contact(
    payload: ContactCreate,
    db: Session = Depends(get_db),
):
    contact = Contact(
        reference_id=str(uuid.uuid4()),
        full_name=payload.full_name,
        email=str(payload.email),
        subject=payload.subject,
        message=payload.message,
    )

    try:
        db.add(contact)
        db.flush()
        send_contact_confirmation(contact, db)
        db.commit()
        db.refresh(contact)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save your inquiry. Please try again later.",
        )

    return ContactResponse(
        success=True,
        message="Your message has been received. Our team will respond shortly.",
        reference_id=contact.reference_id,
    )
