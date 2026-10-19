import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const output=process.env.V5_CAPTURE_OUTPUT||'artifacts/decision-theatre-v5/poc-1';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
console.log('Browser launched');
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
console.log('Page created');
const errors=[];page.on('pageerror',e=>errors.push(e.message));
console.log('Navigate');await page.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5?debug=1&lock=1&isolate=1',{waitUntil:'networkidle'});console.log('Loaded');await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});
console.log('Ready');const frames=[];const values=[0,.1,.25,.4,.5,.6,.75,.9,1];
for(const p of values){console.log('Frame',p);await page.locator('[data-seek]').evaluate((el,p)=>{el.value=String(p);el.dispatchEvent(new Event('input',{bubbles:true}));},p);await page.waitForTimeout(70);const name=`fixed-${Math.round(p*100)}.webp`;await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/${name}`);frames.push(name);}
const tiles=await Promise.all(frames.map(async(name,i)=>({input:await sharp(`${output}/${name}`).resize(480,300).toBuffer(),left:i%3*480,top:Math.floor(i/3)*300})));
await sharp({create:{width:1440,height:900,channels:3,background:'#090d12'}}).composite(tiles).webp({lossless:true}).toFile(`${output}/fixed-camera-sheet.webp`);
await page.dispatchEvent('[data-v5]','v5-measure');const measurement=await page.locator('[data-v5]').getAttribute('data-measurement');
for(const p of [.5,1]){await page.locator('[data-seek]').evaluate((el,p)=>{el.value=String(p);el.dispatchEvent(new Event('input',{bubbles:true}));},p);await page.getByRole('button',{name:'Toggle material detail'}).click();await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/detail-${p*100}.webp`);}
// Full page, natural scroll, with all diagnostic UI absent from visitor captures.
await page.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5',{waitUntil:'networkidle'});
await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});
for(const [name,index] of [['hero',0],['dependencies',1],['decision',2],['alignment',3],['execution',4]]){
 await page.evaluate(i=>{const l=JSON.parse(document.querySelector('[data-v5]').dataset.landmarks);window.scrollTo(0,l[i]);},index);await page.waitForTimeout(150);
 await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/desktop-${name}.webp`);
}
await page.locator('#conversation').scrollIntoViewIfNeeded();await page.waitForTimeout(100);await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/desktop-cta.webp`);
for(const p of [.1,.4,.6,.9]){await page.evaluate(p=>{const l=JSON.parse(document.querySelector('[data-v5]').dataset.landmarks),i=Math.min(3,Math.floor(p*4));scrollTo(0,l[i]+(l[i+1]-l[i])*(p*4-i));},p);await page.waitForTimeout(150);await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/native-${p*100}.webp`);}
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5',{waitUntil:'networkidle'});await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});
for(const [name,index] of [['hero',0],['dependencies',1],['decision',2],['alignment',3],['execution',4]]){
 await page.evaluate(i=>{const l=JSON.parse(document.querySelector('[data-v5]').dataset.landmarks);window.scrollTo(0,l[i]);},index);await page.waitForTimeout(180);await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/mobile-${name}.webp`);
}
await page.locator('#conversation').scrollIntoViewIfNeeded();await page.waitForTimeout(100);await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/mobile-cta.webp`);
await page.setViewportSize({width:320,height:740});await page.goto('http://127.0.0.1:4173/lab/decision-theatre-v5',{waitUntil:'networkidle'});await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/narrow-polish.webp`);
const full=['desktop-hero','desktop-dependencies','desktop-decision','desktop-alignment','desktop-execution','desktop-cta'];
const layout=await Promise.all(full.map(async(name,i)=>({input:await sharp(`${output}/${name}.webp`).resize(640,400).toBuffer(),left:i%2*640,top:Math.floor(i/2)*400})));
await sharp({create:{width:1280,height:1200,channels:3,background:'#090d12'}}).composite(layout).webp({lossless:true}).toFile(`${output}/editorial-sheet.webp`);
const phones=await Promise.all(['hero','dependencies','decision','alignment','execution','cta'].map(async(name,i)=>({input:await sharp(`${output}/mobile-${name}.webp`).toBuffer(),left:i%3*390,top:Math.floor(i/3)*844})));
await sharp({create:{width:1170,height:1688,channels:3,background:'#090d12'}}).composite(phones).webp({lossless:true}).toFile(`${output}/mobile-sheet.webp`);
const fallback=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),staticPage=await fallback.newPage();await staticPage.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5');await sharp(await staticPage.screenshot()).webp({lossless:true}).toFile(`${output}/fallback-mobile.webp`);await fallback.close();
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5',{waitUntil:'networkidle'});await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});await page.locator('#conversation').scrollIntoViewIfNeeded();await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/reduced-motion-end.webp`);
await fs.writeFile(`${output}/results.json`,JSON.stringify({errors,measurement:JSON.parse(measurement)},null,2));await browser.close();
