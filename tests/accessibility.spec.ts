import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noteSlugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'ai-governance-without-theatre', 'transformation-operating-model'];
const routes = [
  '/', '/o-mnie', '/oaf', '/praktyka', '/perspektywa', '/kontakt', '/prywatnosc',
  ...noteSlugs.map((slug) => `/perspektywa/${slug}`),
  '/en', '/en/about', '/en/oaf', '/en/practice', '/en/perspective', '/en/contact', '/en/privacy',
  ...noteSlugs.map((slug) => `/en/perspective/${slug}`),
];

for (const path of routes) {
  test(`${path} has no detectable WCAG 2.2 A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test(`${path} exposes keyboard-first navigation`, async ({ page }) => {
    await page.goto(path);
    await page.keyboard.press('Tab');
    const first = page.locator(':focus');
    await expect(first).toHaveAttribute('href', '#main');
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test(`${path} does not overflow horizontally at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client + 1);
  });
}
