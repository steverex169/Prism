import json
from datetime import timedelta
from urllib.parse import urlparse, parse_qs
from unittest.mock import patch

import pytest
from sqlalchemy import text, create_engine
from fastapi.testclient import TestClient

from conftest import app
from Model.User_model import User
from Model.order_model import OrderModel
from Model.product_model import ProductModel
from Model.notification_model import EmailOutbox, EmailChallenge, StockSubscription
from Model.abandoned_cart_model import AbandonedCartModel
from Services.email_service import utcnow, queue_email, deliver_pending
from Services.account_service import cleanup_unverified

PASSWORD = "Granite!Cedar927"
NEW_PASSWORD = "Silver!Willow826"
EMAIL = "researcher@example.com"
SIGNUP = {"full_name": "Test Researcher", "email": EMAIL, "password": PASSWORD,
          "confirm_password": PASSWORD, "age_verified": True, "qualified_researcher": True,
          "research_field": "Academic Research", "research_use_acknowledged": True, "agreed": True}
ORDER = {"order_number": "TEST-001", "customer_name": "Test Researcher", "customer_email": EMAIL,
         "items": 1, "total": 50, "payment": "Unpaid", "payment_method": "Bank transfer",
         "status": "pending", "research_field": "Academic Research"}


def mail(db, template):
    db.expire_all()
    return db.query(EmailOutbox).filter_by(template=template).order_by(EmailOutbox.id.desc()).first()


def token(db, template="VerifyEmail", key="verifyUrl"):
    return parse_qs(urlparse(json.loads(mail(db, template).props)[key]).query)["token"][0]


def signup(client):
    result = client.post("/user/signup", json=SIGNUP)
    assert result.status_code == 201, result.text
    return result


def activate(client, db):
    signup(client)
    assert client.post("/user/verify-email", json={"token": token(db)}).status_code == 200
    assert client.post("/user/login", json={"email": EMAIL, "password": PASSWORD}).status_code == 200


def admin():
    client = TestClient(app)
    assert client.post("/admin/login", json={"password": "test-admin-only"}).status_code == 200
    return client


def test_signup_does_not_authenticate_or_send_welcome(client, db):
    result = signup(client)
    assert "access_token" not in result.cookies
    user = db.query(User).one()
    assert not user.email_verified and not user.is_active
    assert mail(db, "VerifyEmail").recipient == EMAIL
    assert mail(db, "WelcomeSignup") is None
    assert client.get("/user/me").status_code == 401
    login = client.post("/user/login", json={"email": EMAIL, "password": PASSWORD})
    assert login.status_code == 403 and login.json()["detail"]["code"] == "email_unverified"
    assert client.post("/orders/", json=ORDER).status_code == 401


def test_link_activation_single_use_and_welcome_once(client, db):
    signup(client)
    secret = token(db)
    assert client.post("/user/verify-email", json={"token": secret}).status_code == 200
    assert client.post("/user/verify-email", json={"token": secret}).status_code == 400
    assert db.query(EmailOutbox).filter_by(template="WelcomeSignup").count() == 1
    assert mail(db, "VerifyEmail").status == "cancelled"
    assert client.post("/user/login", json={"email": EMAIL, "password": PASSWORD}).status_code == 200
    assert client.get("/user/me").json()["user"]["email_verified"] is True


def age_challenge(db):
    db.query(EmailChallenge).update({"created_at": utcnow() - timedelta(minutes=2)})
    db.commit()


def test_resend_cooldown_and_previous_link_invalidated(client, db):
    signup(client)
    secret = token(db)
    assert client.post("/user/resend-verification", json={"email": EMAIL}).status_code == 429
    age_challenge(db)
    assert client.post("/user/resend-verification", json={"email": EMAIL}).status_code == 200
    assert client.post("/user/verify-email", json={"token": secret}).status_code == 400
    assert client.post("/user/verify-email", json={"token": token(db)}).status_code == 200


def test_otp_verified_and_not_stored_in_plaintext(client, db):
    signup(client); age_challenge(db)
    assert client.post("/user/resend-verification", json={"email": EMAIL, "method": "otp"}).status_code == 200
    code = json.loads(mail(db, "OtpCode").props)["code"]
    assert db.query(EmailChallenge).order_by(EmailChallenge.id.desc()).first().code_hash != code
    assert client.post("/user/verify-email", json={"email": EMAIL, "code": code}).status_code == 200
    assert mail(db, "WelcomeSignup")


def test_otp_attempt_limit_blocks_correct_code(client, db):
    signup(client); age_challenge(db)
    client.post("/user/resend-verification", json={"email": EMAIL, "method": "otp"})
    code = json.loads(mail(db, "OtpCode").props)["code"]
    wrong = "000001" if code != "000001" else "000002"
    for _ in range(5):
        assert client.post("/user/verify-email", json={"email": EMAIL, "code": wrong}).status_code == 400
    assert client.post("/user/verify-email", json={"email": EMAIL, "code": code}).status_code == 400
    assert mail(db, "WelcomeSignup") is None


def test_expired_link(client, db):
    signup(client); secret = token(db)
    db.query(EmailChallenge).update({"expires_at": utcnow() - timedelta(seconds=1)}); db.commit()
    assert client.post("/user/verify-email", json={"token": secret}).status_code == 400
    assert mail(db, "WelcomeSignup") is None


def test_cleanup_deletes_only_expired_new_unverified_accounts(client, db):
    signup(client)
    db.query(User).update({"verification_started_at": utcnow() - timedelta(hours=49)})
    db.add(User(full_name="Legacy", email="legacy@example.com", password_hash="not-used", is_active=True,
                email_verified=False, created_at=utcnow() - timedelta(days=100)))
    db.add(User(full_name="Verified", email="verified@example.com", password_hash="not-used", is_active=True,
                email_verified=True, verification_started_at=utcnow() - timedelta(days=10)))
    db.commit()
    assert cleanup_unverified(db) == 1
    assert db.query(User).filter_by(email=EMAIL).first() is None
    assert db.query(User).count() == 2
    assert db.query(EmailChallenge).count() == 0
    assert mail(db, "VerifyEmail").status == "cancelled"


def test_password_reset_single_use_revokes_sessions(client, db):
    activate(client, db)
    assert client.post("/user/forgot-password", json={"email": EMAIL}).status_code == 200
    secret = token(db, "PasswordResetRequest", "resetUrl")
    payload = {"token": secret, "password": NEW_PASSWORD, "confirm_password": NEW_PASSWORD}
    old_cookie = client.cookies.get("access_token")
    assert client.post("/user/reset-password", json=payload).status_code == 200
    client.cookies.set("access_token", old_cookie)
    assert client.get("/user/me").status_code == 401
    assert client.post("/user/reset-password", json=payload).status_code == 400
    assert client.post("/user/login", json={"email": EMAIL, "password": NEW_PASSWORD}).status_code == 200
    assert mail(db, "PasswordChanged").recipient == EMAIL


def test_unknown_forgot_password_generic_and_no_email(client, db):
    assert client.post("/user/forgot-password", json={"email": EMAIL}).status_code == 200
    assert db.query(EmailOutbox).count() == 0


def test_email_change_verifies_new_address_and_notifies_old(client, db):
    activate(client, db)
    assert client.post("/orders/", json=ORDER).status_code == 201
    old_session = client.cookies.get("access_token")
    assert client.put("/user/email", json={"email": "new@example.com", "current_password": PASSWORD}).status_code == 200
    assert client.get("/user/me").json()["user"]["email"] == EMAIL
    secret = token(db)
    assert client.post("/user/verify-email", json={"token": secret, "purpose": "change_email"}).status_code == 200
    assert mail(db, "EmailChanged").recipient == EMAIL
    assert client.get("/user/me").status_code == 401
    client.cookies.clear()
    assert client.post("/user/login", json={"email": "new@example.com", "password": PASSWORD}).status_code == 200
    assert len(client.get("/user/orders").json()) == 1


def test_contact_and_newsletter_use_real_recipients(client, db):
    r = client.post("/contact/", json={"fullName": "Test User", "email": EMAIL, "subject": "Research inquiry", "message": "Please send details."})
    assert r.status_code == 201, r.text
    assert mail(db, "ContactFormConfirmation").recipient == EMAIL
    assert client.post("/email/save-email", json={"email_address": EMAIL}).status_code == 200
    assert client.post("/email/save-email", json={"email_address": EMAIL}).status_code == 200
    assert db.query(EmailOutbox).filter_by(template="SubscriptionConfirmed").count() == 1
    link = json.loads(mail(db, "SubscriptionConfirmed").props)["unsubscribeUrl"]
    t = parse_qs(urlparse(link).query)["token"][0]
    assert client.post("/email/unsubscribe", json={"token": t}).status_code == 200
    assert client.post("/email/unsubscribe", json={"token": "forged"}).status_code == 400


def test_order_auth_payment_protection_and_event_dedup(client, db):
    activate(client, db)
    assert client.post("/orders/", json={**ORDER, "payment": "Paid"}).status_code == 400
    r = client.post("/orders/", json=ORDER)
    assert r.status_code == 201, r.text
    oid = r.json()["id"]
    assert mail(db, "OrderOnHold")
    assert mail(db, "OrderConfirmation") is None
    event = {"event": "OrderConfirmation", "reference": "PAY-1"}
    assert client.post(f"/admin/orders/{oid}/events", json=event).status_code == 401
    staff = admin()
    assert staff.post(f"/admin/orders/{oid}/events", json=event).status_code == 200
    assert staff.post(f"/admin/orders/{oid}/events", json=event).status_code == 200
    assert db.query(EmailOutbox).filter_by(template="OrderConfirmation").count() == 1
    assert client.get("/orders/").status_code == 401
    client.cookies.set("admin_authenticated", "true")
    assert client.get("/admin/emails").status_code == 401


@pytest.mark.parametrize("event,details", [
    ("OrderShipped", {"carrier": "UPS", "trackingNumber": "TEST", "trackingUrl": "https://example.com/track", "estimatedDelivery": "Tomorrow"}),
    ("OutForDelivery", {"carrier": "UPS", "trackingNumber": "TEST", "trackingUrl": "https://example.com/track"}),
    ("OrderDelivered", {}), ("OrderCancelled", {"reason": "Customer requested"}),
    ("RefundIssued", {"refundAmount": "25"}), ("PaymentFailed", {}),
    ("ReturnReceived", {"returnNumber": "R-1", "carrier": "UPS", "returnLabelUrl": "https://example.com/label"}),
    ("CustomerNote", {"note": "Your requested documentation is included."}),
])
def test_all_staff_order_events(client, db, event, details):
    activate(client, db)
    oid = client.post("/orders/", json=ORDER).json()["id"]
    result = admin().post(f"/admin/orders/{oid}/events", json={"event": event, "reference": "REF-001", "details": details})
    assert result.status_code == 200, result.text
    assert mail(db, event).recipient == EMAIL


def test_shipment_requires_real_tracking_data(client, db):
    activate(client, db)
    oid = client.post("/orders/", json=ORDER).json()["id"]
    assert admin().post(f"/admin/orders/{oid}/events", json={"event": "OrderShipped", "reference": "SHIP-1"}).status_code == 422


def test_stock_subscription_and_review_ownership(client, db):
    activate(client, db)
    product = ProductModel(name="Test product", price=50, available=False)
    db.add(product); db.commit()
    assert client.post(f"/products/{product.id}/stock-alert").status_code == 200
    assert client.post(f"/products/{product.id}/stock-alert").status_code == 200
    assert db.query(StockSubscription).count() == 1
    oid = client.post("/orders/", json=ORDER).json()["id"]
    review = {"rating": 5, "comment": "Excellent documentation."}
    assert client.post(f"/user/orders/{oid}/review", json=review).status_code == 400
    admin().post(f"/admin/orders/{oid}/events", json={"event": "OrderDelivered", "reference": "DEL-1"})
    assert client.post(f"/user/orders/{oid}/review", json=review).status_code == 200


def test_delivery_retry_does_not_lose_email(db, monkeypatch):
    monkeypatch.setenv("RESEND_API_KEY", "test-key")
    monkeypatch.setenv("EMAIL_FROM", "store@example.com")
    row = queue_email(db, "WelcomeSignup", EMAIL, {"firstName": "Test"}, "test-delivery")
    db.commit()
    with patch("Services.email_service.render_email", side_effect=RuntimeError("test")):
        assert deliver_pending(db) == 0
    db.refresh(row)
    assert row.status == "pending" and row.attempts == 1 and row.available_at > utcnow()
    row.available_at = utcnow() - timedelta(seconds=1); db.commit()
    class FakeResponse:
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def read(self): return b'{"id": "provider-1"}'
    with patch("Services.email_service.render_email", return_value={"subject": "Welcome", "html": "<p>Hello</p>", "text": "Hello"}), patch("Services.email_service.urlopen", return_value=FakeResponse()) as send:
        assert deliver_pending(db) == 1
        assert send.call_count == 1
        assert deliver_pending(db) == 0
    db.refresh(row)
    assert row.status == "sent" and row.provider_id == "provider-1" and row.props == "{}"


def test_migration_preserves_legacy_users_and_is_repeatable(monkeypatch):
    import Services.schema as schema
    isolated = create_engine("sqlite://")
    with isolated.begin() as conn:
        conn.execute(text('CREATE TABLE "Users" (id INTEGER PRIMARY KEY, email VARCHAR(255))'))
        conn.execute(text('INSERT INTO "Users" (id, email) VALUES (1, :email)'), {"email": EMAIL})
    monkeypatch.setattr(schema, "engine", isolated)
    schema.migrate_email_schema(); schema.migrate_email_schema()
    with isolated.connect() as conn:
        row = conn.execute(text('SELECT email, email_verified, verification_started_at FROM "Users"')).one()
        assert row == (EMAIL, 0, None)


def test_partial_refunds_cannot_exceed_order_balance(client, db):
    activate(client, db)
    oid = client.post("/orders/", json=ORDER).json()["id"]
    staff = admin()
    data = {"event": "RefundIssued", "reference": "R-1", "details": {"refundAmount": "25"}}
    assert staff.post(f"/admin/orders/{oid}/events", json=data).status_code == 200
    assert staff.post(f"/admin/orders/{oid}/events", json=data).status_code == 200
    data["reference"], data["details"]["refundAmount"] = "R-2", "30"
    assert staff.post(f"/admin/orders/{oid}/events", json=data).status_code == 422
    data["details"]["refundAmount"] = "25"
    assert staff.post(f"/admin/orders/{oid}/events", json=data).status_code == 200
    db.expire_all()
    order = db.get(OrderModel, oid)
    assert order.payment == "Refunded" and order.refunded_total == 50
    assert db.query(EmailOutbox).filter_by(template="RefundIssued").count() == 2


def test_password_change_requires_current_password_and_notifies(client, db):
    activate(client, db)
    payload = {"current_password": "wrong", "password": NEW_PASSWORD, "confirm_password": NEW_PASSWORD}
    assert client.put("/user/password", json=payload).status_code == 400
    payload["current_password"] = PASSWORD
    assert client.put("/user/password", json=payload).status_code == 200
    assert mail(db, "PasswordChanged")
    assert client.get("/user/me").status_code == 401


def test_scheduler_queues_cart_and_review_once(client, db):
    from Services.email_worker import maintenance_tick
    activate(client, db)
    user = db.query(User).filter_by(email=EMAIL).one()
    cart = AbandonedCartModel(customer_name=user.full_name, customer_email=EMAIL,
        customer_phone="123", cart_items=json.dumps([{"name": "Test", "price": 50, "quantity": 1}]),
        items=1, total=50, last_active=utcnow() - timedelta(hours=2))
    order = OrderModel(order_number="DELIVERED", customer_name=user.full_name, customer_email=EMAIL,
        research_field="Academic Research", items=1, total=50, payment="Paid", payment_method="Bank",
        status="delivered", delivered_at=utcnow() - timedelta(days=4), user_id=user.id)
    db.add_all([cart, order]); db.commit()
    maintenance_tick(); maintenance_tick()
    assert db.query(EmailOutbox).filter_by(template="AbandonedCart").count() == 1
    assert db.query(EmailOutbox).filter_by(template="ReviewRequest").count() == 1
    assert client.post("/orders/", json=ORDER).status_code == 201
    assert mail(db, "AbandonedCart").status == "cancelled"


def test_restock_alert_is_sent_only_to_subscribers(client, db):
    # Product router uses filesystem paths relative to Backend; no image writes occur.
    from Endpoint.Product_endpoint import router
    if not any(getattr(route, "path", "") == "/products/" for route in app.routes):
        app.include_router(router)
    activate(client, db)
    product = ProductModel(name="Research Product", price=50, available=False,
                           featured=False, sales=0, relevance=0)
    db.add(product); db.commit()
    assert client.post(f"/products/{product.id}/stock-alert").status_code == 200
    staff = admin()
    assert staff.get("/products/").status_code == 200
    response = staff.put(f"/products/{product.id}", data={"available": "true"})
    assert response.status_code == 200, response.text
    assert mail(db, "BackInStock").recipient == EMAIL
    staff.put(f"/products/{product.id}", data={"available": "true"})
    assert db.query(EmailOutbox).filter_by(template="BackInStock").count() == 1


def test_production_renderer_escapes_user_supplied_text():
    from Services.email_service import render_email
    result = render_email("ContactFormConfirmation", {
        "firstName": "<script>alert(1)</script>", "ticketId": "TEST-1", "submittedAt": "Today",
        "subject": "Research", "message": "<b>Customer content</b>",
    })
    assert "<script>" not in result["html"] and "&lt;script&gt;" in result["html"]
    assert result["subject"] and result["text"] and "store.example.test/account" in result["html"]


def test_order_and_partial_refund_preserve_cents(client, db):
    activate(client, db)
    response = client.post("/orders/", json={**ORDER, "total": 49.99})
    assert response.status_code == 201 and response.json()["total"] == 49.99
    oid = response.json()["id"]
    staff = admin()
    payload = {"event": "RefundIssued", "reference": "CENTS-1", "details": {"refundAmount": "19.99"}}
    assert staff.post(f"/admin/orders/{oid}/events", json=payload).status_code == 200
    assert json.loads(mail(db, "RefundIssued").props)["refundAmount"] == "$19.99"
    assert client.get("/user/orders").json()[0]["total"] == 49.99
