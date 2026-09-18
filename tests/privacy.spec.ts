import { expect, test } from '@playwright/test';

for (const [locale, path, label, disclosure] of [
  ['pl', '/privacy', 'Kontakt w sprawach danych', 'Podanie danych jest dobrowolne'],
  ['en', '/en/privacy', 'Data privacy enquiries', 'Providing this information is voluntary'],
] as const) {
  test(`${locale} privacy notice offers accessible email and explains required data`, async ({ page }, testInfo) => {
    await page.goto(path);
    const contact = page.locator('.privacy-contact');
    await expect(contact).toHaveCount(1);
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute('href', 'mailto:contact@arkadiuszkamrowski.com');
    await expect(contact.locator('.privacy-contact-label')).toHaveText(label);
    await expect(contact).toContainText('contact@arkadiuszkamrowski.com');
    await expect(page.locator('.privacy-grid article').nth(1)).toContainText(disclosure);

    if (testInfo.project.name === 'desktop-chromium') {
      await page.screenshot({ path: `artifacts/visual/privacy-${locale}-desktop-chromium.png`, fullPage: true });
    }

    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await expect(contact).toBeVisible();

    if (testInfo.project.name === 'mobile-chromium') {
      await page.screenshot({ path: `artifacts/visual/privacy-${locale}-mobile-chromium.png`, fullPage: true });
    }
  });
}

// Exercise the rendered form and its real serializer against the actual Worker.
// External delivery is mocked; this does not test Cloudflare's internal metadata.
// @ts-ignore JavaScript Worker module is also tested directly by Node.
import worker from '../worker/index.mjs';

for (const locale of ['pl', 'en'] as const) {
  test(`${locale} form, payload, Worker and notice share the data contract`, async ({ page }) => {
    const path = locale === 'pl' ? '/contact' : '/en/contact';
    const marker = { name: 'Synthetic Privacy Name', email: 'privacy-marker@example.invalid', message: 'Synthetic private message marker for contract testing.' };
    let payload: Record<string, any> | undefined;
    await page.clock.install();
    await page.route('**/api/contact', async route => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.goto(path);
    const form = page.locator('[data-contact-form]');
    await expect(form).toHaveAttribute('data-started-at', /\d+/);
    const required = await form.locator('[required]').evaluateAll(elements => elements.map(el => el.getAttribute('name')).sort());
    expect(required).toEqual(['consent', 'email', 'message', 'name', 'topic']);
    await expect(form.locator('[name=organization]')).not.toHaveAttribute('required', '');
    await expect(form.locator('.consent-row')).toContainText(locale === 'pl' ? 'Zapoznałem/am się' : 'I have read');
    for (const [field, value] of Object.entries(marker)) await form.locator(`[name=${field}]`).fill(value);
    await form.locator('[name=topic]').selectOption('other');
    await form.locator('[name=consent]').check();
    // A deterministic response field tests serialization, not the remote widget.
    await form.evaluate(el => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = 'cf-turnstile-response'; input.value = 'synthetic-token-marker';
      el.append(input);
    });
    await page.clock.fastForward(1500);
    await form.locator('[type=submit]').click();
    await expect.poll(() => payload).toBeDefined();
    expect(Object.keys(payload!).sort()).toEqual(['consent', 'email', 'locale', 'message', 'name', 'organization', 'startedAt', 'topic', 'turnstileToken', 'website']);
    expect(payload).toMatchObject({ ...marker, organization: '', topic: 'other', consent: true, locale, website: '', turnstileToken: 'synthetic-token-marker' });
    expect(Number.isFinite(payload!.startedAt)).toBe(true);

    const origin = 'https://contract.example';
    const env = { CONTACT_ALLOWED_ORIGINS: origin, CONTACT_REQUIRE_ORIGIN: '1', TURNSTILE_REQUIRED: '0',
      RESEND_API_KEY: 'synthetic-key', CONTACT_FROM_EMAIL: 'site@example.invalid', CONTACT_TO_EMAIL: 'owner@example.invalid',
      CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) } };
    const realFetch = globalThis.fetch;
    let deliveries = 0;
    globalThis.fetch = async (_input, init) => {
      const email = JSON.parse(String(init?.body));
      expect(email.reply_to).toBe(marker.email);
      expect(email.text).toContain(marker.message);
      expect(email.text).not.toContain('synthetic-token-marker');
      deliveries++;
      return Response.json({ id: 'synthetic-id' });
    };
    const send = (data: Record<string, any>) => worker.fetch(new Request(`${origin}/api/contact`, {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    }), env);
    // Browser clock is intentionally ahead; normalize only the timestamp to the Node clock.
    const valid = { ...payload!, startedAt: Date.now() - 2000 };
    try {
      expect((await send(valid)).status).toBe(202);
      for (const field of required) {
        const missing = { ...valid }; delete missing[field];
        expect((await send(missing)).status, `Worker must require ${field}`).toBe(400);
      }
      const withoutOrganization = { ...valid }; delete withoutOrganization.organization;
      expect((await send(withoutOrganization)).status).toBe(202);
      expect(deliveries).toBe(2);
      expect((await send({ ...valid, organization: 'x'.repeat(141) })).status).toBe(400);
    } finally { globalThis.fetch = realFetch; }

    await page.goto(locale === 'pl' ? '/privacy' : '/en/privacy');
    const sections = page.locator('.privacy-grid article');
    await expect(sections).toHaveCount(8);
    await expect(sections.nth(1)).toContainText(locale === 'pl'
      ? 'Imię i nazwisko, adres e-mail, temat oraz treść wiadomości są wymagane'
      : 'Name, email address, topic and message are required');
    await expect(sections.nth(1)).toContainText(locale === 'pl' ? 'Organizacja jest opcjonalna' : 'Organization is optional');
    await expect(sections.nth(1)).toContainText('Turnstile');
    await expect(sections.nth(2)).toContainText(locale === 'pl' ? 'nie stanowi zgody na przetwarzanie danych' : 'not consent to data processing');
    await expect(page.getByRole('link', { name: 'Cloudflare DPA' })).toHaveAttribute('href', 'https://www.cloudflare.com/cloudflare-customer-dpa/');
  });
}
