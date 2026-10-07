import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from Database import get_db
from Model.abandoned_cart_model import AbandonedCartModel


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
    items: int
    total: int


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


@router.get("/")
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
    db: Session = Depends(get_db)
):
    email = cart_data.customer_email.strip().lower()

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


@router.put("/{cart_id}/followed-up")
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


@router.delete("/{cart_id}")
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