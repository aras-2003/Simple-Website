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

for (const form of document.querySelectorAll('[data-contact-form]')) {
  if (!(form instanceof HTMLFormElement)) continue;
  form.dataset.startedAt = String(Date.now());
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!(submit instanceof HTMLButtonElement) || !(status instanceof HTMLElement)) return;

    const original = submit.innerHTML;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = form.dataset.sending || 'Sending…';
    status.textContent = '';
    status.removeAttribute('data-state');

    const data = new FormData(form);
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
    };

    try {
      const response = await fetch(form.dataset.endpoint || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const code = typeof body?.error === 'string' ? body.error : 'request_failed';
        throw new Error(code);
      }
      form.reset();
      form.dataset.startedAt = String(Date.now());
      status.dataset.state = 'success';
      status.textContent = form.dataset.success || 'Sent.';
    } catch (error) {
      const code = error instanceof Error ? error.message : 'request_failed';
      status.dataset.state = 'error';
      if (code === 'rate_limited') {
        status.textContent = form.dataset.rateLimit || form.dataset.error || 'Could not send.';
      } else if (code === 'delivery_unavailable') {
        status.textContent = form.dataset.delivery || form.dataset.error || 'Could not send.';
      } else if (validationErrors.has(code)) {
        status.textContent = form.dataset.validation || form.dataset.error || 'Could not send.';
      } else {
        status.textContent = form.dataset.error || 'Could not send.';
      }
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.innerHTML = original;
    }
  });
}
