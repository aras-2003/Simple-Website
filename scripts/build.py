#!/usr/bin/env python3
from __future__ import annotations
import json
import os
import shutil
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
DIST = ROOT / "dist"
CONFIG = json.loads((ROOT / "site.config.json").read_text(encoding="utf-8"))

base_url = os.environ.get("SITE_BASE_URL", CONFIG["base_url"]).rstrip("/")
linkedin_url = os.environ.get("LINKEDIN_URL", CONFIG["linkedin_url"]).rstrip("/")

if os.environ.get("PRODUCTION") == "1":
    parsed = urlparse(base_url)
    if parsed.scheme != "https" or not parsed.netloc or "localhost" in parsed.netloc:
        raise SystemExit("PRODUCTION=1 requires SITE_BASE_URL=https://<real-domain>")

if DIST.exists():
    shutil.rmtree(DIST)
shutil.copytree(SRC, DIST)

# Generate a real PNG social card using only Python stdlib. This keeps the repository text-only
# while avoiding a binary asset or a runtime image dependency.
def write_og_png(path: Path, width: int = 1200, height: int = 630) -> None:
    import struct
    import zlib

    ink = (11, 13, 15)
    paper = (242, 238, 230)
    muted = (157, 164, 171)
    signal = (182, 255, 106)
    rows = [bytearray(ink * width) for _ in range(height)]

    def hline(y: int, x1: int, x2: int, color: tuple[int, int, int]) -> None:
        if 0 <= y < height:
            for x in range(max(0, x1), min(width, x2)):
                rows[y][x * 3:x * 3 + 3] = bytes(color)

    def vline(x: int, y1: int, y2: int, color: tuple[int, int, int]) -> None:
        if 0 <= x < width:
            for y in range(max(0, y1), min(height, y2)):
                rows[y][x * 3:x * 3 + 3] = bytes(color)

    # Architectural grid + AK mark. The SVG source remains the richer human-readable artwork.
    grid = (26, 29, 32)
    for x in (64, 300, 600, 900, 1135):
        vline(x, 0, height, grid)
    for y in (64, 430, 566):
        hline(y, 64, 1136, grid)
    for x in range(65, 116):
        rows[65][x * 3:x * 3 + 3] = bytes(paper)
        rows[115][x * 3:x * 3 + 3] = bytes(paper)
    for y in range(65, 116):
        rows[y][65 * 3:65 * 3 + 3] = bytes(paper)
        rows[y][115 * 3:115 * 3 + 3] = bytes(paper)
    hline(492, 64, 330, signal)
    hline(494, 64, 220, muted)

    raw = b''.join(b'\x00' + bytes(row) for row in rows)
    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9))
    png += chunk(b'IEND', b'')
    path.write_bytes(png)

write_og_png(DIST / "assets" / "og-card.png")

index = (DIST / "index.html").read_text(encoding="utf-8")
index = index.replace("{{BASE_URL}}", base_url).replace("{{LINKEDIN_URL}}", linkedin_url)
(DIST / "index.html").write_text(index, encoding="utf-8")

host = urlparse(base_url).netloc or "localhost"
robots = "User-agent: *\nAllow: /\n"
if host != "localhost:8080" and "localhost" not in host:
    robots += f"Sitemap: {base_url}/sitemap.xml\n"
(DIST / "robots.txt").write_text(robots, encoding="utf-8")

sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{base_url}/</loc></url>\n</urlset>\n'''
(DIST / "sitemap.xml").write_text(sitemap, encoding="utf-8")

(DIST / ".well-known").mkdir(exist_ok=True)
(DIST / ".well-known" / "security.txt").write_text(
    "Contact: https://pl.linkedin.com/in/arkadiusz-kamrowski\nPreferred-Languages: pl, en\n",
    encoding="utf-8",
)
print(f"Built {DIST} for {base_url}")
