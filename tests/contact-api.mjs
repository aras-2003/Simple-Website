import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:4321';
const child = spawn(process.execPath, ['server/contact.mjs'], {
  env: {
    ...process.env,
    CONTACT_API_PORT: '18787',
    CONTACT_DRY_RUN: '1',
    CONTACT_RATE_LIMIT: '50',
    CONTACT_REQUIRE_ORIGIN: '1',
    CONTACT_ALLOWED_ORIGINS: origin,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForHealth() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch('http://127.0.0.1:18787/healthz'); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('contact api did not start');
}

const headers = { 'Content-Type': 'application/json', Origin: origin };
try {
  await waitForHealth();

  const valid = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST', headers,
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', organization: 'Example', topic: 'architecture', message: 'This is a valid integration test message.', website: '', consent: true, locale: 'en', startedAt: Date.now() - 2500 }),
  });
  assert.equal(valid.status, 202);

  const invalid = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST', headers,
    body: JSON.stringify({ name: 'A', email: 'bad', topic: 'other', message: 'short', consent: false, startedAt: Date.now() - 2500 }),
  });
  assert.equal(invalid.status, 400);

  const bot = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST', headers,
    body: JSON.stringify({ name: 'Bot User', email: 'bot@example.com', topic: 'other', message: 'A long enough bot message for the test.', website: 'https://spam.example', consent: true, startedAt: Date.now() - 2500 }),
  });
  assert.equal(bot.status, 202);

  const noOrigin = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', topic: 'other', message: 'This message should be rejected by origin policy.', consent: true, startedAt: Date.now() - 2500 }),
  });
  assert.equal(noOrigin.status, 403);

  console.log('CONTACT API TEST PASS');
} finally {
  child.kill('SIGTERM');
}
