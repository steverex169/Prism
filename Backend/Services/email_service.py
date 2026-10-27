"""Queue mail in the caller's transaction; render React templates only on the server."""
import json
import logging
import os
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

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
                          "supportEmail": os.getenv("SUPPORT_EMAIL", "support@prisimwellness.com")}),
        text=True, capture_output=True, timeout=30, check=True,
    )
    return json.loads(result.stdout)


def deliver_pending(db, limit=20):
    """Row locks serialize workers; the provider key covers a crash after sending."""
    if not os.getenv("RESEND_API_KEY") or not os.getenv("EMAIL_FROM"):
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
            payload = {"from": os.environ["EMAIL_FROM"], "to": [row.recipient],
                       "reply_to": os.getenv("SUPPORT_EMAIL", "support@prisimwellness.com"), **rendered}
            req = Request("https://api.resend.com/emails", data=json.dumps(payload).encode(),
                          headers={"Authorization": f"Bearer {os.environ['RESEND_API_KEY']}",
                                   "Content-Type": "application/json", "User-Agent": "Prism/1.0",
                                   "Idempotency-Key": f"prism/{row.event_key}"})
            with urlopen(req, timeout=20) as response:
                row.provider_id = json.load(response).get("id")
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
