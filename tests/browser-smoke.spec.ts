import { test, expect } from '@playwright/test';

const routes = ['/', '/perspektywa', '/oaf', '/wspolpraca', '/about', '/contact', '/en/about'];
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

test('home five-second executive clarity layout remains intact', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const hero = page.locator('.executive-hero');
  const title = page.locator('#hero-title');
  const lead = page.locator('.executive-hero .hero-lead');
  const value = page.locator('.executive-value-line');
  const system = page.locator('.executive-hero .decision-system');
  const primary = page.locator('.hero-actions .button-primary');
  const firstTrigger = page.locator('.executive-trigger-grid article').first();

  await expect(hero).toBeVisible();
  await expect(title).toBeVisible();
  await expect(title).toContainText('Strategia');
  await expect(lead).toBeVisible();
  await expect(value).toBeVisible();
  await expect(system).toBeVisible();
  await expect(primary).toBeVisible();
  await expect(primary).toHaveAttribute('href', '/wspolpraca');
  await expect(firstTrigger).toBeAttached();
  await expect(page.locator('.outcome-mini')).toHaveCount(5);

  const viewport = page.viewportSize();
  const heroBox = await hero.boundingBox();
  const titleBox = await title.boundingBox();
  const leadBox = await lead.boundingBox();
  const primaryBox = await primary.boundingBox();
  const systemBox = await system.boundingBox();

  expect(viewport).not.toBeNull();
  expect(heroBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  expect(leadBox).not.toBeNull();
  expect(primaryBox).not.toBeNull();
  expect(systemBox).not.toBeNull();

  if (viewport && heroBox && titleBox && leadBox && primaryBox && systemBox) {
    for (const box of [titleBox, leadBox, primaryBox, systemBox]) {
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    }
    expect(leadBox.y).toBeGreaterThan(titleBox.y);
    expect(primaryBox.width).toBeGreaterThanOrEqual(44);
    expect(primaryBox.height).toBeGreaterThanOrEqual(44);
    expect(primaryBox.y).toBeLessThanOrEqual(heroBox.y + heroBox.height + 1);
    expect(systemBox.height).toBeGreaterThan(120);
  }

  await page.screenshot({
    path: `artifacts/visual/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test('Perspective presents independent benchmark signals without a false shared scale', async ({ page }) => {
  await page.goto('/perspektywa', { waitUntil: 'networkidle' });
  await expect(page.locator('.benchmark-signal-field')).toBeVisible();
  await expect(page.locator('.benchmark-signal')).toHaveCount(3);
  await expect(page.locator('.benchmark-signal-value')).toHaveText(['26%', '53%', '42%']);
  await expect(page.locator('.benchmark-context')).toHaveCount(3);
  await expect(page.locator('.benchmark-signal-ruler')).toHaveCount(0);
  await expect(page.locator('.benchmark-signal-divider')).toHaveCount(3);
});

test('OAF uses one coherent geometry and preserves the evidence feedback loop', async ({ page }) => {
  await page.goto('/oaf', { waitUntil: 'networkidle' });
  await expect(page.locator('.oaf-system')).toBeVisible();
  await expect(page.locator('.oaf-system-node')).toHaveCount(4);
  await expect(page.locator('.oaf-system-center')).toBeVisible();
  await expect(page.locator('.oaf-system-feedback')).toBeVisible();
});

test('advisory page makes decision change, trade-offs and proof tangible', async ({ page }) => {
  await page.goto('/wspolpraca', { waitUntil: 'networkidle' });
  await expect(page.locator('.decision-architecture-delta')).toBeVisible();
  await expect(page.locator('.engagement-grid article')).toHaveCount(3);
  await expect(page.locator('.portfolio-tradeoff-matrix')).toBeVisible();
  await expect(page.locator('.portfolio-matrix-grid article')).toHaveCount(4);
  await expect(page.locator('.advisory-domain-grid article')).toHaveCount(4);
  await expect(page.locator('.case-proof-item')).toHaveCount(3);
  await expect(page.locator('.case-proof-item .proof-exhibit-canvas')).toHaveCount(3);
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
  await expect(page.locator('.mobile-nav nav a')).toHaveCount(6);
});
