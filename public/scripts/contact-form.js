const validationErrors = new Set([
  'consent_required',
  'invalid_name',
  'invalid_email',
  'invalid_organization',
  'invalid_topic',
  'invalid_message',
  'invalid_timing',
  'invalid_json',
  'json_required',
  'payload_too_large',
]);

let turnstileLoader;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoader) return turnstileLoader;
  turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile_unavailable'));
    script.onerror = () => reject(new Error('turnstile_unavailable'));
    document.head.append(script);
  });
  return turnstileLoader;
}

for (const form of document.querySelectorAll('[data-contact-form]')) {
  if (!(form instanceof HTMLFormElement)) continue;
  form.dataset.startedAt = String(Date.now());
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('button[type="submit"]');
  const turnstileContainer = form.querySelector('[data-turnstile-widget]');
  let turnstileWidgetId = null;

  if (turnstileContainer instanceof HTMLElement) {
    loadTurnstile()
      .then((turnstile) => {
        turnstileWidgetId = turnstile.render(turnstileContainer, {
          sitekey: turnstileContainer.dataset.sitekey || '',
          language: turnstileContainer.dataset.language || 'auto',
          size: 'flexible',
          theme: 'auto',
          'response-field': true,
          'response-field-name': 'cf-turnstile-response',
        });
      })
      .catch(() => {
        if (status instanceof HTMLElement) {
          status.dataset.state = 'error';
          status.textContent = form.dataset.turnstile || form.dataset.error || 'Security check unavailable.';
        }
      });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      form.dispatchEvent(new Event('form_error'));
      return;
    }
    if (!(submit instanceof HTMLButtonElement) || !(status instanceof HTMLElement)) return;

    const data = new FormData(form);
    const turnstileToken = String(data.get('cf-turnstile-response') || '');
    if (turnstileContainer && !turnstileToken) {
      status.dataset.state = 'error';
      status.textContent = form.dataset.turnstile || form.dataset.error || 'Security check required.';
      form.dispatchEvent(new Event('form_error'));
      return;
    }

    const original = submit.innerHTML;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = form.dataset.sending || 'Sending…';
    status.textContent = '';
    status.removeAttribute('data-state');

    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      organization: String(data.get('organization') || ''),
      topic: String(data.get('topic') || ''),
      message: String(data.get('message') || ''),
      website: String(data.get('website') || ''),
      consent: data.get('consent') === 'on',
      locale: document.documentElement.lang === 'en' ? 'en' : 'pl',
      startedAt: Number(form.dataset.startedAt || Date.now()),
      turnstileToken,
    };

    try {
      const response = await fetch(form.dataset.endpoint || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body?.ok !== true) {
        const code = typeof body?.error === 'string' ? body.error : 'request_failed';
        throw new Error(code);
      }
      form.dispatchEvent(new Event('form_success'));
      form.reset();
      form.dataset.startedAt = String(Date.now());
      status.dataset.state = 'success';
      status.textContent = form.dataset.success || 'Sent.';
    } catch (error) {
      form.dispatchEvent(new Event('form_error'));
      const code = error instanceof Error ? error.message : 'request_failed';
      status.dataset.state = 'error';
      if (code === 'rate_limited') {
        status.textContent = form.dataset.rateLimit || form.dataset.error || 'Could not send.';
      } else if (code === 'delivery_unavailable') {
        status.textContent = form.dataset.delivery || form.dataset.error || 'Could not send.';
      } else if (code === 'turnstile_required' || code === 'turnstile_failed' || code === 'turnstile_unavailable') {
        status.textContent = form.dataset.turnstile || form.dataset.error || 'Security check failed.';
      } else if (validationErrors.has(code)) {
        status.textContent = form.dataset.validation || form.dataset.error || 'Could not send.';
      } else {
        status.textContent = form.dataset.error || 'Could not send.';
      }
    } finally {
      if (turnstileWidgetId !== null && window.turnstile) window.turnstile.reset(turnstileWidgetId);
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.innerHTML = original;
    }
  });
}
