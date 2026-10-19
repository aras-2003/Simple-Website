import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/en/lab/decision-theatre-v5';
const ready=async(page)=>{await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});};
const seek=async(page,p)=>{await page.locator('[data-seek]').evaluate((el,p)=>{el.value=String(p);el.dispatchEvent(new Event('input',{bubbles:true}));},p);};

test('native bilingual editorial document, semantic content, keyboard and accessibility',async({page,browserName})=>{
 for(const path of ['/lab/decision-theatre-v5',route]){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await ready(page);
  await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h2')).toHaveCount(5);
  await expect(page.locator('[data-debug]')).toBeHidden();expect(await page.locator('.pin-spacer').count()).toBe(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(audit.violations).toEqual([]);
  await page.keyboard.press('Tab');if(browserName==='webkit'&&!await page.locator('.v5-skip').evaluate(el=>el===document.activeElement))await page.keyboard.press('Alt+Tab');
  await expect(page.locator('.v5-skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#narrative')).toBeFocused();
  const expected=path===route?'/en/contact':'/contact';expect(await page.locator('.v5-contact .v5-link').getAttribute('href')).toBe(expected);expect(errors).toEqual([]);
 }
});

test('fixed camera exposes non-rigid reversible geometry at arbitrary normalized values and idles',async({page})=>{
 await page.goto(`${route}?debug=1&lock=1&isolate=1`);await ready(page);
 const samples=new Map(),cameras=[];
 for(const p of [0,.1,.25,.4,.5,.6,.75,.9,1]){await seek(page,p);samples.set(p,await page.locator('[data-canvas]').getAttribute('data-geometry'));cameras.push(await page.locator('[data-canvas]').getAttribute('data-camera'));}
 expect(new Set(cameras).size).toBe(1);expect(new Set(samples.values()).size).toBe(9);
 for(const p of [1,.9,.75,.6,.5,.4,.25,.1,0]){await seek(page,p);expect(await page.locator('[data-canvas]').getAttribute('data-geometry')).toBe(samples.get(p));}
 const before=await page.locator('[data-canvas]').getAttribute('data-renders');await page.waitForTimeout(700);expect(await page.locator('[data-canvas]').getAttribute('data-renders')).toBe(before);
 await page.dispatchEvent('[data-v5]','v5-measure');const report=JSON.parse(await page.locator('[data-v5]').getAttribute('data-measurement')||'{}');expect(report.renderInfo.calls).toBe(1);expect(report.renderInfo.geometries).toBe(1);
 await page.getByRole('button',{name:'Toggle material detail'}).click();await expect(page.locator('[data-canvas]')).not.toHaveAttribute('data-camera',cameras[0]);
});

test('natural scrolling reverses and restores after resize, anchor navigation and reload',async({page})=>{
 await page.goto(route);await ready(page);
 const native=async(p)=>{await page.evaluate(p=>{const l=JSON.parse(document.querySelector('[data-v5]').dataset.landmarks),s=Math.min(3,Math.floor(p*4)),t=p*4-s;window.scrollTo(0,l[s]+(l[s+1]-l[s])*t);},p);await expect.poll(async()=>Number(await page.locator('[data-v5]').getAttribute('data-progress'))).toBeCloseTo(p,2);};
 await native(.4);const first=JSON.parse(await page.locator('[data-canvas]').getAttribute('data-geometry')||'[]');await native(.9);await native(.4);const reverse=JSON.parse(await page.locator('[data-canvas]').getAttribute('data-geometry')||'[]');expect(Math.max(...first.map((v,i)=>Math.abs(v-reverse[i])))).toBeLessThan(.01);
 const size=page.viewportSize();await page.setViewportSize({width:size.width+25,height:size.height-35});await page.waitForTimeout(300);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 await page.locator('#conversation').scrollIntoViewIfNeeded();await expect.poll(async()=>Number(await page.locator('[data-v5]').getAttribute('data-progress'))).toBeCloseTo(1,2);
 await page.waitForTimeout(300); // Let the browser persist its latest native scroll history before reload.
 await page.reload();await ready(page);await expect.poll(async()=>Number(await page.locator('[data-v5]').getAttribute('data-progress'))).toBeCloseTo(1,2);
});

test('reduced motion stays static and responds to a live preference change',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${route}?debug=1`);await ready(page);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);const before=await page.locator('[data-canvas]').getAttribute('data-renders');await page.locator('#conversation').scrollIntoViewIfNeeded();await page.waitForTimeout(200);expect(await page.locator('[data-canvas]').getAttribute('data-renders')).toBe(before);await seek(page,.9);await expect(page.locator('[data-canvas]')).toHaveAttribute('data-progress','0');
 await page.emulateMedia({reducedMotion:'no-preference'});await expect.poll(async()=>Number(await page.locator('[data-canvas]').getAttribute('data-progress'))).toBeCloseTo(1,2);
});

test('WebGL initialization failure retains fallback, content and contact',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args);};});
 await page.goto(route);await expect(page.locator('[data-v5]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.v5-fallback')).toBeVisible();await expect(page.locator('.v5-contact .v5-link')).toHaveAttribute('href','/en/contact');
});

test('context loss releases scene and restores static illustration',async({page})=>{
 await page.goto(route);await ready(page);await page.locator('canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await expect(page.locator('[data-v5]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.v5-fallback')).toBeVisible();
});

test('no JavaScript and 320px reflow preserve full reading and contact',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const page=await context.newPage();await page.goto(`http://127.0.0.1:4173${route}`);await expect(page.locator('h2')).toHaveCount(5);await expect(page.locator('.v5-fallback')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);await expect(page.locator('[data-debug]')).toBeHidden();await context.close();
});

test('touch input advances the native mobile document',async({page,browserName,isMobile})=>{
 test.skip(!isMobile||browserName!=='chromium','Native touch gesture targets the mobile Chromium project');
 await page.goto(route);await ready(page);const cdp=await page.context().newCDPSession(page);await cdp.send('Input.synthesizeScrollGesture',{x:180,y:620,yDistance:-850,speed:700,gestureSourceType:'touch'});await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(100);await expect.poll(async()=>Number(await page.locator('[data-v5]').getAttribute('data-progress'))).toBeGreaterThan(0);await cdp.detach();
});

test('failure after renderer and environment allocation releases the partial world',async({page})=>{
 await page.addInitScript(()=>{const observe=ResizeObserver.prototype.observe;ResizeObserver.prototype.observe=function(target,...args){if(target.hasAttribute('data-canvas'))throw new Error('Injected failure after scene allocation');return observe.call(this,target,...args);};});
 await page.goto(route);await expect(page.locator('[data-v5]')).toHaveAttribute('data-mode','fallback');await expect(page.locator('canvas')).toHaveCount(0);await expect(page.locator('.v5-fallback')).toBeVisible();await expect(page.locator('h1')).toBeVisible();
});
