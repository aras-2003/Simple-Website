import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {swipeDocument} from './native-touch';
const route='/lab/living-architecture-v6-4';
const ready=async page=>page.waitForSelector('[data-v64][data-mode="webgl"]',{state:'attached'});
const control=async(page,key,value,event='change')=>page.locator(`[data-${key}]`).evaluate((el,{value,event})=>{el.value=String(value);el.dispatchEvent(new Event(event,{bubbles:true}));},{value,event});
const seek=async(page,p)=>control(page,'seek',p,'input');
const measure=async page=>{await page.dispatchEvent('[data-v64]','v6-measure');return JSON.parse(await page.locator('[data-v64]').getAttribute('data-measurement'));};
const native=async(page,p)=>{await page.evaluate(p=>{const a=JSON.parse(document.querySelector('[data-v64]').dataset.landmarks),i=Math.min(3,Math.floor(p*4));scrollTo(0,a[i]+(a[i+1]-a[i])*(p*4-i));},p);await expect.poll(async()=>Number(await page.locator('[data-v64]').getAttribute('data-progress'))).toBeCloseTo(p,2);};
test('PL/EN semantic narrative, keyboard, noindex and WCAG',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of [route,`/en${route}`]){
  await page.goto(path);await ready(page);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h2')).toHaveCount(5);await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');await expect(page.locator('[data-debug]')).toBeHidden();expect(await page.locator('.pin-spacer').count()).toBe(0);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(audit.violations).toEqual([]);
  await page.keyboard.press('Tab');await expect(page.locator('.v6-skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#narrative')).toBeFocused();await expect(page.locator('.v6-cta')).toHaveAttribute('href',path===route?'/contact':'/en/contact');
 }expect(errors).toEqual([]);
});
test('11 poses reverse deterministically with a fixed camera and no opaque reading mask',async({page})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);await page.locator('[data-signals]').uncheck();const samples=[],cameras=[];
 for(let i=0;i<=10;i++){await seek(page,i/10);const r=await measure(page);samples.push(r.samples);cameras.push(r.camera);}
 expect(new Set(cameras.map(JSON.stringify)).size).toBe(1);expect(new Set(samples.map(JSON.stringify)).size).toBe(11);
 for(let i=10;i>=0;i--){await seek(page,i/10);expect((await measure(page)).samples).toEqual(samples[i]);}
 expect(await page.locator('[data-canvas]').evaluate(el=>getComputedStyle(el).maskImage)).toBe('none');
});
test('phase-local clock runs at rest and survives scrolling within its phase',async({page})=>{
 await page.goto(`${route}?debug=1`);await ready(page);await seek(page,.55);await expect.poll(async()=>(await measure(page)).eventTime).toBeGreaterThan(.3);const a=await measure(page);
 await seek(page,.60);const b=await measure(page);expect(b.eventTime).toBeGreaterThanOrEqual(a.eventTime);expect(b.event.id).toBe('merger');
 await seek(page,.8);const c=await measure(page);expect(c.eventTime).toBeLessThan(.25);expect(c.event.id).toBe('transformation');
 await page.locator('[data-motion]').click();const stopped=await measure(page);await page.waitForTimeout(200);expect((await measure(page)).draws).toBe(stopped.draws);
});
test('causal traveling tails, quiet interval and bounded local physical response',async({page})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);await seek(page,1);await control(page,'time',0);const a=await measure(page);
 await control(page,'time',1.5);const b=await measure(page);expect(b.pulses).toBe(1);expect(b.samples).not.toEqual(a.samples);expect(b.camera).toEqual(a.camera);expect(b.renderInfo.calls).toBeLessThanOrEqual(5);expect(b.renderInfo.geometries).toBeLessThanOrEqual(2);
 await control(page,'time',9);expect((await measure(page)).pulses).toBe(0);await control(page,'time',0);expect((await measure(page)).samples).toEqual(a.samples);
});
test('full rear and interior, explicit rear view and small model-adjacent annotation',async({page,isMobile})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);await native(page,1);await control(page,'time',3.2);const a=await measure(page);expect(a.faces).toEqual([252,252,252,252,18]);expect(a.modules).toBe(1026);
 await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');await page.locator('[data-rear]').click();const rear=await measure(page);expect(rear.cameraYaw).toBe(180);expect(rear.camera).not.toEqual(a.camera);expect(rear.samples).toEqual(a.samples);await page.locator('[data-rear]').click();expect((await measure(page)).camera).toEqual(a.camera);
 let visible=0;for(const t of [1,2.5,3.2,5.5]){await control(page,'time',t);const r=await measure(page);if(r.anchor.visible){const caption=page.locator('[data-annotation]');await expect(caption).toBeVisible();const style=await caption.evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),width:el.getBoundingClientRect().width,left:el.getBoundingClientRect().left}));expect(style.font).toBeLessThanOrEqual(isMobile?10:11);expect(style.width).toBeLessThanOrEqual(174);expect(style.left).toBeGreaterThan(isMobile?20:page.viewportSize().width*.65);visible++;}}
 expect(visible).toBeGreaterThan(0);
});
test('native scroll reverses, resizes and touch scroll remains native',async({page,isMobile,browserName})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);await page.locator('[data-signals]').uncheck();await native(page,.4);const a=await measure(page);await native(page,.9);await native(page,.4);const b=await measure(page);expect(Math.max(...a.samples.map((v,i)=>Math.abs(v-b.samples[i])))).toBeLessThan(.03);expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 if(isMobile&&browserName==='chromium'){const before=await page.evaluate(()=>scrollY);await swipeDocument(page);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+50);}
});
test('reduced motion draws a complete static volume and live preference changes resume life',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${route}?debug=1`);await ready(page);await page.waitForTimeout(150);const a=await measure(page);expect(a.progress).toBe(1);await native(page,1);await page.waitForTimeout(200);expect((await measure(page)).draws).toBe(a.draws);await expect(page.locator('[data-motion]')).toBeHidden();await expect(page.locator('[data-annotation]')).toBeHidden();await page.emulateMedia({reducedMotion:'no-preference'});await expect.poll(async()=>(await measure(page)).draws).toBeGreaterThan(a.draws);
});
test('context loss and denied WebGL retain illustration and full reading',async({page})=>{
 await page.goto(route);await ready(page);await page.locator('canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('[data-v64]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.v6-fallback')).toBeVisible();
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:get.call(this,type,...args);};});await page.reload();await expect(page.locator('[data-v64]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('h1')).toBeVisible();
});
test('partial construction and cached page restoration release and recreate resources',async({page})=>{
 await page.goto(route);await ready(page);await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));await expect(page.locator('canvas')).toHaveCount(0);await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await ready(page);await expect(page.locator('canvas')).toHaveCount(1);
 await page.addInitScript(()=>{const observe=ResizeObserver.prototype.observe;ResizeObserver.prototype.observe=function(target,...args){if(target.hasAttribute('data-canvas'))throw new Error('Injected allocation failure');return observe.call(this,target,...args);};});await page.reload();await expect(page.locator('[data-v64]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);
});
test('320px without JS preserves language, reading and contact',async({browser})=>{
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const page=await ctx.newPage();await page.goto(`http://127.0.0.1:4173${route}`);await expect(page.locator('.v6-fallback')).toBeVisible();expect(await page.locator('h2').count()).toBe(5);expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);await expect(page.locator('.v6-cta')).toHaveAttribute('href','/contact');await ctx.close();
});
