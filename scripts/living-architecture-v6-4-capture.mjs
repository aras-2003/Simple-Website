import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
const output=process.env.V64_CAPTURE_OUTPUT||'artifacts/living-architecture-v6-4/iteration-1';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const ready=()=>page.waitForSelector('[data-v64][data-mode="webgl"]',{state:'attached'});
const control=async(key,value,event='change')=>page.locator(`[data-${key}]`).evaluate((el,{value,event})=>{el.value=String(value);el.dispatchEvent(new Event(event,{bubbles:true}));},{value,event});
const shot=async name=>{await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');await sharp(await page.screenshot()).webp({quality:88}).toFile(`${output}/${name}.webp`);await page.locator('[data-debug]').evaluate(el=>el.style.visibility='');};
const measure=async()=>{await page.dispatchEvent('[data-v64]','v6-measure');const r=JSON.parse(await page.locator('[data-v64]').getAttribute('data-measurement'));delete r.samples;delete r.timings;return r;};
const sheet=async(names,name,w,h,cols)=>{const tiles=await Promise.all(names.map(async(n,i)=>({input:await sharp(`${output}/${n}.webp`).resize(w,h).toBuffer(),left:i%cols*w,top:Math.floor(i/cols)*h})));await sharp({create:{width:w*cols,height:h*Math.ceil(names.length/cols),channels:3,background:'#090c10'}}).composite(tiles).webp({quality:90}).toFile(`${output}/${name}.webp`);};
await page.goto('http://127.0.0.1:4173/lab/living-architecture-v6-4?debug=1&freeze=1&isolate=1');await ready();
const fixed=[];for(let i=0;i<=10;i++){await control('seek',i/10,'input');await control('time',0);await shot(`fixed-${i*10}`);fixed.push(await measure());}await sheet(Array.from({length:11},(_,i)=>`fixed-${i*10}`),'assembly',480,300,3);
const rear=[];for(const yaw of [0,90,180,-90]){await control('camera',yaw);await shot(`view-${yaw}`);rear.push(await measure());}await sheet([0,90,180,-90].map(y=>`view-${y}`),'four-sides',640,400,2);await control('camera',0);
const editorial={};for(const [device,width,height] of [['desktop',1600,1000],['mobile',390,844]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4173/lab/living-architecture-v6-4?debug=1&freeze=1');await ready();const names=[];
 for(let i=0;i<=10;i++){await page.evaluate(p=>{const a=JSON.parse(document.querySelector('[data-v64]').dataset.landmarks),s=Math.min(3,Math.floor(p*4));scrollTo(0,a[s]+(a[s+1]-a[s])*(p*4-s));},i/10);await page.waitForTimeout(90);await control('time',i===10?3.2:1.6);const name=`${device}-${i*10}`;await shot(name);names.push(name);editorial[name]=await measure();}
 await sheet(names,`${device}-sheet`,device==='mobile'?260:480,device==='mobile'?563:300,3);
}
await page.setViewportSize({width:320,height:740});await page.goto('http://127.0.0.1:4173/lab/living-architecture-v6-4?debug=1&freeze=1');await ready();await shot('narrow');
await page.emulateMedia({reducedMotion:'reduce'});await shot('reduced');
await fs.writeFile(`${output}/results.json`,JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),errors,fixed,rear,editorial},null,2));await browser.close();console.log(`Captured ${output}; runtime errors: ${errors.length}`);
