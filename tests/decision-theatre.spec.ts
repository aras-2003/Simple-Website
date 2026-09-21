import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Decision Theatre: perspectives, keyboard, pause and WCAG', async ({ page }) => {
  await page.goto('/lab/decision-theatre');
  const controls = page.locator('[data-mode-button]');
  await expect(controls).toHaveCount(3);
  await controls.nth(0).focus();
  // Moving directly to the system must not freeze the hero text below full
  // opacity while its entrance is still running outside the viewport.
  for (const selector of ['.dt-kicker.dt-enter', '#dt-title', '.dt-lead', '.dt-intro']) {
    await expect(page.locator(selector)).toHaveCSS('opacity', '1');
  }
  // Offscreen entrances must never strand the spatial model in a faded state.
  for (const solid of await page.locator('.dt-system .dt-solid').all()) {
    await expect(solid).toHaveCSS('opacity', '1');
  }
  for (let i = 0; i < 3; i++) {
    if (i) await page.keyboard.press('ArrowRight');
    await expect(controls.nth(i)).toBeFocused();
    await expect(controls.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-story="${i}"]`)).toBeVisible();
    await expect(page.locator('[data-system]')).toHaveAttribute('data-mode', String(i));
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.keyboard.press('Home');
  await expect(controls.nth(0)).toBeFocused();
  await page.keyboard.press('End');
  await expect(controls.nth(2)).toBeFocused();
  await page.getByRole('button', { name: 'Wstrzymaj ruch' }).click();
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-motion', 'paused');
  await page.getByRole('button', { name: 'Wznów ruch' }).click();
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-motion', 'running');
});

test('Decision Theatre: reduced motion and 320px reflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/lab/decision-theatre');
  await expect(page.locator('h1')).toHaveText('Strategię widać w wyborach.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.dt-hero-signal').evaluate(el => getComputedStyle(el).display)).toBe('none');
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.locator('[data-mode-button="2"]').click();
  await expect(page.locator('[data-story="2"]')).toBeVisible();
  await expect(page.locator('[data-motion-toggle]')).toBeHidden();
});

test('Decision Theatre: complete readable fallback without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/lab/decision-theatre');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-story="0"]')).toBeVisible();
  await expect(page.locator('.dt-nojs')).toBeVisible();
  await expect(page.locator('[data-mode-button="0"]')).toBeDisabled();
  await expect(page.locator('[data-motion-toggle]')).toBeHidden();
  await context.close();
});
