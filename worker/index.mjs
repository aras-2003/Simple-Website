const MAX_BODY_BYTES = 32 * 1024;
const MAX_TURNSTILE_TOKEN = 2048;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_API_URL = 'https://api.resend.com/emails';

const topicLabels = {
  architecture: 'Enterprise Architecture',
  strategy: 'Strategy & Transformation',
  portfolio: 'PMO & Portfolio',
  ai: 'AI & Technology',
  speaking: 'Speaking / Panel',
  other: 'Other',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; script-src-attr 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; manifest-src 'self'",
};

const LEGACY_ROUTE_PREFIXES = [
  ['/en/writing', '/en/perspective'],
  ['/en/work', '/en/advisory'],
  ['/writing', '/perspektywa'],
  ['/work', '/wspolpraca'],
];

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[char]));
}

function allowedOrigins(env) {
  return String(env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  return allowedOrigins(env).includes(origin);
}

function deploymentEnvironment(env) {
  return clean(env.DEPLOYMENT_ENV) || 'preview';
}

function isNonProduction(env) {
  return deploymentEnvironment(env) !== 'production';
}

function nonProductionHeaders(env) {
  return isNonProduction(env)
    ? { 'X-Robots-Tag': 'noindex, nofollow, noarchive' }
    : {};
}

function applyDeploymentHeaders(response, env) {
  if (!isNonProduction(env)) return response;
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function legacyCanonicalPath(pathname) {
  for (const [legacy, canonical] of LEGACY_ROUTE_PREFIXES) {
    if (pathname === legacy || pathname.startsWith(`${legacy}/`)) {
      return `${canonical}${pathname.slice(legacy.length)}`;
    }
  }
  return null;
}

function clientIp(request) {
  return clean(request.headers.get('CF-Connecting-IP')) || 'unknown';
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function idempotencyKey(data) {
  const digest = await sha256Hex([
    data.email.toLowerCase(),
    data.topic,
    data.message,
    String(data.startedAt),
  ].join('\n'));
  return `contact-${digest}`;
}

async function verifyTurnstile(token, ip, env) {
  if (env.TURNSTILE_REQUIRED === '0') return true;
  const secret = clean(env.TURNSTILE_SECRET_KEY);
  if (!secret) throw new Error('turnstile_not_configured');
  if (!token || token.length > MAX_TURNSTILE_TOKEN) return false;

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
      ...(ip !== 'unknown' ? { remoteip: ip } : {}),
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error('turnstile_unavailable');
  const result = await response.json();
  if (!result?.success) return false;

  const expectedHostname = clean(env.TURNSTILE_EXPECTED_HOSTNAME);
  if (expectedHostname && result.hostname !== expectedHostname) return false;
  return true;
}

async function sendEmail(data, env) {
  const resendKey = clean(env.RESEND_API_KEY);
  const toEmail = clean(env.CONTACT_TO_EMAIL);
  const fromEmail = clean(env.CONTACT_FROM_EMAIL);
  if (!resendKey || !toEmail || !fromEmail) throw new Error('contact_not_configured');

  const label = topicLabels[data.topic] || 'Contact';
  const subject = `[arkadiuszkamrowski.com] ${label} — ${data.name}`;
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Organization: ${data.organization || '—'}`,
    `Topic: ${label}`,
    '',
    data.message,
  ].join('\n');
  const html = `<h2>New website message</h2><p><strong>Name:</strong> ${escapeHtml(data.name)}</p><p><strong>Email:</strong> ${escapeHtml(data.email)}</p><p><strong>Organization:</strong> ${escapeHtml(data.organization || '—')}</p><p><strong>Topic:</strong> ${escapeHtml(label)}</p><hr><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`;

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': await idempotencyKey(data),
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: data.email,
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    console.error('contact_delivery_failed', response.status);
    throw new Error('delivery_failed');
  }
  return response.json();
}

async function rateLimit(request, env) {
  if (!env.CONTACT_RATE_LIMITER?.limit) return true;
  const ip = clientIp(request);
  const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${ip}` });
  return success;
}

async function handleContact(request, env) {
  const origin = clean(request.headers.get('Origin'));
  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin, env)) return json(403, { error: 'origin_not_allowed' });
    return new Response(null, {
      status: 204,
      headers: {
        ...SECURITY_HEADERS,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
      },
    });
  }

  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, { Allow: 'POST, OPTIONS' });
  if (env.CONTACT_REQUIRE_ORIGIN !== '0' && !origin) return json(403, { error: 'origin_required' });
  if (origin && !isAllowedOrigin(origin, env)) return json(403, { error: 'origin_not_allowed' });
  if (!String(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) {
    return json(415, { error: 'json_required' });
  }

  const declaredLength = Number(request.headers.get('Content-Length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json(413, { error: 'payload_too_large' });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json(413, { error: 'payload_too_large' });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  if (body === null || typeof body !== 'object' || Array.isArray(body)) return json(400, { error: 'invalid_json' });

  const data = {
    name: clean(body.name),
    email: clean(body.email),
    organization: clean(body.organization),
    topic: clean(body.topic),
    message: clean(body.message),
    website: clean(body.website),
    consent: body.consent === true,
    locale: body.locale === 'en' ? 'en' : 'pl',
    startedAt: Number(body.startedAt || 0),
    turnstileToken: clean(body.turnstileToken),
  };

  const elapsed = Date.now() - data.startedAt;
  if (data.website) return json(202, { ok: true });
  if (!data.consent) return json(400, { error: 'consent_required' });
  if (data.name.length < 2 || data.name.length > 120) return json(400, { error: 'invalid_name' });
  if (!validEmail(data.email)) return json(400, { error: 'invalid_email' });
  if (data.organization.length > 140) return json(400, { error: 'invalid_organization' });
  if (!Object.hasOwn(topicLabels, data.topic)) return json(400, { error: 'invalid_topic' });
  if (data.message.length < 20 || data.message.length > 4000) return json(400, { error: 'invalid_message' });
  if (!Number.isFinite(elapsed) || elapsed < 1200) return json(400, { error: 'invalid_timing' });
  if (env.TURNSTILE_REQUIRED !== '0' && !data.turnstileToken) return json(403, { error: 'turnstile_required' });
  if (!(await rateLimit(request, env))) return json(429, { error: 'rate_limited' }, { 'Retry-After': '60' });

  try {
    if (!(await verifyTurnstile(data.turnstileToken, clientIp(request), env))) {
      return json(403, { error: 'turnstile_failed' });
    }

    const result = await sendEmail(data, env);
    console.log(JSON.stringify({
      event: 'contact_sent',
      topic: data.topic,
      id: result?.id || null,
      at: new Date().toISOString(),
    }));
    return json(202, { ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'unknown';
    console.error('contact_error', code);
    if (code === 'turnstile_not_configured' || code === 'turnstile_unavailable') {
      return json(503, { error: 'turnstile_unavailable' });
    }
    if (code === 'contact_not_configured') return json(503, { error: 'delivery_unavailable' });
    return json(502, { error: 'delivery_unavailable' });
  }
}

export { handleContact, SECURITY_HEADERS };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (url.pathname.startsWith('/api/')) return json(404, { error: 'not_found' });

    if (isNonProduction(env) && url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /\n', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          ...SECURITY_HEADERS,
          ...nonProductionHeaders(env),
        },
      });
    }

    const canonicalLegacyPath = legacyCanonicalPath(url.pathname);
    if (canonicalLegacyPath) {
      url.pathname = canonicalLegacyPath;
      return new Response(null, {
        status: 308,
        headers: { Location: url.toString(), ...SECURITY_HEADERS, ...nonProductionHeaders(env) },
      });
    }

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
      return new Response(null, {
        status: 308,
        headers: { Location: url.toString(), ...SECURITY_HEADERS, ...nonProductionHeaders(env) },
      });
    }

    const response = await env.ASSETS.fetch(request);
    return applyDeploymentHeaders(response, env);
  },
};
