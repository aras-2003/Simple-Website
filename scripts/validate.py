#!/usr/bin/env python3
from __future__ import annotations
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
HTML = DIST / "index.html"

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.ids = set()
        self.hash_links = []
        self.images = []
        self.blank_links = []
        self.has_main = False
        self.has_nav_label = False
        self.title = []
        self.in_title = False
        self.meta_description = False
        self.canonical = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "h1": self.h1 += 1
        if "id" in a: self.ids.add(a["id"])
        if tag == "a" and a.get("href", "").startswith("#"): self.hash_links.append(a["href"][1:])
        if tag == "a" and a.get("target") == "_blank": self.blank_links.append(a)
        if tag == "img": self.images.append(a)
        if tag == "main": self.has_main = True
        if tag == "nav" and (a.get("aria-label") or a.get("aria-labelledby")): self.has_nav_label = True
        if tag == "title": self.in_title = True
        if tag == "meta" and a.get("name") == "description" and a.get("content"): self.meta_description = True
        if tag == "link" and a.get("rel") == "canonical" and a.get("href"): self.canonical = True
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title.append(data)

errors = []
if not HTML.exists():
    errors.append("dist/index.html missing")
else:
    parser = AuditParser(); parser.feed(HTML.read_text(encoding="utf-8"))
    if parser.h1 != 1: errors.append(f"expected exactly one H1, got {parser.h1}")
    if not parser.has_main: errors.append("missing <main>")
    if not parser.has_nav_label: errors.append("navigation lacks accessible label")
    if not ''.join(parser.title).strip(): errors.append("missing title")
    if not parser.meta_description: errors.append("missing meta description")
    if not parser.canonical: errors.append("missing canonical")
    for target in parser.hash_links:
        if target and target not in parser.ids: errors.append(f"broken anchor: #{target}")
    for img in parser.images:
        if "alt" not in img: errors.append("image without alt")
    for link in parser.blank_links:
        rel = set(link.get("rel", "").split())
        if not {"noopener", "noreferrer"}.issubset(rel): errors.append("target=_blank without noopener noreferrer")

manifest = DIST / "site.webmanifest"
try: json.loads(manifest.read_text(encoding="utf-8"))
except Exception as exc: errors.append(f"invalid manifest: {exc}")

required = ["styles.css", "app.js", "robots.txt", "sitemap.xml", "assets/favicon.svg", "assets/og-card.svg", "assets/og-card.png"]
for rel in required:
    if not (DIST / rel).exists(): errors.append(f"missing {rel}")

for p in DIST.rglob("*"):
    if p.is_file() and p.stat().st_size > 750_000:
        errors.append(f"asset too large (>750KB): {p.relative_to(DIST)}")

text = HTML.read_text(encoding="utf-8") if HTML.exists() else ""
if "{{" in text or "}}" in text: errors.append("unresolved template token in index.html")
if re.search(r'https?://example\.', text): errors.append("example domain leaked into built HTML")

if errors:
    print("VALIDATION FAILED")
    for e in errors: print(f" - {e}")
    sys.exit(1)
print("VALIDATION PASS")
