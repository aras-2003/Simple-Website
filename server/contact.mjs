import http from 'node:http';
import { createHash } from 'node:crypto';

const port = Number(process.env.CONTACT_API_PORT || 8787);
const dryRun = process.env.CONTACT_DRY_RUN === '1';
const requireOrigin = process.env.CONTACT_REQUIRE_ORIGIN === '1';
const resendKey = process.env.RESEND_API_KEY || '';
const resendApiUrl = process.env.RESEND_API_URL || 'https://api.resend.com/emails';
const toEmail = process.env.CONTACT_TO_EMAIL || '';
const fromEmail = process.env.CONTACT_FROM_EMAIL || '';
const turnstileRequired = process.env.TURNSTILE_REQUIRED === '1';
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '';
const turnstileExpectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME || '';
const turnstileVerifyUrl = process.env.TURNSTILE_VERIFY_URL || 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const configured = dryRun || Boolean(
  resendKey && toEmail && fromEmail && (!turnstileRequired || turnstileSecret),
);
const maxBody = 32 * 1024;
const windowMs = 10 * 60 * 1000;
const maxRequests = Math.max(1, Number(process.env.CONTACT_RATE_LIMIT || 5));
const maxBuckets = Math.max(100, Number(process.env.CONTACT_RATE_BUCKETS || 5000));
const buckets = new Map();
let rateChecks = 0;

const topicLabels = {
  architecture: 'Enterprise Architecture',
  strategy: 'Strategy & Transformation',
  portfolio: 'PMO & Portfolio',
  ai: 'AI & Technology',
  speaking: 'Speaking / Panel',
  other: 'Other',
};

function configuredOrigins() {
  return (process.env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return true;
  return configuredOrigins().includes(origin);
}

function json(res, status, body, origin = '', extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    ...extraHeaders,
  };
  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function clientIp(req) {
  // Only trust the address injected by the reverse proxy. Never trust a
  // client-controlled X-Forwarded-For chain as a rate-limit identity.
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  return realIp || req.socket.remoteAddress || 'unknown';
}

function pruneBuckets(now) {
  for (const [ip, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(ip);
  }
  while (buckets.size >= maxBuckets) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

function rateLimited(ip) {
  const now = Date.now();
  rateChecks += 1;
  if (rateChecks % 100 === 0 || buckets.size >= maxBuckets) pruneBuckets(now);

  const current = buckets.get(ip);
  if (!current || current.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > maxRequests;
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

function idempotencyKey(data) {
  const digest = createHash('sha256')
    .update([data.email.toLowerCase(), data.topic, data.message, String(data.startedAt)].join('\n'))
    .digest('hex');
  return `contact-${digest}`;
}

async function verifyTurnstile(token, ip) {
  if (!turnstileRequired) return true;
  if (!turnstileSecret) throw new Error('turnstile_not_configured');
  if (!token || token.length > 2048) return false;

  const response = await fetch(turnstileVerifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: turnstileSecret,
      response: token,
      ...(ip && ip !== 'unknown' ? { remoteip: ip } : {}),
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error('turnstile_unavailable');
  const result = await response.json();
  if (!result?.success) return false;
  if (turnstileExpectedHostname && result.hostname !== turnstileExpectedHostname) return false;
  return true;
}

async function sendEmail(data) {
  if (dryRun) return { id: 'dry-run' };
  if (!resendKey || !toEmail || !fromEmail) throw new Error('contact_not_configured');

  const subject = `[arkadiuszkamrowski.com] ${topicLabels[data.topic] || 'Contact'} — ${data.name}`;
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Organization: ${data.organization || '—'}`,
    `Topic: ${topicLabels[data.topic] || data.topic}`,
    '',
    data.message,
  ].join('\n');
  const html = `<h2>New website message</h2><p><strong>Name:</strong> ${escapeHtml(data.name)}</p><p><strong>Email:</strong> ${escapeHtml(data.email)}</p><p><strong>Organization:</strong> ${escapeHtml(data.organization || '—')}</p><p><strong>Topic:</strong> ${escapeHtml(topicLabels[data.topic] || data.topic)}</p><hr><p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>`;

  const response = await fetch(resendApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey(data),
    },
    body: JSON.stringify({ from: fromEmail, to: [toEmail], reply_to: data.email, subject, text, html }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('contact_delivery_failed', response.status, detail.slice(0, 300));
    throw new Error('delivery_failed');
  }
  return response.json();
}

const server = http.createServer(async (req, res) => {
  const origin = String(req.headers.origin || '');

  if (req.method === 'OPTIONS' && req.url === '/api/contact') {
    if (!isAllowedOrigin(origin)) return json(res, 403, { error: 'origin_not_allowed' });
    res.writeHead(204, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '600',
      Vary: 'Origin',
    });
    return res.end();
  }

  if (req.url === '/healthz') return json(res, configured ? 200 : 503, { ok: configured, dryRun });
  if (req.url !== '/api/contact' || req.method !== 'POST') return json(res, 404, { error: 'not_found' }, origin);
  if (requireOrigin && !origin) return json(res, 403, { error: 'origin_required' });
  if (!isAllowedOrigin(origin)) return json(res, 403, { error: 'origin_not_allowed' });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return json(res, 415, { error: 'json_required' }, origin);

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return json(res, 429, { error: 'rate_limited' }, origin, { 'Retry-After': String(Math.ceil(windowMs / 1000)) });
  }

  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBody) return json(res, 413, { error: 'payload_too_large' }, origin);
    chunks.push(chunk);
  }

  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return json(res, 400, { error: 'invalid_json' }, origin);
  }

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
  if (data.website) return json(res, 202, { ok: true }, origin);
  if (!data.consent) return json(res, 400, { error: 'consent_required' }, origin);
  if (data.name.length < 2 || data.name.length > 120) return json(res, 400, { error: 'invalid_name' }, origin);
  if (!validEmail(data.email)) return json(res, 400, { error: 'invalid_email' }, origin);
  if (data.organization.length > 140) return json(res, 400, { error: 'invalid_organization' }, origin);
  if (!(data.topic in topicLabels)) return json(res, 400, { error: 'invalid_topic' }, origin);
  if (data.message.length < 20 || data.message.length > 4000) return json(res, 400, { error: 'invalid_message' }, origin);
  // The timestamp is only a low-cost bot signal. An upper bound caused valid
  // submissions from long-lived tabs to be rejected and provided no security value.
  if (!Number.isFinite(elapsed) || elapsed < 1200) return json(res, 400, { error: 'invalid_timing' }, origin);
  if (turnstileRequired && !data.turnstileToken) return json(res, 403, { error: 'turnstile_required' }, origin);

  try {
    const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstileOk) return json(res, 403, { error: 'turnstile_failed' }, origin);

    const result = await sendEmail(data);
    console.log(JSON.stringify({
      event: 'contact_sent',
      topic: data.topic,
      dryRun,
      id: result?.id || null,
      at: new Date().toISOString(),
    }));
    return json(res, 202, { ok: true }, origin);
  } catch (error) {
    const code = error?.message || 'unknown';
    console.error('contact_error', code);
    if (code === 'turnstile_not_configured' || code === 'turnstile_unavailable') {
      return json(res, 503, { error: 'turnstile_unavailable' }, origin);
    }
    return json(
      res,
      code === 'contact_not_configured' ? 503 : 502,
      { error: 'delivery_unavailable' },
      origin,
    );
  }
});

server.requestTimeout = 10_000;
server.headersTimeout = 5_000;
server.keepAliveTimeout = 5_000;

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(port, '0.0.0.0', () => {
  console.log(`contact-api listening on :${port}${dryRun ? ' (dry-run)' : ''}`);
  if (!configured) console.error('contact-api is not ready: production delivery/Turnstile configuration is incomplete');
});
