from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/visual_character.png"
CUTOUT = ROOT / "src/assets/visual_character_cutout.png"
BACKGROUND = ROOT / "src/assets/visual_orange_background.png"


def orange_background_candidates(rgb: np.ndarray) -> np.ndarray:
    rgb_f = rgb.astype(np.float32) / 255.0
    r, g, b = rgb_f[..., 0], rgb_f[..., 1], rgb_f[..., 2]
    maxc = rgb_f.max(axis=2)
    minc = rgb_f.min(axis=2)
    delta = maxc - minc

    hue = np.zeros_like(maxc)
    nonzero = delta > 1e-6
    red_max = (maxc == r) & nonzero
    green_max = (maxc == g) & nonzero
    blue_max = (maxc == b) & nonzero
    hue[red_max] = ((g[red_max] - b[red_max]) / delta[red_max]) % 6
    hue[green_max] = ((b[green_max] - r[green_max]) / delta[green_max]) + 2
    hue[blue_max] = ((r[blue_max] - g[blue_max]) / delta[blue_max]) + 4
    hue /= 6.0

    saturation = np.where(maxc == 0, 0, delta / maxc)

    return (
        (hue >= 0.015)
        & (hue <= 0.115)
        & (saturation >= 0.45)
        & (maxc >= 0.28)
        & (r > g * 1.28)
        & (g > b * 1.25)
    )


def flood_from_edges(candidate: np.ndarray) -> np.ndarray:
    height, width = candidate.shape
    visited = np.zeros_like(candidate, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def push(y: int, x: int) -> None:
        if candidate[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(width):
        push(0, x)
        push(height - 1, x)
    for y in range(height):
        push(y, 0)
        push(y, width - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width:
                push(ny, nx)

    return visited


def make_background(size: tuple[int, int]) -> Image.Image:
    width, height = size
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None]
    x = np.linspace(0, 1, width, dtype=np.float32)[None, :]
    base = np.zeros((height, width, 3), dtype=np.float32)

    left = np.array([213, 73, 0], dtype=np.float32)
    mid = np.array([238, 91, 0], dtype=np.float32)
    right = np.array([204, 56, 0], dtype=np.float32)
    blend_left = np.clip(1 - x * 2, 0, 1)[..., None]
    blend_right = np.clip((x - 0.5) * 2, 0, 1)[..., None]
    blend_mid = 1 - blend_left - blend_right
    base[:] = left * blend_left + mid * blend_mid + right * blend_right

    vignette = 1 - 0.12 * np.abs(y - 0.48)
    base *= vignette[..., None]
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB")


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    rgb = np.array(source)

    background_mask = flood_from_edges(orange_background_candidates(rgb))

    foreground_mask = Image.fromarray((~background_mask).astype(np.uint8) * 255, "L")
    foreground_mask = foreground_mask.filter(ImageFilter.GaussianBlur(0.7))

    rgba = source.convert("RGBA")
    rgba.putalpha(foreground_mask)
    rgba.save(CUTOUT)

    make_background(source.size).save(BACKGROUND)


if __name__ == "__main__":
    main()
