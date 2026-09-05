import { test, expect } from '@playwright/test';

const routes = ['/', '/writing', '/oaf', '/work', '/about', '/contact', '/en/about'];

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

test('mobile navigation can be opened and contains the primary routes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile navigation smoke is only relevant on the mobile project');
  await page.goto('/');
  const summary = page.locator('.mobile-nav summary');
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(page.locator('.mobile-nav nav')).toBeVisible();
  await expect(page.locator('.mobile-nav nav a')).toHaveCount(6);
});
