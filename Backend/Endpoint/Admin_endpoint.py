import os
import hmac
import jwt
from datetime import datetime, timedelta, timezone
from security.auth import JWT_SECRET_KEY, JWT_ALGORITHM

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class AdminLoginRequest(BaseModel):
    password: str


@router.post("/login")
def admin_login(
    login_data: AdminLoginRequest,
    response: Response
):
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_password:
        raise HTTPException(
            status_code=500,
            detail="Admin password is not configured"
        )

    if not hmac.compare_digest(login_data.password, admin_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    response.set_cookie(
        key="admin_authenticated",
        value=jwt.encode({"type": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=8)}, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM),
        httponly=True,
        secure=os.getenv("COOKIE_SECURE", "false").lower() == "true",
        samesite="lax",
        max_age=60 * 60 * 8
    )

    return {
        "message": "Admin login successful"
    }


@router.get("/status")
def admin_status(request: Request):
    admin_authenticated = request.cookies.get(
        "admin_authenticated"
    )

    try:
        payload = jwt.decode(admin_authenticated or "", JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        authenticated = payload.get("type") == "admin"
    except jwt.InvalidTokenError:
        authenticated = False

    if not authenticated:
        raise HTTPException(
            status_code=401,
            detail="Admin authentication required"
        )

    return {
        "authenticated": True
    }


@router.post("/logout")
def admin_logout(response: Response):
    response.delete_cookie(
        key="admin_authenticated"
    )

    return {
        "message": "Admin logout successful"
    }
