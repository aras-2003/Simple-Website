#!/usr/bin/env python3
from __future__ import annotations
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--image", required=True)
parser.add_argument("--host", required=True)
parser.add_argument("--namespace", default="personal-site")
parser.add_argument("--output", default=str(ROOT / "rendered-k8s.yaml"))
args = parser.parse_args()

if "/" not in args.image or ":" not in args.image:
    raise SystemExit("--image must be a fully qualified image with immutable tag, e.g. registry.azurecr.io/site:sha")
if "." not in args.host:
    raise SystemExit("--host must look like a real DNS host")

text = (ROOT / "k8s/site.yaml.tpl").read_text(encoding="utf-8")
text = text.replace("{{IMAGE}}", args.image).replace("{{HOST}}", args.host).replace("{{NAMESPACE}}", args.namespace)
Path(args.output).write_text(text, encoding="utf-8")
print(args.output)
