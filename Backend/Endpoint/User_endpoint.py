import os

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Response,
    Request
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
    verify_password,
    create_access_token,
    decode_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)


router = APIRouter(
    prefix="/user",
    tags=["User"]
)

COOKIE_SECURE = (
    os.getenv("COOKIE_SECURE", "false").lower()
    == "true"
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

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# SIGNUP
# =========================

@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED
)
def signup(
    data: SignupRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    email = data.email.lower().strip()

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

    access_token = create_access_token(
        user_id=new_user.id,
        email=new_user.email
    )

    response.set_cookie(
        key="access_token",
        value=access_token,

        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",

        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,

        path="/"
    )

    return {
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email
        }
    }


@router.post("/login")
def login_user(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    email = data.email.lower().strip()

    user = (
        db.query(User_model.User)
        .filter(User_model.User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive."
        )

    access_token = create_access_token(
        user_id=user.id,
        email=user.email
    )

    response.set_cookie(
        key="access_token",
        value=access_token,

        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",

        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,

        path="/"
    )

    return {
        "message": "Login successful",

        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }
    }

@router.get("/me")
def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get(
        "access_token"
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated."
        )

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session."
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    try:
        user_id = int(user_id)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    user = (
        db.query(User_model.User)
        .filter(
            User_model.User.id == user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive."
        )

    return {
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }
    }

@router.post("/logout")
def logout_user(
    response: Response
):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax"
    )

    return {
        "message": "Logged out successfully"
    }