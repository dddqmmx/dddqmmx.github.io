from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC_IMG = ROOT / "src/assets/visual_character.png"
DESKTOP_WEBP = ROOT / "src/assets/visual_character.webp"
MOBILE_WEBP = ROOT / "src/assets/visual_character_mobile.webp"

def optimize():
    print(f"Opening {SRC_IMG}...")
    img = Image.open(SRC_IMG)
    w, h = img.size
    print(f"Original size: {w}x{h}, format: {img.format}, mode: {img.mode}")

    # 1. Desktop LOD: WebP with high quality
    target_h_desktop = min(h, 1024)
    target_w_desktop = int(w * (target_h_desktop / h))
    desktop_img = img.resize((target_w_desktop, target_h_desktop), Image.Resampling.LANCZOS)
    desktop_img.save(DESKTOP_WEBP, "WEBP", quality=80, method=6)
    desktop_size = DESKTOP_WEBP.stat().st_size
    print(f"Desktop WebP saved: {target_w_desktop}x{target_h_desktop}, size: {desktop_size / 1024:.2f} KB")

    # 2. Mobile LOD: WebP for smaller screens (e.g. height 640)
    target_h_mobile = 640
    target_w_mobile = int(w * (target_h_mobile / h))
    mobile_img = img.resize((target_w_mobile, target_h_mobile), Image.Resampling.LANCZOS)
    mobile_img.save(MOBILE_WEBP, "WEBP", quality=75, method=6)
    mobile_size = MOBILE_WEBP.stat().st_size
    print(f"Mobile WebP saved: {target_w_mobile}x{target_h_mobile}, size: {mobile_size / 1024:.2f} KB")

    # 3. Favicon: optimize if needed
    fav_path = ROOT / "public/favicon.png"
    if fav_path.exists():
        fav = Image.open(fav_path)
        if fav.size[0] > 128:
            fav = fav.resize((128, 128), Image.Resampling.LANCZOS)
            fav.save(fav_path, "PNG", optimize=True)
            print(f"Favicon optimized: size {fav_path.stat().st_size / 1024:.2f} KB")

if __name__ == "__main__":
    optimize()
