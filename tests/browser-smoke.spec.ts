import { test, expect } from '@playwright/test';

const routes = ['/', '/perspektywa', '/oaf', '/wspolpraca', '/about', '/contact', '/privacy', '/en', '/en/perspective', '/en/oaf', '/en/advisory', '/en/about', '/en/contact', '/en/privacy'];
const visualRoutes = [
  ['home', '/'],
  ['perspective', '/perspektywa'],
  ['oaf', '/oaf'],
  ['advisory', '/wspolpraca'],
  ['about', '/about'],
  ['contact', '/contact'],
] as const;

for (const path of routes) {
  test(`${path} renders core experience without browser-specific breakage`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');

    const geometry = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
  });
}

test('home exposes a direct executive conversation and three choices', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero-title')).toContainText('Strategię');
  await expect(page.locator('.hero-actions .button-primary')).toHaveAttribute('href', '/contact');
  await expect(page.locator('.signature-choice')).toHaveCount(3);
  await expect(page.locator('.human-section img')).toBeVisible();
  await expect(page.locator('#primary-navigation a[href="/oaf"]')).toHaveCount(0);
});
test('Perspective begins with essays and offers relevant next paths', async ({ page }) => {
  await page.goto('/perspektywa');
  await page.locator('.featured-essay .text-link').click();
  await expect(page.locator('.note-body')).toBeVisible();
  await expect(page.locator('.note-footer a[href="/wspolpraca"]')).toBeVisible();
  await expect(page.locator('.note-footer a[href="/contact"]')).toBeVisible();
});
test('OAF preserves four questions and discloses method boundaries', async ({ page }) => {
  await page.goto('/oaf');
  await expect(page.locator('.question-cycle li')).toHaveCount(4);
  await page.getByText('Granice modelu', { exact: true }).click();
  await expect(page.locator('.method-foundations details').first()).toHaveAttribute('open','');
});
test('advisory explains decision, process, participation and outputs', async ({ page }) => {
  await page.goto('/wspolpraca');
  await expect(page.locator('.engagement')).toHaveCount(3);
  for (const engagement of await page.locator('.engagement').all()) await expect(engagement.locator('dt')).toHaveCount(5);
  await expect(page.locator('.decision-brief')).toBeVisible();
});
test('contact succeeds through mocked delivery and keeps payload out of URL', async ({ page }) => {
  await page.route('**/api/contact', async route => {
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON().email).toBe('test@example.com');
    await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ok:true}) });
  });
  await page.goto('/en/contact');
  await page.getByLabel('Name', { exact:true }).fill('Test User');
  await page.getByLabel('E-mail', { exact:true }).fill('test@example.com');
  await page.getByLabel('What are you dealing with?', { exact:true }).selectOption('design');
  await page.getByLabel('Message', { exact:true }).fill('A sample decision for a mocked browser integration test.');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button', {name:'Send message'}).click();
  await expect(page.locator('[data-form-status]')).toContainText('sent');
  expect(page.url()).not.toContain('test@example.com');
});

for (const [name, path] of visualRoutes) {
  test(`${name} critical surface can be visually audited`, async ({ page }, testInfo) => {
    test.skip(!['desktop-chromium', 'mobile-chromium'].includes(testInfo.project.name), 'visual audit capture is limited to canonical desktop/mobile Chromium');
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({
      path: `artifacts/visual/${name}-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
}

test('mobile navigation can be opened and contains the primary routes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile navigation smoke is only relevant on the mobile project');
  await page.goto('/');
  const summary = page.locator('.mobile-nav summary');
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(page.locator('.mobile-nav nav')).toBeVisible();
  await expect(page.locator('.mobile-nav nav a')).toHaveCount(5);
});

// Exercise the buyer flow, including independent entries and keyboard-accessible details.
test('advisory gives a short scan and reveals the working mechanics by keyboard', async ({ page }) => {
  await page.goto('/wspolpraca');
  const engagement = page.locator('.engagement').first();
  await expect(engagement.getByText('Co rozstrzygamy', {exact:true})).toBeVisible();
  await expect(engagement.getByText('Co staje się możliwe', {exact:true})).toBeVisible();
  await expect(engagement.getByText('Co wnosi zespół', {exact:true})).toBeHidden();
  await engagement.locator('summary').press('Enter');
  await expect(engagement.getByText('Co wnosi zespół', {exact:true})).toBeVisible();
  await page.locator('#proof-technology summary').click();
  await expect(page.locator('#proof-technology').getByText('Mój wkład',{exact:true})).toBeVisible();
});

test('measurement observes intent and form outcomes without contact content or URL parameters', async ({ page }) => {
  const events: Record<string, string>[] = [];
  await page.route('**/api/events', async route => {
    const event = route.request().postDataJSON();
    expect(Object.keys(event).sort()).toEqual(['event','locale','page','source']);
    expect(JSON.stringify(event)).not.toMatch(/private|example\.com|secret|utm_/);
    events.push(event);
    await route.fulfill({status:204});
  });
  await page.route('**/api/contact', async route => route.fulfill({status:503, contentType:'application/json',body:JSON.stringify({error:'delivery_unavailable'})}));
  await page.goto('/?utm_source=private@example.com');
  await page.locator('.hero-actions .button-primary').click();
  await page.getByLabel('Imię i nazwisko',{exact:true}).fill('Private Person');
  await page.getByLabel('E-mail',{exact:true}).fill('private@example.com');
  await page.getByLabel('Z czym przychodzisz?',{exact:true}).selectOption('execution');
  await page.locator('textarea').fill('A secret message that must never be present in analytics.');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button',{name:'Wyślij wiadomość'}).click();
  await expect(page.locator('[data-form-status]')).toContainText('niedostępna');
  await expect(page.locator('textarea')).toHaveValue('A secret message that must never be present in analytics.');
  await expect.poll(() => events.filter(e=>e.event==='form_error').length).toBe(1);
  expect(events.filter(e=>e.event==='contact_intent' && e.page==='home')).toHaveLength(1);
  expect(events.filter(e=>e.event==='form_start')).toHaveLength(1);
  await page.route('**/api/contact', async route => route.fulfill({status:202, contentType:'application/json',body:JSON.stringify({ok:true})}));
  await page.getByRole('button',{name:'Wyślij wiadomość'}).click();
  await expect(page.locator('[data-form-status]')).toContainText('została wysłana');
  await expect.poll(() => events.filter(e=>e.event==='form_success').length).toBe(1);
});

for (const flag of ['doNotTrack','globalPrivacyControl']) {
  test(`measurement honours ${flag} without using browser storage`, async ({ page }) => {
    await page.addInitScript(key => Object.defineProperty(navigator,key,{get:()=> key==='doNotTrack'?'1':true}), flag);
    const events: string[] = [];
    await page.route('**/api/events', async route => { events.push(route.request().url()); await route.fulfill({status:204}); });
    await page.goto('/');
    await page.locator('.hero-actions .button-primary').click();
    await page.getByLabel('Imię i nazwisko',{exact:true}).fill('Test');
    expect(events).toHaveLength(0);
    expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}))).toEqual({local:0,session:0,cookie:''});
  });
}
