import os
import re
import jwt

from pathlib import Path
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from pwdlib import PasswordHash


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


password_hasher = PasswordHash.recommended()


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is missing from environment variables."
    )


JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


COMMON_PASSWORDS = {
    "password",
    "password123",
    "password123!",
    "12345678",
    "123456789",
    "qwerty",
    "qwerty123",
    "qwerty123!",
    "admin123",
    "admin123!",
    "welcome123",
    "letmein",
    "abc123",
    "@umt123",
    "umt123",
}


def validate_password(password: str):
    if len(password) < 12:
        return False, "Password is weak. Use at least 12 characters."

    normalized = password.lower().strip()

    if normalized in COMMON_PASSWORDS:
        return False, "Password is weak. Choose a less common password."

    if not re.search(r"[A-Z]", password):
        return False, "Password is weak. Add an uppercase letter."

    if not re.search(r"[a-z]", password):
        return False, "Password is weak. Add a lowercase letter."

    if not re.search(r"\d", password):
        return False, "Password is weak. Add a number."

    if not re.search(r"[^A-Za-z0-9]", password):
        return False, "Password is weak. Add a special character."

    weak_patterns = [
        "123456",
        "123456789",
        "abcdef",
        "qwerty",
        "asdfgh",
        "password",
    ]

    for pattern in weak_patterns:
        if pattern in normalized:
            return False, "Password is weak. Avoid common patterns."

    if re.search(r"(.)\1{3,}", password):
        return False, "Password is weak. Avoid repeated characters."

    return True, None


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return password_hasher.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    user_id: int,
    email: str
):
    now = datetime.now(timezone.utc)

    expires = now + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": now,
        "exp": expires,
        "type": "access",
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        if payload.get("type") != "access":
            return None

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None