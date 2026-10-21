import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/lab/living-architecture-v7';
const ready=async page=>page.waitForSelector('[data-v7][data-mode="webgl"]',{state:'attached'});
const report=async page=>JSON.parse(await page.locator('[data-canvas]').getAttribute('data-report'));
test('bilingual static study: noindex, accessible reading, links and controls',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 for(const path of [route,`/en${route}`]){
  await page.goto(path);await ready(page);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Tab');await expect(page.locator('.v7-skip')).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.locator('.v7-compare')).toHaveAttribute('href',path===route?'/lab/living-architecture-v6-4':'/en/lab/living-architecture-v6-4');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 }expect(errors).toEqual([]);
});
test('three real viewpoints change the camera only; no idle rendering or scroll animation',async({page})=>{
 await page.goto(route);await ready(page);await page.waitForTimeout(100);const initial=await report(page);
 await page.waitForTimeout(300);expect((await report(page)).draws).toBe(initial.draws);
 for(const view of ['reverse','side','primary']){await page.locator(`[data-view="${view}"]`).click();const r=await report(page);expect(r.view).toBe(view);expect(r.bounds).toEqual(initial.bounds);expect(r.dimensions).toEqual(initial.dimensions);expect(r.volumes).toBe(initial.volumes);await expect(page.locator(`[data-view="${view}"]`)).toHaveAttribute('aria-pressed','true');}
 expect((await report(page)).camera).toEqual(initial.camera);
 await page.mouse.wheel(0,300);await page.waitForTimeout(150);expect((await report(page)).view).toBe('primary');
});
test('reduced motion and narrow screens retain the complete study and all viewpoints',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:740});await page.goto(`${route}?view=reverse`);await ready(page);
 expect((await report(page)).view).toBe('reverse');await page.locator('[data-view="side"]').click();expect((await report(page)).view).toBe('side');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 const a=await report(page);await page.waitForTimeout(250);expect((await report(page)).draws).toBe(a.draws);
 await page.setViewportSize({width:1200,height:800});await expect.poll(async()=>(await report(page)).draws).toBeGreaterThan(a.draws);expect((await report(page)).bounds).toEqual(a.bounds);
});
test('context loss and partial initialization failure release the canvas and explain fallback',async({page})=>{
 await page.goto(route);await ready(page);await page.locator('canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('[data-v7]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('[data-status]')).toBeVisible();await expect(page.locator('[data-view]').first()).toBeDisabled();
 await page.addInitScript(()=>{ResizeObserver.prototype.observe=function(){throw new Error('Injected allocation failure');};});await page.reload();await expect(page.locator('[data-v7]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);
});
test('back-forward cache restoration rebuilds exactly one scene',async({page})=>{
 await page.goto(route);await ready(page);await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));await expect(page.locator('canvas')).toHaveCount(0);await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await ready(page);await expect(page.locator('canvas')).toHaveCount(1);
});
test('without JavaScript, narrow layout has an honest fallback and working navigation',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const page=await context.newPage();await page.goto(`http://127.0.0.1:4173${route}`);await expect(page.locator('[data-status]')).toContainText('JavaScript i WebGL');await expect(page.locator('h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);await context.close();
});
