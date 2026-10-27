import json

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field, field_validator
import math
from sqlalchemy.orm import Session
from typing import List, Optional

from Database import get_db
from Model.abandoned_cart_model import AbandonedCartModel
from Endpoint.Admin_endpoint import admin_status
from Endpoint.User_endpoint import get_user_from_request
from datetime import datetime


router = APIRouter(
    prefix="/abandoned-carts",
    tags=["Abandoned Carts"]
)


class AbandonedCartCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    research_field: Optional[str] = None
    cart_items: List[dict]
    items: int = Field(ge=0)
    total: int = Field(ge=0)

    @field_validator("cart_items")
    @classmethod
    def validate_items(cls, items):
        if len(items) > 100:
            raise ValueError("Too many cart items.")
        for item in items:
            try:
                price = float(item.get("price", 0))
                quantity = int(item.get("quantity", 1))
            except (TypeError, ValueError, OverflowError):
                raise ValueError("Invalid cart item price or quantity.")
            if not math.isfinite(price) or price < 0 or not 1 <= quantity <= 10000:
                raise ValueError("Invalid cart item price or quantity.")
        return items


class AbandonedCartResponse(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    customer_phone: str
    research_field: Optional[str]
    cart_items: List[dict]
    items: int
    total: int
    status: str
    order_id: Optional[int]
    created_at: Optional[str]
    last_active: Optional[str]


def serialize_cart(cart):
    try:
        return json.loads(cart)
    except Exception:
        return []


def format_response(cart):
    return {
        "id": cart.id,
        "customer_name": cart.customer_name,
        "customer_email": cart.customer_email,
        "customer_phone": cart.customer_phone,
        "research_field": cart.research_field,
        "cart_items": serialize_cart(cart.cart_items),
        "items": cart.items,
        "total": cart.total,
        "status": cart.status,
        "order_id": cart.order_id,
        "created_at": (
            cart.created_at.isoformat()
            if cart.created_at
            else None
        ),
        "last_active": (
            cart.last_active.isoformat()
            if cart.last_active
            else None
        ),
    }


@router.get("/", dependencies=[Depends(admin_status)])
def get_abandoned_carts(
    db: Session = Depends(get_db)
):
    carts = (
        db.query(AbandonedCartModel)
        .order_by(AbandonedCartModel.last_active.desc())
        .all()
    )

    return [
        format_response(cart)
        for cart in carts
    ]


@router.post("/")
def create_or_update_abandoned_cart(
    cart_data: AbandonedCartCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    user = get_user_from_request(request, db)
    email = user.email.strip().lower()
    cart_data.customer_name = user.full_name

    existing = (
        db.query(AbandonedCartModel)
        .filter(
            AbandonedCartModel.customer_email == email,
            AbandonedCartModel.status == "pending"
        )
        .order_by(
            AbandonedCartModel.id.desc()
        )
        .first()
    )

    cart_json = json.dumps(cart_data.cart_items)

    if existing:
        existing.customer_name = cart_data.customer_name
        existing.customer_phone = cart_data.customer_phone
        existing.research_field = cart_data.research_field
        existing.cart_items = cart_json
        existing.items = cart_data.items
        existing.total = cart_data.total
        existing.last_active = datetime.utcnow()

        db.commit()
        db.refresh(existing)

        return format_response(existing)

    new_cart = AbandonedCartModel(
        customer_name=cart_data.customer_name,
        customer_email=email,
        customer_phone=cart_data.customer_phone,
        research_field=cart_data.research_field,
        cart_items=cart_json,
        items=cart_data.items,
        total=cart_data.total,
        status="pending"
    )

    db.add(new_cart)
    db.commit()
    db.refresh(new_cart)

    return format_response(new_cart)


@router.put("/{cart_id}/followed-up", dependencies=[Depends(admin_status)])
def mark_followed_up(
    cart_id: int,
    db: Session = Depends(get_db)
):
    cart = (
        db.query(AbandonedCartModel)
        .filter(AbandonedCartModel.id == cart_id)
        .first()
    )

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Abandoned customer not found"
        )

    cart.status = "followed_up"

    db.commit()
    db.refresh(cart)

    return format_response(cart)


@router.delete("/{cart_id}", dependencies=[Depends(admin_status)])
def delete_abandoned_cart(
    cart_id: int,
    db: Session = Depends(get_db)
):
    cart = (
        db.query(AbandonedCartModel)
        .filter(AbandonedCartModel.id == cart_id)
        .first()
    )

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Abandoned customer not found"
        )

    db.delete(cart)
    db.commit()

    return {
        "message": "Abandoned customer deleted successfully",
        "id": cart_id
    }
