import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:4321';
const api = 'http://127.0.0.1:18787';
const child = spawn(process.execPath, ['server/contact.mjs'], {
  env: {
    ...process.env,
    CONTACT_API_PORT: '18787',
    CONTACT_DRY_RUN: '1',
    CONTACT_RATE_LIMIT: '2',
    CONTACT_RATE_BUCKETS: '100',
    CONTACT_REQUIRE_ORIGIN: '1',
    CONTACT_ALLOWED_ORIGINS: origin,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForHealth() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`${api}/healthz`); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('contact api did not start');
}

const basePayload = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  organization: 'Example',
  topic: 'architecture',
  message: 'This is a valid integration test message.',
  website: '',
  consent: true,
  locale: 'en',
  startedAt: Date.now() - 2500,
  ...overrides,
});

const headers = (ip = '198.51.100.1', extra = {}) => ({
  'Content-Type': 'application/json',
  Origin: origin,
  'X-Real-IP': ip,
  ...extra,
});

try {
  await waitForHealth();

  const valid = await fetch(`${api}/api/contact`, {
    method: 'POST', headers: headers('198.51.100.10'), body: JSON.stringify(basePayload()),
  });
  assert.equal(valid.status, 202);

  const invalid = await fetch(`${api}/api/contact`, {
    method: 'POST', headers: headers('198.51.100.11'),
    body: JSON.stringify(basePayload({ name: 'A', email: 'bad', topic: 'other', message: 'short', consent: false })),
  });
  assert.equal(invalid.status, 400);

  const bot = await fetch(`${api}/api/contact`, {
    method: 'POST', headers: headers('198.51.100.12'),
    body: JSON.stringify(basePayload({ topic: 'other', website: 'https://spam.example', message: 'A long enough bot message for the test.' })),
  });
  assert.equal(bot.status, 202);

  const noOrigin = await fetch(`${api}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Real-IP': '198.51.100.13' },
    body: JSON.stringify(basePayload({ topic: 'other', message: 'This message should be rejected by origin policy.' })),
  });
  assert.equal(noOrigin.status, 403);

  const preflightNoOrigin = await fetch(`${api}/api/contact`, { method: 'OPTIONS' });
  assert.equal(preflightNoOrigin.status, 403);

  const tooLarge = await fetch(`${api}/api/contact`, {
    method: 'POST', headers: headers('198.51.100.14'),
    body: JSON.stringify(basePayload({ message: 'x'.repeat(40 * 1024) })),
  });
  assert.equal(tooLarge.status, 413);

  // X-Forwarded-For must not let a client escape a proxy-owned IP bucket.
  const rateIp = '198.51.100.20';
  for (let i = 0; i < 2; i += 1) {
    const accepted = await fetch(`${api}/api/contact`, {
      method: 'POST',
      headers: headers(rateIp, { 'X-Forwarded-For': `203.0.113.${10 + i}` }),
      body: JSON.stringify(basePayload({ email: `rate${i}@example.com` })),
    });
    assert.equal(accepted.status, 202);
  }
  const limited = await fetch(`${api}/api/contact`, {
    method: 'POST',
    headers: headers(rateIp, { 'X-Forwarded-For': '203.0.113.99' }),
    body: JSON.stringify(basePayload({ email: 'rate3@example.com' })),
  });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);

  console.log('CONTACT API TEST PASS');
} finally {
  child.kill('SIGTERM');
}
