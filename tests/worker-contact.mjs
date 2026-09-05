import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';

const origin = 'https://arkadiuszkamrowski.com';
const basePayload = {
  name: 'Test User',
  email: 'test@example.com',
  organization: 'Example',
  topic: 'architecture',
  message: 'This is a valid Worker integration test message.',
  website: '',
  consent: true,
  locale: 'en',
  startedAt: Date.now() - 2500,
  turnstileToken: 'test-turnstile-token',
};

const env = {
  DEPLOYMENT_ENV: 'production',
  CONTACT_ALLOWED_ORIGINS: origin,
  CONTACT_REQUIRE_ORIGIN: '1',
  TURNSTILE_REQUIRED: '1',
  TURNSTILE_EXPECTED_HOSTNAME: 'arkadiuszkamrowski.com',
  TURNSTILE_SECRET_KEY: 'test-secret-key-long-enough',
  RESEND_API_KEY: 're_test_key_long_enough_for_worker',
  CONTACT_TO_EMAIL: 'owner@example.net',
  CONTACT_FROM_EMAIL: 'Website <contact@arkadiuszkamrowski.com>',
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
  ASSETS: { fetch: async () => new Response('asset-fallback', { status: 404 }) },
};

function contactRequest(payload = basePayload, headers = {}) {
  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      'CF-Connecting-IP': '203.0.113.10',
      ...headers,
    },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}

const originalFetch = globalThis.fetch;
let resendCalls = 0;
let turnstileCalls = 0;

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.includes('/turnstile/v0/siteverify')) {
    turnstileCalls += 1;
    return Response.json({ success: true, hostname: 'arkadiuszkamrowski.com' });
  }
  if (url === 'https://api.resend.com/emails') {
    resendCalls += 1;
    const body = JSON.parse(init.body);
    assert.equal(body.reply_to, basePayload.email);
    assert.ok(init.headers['Idempotency-Key'].startsWith('contact-'));
    return Response.json({ id: 'email-test-id' });
  }
  throw new Error(`unexpected fetch: ${url}`);
};

try {
  const valid = await worker.fetch(contactRequest(), env);
  assert.equal(valid.status, 202);
  assert.deepEqual(await valid.json(), { ok: true });
  assert.equal(turnstileCalls, 1);
  assert.equal(resendCalls, 1);
  assert.equal(valid.headers.get('cache-control'), 'no-store');
  assert.equal(valid.headers.get('x-content-type-options'), 'nosniff');

  const noOrigin = await worker.fetch(new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(basePayload),
  }), env);
  assert.equal(noOrigin.status, 403);

  const badOrigin = await worker.fetch(contactRequest(basePayload, { Origin: 'https://evil.example' }), env);
  assert.equal(badOrigin.status, 403);

  const invalidJson = await worker.fetch(contactRequest('{broken-json'), env);
  assert.equal(invalidJson.status, 400);

  const tooFast = await worker.fetch(contactRequest({ ...basePayload, startedAt: Date.now() - 100 }), env);
  assert.equal(tooFast.status, 400);

  const missingTurnstile = await worker.fetch(contactRequest({ ...basePayload, turnstileToken: '' }), env);
  assert.equal(missingTurnstile.status, 403);

  const limited = await worker.fetch(contactRequest(), {
    ...env,
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) },
  });
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');

  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.includes('/turnstile/v0/siteverify')) return Response.json({ success: false });
    if (url === 'https://api.resend.com/emails') throw new Error('Resend must not be called after failed Turnstile');
    return originalFetch(input, init);
  };
  const failedTurnstile = await worker.fetch(contactRequest(), env);
  assert.equal(failedTurnstile.status, 403);

  const trailing = await worker.fetch(new Request(`${origin}/about/?from=test`), env);
  assert.equal(trailing.status, 308);
  assert.equal(trailing.headers.get('location'), `${origin}/about?from=test`);
  assert.equal(trailing.headers.get('x-robots-tag'), null, 'production redirects must not be marked noindex');

  const unknownApi = await worker.fetch(new Request(`${origin}/api/unknown`), env);
  assert.equal(unknownApi.status, 404);

  const assetFallback = await worker.fetch(new Request(`${origin}/missing`), env);
  assert.equal(assetFallback.status, 404);
  assert.equal(await assetFallback.text(), 'asset-fallback');
  assert.equal(assetFallback.headers.get('x-robots-tag'), null, 'production assets must remain indexable');

  const stagingOrigin = 'https://staging.arkadiuszkamrowski.com';
  const stagingEnv = {
    ...env,
    DEPLOYMENT_ENV: 'staging',
    CONTACT_ALLOWED_ORIGINS: stagingOrigin,
    TURNSTILE_EXPECTED_HOSTNAME: 'staging.arkadiuszkamrowski.com',
  };

  const stagingRobots = await worker.fetch(new Request(`${stagingOrigin}/robots.txt`), stagingEnv);
  assert.equal(stagingRobots.status, 200);
  assert.equal(await stagingRobots.text(), 'User-agent: *\nDisallow: /\n');
  assert.equal(stagingRobots.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
  assert.equal(stagingRobots.headers.get('cache-control'), 'no-store');

  const stagingAsset = await worker.fetch(new Request(`${stagingOrigin}/about`), stagingEnv);
  assert.equal(stagingAsset.status, 404);
  assert.equal(stagingAsset.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');

  const stagingTrailing = await worker.fetch(new Request(`${stagingOrigin}/about/?from=test`), stagingEnv);
  assert.equal(stagingTrailing.status, 308);
  assert.equal(stagingTrailing.headers.get('location'), `${stagingOrigin}/about?from=test`);
  assert.equal(stagingTrailing.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');

  console.log('WORKER CONTACT TEST PASS · validation, Turnstile, rate limit, Resend, canonical redirects and staging noindex');
} finally {
  globalThis.fetch = originalFetch;
}
