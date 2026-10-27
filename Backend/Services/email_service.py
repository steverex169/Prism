"""Transactional email outbox and SMTP delivery."""
import json
import logging
import os
import smtplib
import ssl
import subprocess
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import urlparse

from Model.notification_model import EmailOutbox

logger = logging.getLogger(__name__)
FRONTEND = Path(__file__).resolve().parents[2] / "Frontend"


def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def site_url(path=""):
    return os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/") + path


def first_name(name):
    return (name or "there").split()[0]


def money(amount):
    return f"\${float(amount or 0):,.2f}"


def queue_email(db, template, recipient, props, event_key, delay=None):
    existing = db.query(EmailOutbox).filter_by(event_key=event_key).first()
    if existing:
        return existing
    email = EmailOutbox(
        template=template, recipient=recipient.strip().lower(),
        props=json.dumps(props), event_key=event_key, status="pending",
        created_at=utcnow(), available_at=utcnow() + (delay or timedelta()),
    )
    db.add(email)
    db.flush()
    return email


def send_contact_confirmation(contact, db):
    return queue_email(db, "ContactFormConfirmation", contact.email, {
        "firstName": first_name(contact.full_name), "ticketId": contact.reference_id,
        "submittedAt": utcnow().strftime("%d %b %Y, %H:%M UTC"),
        "subject": contact.subject, "message": contact.message,
    }, f"contact:{contact.reference_id}")


def render_email(template, props):
    renderer = Path(os.getenv("EMAIL_RENDERER_PATH", str(FRONTEND / "dist-email/render.cjs")))
    if not renderer.is_file():
        raise RuntimeError("Email renderer missing; run npm run email:build in Frontend")
    result = subprocess.run(
        [os.getenv("NODE_BINARY", "node"), str(renderer)],
        input=json.dumps({"template": template, "props": props, "siteUrl": site_url(),
                          "supportEmail": os.getenv("SUPPORT_EMAIL", "support@prisimwellness.com")}),
        text=True, capture_output=True, timeout=30, check=True,
    )
    return json.loads(result.stdout)


def _smtp_settings():
    host = os.getenv("SMTP_HOST", "").strip()
    sender = os.getenv("EMAIL_FROM", "").strip()
    if not host or not sender:
        return None

    try:
        port = int(os.getenv("SMTP_PORT", "587"))
    except ValueError as error:
        raise RuntimeError("SMTP_PORT must be a valid port number") from error
    if not 1 <= port <= 65535:
        raise RuntimeError("SMTP_PORT must be between 1 and 65535")

    use_ssl = os.getenv("SMTP_USE_SSL", "false").lower() == "true" or port == 465
    starttls = os.getenv("SMTP_STARTTLS", "true").lower() == "true"
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    if bool(username) != bool(password):
        raise RuntimeError("Set both SMTP_USERNAME and SMTP_PASSWORD, or leave both empty")
    return host, port, sender, use_ssl, starttls, username, password


def _send_smtp(row, rendered, settings):
    host, port, sender, use_ssl, starttls, username, password = settings
    message = EmailMessage()
    message["From"] = sender
    message["To"] = row.recipient
    message["Subject"] = rendered["subject"]
    message["Reply-To"] = os.getenv("SUPPORT_EMAIL", "support@prisimwellness.com")
    message.set_content(rendered.get("text") or "Thank you for contacting Prisim Wellness.")
    message.add_alternative(rendered["html"], subtype="html")

    context = ssl.create_default_context()
    if use_ssl:
        with smtplib.SMTP_SSL(host, port, timeout=20, context=context) as server:
            if username:
                server.login(username, password)
            server.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.ehlo()
            if starttls:
                server.starttls(context=context)
                server.ehlo()
            if username:
                server.login(username, password)
            server.send_message(message)
    return message.get("Message-ID")


def deliver_pending(db, limit=20):
    """Deliver queued messages through SMTP; keep failures queued for retry."""
    settings = _smtp_settings()
    if not settings:
        # Leave messages pending until SMTP is configured.
        return 0

    sent = 0
    for _ in range(limit):
        row = (db.query(EmailOutbox).filter(
            EmailOutbox.status == "pending", EmailOutbox.available_at <= utcnow()
        ).order_by(EmailOutbox.id).with_for_update(skip_locked=True).first())
        if not row:
            db.rollback()
            break
        try:
            rendered = render_email(row.template, json.loads(row.props))
            row.provider_id = _send_smtp(row, rendered, settings)
            row.status = "sent"
            row.sent_at = utcnow()
            row.props = "{}"
            row.last_error = None
            sent += 1
        except Exception as error:
            row.attempts += 1
            row.last_error = type(error).__name__
            row.available_at = utcnow() + timedelta(seconds=min(3600, 30 * 2 ** min(row.attempts, 7)))
            if row.attempts >= 12:
                row.status = "failed"
            logger.warning("Email outbox %s failed (%s)", row.id, row.last_error)
        db.commit()
    return sent
