#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
from urllib.parse import urlparse

EMAIL_RE = re.compile(r"^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$")


def env(name: str) -> str:
    return os.environ.get(name, "").strip()


def parse_sender_email(value: str) -> str:
    if "<" in value and value.endswith(">"):
        return value.rsplit("<", 1)[1][:-1].strip()
    return value.strip()


def valid_email(value: str) -> bool:
    return bool(EMAIL_RE.fullmatch(value)) and len(value) <= 254


p = argparse.ArgumentParser(description="Validate the Cloudflare Workers production deployment contract without printing secrets.")
p.add_argument("--site-base-url", required=True)
p.add_argument("--host", required=True)
p.add_argument("--require-contact-production", action="store_true")
a = p.parse_args()

errors: list[str] = []
url = urlparse(a.site_base_url)

if url.scheme != "https":
    errors.append("site-base-url must use https")
if not url.hostname:
    errors.append("site-base-url must contain a hostname")
if url.username or url.password or url.query or url.fragment:
    errors.append("site-base-url must be a clean public origin without credentials, query or fragment")
if url.path not in ("", "/"):
    errors.append("site-base-url must not contain a path")
if url.port is not None:
    errors.append("site-base-url must use the default HTTPS port without an explicit port")
if url.hostname and url.hostname.lower() != a.host.lower():
    errors.append(f"URL host ({url.hostname}) must equal production host ({a.host})")
if any(x in a.host.lower() for x in ["example.", "localhost", "replace_"]):
    errors.append("host still looks like a placeholder")

if a.require_contact_production:
    site_key = env("PUBLIC_TURNSTILE_SITE_KEY")
    turnstile_secret = env("TURNSTILE_SECRET_KEY")
    resend_key = env("RESEND_API_KEY")
    to_email = env("CONTACT_TO_EMAIL")
    from_value = env("CONTACT_FROM_EMAIL")
    from_email = parse_sender_email(from_value)
    require_origin = env("CONTACT_REQUIRE_ORIGIN")
    allowed_origins_raw = env("CONTACT_ALLOWED_ORIGINS")
    turnstile_required = env("TURNSTILE_REQUIRED")
    expected_hostname = env("TURNSTILE_EXPECTED_HOSTNAME")

    if len(site_key) < 10:
        errors.append("PUBLIC_TURNSTILE_SITE_KEY is missing or looks incomplete")
    if len(turnstile_secret) < 10:
        errors.append("TURNSTILE_SECRET_KEY is missing or looks incomplete")
    if len(resend_key) < 20:
        errors.append("RESEND_API_KEY is missing or looks incomplete")
    if turnstile_required != "1":
        errors.append("TURNSTILE_REQUIRED must be 1 for production")
    if expected_hostname.lower() != a.host.lower():
        errors.append("TURNSTILE_EXPECTED_HOSTNAME must equal the production host")
    if require_origin != "1":
        errors.append("CONTACT_REQUIRE_ORIGIN must be 1 for production")

    expected_origin = f"https://{a.host.lower()}"
    origins = [item.strip() for item in allowed_origins_raw.split(",") if item.strip()]
    if origins != [expected_origin]:
        errors.append(f"CONTACT_ALLOWED_ORIGINS must contain only {expected_origin}")

    if not valid_email(to_email):
        errors.append("CONTACT_TO_EMAIL must be a valid delivery address")
    if not valid_email(from_email):
        errors.append("CONTACT_FROM_EMAIL must contain a valid sender address")
    elif url.hostname:
        sender_domain = from_email.rsplit("@", 1)[1].lower()
        public_domain = url.hostname.lower()
        if sender_domain != public_domain and not sender_domain.endswith(f".{public_domain}"):
            errors.append("CONTACT_FROM_EMAIL must use the public domain or one of its subdomains")

if errors:
    print("PREDEPLOY CHECK FAILED")
    for error in errors:
        print(" -", error)
    raise SystemExit(1)

print("PREDEPLOY CHECK PASS")
print(f" - origin: https://{a.host}")
print(" - runtime: Cloudflare Workers + Static Assets")
if a.require_contact_production:
    print(" - contact: Turnstile + Resend production configuration present; secrets not displayed")
