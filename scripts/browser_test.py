#!/usr/bin/env python3
from __future__ import annotations
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
PORT = int(os.environ.get('PORT', '8091'))
OUT = Path(os.environ.get('OUT', ROOT / 'artifacts'))
OUT.mkdir(parents=True, exist_ok=True)

subprocess.run([sys.executable, str(ROOT / 'scripts' / 'build.py')], cwd=ROOT, env={**os.environ, 'SITE_BASE_URL': f'http://127.0.0.1:{PORT}'}, check=True)
server = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1'], cwd=ROOT/'dist', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(30):
        try:
            with urlopen(f'http://127.0.0.1:{PORT}/', timeout=1) as r:
                if r.status == 200: break
        except Exception:
            time.sleep(.1)
    else:
        raise SystemExit('Local HTTP server did not start')

    candidates = [
        os.environ.get('CHROME'),
        shutil.which('chromium'), shutil.which('chromium-browser'), shutil.which('google-chrome'),
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ]
    chrome = next((c for c in candidates if c and Path(c).exists()), None)
    if not chrome:
        raise SystemExit('Chrome/Chromium not found. Static tests: make test')

    base = [chrome, '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars']
    for name, size in [('desktop','1440,1000'), ('mobile','390,844')]:
        cmd = base + [f'--window-size={size}', f'--screenshot={OUT / (name + ".png")}', f'http://127.0.0.1:{PORT}/']
        try:
            subprocess.run(cmd, check=True, timeout=30, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except subprocess.TimeoutExpired:
            raise SystemExit(f'Browser smoke timed out for {name}. This environment may not support headless Chromium; static tests remain valid.')

    html = urlopen(f'http://127.0.0.1:{PORT}/', timeout=3).read().decode('utf-8')
    if 'Arkadiusz Kamrowski' not in html:
        raise SystemExit('Browser smoke content check failed')
    print(f'BROWSER SMOKE PASS — screenshots in {OUT}')
finally:
    server.terminate()
    try: server.wait(timeout=3)
    except subprocess.TimeoutExpired: server.kill()
