import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const output=process.env.V6_MOTION_OUTPUT||'artifacts/living-architecture-v6';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,recordVideo:{dir:`${output}/raw-video`,size:{width:1280,height:800}}}),page=await context.newPage();
await page.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6?debug=1&freeze=1&isolate=1');await page.waitForSelector('[data-v6][data-mode="webgl"]',{state:'attached'});await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');
await page.evaluate(async()=>{
 const input=document.querySelector('[data-seek]'),time=document.querySelector('[data-time]');
 const run=async(duration,fn)=>{const start=performance.now();while(performance.now()-start<duration){await new Promise(requestAnimationFrame);fn(Math.min(1,(performance.now()-start)/duration));}};
 await run(5000,p=>{input.value=String(p);input.dispatchEvent(new Event('input'));});
 await run(8000,p=>{time.value=String(p*8);time.dispatchEvent(new Event('change'));});
 await run(3500,p=>{input.value=String(1-p);input.dispatchEvent(new Event('input'));});
});
await page.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6');await page.waitForSelector('[data-v6][data-mode="webgl"]',{state:'attached'});
await page.evaluate(async()=>{const end=document.querySelector('#conversation').offsetTop;const run=async(reverse)=>{const start=performance.now();while(performance.now()-start<4500){await new Promise(requestAnimationFrame);const p=Math.min(1,(performance.now()-start)/4500);scrollTo(0,end*(reverse?1-p:p));}};await run(false);await run(true);});
const video=page.video();await context.close();await video.saveAs(`${output}/morph-life-native-scroll.webm`);await browser.close();console.log(`Saved motion recording to ${output}`);
