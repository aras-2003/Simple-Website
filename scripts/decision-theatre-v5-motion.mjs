import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const out=process.env.V5_MOTION_OUTPUT||'artifacts/decision-theatre-v5/final';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:800},recordVideo:{dir:out,size:{width:1280,height:800}}});const page=await context.newPage();
await page.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5?debug=1&lock=1&isolate=1',{waitUntil:'networkidle'});
await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});
const result=await page.evaluate(async()=>{
 const seek=document.querySelector('[data-seek]'),host=document.querySelector('[data-canvas]');let previous=0;const intervals=[],geometry=[],camera=[];
 for(let i=0;i<=480;i++){await new Promise(requestAnimationFrame);const now=performance.now();if(previous)intervals.push(now-previous);previous=now;const p=i<=240?i/240:2-i/240;seek.value=String(p);seek.dispatchEvent(new Event('input',{bubbles:true}));if(i%24===0){geometry.push({p,sample:JSON.parse(host.dataset.geometry)});camera.push(host.dataset.camera);}}
 const before=Number(host.dataset.renders);await new Promise(r=>setTimeout(r,700));document.querySelector('[data-v5]').dispatchEvent(new Event('v5-measure'));
 return {intervals,geometry,camera,idleRenders:Number(host.dataset.renders)-before,measurement:JSON.parse(document.querySelector('[data-v5]').dataset.measurement)};
});
await fs.writeFile(`${out}/motion.json`,JSON.stringify(result,null,2));const fixedVideo=page.video();await context.close();await fixedVideo.saveAs(`${out}/fixed-camera.webm`);
const editorial=await browser.newContext({viewport:{width:1280,height:800},recordVideo:{dir:out,size:{width:1280,height:800}}});const natural=await editorial.newPage();await natural.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5',{waitUntil:'networkidle'});await natural.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});
await natural.evaluate(async()=>{const end=JSON.parse(document.querySelector('[data-v5]').dataset.landmarks)[5];for(let i=0;i<=960;i++){await new Promise(requestAnimationFrame);scrollTo(0,end*(i<=720?i/720:1-(i-720)/240));}await new Promise(r=>setTimeout(r,400));});
const nativeVideo=natural.video();await editorial.close();await nativeVideo.saveAs(`${out}/native-scroll.webm`);await browser.close();console.log('Captured fixed-camera forward/reverse and native slow/fast scrolling');
