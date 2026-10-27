"""Transactional email outbox and SMTP delivery for Prism emails."""
import json
import logging
import os
import smtplib
import subprocess
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from email.utils import make_msgid
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
    return f"${float(amount or 0):,.2f}"


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
                          "supportEmail": os.getenv("SUPPORT_EMAIL", "info@prisimwellness.com")}),
        text=True, capture_output=True, timeout=30, check=True,
    )
    return json.loads(result.stdout)


def _send_smtp_email(recipient, rendered):
    """Send a rendered message through the mailbox's configured SMTP server."""
    host = os.getenv("SMTP_HOST", "").strip()
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    sender = os.getenv("EMAIL_FROM", "").strip()
    if not all((host, username, password, sender)):
        raise RuntimeError(
            "SMTP is not configured. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, and EMAIL_FROM."
        )

    port = int(os.getenv("SMTP_PORT", "587"))
    use_ssl = os.getenv("SMTP_USE_SSL", "false").lower() == "true"
    use_starttls = os.getenv("SMTP_USE_STARTTLS", "true").lower() == "true"
    timeout = float(os.getenv("SMTP_TIMEOUT", "20"))

    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Reply-To"] = os.getenv("SUPPORT_EMAIL", username).strip()
    message["Subject"] = rendered["subject"]
    message["Message-ID"] = make_msgid(domain=urlparse(f"mailto:{username}").path.split("@")[-1] or None)
    message.set_content(rendered.get("text") or "Thank you for contacting Prism Wellness.")
    message.add_alternative(rendered["html"], subtype="html")

    if use_ssl:
        with smtplib.SMTP_SSL(host, port, timeout=timeout) as server:
            server.login(username, password)
            server.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=timeout) as server:
            server.ehlo()
            if use_starttls:
                server.starttls()
                server.ehlo()
            server.login(username, password)
            server.send_message(message)

    return message["Message-ID"]


def deliver_pending(db, limit=20):
    """Deliver queued messages with retry/backoff after SMTP or rendering failures."""
    smtp_configured = all(os.getenv(key) for key in (
        "SMTP_HOST", "SMTP_USERNAME", "SMTP_PASSWORD", "EMAIL_FROM"
    ))
    if not smtp_configured:
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
            row.provider_id = _send_smtp_email(row.recipient, rendered)
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
