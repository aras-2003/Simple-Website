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
  await page.getByLabel('Topic', { exact:true }).selectOption('strategy');
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
