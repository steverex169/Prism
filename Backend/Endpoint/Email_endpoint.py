from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session
from sqlalchemy.exc import (
    IntegrityError,
    SQLAlchemyError,
)

from pydantic import BaseModel, EmailStr

from Model import Email_model
from Database import get_db


router = APIRouter(
    prefix="/email",
    tags=["Email"]
)


class EmailRequest(BaseModel):
    email_address: EmailStr


@router.post("/save-email")
def save_email(
    email: EmailRequest,
    db: Session = Depends(get_db),
):
    normalized_email = (
        email.email_address
        .lower()
        .strip()
    )

    try:
        existing_email = (
            db.query(Email_model.Email)
            .filter(
                Email_model.Email.email_address
                == normalized_email
            )
            .first()
        )

        if existing_email:
            return {
                "message": "You are already subscribed."
            }

        new_email = Email_model.Email(
            email_address=normalized_email
        )

        db.add(new_email)
        db.commit()
        db.refresh(new_email)

        return {
            "message": "Subscribed successfully!",
            "email_id": new_email.id,
        }

    except IntegrityError:
        db.rollback()

        return {
            "message": "You are already subscribed."
        }

    except SQLAlchemyError as error:
        db.rollback()

        print("DATABASE ERROR:", error)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save email.",
        )