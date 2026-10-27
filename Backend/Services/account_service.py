import hashlib
import hmac
import secrets
from datetime import timedelta
from urllib.parse import urlencode

from fastapi import HTTPException
from Model.User_model import User
from Model.notification_model import EmailChallenge, EmailOutbox, StockSubscription
from security.auth import JWT_SECRET_KEY
from Services.email_service import utcnow, site_url, first_name, queue_email

UNVERIFIED_TTL = timedelta(hours=48)


def digest(value):
    return hmac.new(JWT_SECRET_KEY.encode(), value.encode(), hashlib.sha256).hexdigest()


def cancel_challenge_mail(db, challenge):
    for mail in db.query(EmailOutbox).filter(
        EmailOutbox.event_key.in_([f"challenge:{challenge.id}:link", f"challenge:{challenge.id}:otp"]),
        EmailOutbox.status.in_(["pending", "failed"]),
    ).all():
        mail.status = "cancelled"
        mail.props = "{}"


def issue_challenge(db, user, purpose="verify", email=None, method="link"):
    user = db.query(User).filter_by(id=user.id).with_for_update().one()
    now = utcnow()
    if purpose == "verify" and not user.verification_started_at:
        user.verification_started_at = now
    latest = (db.query(EmailChallenge).filter_by(user_id=user.id, purpose=purpose)
              .order_by(EmailChallenge.id.desc()).first())
    if latest and latest.created_at > now - timedelta(seconds=60):
        raise HTTPException(429, "Please wait one minute before requesting another email.")
    count = db.query(EmailChallenge).filter(
        EmailChallenge.user_id == user.id, EmailChallenge.created_at > now - timedelta(hours=1)
    ).count()
    if count >= 10:
        raise HTTPException(429, "Too many requests. Please try again later.")
    for old in db.query(EmailChallenge).filter_by(user_id=user.id, purpose=purpose, consumed_at=None).all():
        old.consumed_at = now
        cancel_challenge_mail(db, old)
    token = secrets.token_urlsafe(32)
    code = f"{secrets.randbelow(1000000):06d}" if purpose == "verify" else None
    expiry = now + (timedelta(minutes=10) if method == "otp" else timedelta(hours=24 if purpose == "verify" else 1))
    if purpose == "verify":
        expiry = min(expiry, user.verification_started_at.replace(tzinfo=None) + UNVERIFIED_TTL)
    challenge = EmailChallenge(user_id=user.id, purpose=purpose, email=email or user.email,
                               token_hash=digest(token), code_hash=digest(f"{user.id}:{code}") if code else None,
                               attempts=0, created_at=now, expires_at=expiry)
    db.add(challenge)
    db.flush()
    path = {"verify": "/verify-email", "reset": "/reset-password", "change_email": "/verify-email"}[purpose]
    url = site_url(path) + "?" + urlencode({"token": token, "purpose": purpose})
    if method == "otp":
        template, props = "OtpCode", {"code": code, "validFor": "10 minutes"}
    else:
        template = "PasswordResetRequest" if purpose == "reset" else "VerifyEmail"
        props = {"firstName": first_name(user.full_name),
                 "resetUrl" if purpose == "reset" else "verifyUrl": url,
                 "expiresIn": "60 minutes" if purpose != "verify" else "24 hours (account expires after 48 hours)"}
    queue_email(db, template, challenge.email, props, f"challenge:{challenge.id}:{'otp' if method == 'otp' else 'link'}")
    return challenge


def consume_challenge(db, purpose, token=None, email=None, code=None):
    query = db.query(EmailChallenge).filter_by(purpose=purpose, consumed_at=None)
    if token:
        query = query.filter_by(token_hash=digest(token))
    elif email and code and purpose == "verify":
        query = query.filter_by(email=email.strip().lower()).filter(EmailChallenge.code_hash.isnot(None))
    else:
        raise HTTPException(400, "A verification link or email and code is required.")
    candidate = query.order_by(EmailChallenge.id.desc()).first()
    if not candidate:
        raise HTTPException(400, "This link or code is invalid or expired. Request a new one.")
    # Consistently lock the account before its challenges, also used by resend/cleanup.
    user = db.query(User).filter_by(id=candidate.user_id).with_for_update().first()
    challenge = query.order_by(EmailChallenge.id.desc()).populate_existing().with_for_update().first()
    if not challenge or challenge.expires_at <= utcnow() or challenge.attempts >= 5:
        raise HTTPException(400, "This link or code is invalid or expired. Request a new one.")
    if not token and not hmac.compare_digest(challenge.code_hash, digest(f"{challenge.user_id}:{code}")):
        challenge.attempts += 1
        db.commit()
        raise HTTPException(400, "Invalid code. Please check your email.")
    challenge.consumed_at = utcnow()
    cancel_challenge_mail(db, challenge)
    if not user or (not user.email_verified and user.verification_started_at and user.verification_started_at.replace(tzinfo=None) <= utcnow() - UNVERIFIED_TTL):
        raise HTTPException(400, "This account has expired. Please sign up again.")
    return user, challenge


def cleanup_unverified(db):
    users = db.query(User).filter(User.email_verified.is_(False), User.verification_started_at <= utcnow() - UNVERIFIED_TTL).with_for_update(skip_locked=True).all()
    for user in users:
        for c in db.query(EmailChallenge).filter_by(user_id=user.id).all():
            cancel_challenge_mail(db, c)
            db.delete(c)
        db.query(StockSubscription).filter_by(user_id=user.id).delete()
        db.delete(user)
    for c in db.query(EmailChallenge).filter(EmailChallenge.expires_at <= utcnow(), EmailChallenge.consumed_at.is_(None)).all():
        c.consumed_at = utcnow()
        cancel_challenge_mail(db, c)
    db.commit()
    return len(users)
