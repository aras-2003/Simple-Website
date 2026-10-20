import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/en/lab/living-architecture-v6';
const ready=async page=>page.waitForSelector('[data-v6][data-mode="webgl"]',{state:'attached'});
const seek=async(page,p)=>page.locator('[data-seek]').evaluate((el,p)=>{el.value=String(p);el.dispatchEvent(new Event('input',{bubbles:true}));},p);
const measure=async page=>{await page.dispatchEvent('[data-v6]','v6-measure');return JSON.parse(await page.locator('[data-v6]').getAttribute('data-measurement'));};
const native=async(page,p)=>{await page.evaluate(p=>{const a=JSON.parse(document.querySelector('[data-v6]').dataset.landmarks),i=Math.min(3,Math.floor(p*4));scrollTo(0,a[i]+(a[i+1]-a[i])*(p*4-i));},p);await expect.poll(async()=>Number(await page.locator('[data-v6]').getAttribute('data-progress'))).toBeCloseTo(p,2);};

test('bilingual semantic editorial, noindex, contact, keyboard and WCAG',async({page,browserName})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/lab/living-architecture-v6',route]){
 await page.goto(path);await ready(page);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h2')).toHaveCount(5);
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');await expect(page.locator('[data-debug]')).toBeHidden();expect(await page.locator('.pin-spacer').count()).toBe(0);
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(audit.violations).toEqual([]);
 await page.keyboard.press('Tab');if(browserName==='webkit'&&!await page.locator('.v6-skip').evaluate(el=>el===document.activeElement))await page.keyboard.press('Alt+Tab');await expect(page.locator('.v6-skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#narrative')).toBeFocused();
 await expect(page.locator('.v6-cta')).toHaveAttribute('href',path===route?'/en/contact':'/contact');
 }expect(errors).toEqual([]);
});
test('11 frozen actual poses reverse with a fixed camera and stable projected anchor',async({page})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);const samples=[],cameras=[],centers=[];
 for(let i=0;i<=10;i++){await seek(page,i/10);const r=await measure(page);samples.push(r.samples);cameras.push(r.camera);centers.push(r.centroid);}
 expect(new Set(cameras.map(JSON.stringify)).size).toBe(1);expect(new Set(samples.map(JSON.stringify)).size).toBe(11);
 for(let i=10;i>=0;i--){await seek(page,i/10);expect((await measure(page)).samples).toEqual(samples[i]);}
 const size=page.viewportSize();for(const axis of [0,1])expect(Math.max(...centers.map(c=>c[axis]))-Math.min(...centers.map(c=>c[axis]))).toBeLessThan((axis===0?size.width:size.height)*.03);
});
test('final life changes at rest, deterministic time control, real signals, pause and bounded GPU allocation',async({page})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);await seek(page,1);const a=await measure(page);
 await page.locator('[data-time]').fill('2');await page.locator('[data-time]').dispatchEvent('change');const b=await measure(page);expect(b.samples).not.toEqual(a.samples);expect(b.camera).toEqual(a.camera);expect(b.renderInfo.geometries).toBe(1);expect(b.renderInfo.calls).toBeLessThanOrEqual(4);
 await page.locator('[data-time]').fill('0');await page.locator('[data-time]').dispatchEvent('change');expect((await measure(page)).samples).toEqual(a.samples);
 await page.locator('[data-time]').fill('1.5');await page.locator('[data-time]').dispatchEvent('change');const withSignal=await measure(page);await page.locator('[data-signals]').uncheck();expect((await measure(page)).samples).not.toEqual(withSignal.samples);
 const before=(await measure(page)).draws;await page.waitForTimeout(180);expect((await measure(page)).draws).toBe(before);
 await page.locator('[data-freeze]').uncheck();await page.waitForTimeout(180);expect((await measure(page)).draws).toBeGreaterThan(before);
 await page.locator('[data-motion]').click();const stopped=(await measure(page)).draws;await page.waitForTimeout(180);expect((await measure(page)).draws).toBe(stopped);
});
test('native forward/reverse scroll, reload, resize and anchor navigation',async({page})=>{
 await page.goto(`${route}?debug=1&freeze=1`);await ready(page);await native(page,.4);const first=(await measure(page)).samples;await native(page,.9);await native(page,.4);const reverse=(await measure(page)).samples;expect(Math.max(...first.map((v,i)=>Math.abs(v-reverse[i])))).toBeLessThan(.03);
 const size=page.viewportSize();await page.setViewportSize({width:size.width+20,height:size.height-20});await page.waitForTimeout(180);expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.locator('#conversation').scrollIntoViewIfNeeded();await expect.poll(async()=>Number(await page.locator('[data-v6]').getAttribute('data-progress'))).toBeCloseTo(1,2);await page.waitForTimeout(300);await page.reload();await ready(page);await expect.poll(async()=>Number(await page.locator('[data-v6]').getAttribute('data-progress'))).toBeCloseTo(1,2);
});
test('reduced motion is a static complete architecture, including live preference changes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${route}?debug=1`);await ready(page);await page.waitForTimeout(200);const a=await measure(page);expect(a.progress).toBe(1);await page.locator('#conversation').scrollIntoViewIfNeeded();await page.waitForTimeout(200);expect((await measure(page)).draws).toBe(a.draws);await expect(page.locator('[data-motion]')).toBeHidden();
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(200);expect((await measure(page)).draws).toBeGreaterThan(a.draws);
});
test('WebGL denied and context loss preserve static illustration and the complete document',async({page})=>{
 await page.goto(route);await ready(page);await page.locator('canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('[data-v6]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.v6-fallback')).toBeVisible();
 await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:get.call(this,type,...args);};});await page.reload();await expect(page.locator('[data-v6]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.v6-cta')).toHaveAttribute('href','/en/contact');
});
test('partial construction failure releases its canvas and GPU resources',async({page})=>{
 await page.addInitScript(()=>{const observe=ResizeObserver.prototype.observe;ResizeObserver.prototype.observe=function(target,...args){if(target.hasAttribute('data-canvas'))throw new Error('Injected post-allocation failure');return observe.call(this,target,...args);};});await page.goto(route);await expect(page.locator('[data-v6]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.v6-fallback')).toBeVisible();
});
test('320px without JavaScript retains reading, language and contact paths',async({browser})=>{
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}}),page=await ctx.newPage();await page.goto(`http://127.0.0.1:4173${route}`);await expect(page.locator('.v6-fallback')).toBeVisible();expect(await page.locator('h2').count()).toBe(5);expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);await expect(page.locator('[data-debug]')).toBeHidden();await ctx.close();
});
test('mobile touch advances normal document scrolling',async({page,isMobile,browserName})=>{
 test.skip(!isMobile||browserName!=='chromium','Touch only applies to mobile Chromium');await page.goto(route);await ready(page);const cdp=await page.context().newCDPSession(page);await cdp.send('Input.synthesizeScrollGesture',{x:180,y:620,yDistance:-850,speed:700,gestureSourceType:'touch'});await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(100);await expect.poll(async()=>Number(await page.locator('[data-v6]').getAttribute('data-progress'))).toBeGreaterThan(0);await cdp.detach();
});
