import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const noteSlugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'ai-governance-without-theatre', 'transformation-operating-model'];
const sharedSlugs = ['', 'about', 'oaf', 'work', 'writing', 'contact', 'privacy'];
const routes = [
  ...sharedSlugs.map((slug) => slug ? `/${slug}` : '/'),
  ...noteSlugs.map((slug) => `/writing/${slug}`),
  ...sharedSlugs.map((slug) => slug ? `/en/${slug}` : '/en'),
  ...noteSlugs.map((slug) => `/en/writing/${slug}`),
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
    await expect(first).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test(`${path} reflows at the WCAG-equivalent 320px / 400% viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client + 1);
  });
}

test('home honors prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const motion = await page.locator('.hero-actions .button-primary').evaluate((element) => {
    const htmlStyle = getComputedStyle(document.documentElement);
    const elementStyle = getComputedStyle(element);
    return {
      scrollBehavior: htmlStyle.scrollBehavior,
      transitionDuration: elementStyle.transitionDuration,
      animationDuration: elementStyle.animationDuration,
    };
  });
  expect(motion.scrollBehavior).toBe('auto');
  expect(motion.transitionDuration).toMatch(/^(0s|0\.00001s|0\.01ms)(,\s*(0s|0\.00001s|0\.01ms))*$/);
  expect(motion.animationDuration).toMatch(/^(0s|0\.00001s|0\.01ms)(,\s*(0s|0\.00001s|0\.01ms))*$/);
});
