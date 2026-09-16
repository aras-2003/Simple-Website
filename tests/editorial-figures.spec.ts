import { test, expect } from '@playwright/test';

const slugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'transformation-operating-model', 'ai-governance-without-theatre'];
for (const locale of ['pl', 'en']) {
  for (const slug of slugs) {
    test(`editorial artwork ${locale}/${slug}`, async ({ page }, testInfo) => {
      await page.goto(`/${locale === 'pl' ? 'perspektywa' : 'en/perspective'}/${slug}`);
      const figure = page.locator('.editorial-figure');
      await figure.scrollIntoViewIfNeeded();
      await expect(figure).toBeVisible();
      await figure.locator('img').evaluate(async (img: HTMLImageElement) => {
        await img.decode();
        if (!img.naturalWidth) throw new Error('Empty artwork');
      });
      await expect(figure.locator('li')).toHaveCount(slug.startsWith('architecture') || slug.startsWith('transformation') ? 4 : 3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await figure.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      await figure.screenshot({ path: `artifacts/visual/editorial-${locale}-${slug}-${testInfo.project.name}.png` });
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

  test(`delivery essay ${locale} explains all three levels without a broken artwork placeholder`, async ({ page }, testInfo) => {
    await page.goto(`/${locale === 'pl' ? 'perspektywa' : 'en/perspective'}/delivery-beyond-deployment`);
    const figure = page.locator('.editorial-figure');
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toBeVisible();
    await expect(figure.locator('li')).toHaveCount(3);
    for (const label of ['Engineering performance', 'Delivery performance', 'Business outcomes']) {
      await expect(figure).toContainText(label);
    }
    await expect(figure.locator('img')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await figure.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    await figure.screenshot({ path: `artifacts/visual/editorial-${locale}-delivery-beyond-deployment-${testInfo.project.name}.png` });
  });
}
