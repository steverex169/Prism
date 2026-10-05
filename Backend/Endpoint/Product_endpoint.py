import os
import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    UploadFile,
    File,
    Form,
)
from pydantic import BaseModel
from sqlalchemy.orm import Session

from Database import get_db
from Model.product_model import ProductModel


router = APIRouter(prefix="/products", tags=["Products"])


# =========================
# Upload Directory
# =========================

UPLOAD_DIR = "uploads/products"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# Response Schema
# =========================

class ProductResponse(BaseModel):
    id: int
    name: str
    price: int
    image: Optional[str] = None
    available: bool
    featured: bool
    sales: int
    relevance: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================
# Allowed Image Types
# =========================

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


# =========================
# Save Image
# =========================

async def save_image(image: UploadFile) -> str:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    extension = ALLOWED_IMAGE_TYPES[image.content_type]

    filename = f"{uuid.uuid4().hex}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    contents = await image.read()

    with open(file_path, "wb") as file:
        file.write(contents)

    return f"/uploads/products/{filename}"


# =========================
# Delete Image File
# =========================

def delete_image(image_path: Optional[str]):
    if not image_path:
        return

    filename = os.path.basename(image_path)

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    if os.path.exists(file_path):
        os.remove(file_path)


# =========================
# GET ALL PRODUCTS
# =========================

@router.get("/", response_model=List[ProductResponse])
def get_products(
    db: Session = Depends(get_db)
):
    products = (
        db.query(ProductModel)
        .order_by(ProductModel.id.asc())
        .all()
    )

    return products


# =========================
# GET PRODUCT BY ID
# =========================

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(ProductModel)
        .filter(ProductModel.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# =========================
# GET PRODUCT BY NAME
# =========================

@router.get("/search", response_model=List[ProductResponse])
def get_product_by_name(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    products = (
        db.query(ProductModel)
        .filter(
            ProductModel.name.ilike(f"%{name}%")
        )
        .order_by(ProductModel.id.asc())
        .all()
    )

    return products


# =========================
# CREATE PRODUCT
# =========================

@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product(
    name: str = Form(...),
    price: int = Form(...),
    available: bool = Form(True),
    featured: bool = Form(False),
    sales: int = Form(0),
    relevance: int = Form(0),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    existing_product = (
        db.query(ProductModel)
        .filter(ProductModel.name == name)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Product with this name already exists"
        )

    image_path = None

    if image:
        image_path = await save_image(image)

    new_product = ProductModel(
        name=name,
        price=price,
        image=image_path,
        available=available,
        featured=featured,
        sales=sales,
        relevance=relevance,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# =========================
# UPDATE PRODUCT
# =========================

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    price: Optional[int] = Form(None),
    available: Optional[bool] = Form(None),
    featured: Optional[bool] = Form(None),
    sales: Optional[int] = Form(None),
    relevance: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    product = (
        db.query(ProductModel)
        .filter(ProductModel.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if name is not None:
        existing_product = (
            db.query(ProductModel)
            .filter(
                ProductModel.name == name,
                ProductModel.id != product_id
            )
            .first()
        )

        if existing_product:
            raise HTTPException(
                status_code=400,
                detail="Product with this name already exists"
            )

        product.name = name

    if price is not None:
        if price < 0:
            raise HTTPException(
                status_code=400,
                detail="Product price cannot be negative"
            )

        product.price = price

    if available is not None:
        product.available = available

    if featured is not None:
        product.featured = featured

    if sales is not None:
        product.sales = sales

    if relevance is not None:
        product.relevance = relevance

    if image:
        new_image_path = await save_image(image)

        delete_image(product.image)

        product.image = new_image_path

    product.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(product)

    return product


# =========================
# DELETE PRODUCT
# =========================

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(ProductModel)
        .filter(ProductModel.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Delete image from server
    delete_image(product.image)

    # Delete database record
    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully",
        "id": product_id
    }