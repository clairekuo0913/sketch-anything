import random
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = Path(__file__).parent.parent
IMAGE_DIR = BASE_DIR / "data" / "images"

# Ensure image directory exists
IMAGE_DIR.mkdir(parents=True, exist_ok=True)


# Models
class SessionSettings(BaseModel):
    category: str
    count: int
    duration: int


class ImageSessionResponse(BaseModel):
    images: List[str]
    duration: int


@app.get("/api/categories")
async def get_categories():
    """List all available image categories (subdirectories in data/images)."""
    if not IMAGE_DIR.exists():
        return []

    categories = [
        d.name for d in IMAGE_DIR.iterdir() if d.is_dir() and not d.name.startswith(".")
    ]
    return sorted(categories)


@app.post("/api/session", response_model=ImageSessionResponse)
async def create_session(settings: SessionSettings):
    """Start a session: get random images from the selected category."""
    category_path = IMAGE_DIR / settings.category

    if not category_path.exists() or not category_path.is_dir():
        raise HTTPException(status_code=404, detail="Category not found")

    # Get all valid image files
    valid_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    all_images = [
        f.name
        for f in category_path.iterdir()
        if f.is_file() and f.suffix.lower() in valid_extensions
    ]

    if not all_images:
        # For testing purposes, if no images exist, we might want to return empty or handle it.
        # But the spec implies we should show images.
        # If the user has just created folders but no images, this might return empty.
        raise HTTPException(status_code=404, detail="No images found in this category")

    # Select random images
    # If requested count > available images, we can either repeat or limit.
    # Usually for sketching, repeating is fine if you run out, or just showing all uniquely.
    # Let's sample with replacement if count > len, or just sample unique if possible.

    selected_images = []
    if len(all_images) >= settings.count:
        selected_images = random.sample(all_images, settings.count)
    else:
        # If we need more than we have, fill with available and then random sample for the rest
        selected_images = all_images.copy()
        remaining = settings.count - len(all_images)
        # Add random choices for the remainder
        selected_images.extend(random.choices(all_images, k=remaining))
        # Shuffle the result so the duplicates aren't just at the end
        random.shuffle(selected_images)

    # Construct URLs
    # We serve images at /images/{category}/{filename}
    image_urls = [f"/images/{settings.category}/{img}" for img in selected_images]

    return ImageSessionResponse(images=image_urls, duration=settings.duration)


# Mount static files for images
# This should be after API routes to avoid conflicts if any
app.mount("/images", StaticFiles(directory=str(IMAGE_DIR)), name="images")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
