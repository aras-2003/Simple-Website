import { test, expect } from '@playwright/test';

const routes = ['/', '/writing', '/oaf', '/work', '/about', '/contact', '/en/about'];
const visualRoutes = [
  ['perspective', '/writing'],
  ['oaf', '/oaf'],
  ['practice', '/work'],
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

test('home five-second clarity layout remains intact', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const hero = page.locator('.landing-hero-light');
  const title = page.locator('#hero-title');
  const context = page.locator('.hero-context');
  const primary = page.locator('.hero-actions .button-primary');
  const problem = page.locator('#problem-title');

  await expect(hero).toBeVisible();
  await expect(title).toBeVisible();
  await expect(context).toBeVisible();
  await expect(context).toContainText('Arkadiusz Kamrowski');
  await expect(primary).toBeVisible();
  await expect(problem).toBeAttached();

  const viewport = page.viewportSize();
  const heroBox = await hero.boundingBox();
  const titleBox = await title.boundingBox();
  const contextBox = await context.boundingBox();
  const primaryBox = await primary.boundingBox();

  expect(viewport).not.toBeNull();
  expect(heroBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  expect(contextBox).not.toBeNull();
  expect(primaryBox).not.toBeNull();

  if (viewport && heroBox && titleBox && contextBox && primaryBox) {
    expect(titleBox.x).toBeGreaterThanOrEqual(-1);
    expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(contextBox.x).toBeGreaterThanOrEqual(-1);
    expect(contextBox.x + contextBox.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(contextBox.y).toBeGreaterThan(titleBox.y);
    expect(primaryBox.width).toBeGreaterThanOrEqual(44);
    expect(primaryBox.height).toBeGreaterThanOrEqual(44);
    expect(primaryBox.y).toBeLessThanOrEqual(heroBox.y + heroBox.height + 1);
  }

  await page.screenshot({
    path: `artifacts/visual/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
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
