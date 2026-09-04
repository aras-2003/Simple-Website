#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Astro project static checks"
node --check tests/static.mjs
node --check tests/contact-api.mjs
node --check server/contact.mjs
node tests/contact-api.mjs
python3 scripts/render-k8s-local.py --image personal-site:local --contact-image personal-contact:local >/dev/null
python3 scripts/render-k8s.py --image example.invalid/personal-site:test --contact-image example.invalid/personal-contact:test --host example.invalid --namespace personal-site >/dev/null
python3 - <<'PY'
import yaml
for f in ['rendered-k8s-local.yaml','rendered-k8s.yaml','.github/workflows/ci.yml','compose.yaml']:
    with open(f, encoding='utf-8') as h:
        list(yaml.safe_load_all(h))
print('YAML PASS')
PY
printf 'CHATGPT STATIC PIPELINE PASS\n'
