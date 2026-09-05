import { spawn } from 'node:child_process';
import http from 'node:http';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:4321';
const basePayload = {
  name: 'Test User',
  email: 'test@example.com',
  organization: 'Example',
  topic: 'architecture',
  message: 'This is a valid integration test message.',
  website: '',
  consent: true,
  locale: 'en',
  startedAt: Date.now() - 2500,
};

function startApi(port, extraEnv = {}) {
  return spawn(process.execPath, ['server/contact.mjs'], {
    env: {
      ...process.env,
      CONTACT_API_PORT: String(port),
      CONTACT_DRY_RUN: '1',
      CONTACT_RATE_LIMIT: '50',
      CONTACT_RATE_BUCKETS: '100',
      CONTACT_REQUIRE_ORIGIN: '1',
      CONTACT_ALLOWED_ORIGINS: origin,
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function waitForHealth(port, expected = 200) {
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/healthz`);
      if (response.status === expected) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`contact api on ${port} did not reach expected health ${expected}`);
}

async function post(port, payload, extraHeaders = {}) {
  return fetch(`http://127.0.0.1:${port}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, ...extraHeaders },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}

async function stop(child) {
  if (!child || child.killed) return;
  child.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 1500);
    child.once('exit', () => { clearTimeout(timer); resolve(); });
  });
}

const children = [];
let mockServer;
try {
  const functional = startApi(18787);
  children.push(functional);
  await waitForHealth(18787);

  const valid = await post(18787, basePayload);
  assert.equal(valid.status, 202);

  const invalid = await post(18787, {
    ...basePayload,
    name: 'A',
    email: 'bad',
    message: 'short',
    consent: false,
  });
  assert.equal(invalid.status, 400);

  const bot = await post(18787, { ...basePayload, website: 'https://spam.example' });
  assert.equal(bot.status, 202);

  const noOrigin = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(basePayload),
  });
  assert.equal(noOrigin.status, 403);

  const badOrigin = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
    body: JSON.stringify(basePayload),
  });
  assert.equal(badOrigin.status, 403);

  const wrongType = await fetch('http://127.0.0.1:18787/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain', Origin: origin },
    body: 'hello',
  });
  assert.equal(wrongType.status, 415);

  const tooFast = await post(18787, { ...basePayload, startedAt: Date.now() - 100 });
  assert.equal(tooFast.status, 400);

  const oldTab = await post(18787, { ...basePayload, startedAt: Date.now() - (48 * 60 * 60 * 1000) });
  assert.equal(oldTab.status, 202);

  const oversized = await post(18787, JSON.stringify({ ...basePayload, message: 'x'.repeat(40 * 1024) }));
  assert.equal(oversized.status, 413);

  const limiter = startApi(18789, { CONTACT_RATE_LIMIT: '2' });
  children.push(limiter);
  await waitForHealth(18789);

  const identityA = { 'X-Real-IP': '203.0.113.10', 'X-Forwarded-For': '198.51.100.1' };
  assert.equal((await post(18789, basePayload, identityA)).status, 202);
  assert.equal((await post(18789, { ...basePayload, email: 'two@example.com' }, { ...identityA, 'X-Forwarded-For': '198.51.100.2' })).status, 202);
  const limited = await post(18789, { ...basePayload, email: 'three@example.com' }, { ...identityA, 'X-Forwarded-For': '198.51.100.3' });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);

  const otherIdentity = await post(18789, { ...basePayload, email: 'other@example.com' }, { 'X-Real-IP': '203.0.113.11', 'X-Forwarded-For': '198.51.100.3' });
  assert.equal(otherIdentity.status, 202);

  mockServer = http.createServer((_req, res) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'mock_failure' }));
  });
  await new Promise((resolve) => mockServer.listen(18999, '127.0.0.1', resolve));

  const delivery = startApi(18788, {
    CONTACT_DRY_RUN: '0',
    RESEND_API_KEY: 'test-key',
    CONTACT_TO_EMAIL: 'owner@example.com',
    CONTACT_FROM_EMAIL: 'site@example.com',
    RESEND_API_URL: 'http://127.0.0.1:18999',
  });
  children.push(delivery);
  await waitForHealth(18788);
  const unavailable = await post(18788, basePayload);
  assert.equal(unavailable.status, 502);
  assert.deepEqual(await unavailable.json(), { error: 'delivery_unavailable' });

  console.log('CONTACT API TEST PASS · validation, origin, size, timing, rate-limit identity and delivery failure');
} finally {
  for (const child of children) await stop(child);
  if (mockServer) await new Promise((resolve) => mockServer.close(resolve));
}
