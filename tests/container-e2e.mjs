import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const siteName = `site-runtime-${process.pid}`;
const contactName = `contact-runtime-${process.pid}`;
const baseUrl = 'http://127.0.0.1:18080';
const canonicalOrigin = 'https://arkadiuszkamrowski.com';

function docker(...args) {
  return execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function cleanup() {
  for (const name of [contactName, siteName]) {
    try { docker('rm', '-f', name); } catch {}
  }
}

async function waitFor(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok) return response;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`runtime did not become ready: ${url}`);
}

async function postContact(payload, headers = {}) {
  return fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: baseUrl,
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}

async function waitForContact() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await postContact({
        name: 'Runtime Probe',
        email: 'probe@example.com',
        organization: 'CI',
        topic: 'architecture',
        message: 'Contact sidecar readiness probe for runtime test.',
        website: '',
        consent: true,
        locale: 'en',
        startedAt: Date.now() - 2500,
      });
      if (response.status === 202) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('contact sidecar did not become ready through NGINX');
}

cleanup();
try {
  docker(
    'run', '-d', '--name', siteName,
    '-p', '127.0.0.1:18080:8080',
    '--read-only', '--tmpfs', '/tmp:size=16m',
    '--security-opt', 'no-new-privileges:true',
    '--cap-drop', 'ALL',
    'personal-site:ci',
  );

  docker(
    'run', '-d', '--name', contactName,
    '--network', `container:${siteName}`,
    '--read-only', '--security-opt', 'no-new-privileges:true', '--cap-drop', 'ALL',
    '-e', 'CONTACT_API_PORT=8787',
    '-e', 'CONTACT_DRY_RUN=1',
    '-e', 'CONTACT_RATE_LIMIT=20',
    '-e', 'CONTACT_RATE_BUCKETS=100',
    '-e', 'CONTACT_REQUIRE_ORIGIN=1',
    '-e', `CONTACT_ALLOWED_ORIGINS=${baseUrl}`,
    'personal-contact:ci',
  );

  await waitFor(`${baseUrl}/healthz`);
  await waitForContact();

  const home = await fetch(`${baseUrl}/`);
  assert.equal(home.status, 200);
  const homeHtml = await home.text();
  assert.match(homeHtml, new RegExp(`<link rel="canonical" href="${canonicalOrigin.replaceAll('.', '\\.')}\/?"`));
  assert.match(homeHtml, /<meta property="og:image" content="https:\/\/arkadiuszkamrowski\.com\/assets\/og-card\.png"/);

  const csp = home.headers.get('content-security-policy') || '';
  assert.ok(csp.includes("script-src 'self'"), 'CSP must allow same-origin bundled scripts');
  assert.ok(csp.includes("script-src-attr 'none'"), 'CSP must block inline event handlers');
  assert.ok(!csp.includes("'unsafe-inline'"), 'CSP must not contain unsafe-inline');
  assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(home.headers.get('x-frame-options'), 'DENY');
  assert.ok((home.headers.get('strict-transport-security') || '').includes('max-age='));

  for (const path of ['/about/', '/en/about/']) {
    const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
    assert.equal(response.status, 308, `${path} should canonicalize with 308`);
    assert.equal(response.headers.get('location'), path.slice(0, -1));
  }
  assert.equal((await fetch(`${baseUrl}/about`, { redirect: 'manual' })).status, 200);
  assert.equal((await fetch(`${baseUrl}/en/about`, { redirect: 'manual' })).status, 200);

  const namedAsset = await fetch(`${baseUrl}/assets/favicon.svg`);
  assert.equal(namedAsset.status, 200);
  const namedCache = namedAsset.headers.get('cache-control') || '';
  assert.ok(namedCache.includes('max-age=86400'));
  assert.ok(!namedCache.includes('immutable'));

  const bundledAsset = homeHtml.match(/(?:href|src)="(\/_astro\/[^"?]+\.(?:css|js))"/)?.[1];
  assert.ok(bundledAsset, 'expected at least one fingerprinted Astro asset');
  const bundleResponse = await fetch(`${baseUrl}${bundledAsset}`);
  assert.equal(bundleResponse.status, 200);
  const bundleCache = bundleResponse.headers.get('cache-control') || '';
  assert.ok(bundleCache.includes('max-age=31536000'));
  assert.ok(bundleCache.includes('immutable'));

  const contactPayload = {
    name: 'Runtime Test',
    email: 'runtime@example.com',
    organization: 'CI',
    topic: 'architecture',
    message: 'Runtime reverse proxy integration test message.',
    website: '',
    consent: true,
    locale: 'en',
    startedAt: Date.now() - 2500,
  };
  const contact = await postContact(contactPayload, { 'X-Forwarded-For': '198.51.100.77' });
  assert.equal(contact.status, 202);
  assert.deepEqual(await contact.json(), { ok: true });
  assert.equal(contact.headers.get('cache-control'), 'no-store');

  const badOrigin = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
    body: JSON.stringify(contactPayload),
  });
  assert.equal(badOrigin.status, 403);

  const hidden = await fetch(`${baseUrl}/.git/config`, { redirect: 'manual' });
  assert.ok([403, 404].includes(hidden.status));

  console.log('CONTAINER E2E PASS · NGINX canonicalization, security headers, cache policy and reverse-proxy contact flow');
} catch (error) {
  try {
    console.error('SITE LOGS\n', docker('logs', siteName));
    console.error('CONTACT LOGS\n', docker('logs', contactName));
  } catch {}
  throw error;
} finally {
  cleanup();
}
