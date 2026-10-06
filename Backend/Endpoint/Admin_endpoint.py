import os

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

    if login_data.password != admin_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    response.set_cookie(
        key="admin_authenticated",
        value="true",
        httponly=True,
        secure=True,
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

    if admin_authenticated != "true":
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