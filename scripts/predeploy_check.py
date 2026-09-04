#!/usr/bin/env python3
from __future__ import annotations
import argparse
from urllib.parse import urlparse

p=argparse.ArgumentParser()
p.add_argument('--site-base-url', required=True)
p.add_argument('--host', required=True)
p.add_argument('--namespace', default='personal-site')
a=p.parse_args()
url=urlparse(a.site_base_url)
errors=[]
if url.scheme != 'https': errors.append('site-base-url must use https')
if not url.hostname: errors.append('site-base-url must contain a hostname')
if url.hostname and url.hostname.lower() != a.host.lower(): errors.append(f'URL host ({url.hostname}) must equal ingress host ({a.host})')
if '/' in a.namespace or not a.namespace: errors.append('namespace is invalid')
if any(x in a.host for x in ['example.', 'localhost', 'REPLACE_']): errors.append('host still looks like a placeholder')
if errors:
    print('PREDEPLOY CHECK FAILED')
    for e in errors: print(' -', e)
    raise SystemExit(1)
print('PREDEPLOY CHECK PASS')
