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
    "--require-contact-production",
]
FAKE_RESEND = "re_123456789012345678901234567890"
FAKE_TURNSTILE = "0x4AAAAAAAtest-secret-value"
GOOD_ENV = {
    **os.environ,
    "PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAAAtest-site-key",
    "TURNSTILE_SECRET_KEY": FAKE_TURNSTILE,
    "RESEND_API_KEY": FAKE_RESEND,
    "CONTACT_TO_EMAIL": "owner@example.net",
    "CONTACT_FROM_EMAIL": "Website <contact@arkadiuszkamrowski.com>",
    "CONTACT_REQUIRE_ORIGIN": "1",
    "CONTACT_ALLOWED_ORIGINS": "https://arkadiuszkamrowski.com",
    "TURNSTILE_REQUIRED": "1",
    "TURNSTILE_EXPECTED_HOSTNAME": "arkadiuszkamrowski.com",
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
    assert "Cloudflare Workers + Static Assets" in result.stdout
    assert FAKE_RESEND not in result.stdout + result.stderr
    assert FAKE_TURNSTILE not in result.stdout + result.stderr


def expect_failure(overrides: dict[str, str], expected: str) -> None:
    result = run(overrides)
    assert result.returncode != 0, "expected failure"
    output = result.stdout + result.stderr
    assert "PREDEPLOY CHECK FAILED" in output
    assert expected in output, output
    assert FAKE_RESEND not in output
    assert FAKE_TURNSTILE not in output


def main() -> None:
    expect_success()
    expect_failure({"PUBLIC_TURNSTILE_SITE_KEY": "short"}, "PUBLIC_TURNSTILE_SITE_KEY")
    expect_failure({"TURNSTILE_SECRET_KEY": "short"}, "TURNSTILE_SECRET_KEY")
    expect_failure({"RESEND_API_KEY": "short"}, "RESEND_API_KEY")
    expect_failure({"TURNSTILE_REQUIRED": "0"}, "TURNSTILE_REQUIRED must be 1")
    expect_failure({"TURNSTILE_EXPECTED_HOSTNAME": "www.arkadiuszkamrowski.com"}, "TURNSTILE_EXPECTED_HOSTNAME")
    expect_failure({"CONTACT_REQUIRE_ORIGIN": "0"}, "CONTACT_REQUIRE_ORIGIN must be 1")
    expect_failure(
        {"CONTACT_ALLOWED_ORIGINS": "https://arkadiuszkamrowski.com,http://localhost:8080"},
        "CONTACT_ALLOWED_ORIGINS must contain only",
    )
    expect_failure(
        {"CONTACT_FROM_EMAIL": "Website <contact@other-domain.example>"},
        "CONTACT_FROM_EMAIL must use the public domain",
    )

    bad_origin_args = BASE_ARGS.copy()
    bad_origin_args[bad_origin_args.index("https://arkadiuszkamrowski.com")] = "http://arkadiuszkamrowski.com"
    result = run(args=bad_origin_args)
    assert result.returncode != 0
    assert "site-base-url must use https" in result.stdout

    print("Production Worker predeploy contract tests: PASS")


if __name__ == "__main__":
    main()
