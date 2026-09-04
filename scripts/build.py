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

# Keep the repository text-only for connector-friendly transport while serving a real PNG for social previews.
og_b64 = DIST / "assets" / "og-card.png.b64"
if og_b64.exists():
    import base64
    (DIST / "assets" / "og-card.png").write_bytes(base64.b64decode(og_b64.read_text(encoding="ascii").strip()))
    og_b64.unlink()

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
