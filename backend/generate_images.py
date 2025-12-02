from pathlib import Path

from PIL import Image, ImageDraw

# Generate some dummy images for testing
BASE_DIR = Path(__file__).parent.parent
IMAGE_DIR = BASE_DIR / "data" / "images"


def create_dummy_images():
    categories = ["hands", "people"]
    colors = ["red", "green", "blue", "yellow", "purple", "orange"]

    for cat in categories:
        cat_dir = IMAGE_DIR / cat
        cat_dir.mkdir(parents=True, exist_ok=True)

        print(f"Generating images for {cat}...")
        for i in range(5):
            filename = f"{cat}_{i + 1}.jpg"
            filepath = cat_dir / filename

            if not filepath.exists():
                img = Image.new("RGB", (800, 600), color=colors[i % len(colors)])
                d = ImageDraw.Draw(img)
                d.text((350, 300), f"{cat} {i + 1}", fill="black")
                img.save(filepath)
                print(f"  Created {filename}")


if __name__ == "__main__":
    # Ensure PIL is installed: pip install pillow
    try:
        create_dummy_images()
    except ImportError:
        print("Pillow not installed. Skipping dummy image generation.")
        print("Run: pip install pillow")
