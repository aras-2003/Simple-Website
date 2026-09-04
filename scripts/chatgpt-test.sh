#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
bash scripts/test.sh
python3 scripts/render-k8s.py --image 'example.azurecr.io/personal-site:sha-test' --host 'www.example.org' --output /tmp/ak-site-k8s.yaml
python3 - <<'PY'
import yaml
from pathlib import Path
for p in [Path('.github/workflows/ci.yml'), Path('.github/workflows/deploy-aks.yml'), Path('.github/dependabot.yml'), Path('compose.yaml'), Path('/tmp/ak-site-k8s.yaml')]:
    list(yaml.safe_load_all(p.read_text()))
    print(f'YAML PASS — {p}')
issuer = Path('k8s/clusterissuer.yaml.tpl').read_text().replace('{{LETSENCRYPT_EMAIL}}', 'webmaster@example.org')
list(yaml.safe_load_all(issuer))
print('YAML PASS — rendered ClusterIssuer')
PY
rm -f /tmp/ak-site-k8s.yaml

echo "CHATGPT/LOCAL STATIC PIPELINE PASS"
