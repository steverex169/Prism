"""Additive migration for existing installs; never infer proof of email ownership."""
from sqlalchemy import inspect, text, Integer
from sqlalchemy.schema import CreateColumn
from Database import base, engine
from Model import User_model, order_model, notification_model


def migrate_email_schema():
    inspector = inspect(engine)
    with engine.begin() as conn:
        for model, names in [(User_model.User, ["email_verified", "verified_at", "verification_started_at", "session_version"]),
                             (order_model.OrderModel, ["email_details", "delivered_at", "user_id", "refunded_total"])]:
            table = model.__table__
            if not inspector.has_table(table.name):
                table.create(conn)
                continue
            columns = {c["name"]: c for c in inspector.get_columns(table.name)}
            existing = set(columns)
            for name in names:
                if name not in existing:
                    column = str(CreateColumn(table.c[name]).compile(dialect=engine.dialect))
                    quoted = engine.dialect.identifier_preparer.quote(table.name)
                    conn.execute(text(f"ALTER TABLE {quoted} ADD COLUMN {column}"))
            if table.name == "orders" and engine.dialect.name == "mysql" and isinstance(columns["total"]["type"], Integer):
                conn.execute(text("ALTER TABLE orders MODIFY COLUMN total NUMERIC(12, 2) NOT NULL"))
        for model in [notification_model.EmailChallenge, notification_model.EmailOutbox, notification_model.StockSubscription, notification_model.OrderReview]:
            model.__table__.create(conn, checkfirst=True)
