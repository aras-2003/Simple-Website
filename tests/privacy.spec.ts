import { expect, test } from '@playwright/test';

for (const [locale, path, label, disclosure] of [
  ['pl', '/privacy', 'Kontakt w sprawach danych', 'Podanie danych jest dobrowolne'],
  ['en', '/en/privacy', 'Data privacy enquiries', 'Providing this information is voluntary'],
] as const) {
  test(`${locale} privacy notice offers accessible email and explains required data`, async ({ page }, testInfo) => {
    await page.goto(path);
    const contact = page.locator('.privacy-contact');
    await expect(contact).toHaveCount(1);
    await expect(contact).toBeVisible();
    await expect(contact).toHaveAttribute('href', 'mailto:contact@arkadiuszkamrowski.com');
    await expect(contact.locator('.privacy-contact-label')).toHaveText(label);
    await expect(contact).toContainText('contact@arkadiuszkamrowski.com');
    await expect(page.locator('.privacy-grid article').nth(1)).toContainText(disclosure);

    if (testInfo.project.name === 'desktop-chromium') {
      await page.screenshot({ path: `artifacts/visual/privacy-${locale}-desktop-chromium.png`, fullPage: true });
    }

    await page.setViewportSize({ width: 320, height: 740 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await expect(contact).toBeVisible();

    if (testInfo.project.name === 'mobile-chromium') {
      await page.screenshot({ path: `artifacts/visual/privacy-${locale}-mobile-chromium.png`, fullPage: true });
    }
  });
}
