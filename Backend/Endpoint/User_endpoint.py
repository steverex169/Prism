import os

from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Response,
    Request
)

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

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

COOKIE_NAME = "access_token"

RESEARCH_FIELDS = {
    "Pharmacology / Drug Discovery",
    "Biochemistry & Molecular Biology",
    "Academic Research",
    "Contract Research Organization (CRO)",
    "Analytical Chemistry Laboratory",
    "Other Qualified Research",
}


def set_auth_cookie(
    response: Response,
    token: str
):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )


def get_user_from_request(
    request: Request,
    db: Session
):
    token = request.cookies.get(COOKIE_NAME)

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

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    user = (
        db.query(User_model.User)
        .filter(User_model.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive."
        )

    return user


def compliance_complete(user):
    return bool(
        user.age_verified
        and user.qualified_researcher
        and user.research_use_acknowledged
        and user.terms_accepted
        and user.research_field
    )


def user_payload(user):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "age_verified": bool(user.age_verified),
        "qualified_researcher": bool(user.qualified_researcher),
        "research_field": user.research_field,
        "research_use_acknowledged": bool(
            user.research_use_acknowledged
        ),
        "terms_accepted": bool(user.terms_accepted),
        "compliance_complete": compliance_complete(user),
    }


# =========================
# SIGNUP SCHEMA
# =========================

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str

    age_verified: bool
    qualified_researcher: bool
    research_field: str
    research_use_acknowledged: bool

    # Existing frontend field name retained for Terms acceptance.
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

    @field_validator("research_field")
    @classmethod
    def validate_research_field(cls, value):
        value = value.strip()

        if value not in RESEARCH_FIELDS:
            raise ValueError(
                "Please select a valid field of qualified research."
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

        if not self.age_verified:
            raise ValueError(
                "You must confirm that you are 21 years of age or older."
            )

        if not self.qualified_researcher:
            raise ValueError(
                "You must confirm that you are a qualified research professional."
            )

        if not self.research_use_acknowledged:
            raise ValueError(
                "You must acknowledge that all products are for research use only."
            )

        if not self.agreed:
            raise ValueError(
                "You must agree to the Terms & Conditions."
            )

        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ComplianceRequest(BaseModel):
    age_verified: bool
    qualified_researcher: bool
    research_field: str
    research_use_acknowledged: bool
    agreed: bool

    @field_validator("research_field")
    @classmethod
    def validate_research_field(cls, value):
        value = value.strip()

        if value not in RESEARCH_FIELDS:
            raise ValueError(
                "Please select a valid field of qualified research."
            )

        return value

    @model_validator(mode="after")
    def validate_compliance(self):
        if not self.age_verified:
            raise ValueError(
                "You must confirm that you are 21 years of age or older."
            )

        if not self.qualified_researcher:
            raise ValueError(
                "You must confirm that you are a qualified research professional."
            )

        if not self.research_use_acknowledged:
            raise ValueError(
                "You must acknowledge that all products are for research use only."
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
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    try:
        hashed_password = hash_password(
            data.password
        )

        new_user = User_model.User(
            full_name=data.full_name.strip(),
            email=email,
            password_hash=hashed_password,
            is_active=True,
            age_verified=data.age_verified,
            qualified_researcher=data.qualified_researcher,
            research_field=data.research_field.strip(),
            research_use_acknowledged=(
                data.research_use_acknowledged
            ),
            terms_accepted=data.agreed,
            terms_accepted_at=datetime.now(timezone.utc)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create account."
        )

    access_token = create_access_token(
        user_id=new_user.id,
        email=new_user.email
    )

    set_auth_cookie(
        response,
        access_token
    )

    return {
        "message": "Account created successfully",
        "user": user_payload(new_user)
    }


# =========================
# LOGIN
# =========================

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

    try:
        password_correct = verify_password(
            data.password,
            user.password_hash
        )
    except Exception:
        password_correct = False

    if not password_correct:
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

    set_auth_cookie(
        response,
        access_token
    )

    return {
        "message": "Login successful",
        "user": user_payload(user)
    }


# =========================
# CURRENT USER
# =========================

@router.get("/me")
def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_user_from_request(
        request,
        db
    )

    return {
        "user": user_payload(user)
    }


# =========================
# COMPLETE / UPDATE COMPLIANCE
# =========================

@router.put("/compliance")
def update_compliance(
    data: ComplianceRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_user_from_request(
        request,
        db
    )

    try:
        user.age_verified = data.age_verified
        user.qualified_researcher = (
            data.qualified_researcher
        )
        user.research_field = (
            data.research_field.strip()
        )
        user.research_use_acknowledged = (
            data.research_use_acknowledged
        )
        user.terms_accepted = data.agreed
        user.terms_accepted_at = datetime.now(
            timezone.utc
        )

        db.commit()
        db.refresh(user)

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save compliance information."
        )

    return {
        "message": "Research qualification confirmed.",
        "user": user_payload(user)
    }


# =========================
# LOGOUT
# =========================

@router.post("/logout")
def logout_user(
    response: Response
):
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax"
    )

    return {
        "message": "Logged out successfully"
    }
