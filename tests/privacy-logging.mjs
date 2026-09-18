import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import worker from '../worker/index.mjs';

const origin = 'https://privacy.example';
const markers = ['PRIVATE_NAME_MARKER', 'private-email-marker@example.invalid', 'PRIVATE_ORG_MARKER', 'PRIVATE_MESSAGE_MARKER', 'PRIVATE_TOKEN_MARKER'];
const payload = { name: markers[0], email: markers[1], organization: markers[2], message: markers[3],
  turnstileToken: markers[4], topic: 'other', locale: 'en', consent: true, website: '', startedAt: Date.now() - 2500 };
const env = { CONTACT_ALLOWED_ORIGINS: origin, CONTACT_REQUIRE_ORIGIN: '1', TURNSTILE_REQUIRED: '1',
  TURNSTILE_SECRET_KEY: 'synthetic-secret', TURNSTILE_EXPECTED_HOSTNAME: 'privacy.example',
  RESEND_API_KEY: 'synthetic-key', CONTACT_FROM_EMAIL: 'site@example.invalid', CONTACT_TO_EMAIL: 'owner@example.invalid',
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) } };
const leakedText = markers.join(' ');
const noLeaks = (value, label) => { for (const marker of markers) assert.ok(!value.includes(marker), `${label}: leaked ${marker.split('@')[0]}`); };
const originalFetch = globalThis.fetch;
const originalLog = console.log;
const originalError = console.error;

// A deliberately hostile provider can echo request data even in an ID/error.
for (const provider of ['turnstile', 'resend']) {
  for (const outcome of ['success', 'provider-error', 'exception', 'timeout']) {
    const logs = [];
    console.log = (...args) => logs.push(args);
    console.error = (...args) => logs.push(args);
    globalThis.fetch = async (url, init) => {
      const target = String(url).includes('siteverify') ? 'turnstile' : 'resend';
      if (target === provider) {
        if (outcome === 'provider-error') return new Response(leakedText, { status: 503 });
        if (outcome === 'exception') throw new Error(leakedText);
        if (outcome === 'timeout') {
          assert.ok(init.signal instanceof AbortSignal, 'provider call must have a deadline');
          // Exercise the real 8-second AbortSignal, not a synthetic immediate rejection.
          await new Promise((_, reject) => {
            const keepAlive = setTimeout(() => reject(new Error('deadline did not fire')), 9500);
            init.signal.addEventListener('abort', () => { clearTimeout(keepAlive); reject(init.signal.reason); }, { once: true });
          });
        }
      }
      return Response.json(target === 'turnstile' ? { success: true, hostname: 'privacy.example' } : { id: leakedText });
    };
    try {
      const response = await worker.fetch(new Request(`${origin}/api/contact`, { method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }), env);
      assert.equal(response.status, outcome === 'success' ? 202 : provider === 'turnstile' && outcome === 'provider-error' ? 503 : 502);
      noLeaks(JSON.stringify(logs), `Worker ${provider}/${outcome} logs`);
      noLeaks(await response.text(), `Worker ${provider}/${outcome} response`);
      assert.ok(logs.length > 0, 'must actually inspect an application log');
    } finally { globalThis.fetch = originalFetch; console.log = originalLog; console.error = originalError; }
  }
}

// Test the actual local/container server in an isolated child process. The
// preload replaces providers only; server validation/logging remain real.
for (const provider of ['turnstile', 'resend']) {
  for (const outcome of ['success', 'provider-error', 'exception', 'timeout']) {
    const preload = `globalThis.fetch = async (url, init) => {
      const target = String(url).includes('siteverify') ? 'turnstile' : 'resend';
      if (target === ${JSON.stringify(provider)}) {
        if (${JSON.stringify(outcome)} === 'provider-error') return new Response(${JSON.stringify(leakedText)}, {status:503});
        if (${JSON.stringify(outcome)} === 'exception') throw new Error(${JSON.stringify(leakedText)});
        if (${JSON.stringify(outcome)} === 'timeout') await new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), {once:true}));
      }
      return Response.json(target === 'turnstile' ? {success:true,hostname:'privacy.example'} : {id:${JSON.stringify(leakedText)}});
    };`;
    const child = spawn(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`, 'server/contact.mjs'], {
      env: { ...process.env, ...env, CONTACT_RATE_LIMITER: '', CONTACT_API_PORT: '18796', CONTACT_DRY_RUN: '0', CONTACT_RATE_LIMIT: '50' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let logs = '';
    child.stdout.on('data', chunk => { logs += chunk; });
    child.stderr.on('data', chunk => { logs += chunk; });
    try {
      for (let attempt = 0; ; attempt++) {
        if (logs.includes('contact-api listening')) break;
        if (attempt === 100) throw new Error('local API failed to start');
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      const response = await fetch('http://127.0.0.1:18796/api/contact', { method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      assert.equal(response.status, outcome === 'success' ? 202 : provider === 'turnstile' && outcome === 'provider-error' ? 503 : 502);
      noLeaks(await response.text(), `local ${provider}/${outcome} response`);
    } finally {
      const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited;
    }
    noLeaks(logs, `local ${provider}/${outcome} logs`);
    assert.ok(logs.includes(outcome === 'success' ? 'contact_sent' : 'contact_error'));
  }
}
console.log('PRIVACY LOGGING PASS · Worker and local server, both providers, success/error/exception/real timeout, no synthetic data or token leakage');
