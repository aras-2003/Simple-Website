(() => {
  const forms = document.querySelectorAll('[data-contact-form]');

  const errorMessage = (form, code) => {
    if (code === 'rate_limited') return form.dataset.rateError || form.dataset.error;
    if (code === 'delivery_unavailable') return form.dataset.deliveryError || form.dataset.error;
    if (code === 'invalid_timing') return form.dataset.timingError || form.dataset.error;
    if (typeof code === 'string' && (code.startsWith('invalid_') || code === 'consent_required' || code === 'json_required')) {
      return form.dataset.validationError || form.dataset.error;
    }
    return form.dataset.error || 'Could not send.';
  };

  for (const form of forms) {
    if (!(form instanceof HTMLFormElement)) continue;

    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');
    if (!(submit instanceof HTMLButtonElement) || !(status instanceof HTMLElement)) continue;

    const markStarted = () => {
      if (!form.dataset.startedAt) form.dataset.startedAt = String(Date.now());
    };
    form.addEventListener('focusin', markStarted, { once: true });
    form.addEventListener('pointerdown', markStarted, { once: true });
    form.addEventListener('keydown', markStarted, { once: true });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const original = submit.innerHTML;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = form.dataset.sending || 'Sending…';
      status.textContent = '';

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
        startedAt: Number(form.dataset.startedAt || 0),
      };

      const endpoint = form.dataset.endpoint || '/api/contact';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.error || 'request_failed');

        form.reset();
        delete form.dataset.startedAt;
        status.textContent = form.dataset.success || 'Sent.';
      } catch (error) {
        status.textContent = errorMessage(form, error instanceof Error ? error.message : 'request_failed');
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.innerHTML = original;
      }
    });
  }
})();
