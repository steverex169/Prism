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
import jwt
from datetime import datetime, timedelta, timezone
from security.auth import JWT_SECRET_KEY, JWT_ALGORITHM
from Services.email_service import queue_email, site_url


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
        db.flush()
        token = jwt.encode({"type": "unsubscribe", "email": normalized_email,
                            "exp": datetime.now(timezone.utc) + timedelta(days=3650)},
                           JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        queue_email(db, "SubscriptionConfirmed", normalized_email, {
            "firstName": "subscriber", "unsubscribeUrl": site_url("/unsubscribe?token=" + token),
        }, f"newsletter:{new_email.id}:{token[-20:]}")
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


class UnsubscribeRequest(BaseModel):
    token: str


@router.post("/unsubscribe")
def unsubscribe(data: UnsubscribeRequest, db: Session = Depends(get_db)):
    try:
        claims = jwt.decode(data.token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if claims.get("type") != "unsubscribe":
            raise ValueError()
    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(400, "Invalid unsubscribe link.")
    db.query(Email_model.Email).filter_by(email_address=claims["email"]).delete()
    db.commit()
    return {"message": "You have been unsubscribed."}
