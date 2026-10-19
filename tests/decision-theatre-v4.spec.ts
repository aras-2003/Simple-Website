import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.setTimeout(120000);
const route='/lab/decision-theatre-v4';
async function ready(page:Page,query=''){
 await page.goto(route+query,{waitUntil:'networkidle'});
 await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','webgl');
 await expect(page.locator('[data-v4]')).toHaveAttribute('data-landmarks',/^\[/);
}
async function scroll(page:Page,p:number){
 await page.evaluate(p=>{const stops=JSON.parse(document.querySelector<HTMLElement>('[data-v4]')!.dataset['landmarks']!);const i=Math.min(4,Math.floor(p));scrollTo(0,stops[i]+(stops[i+1]-stops[i])*(p>=4?(p-4)/.5:p-i));},p);
 await page.waitForTimeout(200);
 await expect.poll(async()=>Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBeCloseTo(p,2);
}
const pose=(page:Page)=>page.locator('[data-v4-canvas]').getAttribute('data-pose');
test('native editorial flow, persistent identities, exact reverse poses and idle demand rendering',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await ready(page);const root=page.locator('[data-v4]');const ids=await root.getAttribute('data-object-ids');
 expect(JSON.parse(ids!)).toHaveLength(6);
 await expect(page.locator('[data-debug]')).toBeHidden();expect(await page.locator('.pin-spacer').count()).toBe(0);
 const firstY=await page.locator('h1').evaluate(el=>el.getBoundingClientRect().top);
 const before=await pose(page);
 await page.evaluate(()=>scrollTo(0,100));await page.waitForTimeout(200);
 expect(await page.locator('h1').evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(firstY-100,0);
 const states=new Map<number,string>();
 for(const p of [0,1,2,2.25,2.5,2.75,3,4,4.5,4,3,2.75,2.5,2.25,2,1,0]){
  await scroll(page,p);const state=(await pose(page))!;
  if(states.has(p))expect(state).toBe(states.get(p));else states.set(p,state);
  expect(await root.getAttribute('data-object-ids')).toBe(ids);
 }
 expect(await pose(page)).toBe(before);
 const renders=await page.locator('[data-v4-canvas]').getAttribute('data-renders');await page.waitForTimeout(500);
 expect(await page.locator('[data-v4-canvas]').getAttribute('data-renders')).toBe(renders);expect(errors).toEqual([]);
});
test('slow and fast scroll, section boundaries, navigation and resize remain deterministic',async({page})=>{
 await ready(page);
 for(const p of [.98,1,1.02,1.98,2,2.02,2.98,3,3.02])await scroll(page,p);
 await scroll(page,2.5);const middle=await pose(page);
 await scroll(page,4.5);await scroll(page,0);await scroll(page,2.5);expect(await pose(page)).toBe(middle);
 const size=page.viewportSize()!;await page.setViewportSize({width:size.width-20,height:size.height-40});await page.waitForTimeout(600);
 expect(Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBeGreaterThan(2.3);
 expect(Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBeLessThan(2.7);
 await scroll(page,2.5);await expect(page.locator('canvas')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.setViewportSize({width:size.height,height:size.width});await page.waitForTimeout(600);
 await scroll(page,2.5);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.goto(route+'#coherence',{waitUntil:'networkidle'});await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','webgl');
 expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(0);
 await page.waitForTimeout(300);expect(Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBeGreaterThan(2.9);
 await page.reload({waitUntil:'networkidle'});await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','webgl');
 expect(Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBeGreaterThan(2.9);
});
test('semantic narrative passes axe, keyboard navigation and the final contact link',async({page,browserName})=>{
 await ready(page);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.keyboard.press('Tab');
 // macOS WebKit may reserve ordinary Tab for controls; Option+Tab visits links.
 if(browserName==='webkit'&&!await page.locator('.v4-skip').evaluate(el=>el===document.activeElement))await page.keyboard.press('Alt+Tab');
 await expect(page.locator('.v4-skip')).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 expect(await page.locator('main section[data-act]').count()).toBe(5);
 await page.locator('#conversation a').click();await expect(page.locator('form')).toBeVisible();
});
test('reduced motion preserves a stable hero environment across the whole narrative and preference changes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await ready(page);
 const initial=await pose(page);await page.locator('#conversation').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 expect(await pose(page)).toBe(initial);expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(300);expect(await pose(page)).not.toBe(initial);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);expect(await pose(page)).toBe(initial);
});
test('context loss keeps all editorial content, illustration and contact navigation available',async({page})=>{
 await ready(page);
 await page.locator('canvas').evaluate(el=>(el as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
 await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','fallback');
 await expect(page.locator('.v4-fallback')).toBeVisible();await expect(page.locator('h1')).toBeVisible();
 await page.locator('#conversation a').click();await expect(page.locator('form')).toBeVisible();
});
test('without JavaScript the complete narrative and illustration remain available',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto(route);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.v4-fallback')).toBeVisible();
 expect(await page.locator('main section[data-act]').count()).toBe(5);
 await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
 await page.locator('#conversation a').click();await expect(page.locator('form')).toBeVisible();await context.close();
});
test('WebGL initialization denial exposes the fallback without breaking the document',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
   if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;
   return Reflect.apply(original,this,[type,...args]);
  } as typeof original;
 });
 await page.goto(route,{waitUntil:'networkidle'});
 await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','fallback');
 await expect(page.locator('.v4-fallback')).toBeVisible();expect(await page.locator('[data-act]').count()).toBe(5);
 await page.locator('#conversation a').click();await expect(page.locator('form')).toBeVisible();expect(errors).toEqual([]);
});
test('debug tools are explicit and resume document state without a competing scene timeline',async({page})=>{
 await ready(page,'?debug=1');await expect(page.locator('[data-debug]')).toBeVisible();
 await page.locator('[data-seek]').fill('2.5');expect(Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBe(2.5);
 await page.locator('[data-resume]').click();expect(Number(await page.locator('[data-v4-canvas]').getAttribute('data-progress'))).toBe(0);
});
test('intermediate scene states stay continuous across all narrative boundaries and allocations stay bounded',async({page})=>{
 await ready(page,'?debug=1');
 const sample=async(p:number)=>{
  await page.locator('[data-seek]').fill(String(p));
  return page.locator('[data-v4-canvas]').evaluate(el=>({pose:JSON.parse((el as HTMLElement).dataset['pose']!) as number[][],camera:JSON.parse((el as HTMLElement).dataset['camera']!) as number[]}));
 };
 const measure=()=>page.locator('[data-v4]').evaluate(el=>{el.dispatchEvent(new Event('v4-measure'));return JSON.parse((el as HTMLElement).dataset['measurement']!);});
 const initial=await measure();
 for(const boundary of [1,1.75,2,2.25,2.75,3,4]){
  const a=await sample(boundary-.01),b=await sample(boundary+.01);
  for(let i=0;i<6;i++)for(let j=0;j<6;j++)expect(Math.abs(a.pose[i]![j]!-b.pose[i]![j]!)).toBeLessThan(.4);
  expect(Math.hypot(...a.camera.map((v,i)=>v-b.camera[i]!))).toBeLessThan(.5);
 }
 const final=await measure();expect(final.renderInfo.geometries).toBe(initial.renderInfo.geometries);expect(final.renderInfo.textures).toBe(initial.renderInfo.textures);
 expect(final.reflectionTarget[0]).toBeLessThanOrEqual(768);
});
