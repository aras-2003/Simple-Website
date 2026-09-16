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
      await figure.locator('img').evaluate(async (img: HTMLImageElement) => {
        img.parentElement?.querySelector('source')?.remove();
        img.removeAttribute('srcset');
        await img.decode();
        if (!img.naturalWidth || !img.currentSrc.endsWith('.webp')) throw new Error('Broken WebP fallback');
      });
    });
  }
}
