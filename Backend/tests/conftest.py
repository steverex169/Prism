"""Test database is isolated SQLite. No application .env, MySQL or live mail is used."""
import os
import sys
import types
from pathlib import Path

os.environ["JWT_SECRET_KEY"] = "test-only-key-" + "x" * 64
os.environ["FRONTEND_URL"] = "https://store.example.test"
os.environ["ADMIN_PASSWORD"] = "test-admin-only"
os.environ["COOKIE_SECURE"] = "false"
os.environ["EMAIL_WORKER_ENABLED"] = "false"
os.environ["RESEND_API_KEY"] = ""
os.environ["EMAIL_FROM"] = ""

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

# Install an isolated Database module before importing any models/endpoints.
database = types.ModuleType("Database")
database.engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
database.base = declarative_base()
database.session_local = sessionmaker(bind=database.engine, expire_on_commit=False, autoflush=False)
def get_db():
    with database.session_local() as db:
        yield db
database.get_db = get_db
sys.modules["Database"] = database

from fastapi import FastAPI
from fastapi.testclient import TestClient
from Endpoint import User_endpoint, Account_endpoint, Order_endpoint, Notification_endpoint, Email_endpoint, contact_endpoint, Admin_endpoint, AbandonedCart_endpoint
from Model import product_model

app = FastAPI()
for endpoint in [User_endpoint, Account_endpoint, Order_endpoint, Notification_endpoint, Email_endpoint, contact_endpoint, Admin_endpoint, AbandonedCart_endpoint]:
    app.include_router(endpoint.router)


@pytest.fixture
def db():
    database.base.metadata.create_all(database.engine)
    with database.session_local() as session:
        yield session
    database.base.metadata.drop_all(database.engine)


@pytest.fixture
def client(db):
    with TestClient(app) as client:
        yield client
