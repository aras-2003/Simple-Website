// Explicit schema: no URLs, free text, contact fields, IDs or error messages.
const EVENTS = new Set(['page_view', 'contact_intent', 'advisory_intent', 'language_switch', 'form_start', 'form_success', 'form_error']);
const PAGES = new Set(['home', 'work', 'writing', 'article', 'about', 'contact', 'oaf', 'privacy']);
const SOURCES = new Set(['direct', 'internal', 'linkedin', 'search', 'other']);
const KEYS = ['event', 'page', 'locale', 'source'];
const MAX_BYTES = 256;
const response = status => new Response(null, {status, headers: {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'}});

export async function handleMeasurement(request, env) {
  if (env.PRODUCT_MEASUREMENT !== '1' || request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return response(204);
  if (request.method !== 'POST') return response(405);
  const origin = request.headers.get('Origin');
  const allowed = String(env.CONTACT_ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
  if (!origin || origin !== new URL(request.url).origin || !allowed.includes(origin)) return response(403);
  if (new URL(request.url).search) return response(400);
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return response(415);
  if (Number(request.headers.get('Content-Length')) > MAX_BYTES) return response(413);
  // Separate limiter: measurement traffic must never consume the contact allowance.
  if (!env.MEASUREMENT_RATE_LIMITER?.limit) return response(503);
  const {success} = await env.MEASUREMENT_RATE_LIMITER.limit({key: `events:${request.headers.get('CF-Connecting-IP') || 'unknown'}`});
  if (!success) return response(429);
  const reader = request.body?.getReader();
  if (!reader) return response(400);
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); return response(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || Array.isArray(data) || typeof data !== 'object' || Object.keys(data).length !== KEYS.length || !KEYS.every(k => Object.hasOwn(data, k))) return response(400);
    const {event, page, locale, source} = data;
    if (!EVENTS.has(event) || !PAGES.has(page) || !['pl', 'en'].includes(locale) || !SOURCES.has(source)) return response(400);
    if (event.startsWith('form_') && page !== 'contact') return response(400);
    if (event === 'advisory_intent' && page !== 'home') return response(400);
    // Never log request/body objects. Platform security processing is documented separately.
    console.log({kind: 'product_event', version: 1, environment: env.DEPLOYMENT_ENV === 'production' ? 'production' : 'staging', event, page, locale, source});
    return response(204);
  } catch { return response(400); }
}
