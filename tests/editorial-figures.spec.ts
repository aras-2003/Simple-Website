import { test, expect } from '@playwright/test';

const slugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'transformation-operating-model', 'ai-governance-without-theatre', 'delivery-beyond-deployment'];
for (const locale of ['pl', 'en']) {
  for (const slug of slugs) {
    test(`editorial artwork ${locale}/${slug}`, async ({ page }, testInfo) => {
      await page.goto(`/${locale === 'pl' ? 'perspektywa' : 'en/perspective'}/${slug}`);
      const figure = page.locator(slug === 'delivery-beyond-deployment' ? '.editorial-figure--delivery' : '.editorial-figure');
      await figure.scrollIntoViewIfNeeded();
      await expect(figure).toBeVisible();
      await figure.locator('img').evaluate(async (img: HTMLImageElement) => {
        await img.decode();
        if (!img.naturalWidth) throw new Error('Empty artwork');
      });
      await expect(figure.locator('li')).toHaveCount(slug === 'delivery-beyond-deployment' ? 9 : slug.startsWith('architecture') || slug.startsWith('transformation') ? 4 : 3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await figure.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      await figure.screenshot({ style: '.skip-link:not(:focus) { visibility: hidden; }', path: `artifacts/visual/editorial-${locale}-${slug}-${testInfo.project.name}.png` });
      // Exercise the fallback separately: a valid AVIF must not hide a broken WebP.
      await figure.locator('img').evaluate((img: HTMLImageElement) => {
        img.parentElement?.querySelector('source')?.remove();
        img.removeAttribute('srcset');
      });
      // Source selection is asynchronous in Firefox. decode() can otherwise
      // resolve for the previously selected AVIF before the WebP request starts.
      await expect.poll(() => figure.locator('img').evaluate((img: HTMLImageElement) =>
        img.currentSrc.endsWith('.webp') && img.complete
      )).toBe(true);
      await figure.locator('img').evaluate(async (img: HTMLImageElement) => {
        await img.decode();
        if (!img.naturalWidth || !img.currentSrc.endsWith('.webp')) throw new Error('Broken WebP fallback');
      });
    });
  }

  test(`delivery essay ${locale} preserves the three measurement levels alongside the new artwork`, async ({ page }, testInfo) => {
    await page.goto(`/${locale === 'pl' ? 'perspektywa' : 'en/perspective'}/delivery-beyond-deployment`);
    const figure = page.locator('figure[aria-labelledby="delivery-levels-title"]');
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toBeVisible();
    await expect(figure.locator('li')).toHaveCount(3);
    const expectedLabels = locale === 'pl'
      ? ['Sprawność inżynierska', 'Sprawność dostarczania rozwiązań', 'Efekty biznesowe']
      : ['Engineering performance', 'Delivery performance', 'Business outcomes'];
    for (const label of expectedLabels) {
      await expect(figure).toContainText(label);
    }
    await expect(figure.locator('img')).toHaveCount(0);
    const art = page.locator('.editorial-figure--delivery');
    await expect(art).toContainText(locale === 'pl' ? 'Przykład hipotetyczny' : 'Hypothetical example');
    await expect(art).toContainText('30%');
    await expect(art).toContainText(locale === 'pl' ? '2 miesiące oczekiwania' : '2 months waiting');
    await expect(art.locator('.delivery-track--technical li')).toHaveCount(3);
    await expect(art.locator('.delivery-track--value li')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await figure.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    await figure.screenshot({ style: '.skip-link:not(:focus) { visibility: hidden; }', path: `artifacts/visual/editorial-${locale}-delivery-levels-${testInfo.project.name}.png` });
  });
}
