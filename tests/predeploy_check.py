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
GOOD_ENV = {
    **os.environ,
    "CONTACT_DRY_RUN": "0",
    "CONTACT_REQUIRE_ORIGIN": "1",
    "CONTACT_ALLOWED_ORIGINS": "https://arkadiuszkamrowski.com",
    "CONTACT_RATE_LIMIT": "5",
    "CONTACT_RATE_BUCKETS": "5000",
    "CONTACT_API_PORT": "8787",
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
    assert FAKE_SECRET not in result.stdout
    assert FAKE_SECRET not in result.stderr


def expect_failure(overrides: dict[str, str], expected: str) -> None:
    result = run(overrides)
    assert result.returncode != 0, "expected failure"
    output = result.stdout + result.stderr
    assert "PREDEPLOY CHECK FAILED" in output
    assert expected in output, output
    assert FAKE_SECRET not in output


def main() -> None:
    expect_success()
    expect_failure({"CONTACT_DRY_RUN": "1"}, "CONTACT_DRY_RUN must be 0")
    expect_failure({"CONTACT_REQUIRE_ORIGIN": "0"}, "CONTACT_REQUIRE_ORIGIN must be 1")
    expect_failure(
        {"CONTACT_ALLOWED_ORIGINS": "http://localhost:8080"},
        "contact origin must be an explicit https origin",
    )
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

    print("Production predeploy contract tests: PASS")


if __name__ == "__main__":
    main()
