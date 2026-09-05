#!/usr/bin/env python3
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "predeploy_check.py"
BASE_ARGS = [
    sys.executable,
    str(SCRIPT),
    "--site-base-url",
    "https://arkadiuszkamrowski.com",
    "--host",
    "arkadiuszkamrowski.com",
    "--namespace",
    "personal-site",
    "--require-contact-production",
]
FAKE_SECRET = "re_123456789012345678901234567890"
FAKE_TURNSTILE_SECRET = "0x4AAA-test-secret-123456789012345"
FAKE_TURNSTILE_SITEKEY = "0x4AAAA-test-sitekey-1234567890123"
GIT_SHA = "0123456789abcdef0123456789abcdef01234567"
GOOD_ENV = {
    **os.environ,
    "IMAGE": f"example.azurecr.io/personal-site:{GIT_SHA}",
    "CONTACT_IMAGE": f"example.azurecr.io/personal-contact:{GIT_SHA}",
    "CONTACT_DRY_RUN": "0",
    "CONTACT_REQUIRE_ORIGIN": "1",
    "CONTACT_ALLOWED_ORIGINS": "https://arkadiuszkamrowski.com",
    "CONTACT_RATE_LIMIT": "5",
    "CONTACT_RATE_BUCKETS": "5000",
    "CONTACT_API_PORT": "8787",
    "TURNSTILE_REQUIRED": "1",
    "PUBLIC_TURNSTILE_SITE_KEY": FAKE_TURNSTILE_SITEKEY,
    "TURNSTILE_SECRET_KEY": FAKE_TURNSTILE_SECRET,
    "TURNSTILE_EXPECTED_HOSTNAME": "arkadiuszkamrowski.com",
    "RESEND_API_KEY": FAKE_SECRET,
    "CONTACT_TO_EMAIL": "owner@example.net",
    "CONTACT_FROM_EMAIL": "Website <contact@arkadiuszkamrowski.com>",
}


def run(overrides: dict[str, str] | None = None, args: list[str] | None = None) -> subprocess.CompletedProcess[str]:
    environment = GOOD_ENV.copy()
    if overrides:
        environment.update(overrides)
    return subprocess.run(
        args or BASE_ARGS,
        cwd=ROOT,
        env=environment,
        text=True,
        capture_output=True,
        check=False,
    )


def expect_success() -> None:
    result = run()
    assert result.returncode == 0, result.stdout + result.stderr
    assert "PREDEPLOY CHECK PASS" in result.stdout
    assert "immutable release references present" in result.stdout
    assert "Turnstile enforcement configuration present" in result.stdout
    for secret in (FAKE_SECRET, FAKE_TURNSTILE_SECRET):
        assert secret not in result.stdout
        assert secret not in result.stderr


def expect_failure(overrides: dict[str, str], expected: str) -> None:
    result = run(overrides)
    assert result.returncode != 0, "expected failure"
    output = result.stdout + result.stderr
    assert "PREDEPLOY CHECK FAILED" in output
    assert expected in output, output
    for secret in (FAKE_SECRET, FAKE_TURNSTILE_SECRET):
        assert secret not in output


def main() -> None:
    expect_success()
    expect_failure({"IMAGE": "example.azurecr.io/personal-site:latest"}, "IMAGE must use an immutable")
    expect_failure({"CONTACT_IMAGE": "example.azurecr.io/personal-contact:production"}, "CONTACT_IMAGE must use an immutable")
    expect_failure({"CONTACT_IMAGE": GOOD_ENV["IMAGE"]}, "IMAGE and CONTACT_IMAGE must reference distinct images")
    expect_failure({"CONTACT_DRY_RUN": "1"}, "CONTACT_DRY_RUN must be 0")
    expect_failure({"CONTACT_REQUIRE_ORIGIN": "0"}, "CONTACT_REQUIRE_ORIGIN must be 1")
    expect_failure(
        {"CONTACT_ALLOWED_ORIGINS": "http://localhost:8080"},
        "contact origin must be an explicit https origin",
    )
    expect_failure({"TURNSTILE_REQUIRED": "0"}, "TURNSTILE_REQUIRED must be 1")
    expect_failure({"PUBLIC_TURNSTILE_SITE_KEY": "short"}, "PUBLIC_TURNSTILE_SITE_KEY is missing")
    expect_failure({"TURNSTILE_SECRET_KEY": "short"}, "TURNSTILE_SECRET_KEY is missing")
    expect_failure({"TURNSTILE_EXPECTED_HOSTNAME": "www.arkadiuszkamrowski.com"}, "TURNSTILE_EXPECTED_HOSTNAME must equal")
    expect_failure({"RESEND_API_KEY": "short"}, "RESEND_API_KEY is missing")
    expect_failure(
        {"CONTACT_FROM_EMAIL": "Website <contact@other-domain.example>"},
        "CONTACT_FROM_EMAIL must use the public domain",
    )

    bad_origin_args = BASE_ARGS.copy()
    bad_origin_args[bad_origin_args.index("https://arkadiuszkamrowski.com")] = "http://arkadiuszkamrowski.com"
    result = run(args=bad_origin_args)
    assert result.returncode != 0
    assert "site-base-url must use https" in result.stdout

    bad_port_args = BASE_ARGS.copy()
    bad_port_args[bad_port_args.index("https://arkadiuszkamrowski.com")] = "https://arkadiuszkamrowski.com:444"
    result = run(args=bad_port_args)
    assert result.returncode != 0
    assert "default HTTPS port" in result.stdout

    print("Production predeploy contract tests: PASS")


if __name__ == "__main__":
    main()
