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
    Request,
)
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from Database import get_db
from Model.product_model import ProductModel
from Endpoint.User_endpoint import get_user_from_request, compliance_complete
from Endpoint.Admin_endpoint import admin_status
from Model.notification_model import StockSubscription
from Model.User_model import User
from Services.email_service import queue_email, first_name, site_url, money, utcnow


router = APIRouter(prefix="/products", tags=["Products"])

def require_compliant_researcher(
    request: Request,
    db: Session = Depends(get_db),
):
    if request.cookies.get("admin_authenticated"):
        try:
            return admin_status(request)
        except HTTPException:
            pass
    user = get_user_from_request(request, db)
    if not compliance_complete(user):
        raise HTTPException(
            status_code=403,
            detail="Complete your age and qualified-researcher compliance confirmations to access products.",
        )
    return user


def require_admin(request: Request):
    return admin_status(request)



UPLOAD_DIR = "uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    price: int
    image: Optional[str] = None

    # Technical / Scientific Information
    cas_number: Optional[str] = None
    chemical_name: Optional[str] = None
    molecular_formula: Optional[str] = None
    molecular_weight: Optional[str] = None
    purity: Optional[str] = None
    appearance: Optional[str] = None
    solubility: Optional[str] = None
    storage_conditions: Optional[str] = None

    available: bool
    featured: bool
    sales: int
    relevance: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None



ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


async def save_image(image: UploadFile) -> str:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    extension = ALLOWED_IMAGE_TYPES[image.content_type]
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    contents = await image.read()

    with open(file_path, "wb") as file:
        file.write(contents)

    return f"/uploads/products/{filename}"


def delete_image(image_path: Optional[str]):
    if not image_path:
        return

    filename = os.path.basename(image_path)
    file_path = os.path.join(UPLOAD_DIR, filename)

    if os.path.exists(file_path):
        os.remove(file_path)


# IMPORTANT:
# Keep /search before /{product_id}
# so "search" is not treated as a product ID.


@router.get("/", response_model=List[ProductResponse])
def get_products(
    db: Session = Depends(get_db),
    researcher=Depends(require_compliant_researcher),
):
    products = (
        db.query(ProductModel)
        .order_by(ProductModel.id.asc())
        .all()
    )

    return products


@router.get("/search", response_model=List[ProductResponse])
def get_product_by_name(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    researcher=Depends(require_compliant_researcher),
):
    products = (
        db.query(ProductModel)
        .filter(ProductModel.name.ilike(f"%{name}%"))
        .order_by(ProductModel.id.asc())
        .all()
    )

    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    researcher=Depends(require_compliant_researcher),
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


@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product(
    name: str = Form(...),
    price: int = Form(...),

    # Technical / Scientific Information
    cas_number: Optional[str] = Form(None),
    chemical_name: Optional[str] = Form(None),
    molecular_formula: Optional[str] = Form(None),
    molecular_weight: Optional[str] = Form(None),
    purity: Optional[str] = Form(None),
    appearance: Optional[str] = Form(None),
    solubility: Optional[str] = Form(None),
    storage_conditions: Optional[str] = Form(None),

    available: bool = Form(True),
    featured: bool = Form(False),
    sales: int = Form(0),
    relevance: int = Form(0),

    image: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),
    admin=Depends(require_admin),
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

    if price < 0:
        raise HTTPException(
            status_code=400,
            detail="Product price cannot be negative"
        )

    image_path = None

    if image:
        image_path = await save_image(image)

    new_product = ProductModel(
        name=name,
        price=price,
        image=image_path,

        # Technical / Scientific Information
        cas_number=cas_number,
        chemical_name=chemical_name,
        molecular_formula=molecular_formula,
        molecular_weight=molecular_weight,
        purity=purity,
        appearance=appearance,
        solubility=solubility,
        storage_conditions=storage_conditions,

        available=available,
        featured=featured,
        sales=sales,
        relevance=relevance,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,

    name: Optional[str] = Form(None),
    price: Optional[int] = Form(None),

    # Technical / Scientific Information
    cas_number: Optional[str] = Form(None),
    chemical_name: Optional[str] = Form(None),
    molecular_formula: Optional[str] = Form(None),
    molecular_weight: Optional[str] = Form(None),
    purity: Optional[str] = Form(None),
    appearance: Optional[str] = Form(None),
    solubility: Optional[str] = Form(None),
    storage_conditions: Optional[str] = Form(None),

    available: Optional[bool] = Form(None),
    featured: Optional[bool] = Form(None),
    sales: Optional[int] = Form(None),
    relevance: Optional[int] = Form(None),

    image: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),
    admin=Depends(require_admin),
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

    # Technical / Scientific Information
    if cas_number is not None:
        product.cas_number = cas_number

    if chemical_name is not None:
        product.chemical_name = chemical_name

    if molecular_formula is not None:
        product.molecular_formula = molecular_formula

    if molecular_weight is not None:
        product.molecular_weight = molecular_weight

    if purity is not None:
        product.purity = purity

    if appearance is not None:
        product.appearance = appearance

    if solubility is not None:
        product.solubility = solubility

    if storage_conditions is not None:
        product.storage_conditions = storage_conditions

    restocked = available is True and not product.available
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

    product.updated_at = utcnow()

    if restocked:
        for alert in db.query(StockSubscription).filter_by(product_id=product.id, notified=False).all():
            user = db.query(User).filter_by(id=alert.user_id, email_verified=True, is_active=True).first()
            if user:
                queue_email(db, "BackInStock", user.email, {
                    "firstName": first_name(user.full_name), "productName": product.name,
                    "productPrice": money(product.price), "productImageUrl": site_url(product.image or ""),
                    "productUrl": site_url("/catalog"),
                }, f"stock:{alert.id}:{product.updated_at.isoformat()}")
                alert.notified = True

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
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

    delete_image(product.image)

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully",
        "id": product_id
    }
