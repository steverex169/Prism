from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from pydantic import (
    BaseModel,
    EmailStr,
    field_validator,
    model_validator
)

from Database import get_db
from Model import User_model

from security.auth import (
    validate_password,
    hash_password,
    create_access_token
)


router = APIRouter(
    prefix="/user",
    tags=["User"]
)


# =========================
# SIGNUP SCHEMA
# =========================

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str
    agreed: bool

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value):
        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Please enter your full name."
            )

        if len(value) > 255:
            raise ValueError(
                "Full name is too long."
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_user_password(cls, value):
        valid, message = validate_password(value)

        if not valid:
            raise ValueError(message)

        return value

    @model_validator(mode="after")
    def validate_signup(self):

        if self.password != self.confirm_password:
            raise ValueError(
                "Passwords do not match."
            )

        if not self.agreed:
            raise ValueError(
                "You must agree to the Terms & Conditions."
            )

        return self


# =========================
# SIGNUP
# =========================

@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED
)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):

    try:

        email = data.email.lower().strip()

        # Check existing account
        existing_user = (
            db.query(User_model.User)
            .filter(User_model.User.email == email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists."
            )

        # Hash password using Argon2
        hashed_password = hash_password(
            data.password
        )

        new_user = User_model.User(
            full_name=data.full_name.strip(),
            email=email,
            password_hash=hashed_password,
            is_active=True
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create JWT
        access_token = create_access_token(
            user_id=new_user.id,
            email=new_user.email
        )

        return {
            "message": "Account created successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "full_name": new_user.full_name,
                "email": new_user.email
            }
        }

    except HTTPException:
        raise

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to create account."
        )