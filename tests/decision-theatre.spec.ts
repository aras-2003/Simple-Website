import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/lab/decision-theatre-v2', '/en/lab/decision-theatre-v2'];
async function ready(page: Page, route = routes[1]!) {
  await page.goto(route, {waitUntil:'networkidle'});
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode', 'webgl');
}
async function seek(page: Page, progress: number) {
  await page.evaluate(progress => {
    const el = document.querySelector<HTMLElement>('[data-theatre]')!;
    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * (.14 + .86 * progress));
  }, progress);
  await expect.poll(async () => Number(await page.locator('[data-theatre]').getAttribute('data-progress'))).toBeCloseTo(progress, 2);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
for (const route of routes) {
  test(`${route} has semantic, accessible hero and final CTA`, async ({page}) => {
    await ready(page, route);
    expect(await page.locator('html').getAttribute('lang')).toBe(route.startsWith('/en') ? 'en' : 'pl');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-theatre]')).toHaveAttribute('data-modules', '24');
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
    await page.locator('.dt-cta').scrollIntoViewIfNeeded();
    const link = page.locator('.dt-cta > a');
    await expect(link).toHaveAttribute('href', route.startsWith('/en') ? '/en/contact' : '/contact');
    await link.click();
    await expect(page.locator('form')).toBeVisible();
  });
}

test('all four states reverse to identical rendered pixels; no idle rendering or runtime errors', async ({page}) => {
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await ready(page);
  const snapshots = new Map<number, Buffer>();
  for (const [p,state] of [[0,'fragmentation'],[.25,'tension'],[.5,'alignment'],[.75,'alignment'],[1,'coherence']] as const) {
    await seek(page,p);
    await expect(page.locator('[data-theatre]')).toHaveAttribute('data-state',state);
    await expect(page.locator('article[data-state]:visible')).toHaveCount(1);
    snapshots.set(p,await page.locator('canvas').screenshot());
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
  }
  const renders=await page.locator('[data-theatre]').getAttribute('data-renders');
  await page.waitForTimeout(350);
  expect(await page.locator('[data-theatre]').getAttribute('data-renders')).toBe(renders);
  for (const p of [.75,.5,.25,0]) {
    await seek(page,p);
    expect((await page.locator('canvas').screenshot()).equals(snapshots.get(p)!)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test('keyboard navigation reaches state controls and pause/resume', async ({page}) => {
  await ready(page);
  await page.keyboard.press('Tab');
  await expect(page.locator('.dt-skip')).toBeFocused();
  await seek(page,.25);
  const coherence=page.locator('[data-jump="3"]');
  await coherence.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-state','coherence');
  await expect.poll(async () => Number(await page.locator('[data-theatre]').getAttribute('data-progress'))).toBeCloseTo(1, 3);
  const button=page.locator('[data-motion]');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed','true');
  await page.evaluate(()=>window.scrollBy(0,-100));
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-progress','1.00000');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('[data-theatre]')).not.toHaveAttribute('data-progress','1.00000');
});

test('resize and narrow reflow preserve copy, canvas and navigation', async ({page, isMobile}) => {
  await ready(page);
  for(const width of (isMobile ? [390,320] : [1440,768,390,320])) {
    await page.setViewportSize({width,height:900});
    await page.waitForTimeout(350); // Wait for ScrollTrigger's resize refresh before sampling.
    await seek(page,.5);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    const canvas=await page.locator('canvas').boundingBox();
    const copy=await page.locator('[data-state-copy]').boundingBox();
    expect(canvas!.height).toBeGreaterThan(100);
    expect(copy!.x).toBeGreaterThanOrEqual(0);
    expect(copy!.x+copy!.width).toBeLessThanOrEqual(width);
    if(width<651)expect(canvas!.y).toBeGreaterThanOrEqual(copy!.y+copy!.height);
  }
});

test('reduced motion uses a complete static diagram without downloading the graphics runtime', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  const scripts:string[]=[];
  page.on('request',r=>{if(r.resourceType()==='script')scripts.push(r.url());});
  await page.goto(routes[1]!,{waitUntil:'networkidle'});
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','reduced-motion');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.dt-fallback')).toBeVisible();
  expect(scripts.some(url=>url.includes('theatre-scene'))).toBeFalsy();
  expect(await page.locator('[data-theatre]').evaluate(e=>e.clientHeight)).toBeLessThanOrEqual(1000);
  await expect(page.locator('.dt-reading-list li')).toHaveCount(4);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('WebGL denial and context loss retain the complete reading path', async ({page}) => {
  await ready(page);
  await page.locator('canvas').evaluate(canvas => {
    (canvas as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext();
  });
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','fallback');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('h1')).toBeVisible();
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type:string,...args:unknown[]){
      if(type==='webgl'||type==='webgl2')return null;
      return original.call(this,type,...args);
    } as typeof original;
  });
  await page.reload({waitUntil:'networkidle'});
  await expect(page.locator('[data-theatre]')).toHaveAttribute('data-render-mode','fallback');
  await expect(page.locator('.dt-fallback')).toBeVisible();
  await expect(page.locator('.dt-reading-list li')).toHaveCount(4);
});

test('JavaScript unavailable still exposes the model and contact path', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4173'});
  const page=await context.newPage();
  await page.goto(routes[1]!);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.dt-fallback')).toBeVisible();
  await page.locator('.dt-quiet').click();
  await expect(page.locator('#reading')).toBeInViewport();
  await expect(page.locator('.dt-reading-list li')).toHaveCount(4);
  await context.close();
});

test('lab bundles stay isolated from public pages and sitemap', async ({page,request}) => {
  const scripts:string[]=[];
  page.on('request',r=>{if(r.resourceType()==='script')scripts.push(r.url());});
  await page.goto('/',{waitUntil:'networkidle'});
  expect(scripts.some(url=>/DecisionTheatre|theatre-scene/.test(url))).toBeFalsy();
  expect(await (await request.get('/sitemap-0.xml')).text()).not.toContain('/lab/');
});
