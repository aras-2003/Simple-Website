import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('perspectives are keyboard operable, synchronized and accessible', async ({page})=>{
  await page.goto('/lab/decision-theatre');
  const buttons=page.locator('[data-mode-button]');
  await buttons.first().focus();
  for(let i=0;i<3;i++){
    if(i)await page.keyboard.press('ArrowRight');else await page.keyboard.press('Enter');
    await expect(buttons.nth(i)).toBeFocused();
    await expect(buttons.nth(i)).toHaveAttribute('aria-pressed','true');
    await expect(page.locator(`[data-story="${i}"]`)).toBeVisible();
    await expect(page.locator('[data-system]')).toHaveAttribute('data-mode',String(i));
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(audit.violations).toEqual([]);
  }
  await page.keyboard.press('Home');await expect(buttons.first()).toBeFocused();
  await page.keyboard.press('End');await expect(buttons.last()).toBeFocused();
  await page.getByRole('button',{name:'Wstrzymaj ruch'}).click();
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-motion','paused');
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await page.getByRole('button',{name:'Wznów ruch'}).click();
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-motion','running');
});

test('scroll changes the same modules and synchronized narrative',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/lab/decision-theatre');
  const cube=page.locator('[data-sculpture="system"] [data-cube="4"]');
  const initial=await cube.getAttribute('style');
  await page.evaluate(()=>{const s=document.querySelector<HTMLElement>('[data-system]')!;window.scrollTo({top:s.offsetTop+(s.offsetHeight-innerHeight)*.5,behavior:'instant'});});
  await expect(page.locator('[data-system]')).toHaveAttribute('data-mode','1');
  await expect.poll(()=>cube.getAttribute('style')).not.toBe(initial);
  await expect(page.locator('[data-sculpture="system"] [data-cube]')).toHaveCount(9);
  await page.evaluate(()=>{const s=document.querySelector<HTMLElement>('[data-system]')!;window.scrollTo({top:s.offsetTop+(s.offsetHeight-innerHeight)*.96,behavior:'instant'});});
  await expect(page.locator('[data-system]')).toHaveAttribute('data-mode','2');
  await expect(page.locator('[data-story="2"]')).toBeVisible();
});

test('reduced motion, responsive reflow, links and route isolation',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/lab/decision-theatre');
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-choreography','false');
  await expect(page.locator('[data-motion-toggle]')).toBeHidden();
  for(const width of [320,390,768,1024,1440,1920]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(let i=0;i<3;i++){
      await page.locator(`[data-mode-button="${i}"]`).click();
      await expect(page.locator(`[data-story="${i}"]`)).toBeVisible();
      // The decorative modules must remain inside the sculpture's clipping box.
      const fits=await page.locator('[data-sculpture="system"]').evaluate(el=>{
        const r=el.getBoundingClientRect();
        return [...el.querySelectorAll('.dt-cube>div')].every(face=>{const b=face.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1&&b.top>=r.top-1&&b.bottom<=r.bottom+1;});
      });
      expect(fits,`Object fits at ${width}px, state ${i}`).toBe(true);
    }
  }
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, nofollow');
  await expect(page.locator('.dt-cta')).toHaveAttribute('href','/contact');
  const sitemap=await page.request.get('/sitemap-0.xml');expect(await sitemap.text()).not.toContain('/lab/');
});

test('no-JavaScript retains the scene and all three explanations',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto('/lab/decision-theatre');
  await expect(page.locator('h1')).toBeVisible();await expect(page.locator('[data-story="0"]')).toBeVisible();
  await expect(page.locator('[data-mode-button="0"]')).toBeDisabled();
  await expect(page.locator('[data-motion-toggle]')).toBeHidden();
  await expect(page.locator('noscript details')).toHaveCount(2);
  await page.locator('noscript summary').first().click();
  await expect(page.locator('noscript details').first().locator('p').first()).toBeVisible();
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
  await context.close();
});
