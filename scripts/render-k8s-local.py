#!/usr/bin/env python3
from __future__ import annotations
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description="Render a localhost-only Kubernetes manifest")
parser.add_argument("--image", default="arkadiusz-kamrowski-site:local")
parser.add_argument("--namespace", default="personal-site-local")
parser.add_argument("--output", default=str(ROOT / "rendered-k8s-local.yaml"))
args = parser.parse_args()

if ":" not in args.image:
    raise SystemExit("--image must include a tag")

text = (ROOT / "k8s/local.yaml.tpl").read_text(encoding="utf-8")
text = text.replace("{{IMAGE}}", args.image).replace("{{NAMESPACE}}", args.namespace)
Path(args.output).write_text(text, encoding="utf-8")
print(args.output)
