// Only fixed event names and coarse page/source categories cross this boundary.
const page = document.body.dataset.page || 'home';
const locale = document.documentElement.lang === 'en' ? 'en' : 'pl';
const disabled = navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
let source = 'direct';
try {
  const ref = new URL(document.referrer);
  source = ref.origin === location.origin ? 'internal'
    : /(^|\.)linkedin\.com$/.test(ref.hostname) ? 'linkedin'
    : /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(ref.hostname) ? 'search' : 'other';
} catch { /* No usable referrer. Do not inspect URL parameters or browser storage. */ }
let sent = 0;
function emit(event: string) {
  if (disabled || sent++ >= 30) return;
  void fetch('/api/events', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({event, page, locale, source}),
    keepalive: true, referrerPolicy: 'no-referrer',
  }).catch(() => {}); // Measurement must never interrupt navigation or contact.
}
if (page === 'home' || page === 'work' || page === 'article' || page === 'contact') emit('page_view');
document.addEventListener('click', event => {
  const link = event.target instanceof Element ? event.target.closest('a') : null;
  if (!link) return;
  const target = new URL(link.href, location.href);
  if (link.classList.contains('language-link')) emit('language_switch');
  else if (target.origin === location.origin) {
    if (/^\/(en\/)?contact$/.test(target.pathname)) emit('contact_intent');
    else if (page === 'home' && ['/wspolpraca', '/en/advisory'].includes(target.pathname)) emit('advisory_intent');
  }
});
const form = document.querySelector('[data-contact-form]');
form?.addEventListener('input', () => emit('form_start'), {once: true});
for (const event of ['form_success', 'form_error']) form?.addEventListener(event, () => emit(event));
