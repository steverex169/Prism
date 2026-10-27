"""Single-use account verification, recovery and authenticated account changes."""
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from Database import get_db
from Model.User_model import User
from Model.notification_model import EmailChallenge
from Model.order_model import OrderModel
from Endpoint.User_endpoint import get_user_from_request
from Services.account_service import issue_challenge, consume_challenge, cleanup_unverified, cancel_challenge_mail
from Services.email_service import queue_email, first_name, site_url, utcnow
from security.auth import validate_password, hash_password, verify_password

router = APIRouter(prefix="/user", tags=["Account"])


class EmailRequest(BaseModel):
    email: EmailStr
    method: Literal["link", "otp"] = "link"


class VerifyRequest(BaseModel):
    token: str | None = Field(None, min_length=20, max_length=200)
    email: EmailStr | None = None
    code: str | None = Field(None, pattern=r"^\d{6}$")
    purpose: Literal["verify", "change_email"] = "verify"


class PasswordRequest(BaseModel):
    password: str
    confirm_password: str

    @field_validator("password")
    @classmethod
    def strong_password(cls, value):
        valid, message = validate_password(value)
        if not valid:
            raise ValueError(message)
        return value


class ResetRequest(PasswordRequest):
    token: str = Field(min_length=20, max_length=200)


class ChangePasswordRequest(PasswordRequest):
    current_password: str


class ChangeEmailRequest(BaseModel):
    email: EmailStr
    current_password: str


@router.post("/resend-verification")
def resend_verification(data: EmailRequest, db: Session = Depends(get_db)):
    cleanup_unverified(db)
    user = db.query(User).filter_by(email=str(data.email).strip().lower()).first()
    if user and not user.email_verified:
        issue_challenge(db, user, method=data.method)
        db.commit()
    return {"message": "If this account needs verification, a new email will arrive shortly."}


@router.post("/verify-email")
def verify_email(data: VerifyRequest, db: Session = Depends(get_db)):
    user, challenge = consume_challenge(db, data.purpose, data.token, data.email, data.code)
    if data.purpose == "change_email":
        if not user.email_verified or not user.is_active:
            raise HTTPException(403, "Account is inactive.")
        old = user.email
        db.query(OrderModel).filter_by(customer_email=old, user_id=None).update({"user_id": user.id})
        user.email = challenge.email
        user.session_version += 1
        queue_email(db, "EmailChanged", old, {
            "firstName": first_name(user.full_name), "oldEmail": old, "newEmail": user.email,
            "changedAt": utcnow().isoformat() + " UTC", "secureAccountUrl": site_url("/forgot-password"),
        }, f"email-changed:{challenge.id}")
    else:
        if user.email_verified:
            raise HTTPException(400, "This account has already been verified. Please sign in.")
        user.email_verified = True
        user.is_active = True
        user.verified_at = utcnow()
        queue_email(db, "WelcomeSignup", user.email, {
            "firstName": first_name(user.full_name), "accountUrl": site_url("/account"),
        }, f"welcome:{user.id}:{user.created_at.isoformat()}")
    for other in db.query(EmailChallenge).filter_by(user_id=user.id, consumed_at=None).all():
        other.consumed_at = utcnow()
        cancel_challenge_mail(db, other)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "This email address is already in use.")
    return {"message": "Email verified. You can now sign in."}


@router.post("/forgot-password")
def forgot_password(data: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=str(data.email).strip().lower(), email_verified=True, is_active=True).first()
    if user:
        issue_challenge(db, user, purpose="reset")
        db.commit()
    return {"message": "If an active account exists, a password reset link will arrive shortly."}


def password_notice(db, user, request, key):
    queue_email(db, "PasswordChanged", user.email, {
        "firstName": first_name(user.full_name), "changedAt": utcnow().isoformat() + " UTC",
        "device": request.headers.get("user-agent", "Unknown device")[:200],
        "location": "Not collected", "loginUrl": site_url("/login"),
        "resetUrl": site_url("/forgot-password"),
    }, key)
    for c in db.query(EmailChallenge).filter_by(user_id=user.id, consumed_at=None).all():
        c.consumed_at = utcnow()
        cancel_challenge_mail(db, c)


def check_password(user, password):
    try:
        valid = verify_password(password, user.password_hash)
    except Exception:
        valid = False
    if not valid:
        raise HTTPException(400, "Current password is incorrect.")


@router.post("/reset-password")
def reset_password(data: ResetRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(400, "Passwords do not match.")
    user, challenge = consume_challenge(db, "reset", token=data.token)
    if not user.email_verified or not user.is_active:
        raise HTTPException(403, "Account is inactive.")
    user.password_hash = hash_password(data.password)
    user.session_version += 1
    password_notice(db, user, request, f"password-reset:{challenge.id}")
    db.commit()
    response.delete_cookie("access_token", path="/")
    return {"message": "Password updated. Please sign in with your new password."}


@router.put("/password")
def change_password(data: ChangePasswordRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    user = get_user_from_request(request, db)
    check_password(user, data.current_password)
    if data.password != data.confirm_password:
        raise HTTPException(400, "Passwords do not match.")
    user.password_hash = hash_password(data.password)
    user.session_version += 1
    password_notice(db, user, request, f"password-change:{user.id}:{user.session_version}")
    db.commit()
    response.delete_cookie("access_token", path="/")
    return {"message": "Password updated. Please sign in again."}


@router.put("/email")
def change_email(data: ChangeEmailRequest, request: Request, db: Session = Depends(get_db)):
    user = get_user_from_request(request, db)
    check_password(user, data.current_password)
    email = str(data.email).strip().lower()
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(409, "This email address is already in use.")
    issue_challenge(db, user, purpose="change_email", email=email)
    db.commit()
    return {"message": "Check your new email address to confirm the change. Your current address remains active until confirmed."}
