from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from Database import get_db
from Model.order_model import OrderModel


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# =========================
# Pydantic Schemas
# =========================

class OrderCreate(BaseModel):
    order_number: str
    customer_name: str
    customer_email: str
    items: int
    total: int
    payment: str
    payment_method: str
    status: Optional[str] = "pending"
    research_field: str


class OrderUpdate(BaseModel):
    order_number: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    research_field: str
    items: Optional[int] = None
    total: Optional[int] = None
    payment: Optional[str] = None
    payment_method: Optional[str] = None
    status: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    research_field: str
    items: int
    total: int
    payment: str
    payment_method: str
    status: str
    date: Optional[datetime] = None

    class Config:
        from_attributes = True


#========================
# Get All Orders
#=======================
@router.get("/", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    orders = (
        db.query(OrderModel)
        .order_by(OrderModel.id.asc())
        .all()
    )

    return orders


#========================
# Search Orders by Customer Name
#=======================
@router.get("/search", response_model=List[OrderResponse])
def search_orders(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(OrderModel)
        .filter(
            OrderModel.customer_name.ilike(
                f"%{name}%"
            )
        )
        .order_by(OrderModel.id.asc())
        .all()
    )

    return orders


# =========================
# Get Order By ID
# =========================

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(OrderModel)
        .filter(OrderModel.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order

# =========================
# Create Order
# =========================
@router.post(
    "/",
    response_model=OrderResponse,
    status_code=201
)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    existing_order = (
        db.query(OrderModel)
        .filter(
            OrderModel.order_number ==
            order_data.order_number
        )
        .first()
    )

    if existing_order:
        raise HTTPException(
            status_code=400,
            detail="Order number already exists"
        )

    # Find the smallest available ID
    existing_ids = {
        row[0]
        for row in db.query(OrderModel.id)
        .order_by(OrderModel.id.asc())
        .all()
    }

    new_id = 1

    while new_id in existing_ids:
        new_id += 1

    new_order = OrderModel(
        id=new_id,
        order_number=order_data.order_number,
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        research_field=order_data.research_field,
        items=order_data.items,
        total=order_data.total,
        payment=order_data.payment,
        payment_method=order_data.payment_method,
        status=order_data.status or "pending",
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order

# =========================
# Update Order
# =========================

@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: Session = Depends(get_db)
):
    order = (
        db.query(OrderModel)
        .filter(OrderModel.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    update_data = order_data.model_dump(
        exclude_unset=True
    )

    if "order_number" in update_data:
        existing_order = (
            db.query(OrderModel)
            .filter(
                OrderModel.order_number == update_data["order_number"],
                OrderModel.id != order_id
            )
            .first()
        )

        if existing_order:
            raise HTTPException(
                status_code=400,
                detail="Order number already exists"
            )

    for field, value in update_data.items():
        setattr(order, field, value)

    db.commit()
    db.refresh(order)

    return order


# =========================
# Delete Order
# =========================

@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(OrderModel)
        .filter(OrderModel.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully",
        "id": order_id
    }