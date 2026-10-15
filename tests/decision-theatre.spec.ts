import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes=['/lab/decision-theatre-v2','/en/lab/decision-theatre-v2'];
async function settled(page:Page){
  await expect.poll(async()=>page.locator('[data-theatre]').evaluate(el=>{
    const d=(el as HTMLElement).dataset;return Math.abs(Number(d['progress'])-Number(d['targetProgress']));
  })).toBeLessThan(.0001);
  await page.waitForTimeout(320);
}
async function ready(page:Page,route=routes[1]!){
  await page.goto(route,{waitUntil:'networkidle'});
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','webgl');
  await settled(page);
}
async function seek(page:Page,index:number,fraction=0){
  await page.evaluate(({index,fraction})=>{
    const d=document.querySelector<HTMLElement>('[data-theatre]')!.dataset;
    const a=JSON.parse(d['anchors']!) as number[];
    const end=a[Math.min(index+1,a.length-1)]!;
    window.scrollTo(0,a[index]!+(end-a[index]!)*fraction);
  },{index,fraction});
  await settled(page);
}
async function readable(page:Page){
  expect(await page.locator('.dt-copy').evaluateAll(copies=>copies.every(copy=>{
    const c=getComputedStyle(copy);
    return !['absolute','fixed','sticky'].includes(c.position)&&c.display!=='none'&&c.visibility==='visible'&&Number(c.opacity)===1&&!copy.closest('[hidden]');
  }))).toBeTruthy();
  await expect(page.locator('main [hidden]')).toHaveCount(0);
  await expect(page.locator('[data-beat]')).toHaveCount(6);
}
for(const route of routes){
  test(`${route} has accessible narrative, localised copy and a functional CTA`,async({page})=>{
    await ready(page,route);
    await expect(page.locator('html')).toHaveAttribute('lang',route.startsWith('/en')?'en':'pl');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');
    await readable(page);
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
    await page.locator('.dt-cta a').click();
    await expect(page.locator('form')).toBeVisible();
  });
}

test('copy travels with native scroll; adjacent sections coexist without replacement',async({page})=>{
  await ready(page);
  const original=await page.locator('main').textContent();
  await seek(page,1);
  const heading=page.locator('#complexity h2');
  const before=(await heading.boundingBox())!.y;
  await page.evaluate(()=>scrollBy(0,160));
  await settled(page);
  expect((await heading.boundingBox())!.y).toBeCloseTo(before-160,0);
  await page.evaluate(()=>{
    const section=document.querySelector('#decisions')!;
    scrollTo(0,scrollY+section.getBoundingClientRect().top-innerHeight*.55);
  });
  await settled(page);
  expect(await page.locator('[data-beat]').evaluateAll(sections=>sections.filter(el=>{
    const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;
  }).length)).toBeGreaterThanOrEqual(2);
  for(const index of [2,3,4,5,3,1,0]){await seek(page,index);await readable(page);}
  expect(await page.locator('main').textContent()).not.toBeNull();
  // Scene captions may change; every original editorial paragraph must persist verbatim.
  for(const paragraph of await page.locator('.dt-copy p').allTextContents())expect(original).toContain(paragraph);
  expect(await page.locator('.dt-stage,.dt-state-copy,.dt-reading').count()).toBe(0);
});

test('section geometry drives continuous reversible rendering, with no idle loop or console errors',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await ready(page);
  const images=new Map<number,Buffer>();
  for(const index of [1,2,3,4]){
    await seek(page,index,.3);
    images.set(index,await page.locator('canvas').screenshot());
    await readable(page);
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
  }
  const renders=await page.locator('[data-theatre]').getAttribute('data-renders');
  await page.waitForTimeout(450);
  expect(await page.locator('[data-theatre]').getAttribute('data-renders')).toBe(renders);
  for(const index of [3,2,1]){
    await seek(page,index,.3);
    expect((await page.locator('canvas').screenshot()).equals(images.get(index)!)).toBeTruthy();
  }
  await page.mouse.wheel(0,250);await settled(page);
  const forward=Number(await page.locator('[data-theatre]').getAttribute('data-progress'));
  await page.mouse.wheel(0,-400);await settled(page);
  expect(Number(await page.locator('[data-theatre]').getAttribute('data-progress'))).toBeLessThan(forward);
  expect(errors).toEqual([]);
});

test('anchors remeasure when editorial content changes instead of using a synthetic scroll quota',async({page})=>{
  await ready(page);
  const before=JSON.parse((await page.locator('[data-theatre]').getAttribute('data-anchors'))!);
  await page.locator('#complexity .dt-body').evaluate(el=>{el.textContent+=' '+el.textContent!.repeat(3);});
  await expect.poll(async()=>JSON.parse((await page.locator('[data-theatre]').getAttribute('data-anchors'))!)[2]).toBeGreaterThan(before[2]);
  await seek(page,3);
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-state','alignment');
  await readable(page);
});

test('keyboard anchors and pause affect the world without freezing the editorial document',async({page})=>{
  await ready(page);
  await page.keyboard.press('Tab');await expect(page.locator('.dt-skip')).toBeFocused();
  await page.locator('.dt-hero-actions .dt-link').focus();await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#complexity$/);
  await settled(page);
  const button=page.locator('[data-motion]');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed','true');
  const frozen=await page.locator('[data-theatre]').getAttribute('data-progress');
  await page.evaluate(()=>scrollBy(0,-800));await page.waitForTimeout(400);
  expect(await page.locator('[data-theatre]').getAttribute('data-progress')).toBe(frozen);
  await readable(page);
  await button.click();await settled(page);
  await expect(button).toHaveAttribute('aria-pressed','false');
});

test('responsive composition retains readable copy, bounded scene and fewer mobile modules',async({page,isMobile})=>{
  await ready(page);
  for(const width of(isMobile?[390,320]:[1440,768,390,320])){
    await page.setViewportSize({width,height:900});await page.waitForTimeout(350);
    await seek(page,2,.5);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    await readable(page);
    const phone=width<=650;
    await expect(page.locator('[data-theatre]')).toHaveAttribute('data-modules',phone?'12':'18');
    const rect=await page.locator('#decisions .dt-copy').boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(0);expect(rect!.x+rect!.width).toBeLessThanOrEqual(width);
  }
});

test('reduced motion preserves normal-flow content and skips the graphics runtime',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const scripts:string[]=[];page.on('request',r=>{if(r.resourceType()==='script')scripts.push(r.url());});
  await page.goto(routes[1]!,{waitUntil:'networkidle'});
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','reduced-motion');
  await expect(page.locator('canvas')).toHaveCount(0);
  await readable(page);await expect(page.locator('.dt-fallback')).toBeVisible();
  expect(scripts.some(url=>url.includes('theatre-scene'))).toBeFalsy();
  const height=await page.locator('main').evaluate(el=>el.clientHeight);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(await page.locator('main').evaluate(el=>el.clientHeight)).toBe(height);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('canvas')).toHaveCount(0);await readable(page);
});

test('WebGL denial and context loss preserve every editorial section',async({page})=>{
  await ready(page);
  await page.locator('canvas').evaluate(el=>(el as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','fallback');
  await expect(page.locator('canvas')).toHaveCount(0);await readable(page);
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type:string,...args:unknown[]){
      if(type==='webgl'||type==='webgl2')return null;return original.call(this,type,...args);
    } as typeof original;
  });
  await page.reload({waitUntil:'networkidle'});
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','fallback');
  await readable(page);await expect(page.locator('.dt-fallback')).toBeVisible();
});

test('JavaScript unavailable still exposes the entire narrative and contact path',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4173'});
  const page=await context.newPage();await page.goto(routes[1]!);await readable(page);
  await page.locator('.dt-hero-actions .dt-link').click();await expect(page).toHaveURL(/#complexity$/);
  await page.locator('.dt-cta a').click();await expect(page.locator('form')).toBeVisible();
  await context.close();
});

test('lab scripts and pages stay isolated from public routes and sitemap',async({page,request})=>{
  const scripts:string[]=[];page.on('request',r=>{if(r.resourceType()==='script')scripts.push(r.url());});
  await page.goto('/',{waitUntil:'networkidle'});
  expect(scripts.some(url=>/DecisionTheatre|theatre-scene/.test(url))).toBeFalsy();
  expect(await(await request.get('/sitemap-0.xml')).text()).not.toContain('/lab/');
});
