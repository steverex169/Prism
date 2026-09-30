from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel

from Model import Hero_model
from Database import get_db
import os


router = APIRouter(
    prefix="/hero",
    tags=["Hero"]
)


# -------------------------
# Schemas
# -------------------------

class HeroImageCreate(BaseModel):
    section_name: Optional[str] = None
    alt_text: Optional[str] = None


class UpdateHeroImage(BaseModel):
    section_name: Optional[str] = None
    alt_text: Optional[str] = None


class DeleteHeroImage(BaseModel):
    id: int


UPLOAD_FOLDER = "uploads/hero"
MAX_FILE_SIZE = 100 * 1024  # 100 KB

ALLOWED_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp"
}

ALLOWED_CONTENT_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp"
}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# -------------------------
# HELPER
# -------------------------

async def save_image(image: UploadFile):

    extension = os.path.splitext(image.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PNG, JPG, JPEG and WEBP images are allowed"
        )

    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format"
        )

    content = await image.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image size must not exceed 100 KB"
        )

    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(file_path, "wb") as f:
        f.write(content)

    return file_path


# -------------------------
# CREATE HERO IMAGE
# -------------------------

@router.post("/")
async def create_hero_image(
    image: UploadFile = File(...),
    section_name: Optional[str] = Form(None),
    alt_text: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):

    try:

        image_path = await save_image(image)

        new_hero = Hero_model.HeroImages(
            section_name=section_name,
            image_url=image_path,
            alt_text=alt_text
        )

        db.add(new_hero)
        db.commit()
        db.refresh(new_hero)

        return {
            "message": "Hero image created successfully",
            "data": new_hero
        }

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -------------------------
# GET ALL HERO IMAGES
# -------------------------

@router.get("/")
def get_all_hero_images(
    db: Session = Depends(get_db)
):

    try:

        heroes = db.query(
            Hero_model.HeroImages
        ).all()

        return {
            "message": "Hero images fetched successfully",
            "data": heroes
        }

    except SQLAlchemyError as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -------------------------
# GET HERO IMAGE BY ID
# -------------------------

@router.get("/{hero_id}")
def get_hero_image(
    hero_id: int,
    db: Session = Depends(get_db)
):

    hero = db.query(
        Hero_model.HeroImages
    ).filter(
        Hero_model.HeroImages.id == hero_id
    ).first()

    if not hero:

        raise HTTPException(
            status_code=404,
            detail="Hero image not found"
        )

    return {
        "message": "Hero image fetched successfully",
        "data": hero
    }


# -------------------------
# UPDATE HERO IMAGE
# -------------------------

@router.put("/{hero_id}")
async def update_hero_image(
    hero_id: int,
    image: Optional[UploadFile] = File(None),
    section_name: Optional[str] = Form(None),
    alt_text: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):

    try:

        hero = db.query(
            Hero_model.HeroImages
        ).filter(
            Hero_model.HeroImages.id == hero_id
        ).first()

        if not hero:

            raise HTTPException(
                status_code=404,
                detail="Hero image not found"
            )

        if section_name is not None:
            hero.section_name = section_name

        if alt_text is not None:
            hero.alt_text = alt_text

        if image is not None:

            new_image_path = await save_image(image)

            # Delete old image if it exists
            if hero.image_url and os.path.exists(hero.image_url):
                os.remove(hero.image_url)

            hero.image_url = new_image_path

        db.commit()
        db.refresh(hero)

        return {
            "message": "Hero image updated successfully",
            "data": hero
        }

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -------------------------
# DELETE HERO IMAGE
# -------------------------

@router.delete("/{hero_id}")
def delete_hero_image(
    hero_id: int,
    db: Session = Depends(get_db)
):

    try:

        hero = db.query(
            Hero_model.HeroImages
        ).filter(
            Hero_model.HeroImages.id == hero_id
        ).first()

        if not hero:

            raise HTTPException(
                status_code=404,
                detail="Hero image not found"
            )

        # Delete image from storage
        if hero.image_url and os.path.exists(hero.image_url):
            os.remove(hero.image_url)

        db.delete(hero)
        db.commit()

        return {
            "message": "Hero image deleted successfully"
        }

    except HTTPException:
        raise

    except SQLAlchemyError as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )