from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from Database import get_db
from Model.shipping_model import ShippingModel


router = APIRouter(
    prefix="/shipping",
    tags=["Shipping"]
)


class ShippingCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    research_field: str
    street_address: str
    city: str
    zip_code: str
    state: str


class ShippingUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    research_field: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    state: Optional[str] = None


class ShippingResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    research_field: str
    street_address: str
    city: str
    zip_code: str
    state: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.get("/{shipping_id}", response_model=ShippingResponse)
def get_shipping(
    shipping_id: int,
    db: Session = Depends(get_db)
):
    shipping = (
        db.query(ShippingModel)
        .filter(ShippingModel.id == shipping_id)
        .first()
    )

    if not shipping:
        raise HTTPException(
            status_code=404,
            detail="Shipping information not found"
        )

    return shipping


@router.post("/", response_model=ShippingResponse, status_code=201)
def create_shipping(
    shipping_data: ShippingCreate,
    db: Session = Depends(get_db)
):
    new_shipping = ShippingModel(
        full_name=shipping_data.full_name,
        email=shipping_data.email,
        phone=shipping_data.phone,
        research_field=shipping_data.research_field,
        street_address=shipping_data.street_address,
        city=shipping_data.city,
        zip_code=shipping_data.zip_code,
        state=shipping_data.state,
    )

    db.add(new_shipping)
    db.commit()
    db.refresh(new_shipping)

    return new_shipping


@router.put("/{shipping_id}", response_model=ShippingResponse)
def update_shipping(
    shipping_id: int,
    shipping_data: ShippingUpdate,
    db: Session = Depends(get_db)
):
    shipping = (
        db.query(ShippingModel)
        .filter(ShippingModel.id == shipping_id)
        .first()
    )

    if not shipping:
        raise HTTPException(
            status_code=404,
            detail="Shipping information not found"
        )

    update_data = shipping_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(shipping, field, value)

    shipping.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(shipping)

    return shipping


@router.delete("/{shipping_id}")
def delete_shipping(
    shipping_id: int,
    db: Session = Depends(get_db)
):
    shipping = (
        db.query(ShippingModel)
        .filter(ShippingModel.id == shipping_id)
        .first()
    )

    if not shipping:
        raise HTTPException(
            status_code=404,
            detail="Shipping information not found"
        )

    db.delete(shipping)
    db.commit()

    return {
        "message": "Shipping information deleted successfully",
        "id": shipping_id
    }