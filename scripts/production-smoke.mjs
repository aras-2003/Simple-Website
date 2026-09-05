import assert from 'node:assert/strict';

const configured = process.env.SITE_BASE_URL || 'https://arkadiuszkamrowski.com';
const base = new URL(configured);

assert.equal(base.protocol, 'https:', 'SITE_BASE_URL must use https');
assert.equal(base.pathname, '/', 'SITE_BASE_URL must be a bare origin');
assert.equal(base.search, '', 'SITE_BASE_URL must not contain a query');
assert.equal(base.hash, '', 'SITE_BASE_URL must not contain a fragment');

const origin = base.origin;
const canonicalHost = base.hostname;
const timeoutMs = Number(process.env.PRODUCTION_SMOKE_TIMEOUT_MS || 10_000);
const routes = [
  '/',
  '/writing',
  '/oaf',
  '/work',
  '/about',
  '/contact',
  '/privacy',
  '/en',
  '/en/writing',
  '/en/oaf',
  '/en/work',
  '/en/about',
  '/en/contact',
  '/en/privacy',
];

function signal() {
  return AbortSignal.timeout(timeoutMs);
}

async function request(path, init = {}) {
  return fetch(new URL(path, origin), {
    redirect: 'manual',
    signal: signal(),
    ...init,
  });
}

function assertSecurityHeaders(response, label) {
  const csp = response.headers.get('content-security-policy') || '';
  assert.ok(csp.includes("default-src 'self'"), `${label}: missing CSP default-src`);
  assert.ok(csp.includes("script-src 'self'"), `${label}: missing same-origin script policy`);
  assert.ok(!csp.includes("'unsafe-inline'"), `${label}: unsafe-inline must not ship`);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${label}: missing nosniff`);
  assert.equal(response.headers.get('x-frame-options'), 'DENY', `${label}: missing frame denial`);
  assert.ok((response.headers.get('strict-transport-security') || '').includes('max-age='), `${label}: missing HSTS`);
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', `${label}: unexpected referrer policy`);
}

function expectedCanonical(path) {
  return `${origin}${path === '/' ? '/' : path}`;
}

for (const path of routes) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path}: expected 200, got ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  assert.ok(contentType.includes('text/html'), `${path}: expected HTML`);
  const html = await response.text();
  const canonical = expectedCanonical(path);
  assert.ok(
    html.includes(`<link rel="canonical" href="${canonical}"`),
    `${path}: rendered canonical must be ${canonical}`,
  );
  assert.ok(!html.includes('localhost'), `${path}: localhost leaked into production HTML`);
}

const home = await request('/');
assertSecurityHeaders(home, 'home');

const trailing = await request('/about/');
assert.equal(trailing.status, 308, '/about/: expected 308 canonical redirect');
assert.equal(trailing.headers.get('location'), '/about', '/about/: redirect target must remove trailing slash');

const missing = await request('/__production-smoke-missing-route__');
assert.equal(missing.status, 404, 'unknown routes must return a real 404');

const robots = await request('/robots.txt');
assert.equal(robots.status, 200, 'robots.txt must be public');
const robotsBody = await robots.text();
assert.ok(robotsBody.includes('User-agent: *'), 'robots.txt must define a crawler policy');
assert.ok(robotsBody.includes(`Sitemap: ${origin}/sitemap-index.xml`), 'robots.txt must point at the canonical sitemap');

const sitemap = await request('/sitemap-index.xml');
assert.equal(sitemap.status, 200, 'sitemap-index.xml must be public');
const sitemapBody = await sitemap.text();
assert.ok(sitemapBody.includes(origin), 'sitemap must use the production origin');
assert.ok(!sitemapBody.includes('localhost'), 'sitemap must not contain localhost URLs');

const wwwOrigin = `${base.protocol}//www.${canonicalHost}`;
const wwwResponse = await fetch(`${wwwOrigin}/oaf?smoke=1`, {
  redirect: 'manual',
  signal: signal(),
});
assert.ok([301, 308].includes(wwwResponse.status), `www host must redirect permanently, got ${wwwResponse.status}`);
assert.equal(
  wwwResponse.headers.get('location'),
  `${origin}/oaf?smoke=1`,
  'www redirect must preserve path and query and land on the apex canonical origin',
);

const blockedOrigin = await request('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: 'https://production-smoke.invalid',
  },
  body: '{}',
});
assert.equal(blockedOrigin.status, 403, 'contact API must reject a disallowed Origin before delivery');
assertSecurityHeaders(blockedOrigin, 'contact API blocked-origin response');

const preflight = await request('/api/contact', {
  method: 'OPTIONS',
  headers: {
    Origin: origin,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type',
  },
});
assert.equal(preflight.status, 204, 'contact API same-origin preflight must succeed');
assert.equal(preflight.headers.get('access-control-allow-origin'), origin, 'contact CORS allow-origin must be exact');

console.log(`PRODUCTION SMOKE PASS · ${origin} · routes, canonicalization, robots/sitemap, headers and contact-origin policy`);
