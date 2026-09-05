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


def positive_int(value: str, *, minimum: int = 1, maximum: int | None = None) -> bool:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return False
    if parsed < minimum:
        return False
    if maximum is not None and parsed > maximum:
        return False
    return True


p = argparse.ArgumentParser(description="Validate the production deployment contract without printing secrets.")
p.add_argument("--site-base-url", required=True)
p.add_argument("--host", required=True)
p.add_argument("--namespace", default="personal-site")
p.add_argument(
    "--require-contact-production",
    action="store_true",
    help="also require a live, origin-locked contact configuration and delivery secrets",
)
a = p.parse_args()

errors: list[str] = []
warnings: list[str] = []
url = urlparse(a.site_base_url)

if url.scheme != "https":
    errors.append("site-base-url must use https")
if not url.hostname:
    errors.append("site-base-url must contain a hostname")
if url.username or url.password or url.query or url.fragment:
    errors.append("site-base-url must be a clean public origin without credentials, query or fragment")
if url.path not in ("", "/"):
    errors.append("site-base-url must not contain a path")
if url.hostname and url.hostname.lower() != a.host.lower():
    errors.append(f"URL host ({url.hostname}) must equal ingress host ({a.host})")
if "/" in a.namespace or not a.namespace:
    errors.append("namespace is invalid")
if any(x in a.host.lower() for x in ["example.", "localhost", "replace_"]):
    errors.append("host still looks like a placeholder")

if a.require_contact_production:
    dry_run = env("CONTACT_DRY_RUN")
    require_origin = env("CONTACT_REQUIRE_ORIGIN")
    allowed_origins_raw = env("CONTACT_ALLOWED_ORIGINS")
    resend_key = env("RESEND_API_KEY")
    to_email = env("CONTACT_TO_EMAIL")
    from_value = env("CONTACT_FROM_EMAIL")
    from_email = parse_sender_email(from_value)
    rate_limit = env("CONTACT_RATE_LIMIT") or "5"
    rate_buckets = env("CONTACT_RATE_BUCKETS") or "5000"
    api_port = env("CONTACT_API_PORT") or "8787"

    if dry_run != "0":
        errors.append("CONTACT_DRY_RUN must be 0 for production")
    if require_origin != "1":
        errors.append("CONTACT_REQUIRE_ORIGIN must be 1 for production")

    if not allowed_origins_raw:
        errors.append("CONTACT_ALLOWED_ORIGINS is required for production")
    else:
        allowed_origins = [item.strip() for item in allowed_origins_raw.split(",") if item.strip()]
        expected_origin = f"https://{a.host.lower()}"
        normalized_origins: set[str] = set()
        for origin in allowed_origins:
            parsed = urlparse(origin)
            if origin == "*":
                errors.append("CONTACT_ALLOWED_ORIGINS must never contain *")
                continue
            if parsed.scheme != "https" or not parsed.hostname:
                errors.append(f"contact origin must be an explicit https origin: {origin}")
                continue
            if parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path not in ("", "/"):
                errors.append(f"contact origin must not contain credentials, path, query or fragment: {origin}")
                continue
            normalized_origins.add(f"https://{parsed.hostname.lower()}{':' + str(parsed.port) if parsed.port else ''}")
            if parsed.hostname.lower() in {"localhost", "127.0.0.1"}:
                errors.append("CONTACT_ALLOWED_ORIGINS must not include localhost in production")
        if expected_origin not in normalized_origins:
            errors.append(f"CONTACT_ALLOWED_ORIGINS must include {expected_origin}")

    if len(resend_key) < 20:
        errors.append("RESEND_API_KEY is missing or looks incomplete")
    if not valid_email(to_email):
        errors.append("CONTACT_TO_EMAIL must be a valid delivery address")
    if not valid_email(from_email):
        errors.append("CONTACT_FROM_EMAIL must contain a valid sender address")
    elif url.hostname:
        sender_domain = from_email.rsplit("@", 1)[1].lower()
        public_domain = url.hostname.lower()
        if sender_domain != public_domain and not sender_domain.endswith(f".{public_domain}"):
            errors.append(
                "CONTACT_FROM_EMAIL must use the public domain or one of its subdomains so sender-domain verification is explicit"
            )

    if not positive_int(rate_limit, minimum=1, maximum=100):
        errors.append("CONTACT_RATE_LIMIT must be an integer between 1 and 100")
    elif int(rate_limit) > 10:
        warnings.append("CONTACT_RATE_LIMIT is above 10 requests per 10 minutes; confirm this is intentional")
    if not positive_int(rate_buckets, minimum=100, maximum=1000000):
        errors.append("CONTACT_RATE_BUCKETS must be an integer between 100 and 1000000")
    if not positive_int(api_port, minimum=1, maximum=65535):
        errors.append("CONTACT_API_PORT must be a valid TCP port")

if errors:
    print("PREDEPLOY CHECK FAILED")
    for error in errors:
        print(" -", error)
    raise SystemExit(1)

print("PREDEPLOY CHECK PASS")
print(f" - origin: https://{a.host}")
print(f" - namespace: {a.namespace}")
if a.require_contact_production:
    print(" - contact: live delivery configuration present; secrets not displayed")
for warning in warnings:
    print(" - warning:", warning)
