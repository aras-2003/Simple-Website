import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.setTimeout(60000);
const route='/lab/decision-theatre-v4';
async function ready(page:Page,query=''){
  await page.goto(route+query,{waitUntil:'networkidle'});
  await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','webgl');
}
test('static frames retain object identities, reverse deterministically and render only on demand',async({page})=>{
  test.setTimeout(120000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await ready(page);const root=page.locator('[data-v4]');const ids=await root.getAttribute('data-object-ids');
  expect(JSON.parse(ids!)).toHaveLength(6);
  for(const candidate of ['incision','compression']){
    await page.selectOption('select[data-candidate]',candidate);
    const frames=new Map<string,Buffer>();
    for(const frame of ['complexity','transformation','coherence','transformation','complexity']){
      await page.locator(`button[data-frame="${frame}"]`).click();
      await expect(page.locator(`button[data-frame="${frame}"]`)).toHaveAttribute('aria-pressed','true');
      const pixels=await page.locator('canvas').screenshot();
      if(frames.has(frame))expect(pixels.equals(frames.get(frame)!)).toBeTruthy();else frames.set(frame,pixels);
      expect(await root.getAttribute('data-object-ids')).toBe(ids);
    }
    expect(frames.get('complexity')!.equals(frames.get('coherence')!)).toBeFalsy();
  }
  const renders=await page.locator('[data-v4-canvas]').getAttribute('data-renders');
  await page.waitForTimeout(400);
  expect(await page.locator('[data-v4-canvas]').getAttribute('data-renders')).toBe(renders);
  expect(errors).toEqual([]);
});
test('fresh direct study avoids studio texture allocation; studio adds reflections',async({page})=>{
  await ready(page,'?quality=direct');
  const measure=()=>page.locator('[data-v4]').evaluate(el=>{el.dispatchEvent(new Event('v4-measure'));return JSON.parse((el as HTMLElement).dataset['measurement']!);});
  const direct=await measure();expect(direct.environment).toBeNull();expect(direct.reflectionTarget).toBeNull();
  await page.selectOption('select[data-quality]','studio');const studio=await measure();
  expect(studio.environment.type).toBe('half-float');expect(studio.renderInfo.calls).toBeGreaterThan(direct.renderInfo.calls);
  expect(studio.renderInfo.textures).toBeGreaterThan(direct.renderInfo.textures);
});
test('responsive study is accessible, keyboard operable and contact link works',async({page})=>{
  await ready(page);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Tab');await expect(page.locator('.v4-skip')).toBeFocused();
  await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
  await page.locator('button[data-frame="coherence"]').focus();await page.keyboard.press('Space');
  await expect(page.locator('[data-v4]')).toHaveAttribute('data-frame','coherence');
  await page.locator('.v4-footer a').click();await expect(page.locator('form')).toBeVisible();
});
test('reduced motion retains the same immediate static study',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await ready(page);
  await page.locator('button[data-frame="coherence"]').click();
  await expect(page.locator('[data-v4]')).toHaveAttribute('data-frame','coherence');
  expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
});
test('context loss restores a readable illustration and review controls',async({page})=>{
  await ready(page);
  await page.locator('canvas').evaluate(el=>(el as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.locator('[data-v4]')).toHaveAttribute('data-render-mode','fallback');
  await expect(page.locator('.v4-fallback')).toBeVisible();await expect(page.locator('h1')).toBeVisible();
  await page.locator('button[data-frame="coherence"]').click();await expect(page.locator('[data-caption]')).toContainText('coherent');
});
test('without JavaScript the original illustration and semantic brief remain available',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto(route);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.v4-fallback')).toBeVisible();
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex, nofollow');await context.close();
});
