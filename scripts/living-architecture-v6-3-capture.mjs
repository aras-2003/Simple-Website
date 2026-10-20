import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
const output=process.env.V63_CAPTURE_OUTPUT||'artifacts/living-architecture-v6-3/iteration-1';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1}),errors=[],evidence=[];
page.on('pageerror',e=>errors.push(e.message));
const ready=()=>page.waitForSelector('[data-v6][data-mode="webgl"]',{state:'attached'});
const seek=async p=>page.locator('[data-seek]').evaluate((el,p)=>{el.value=String(p);el.dispatchEvent(new Event('input',{bubbles:true}));},p);
const time=async t=>{await page.locator('[data-time]').fill(String(t));await page.locator('[data-time]').dispatchEvent('change');};
const measure=async()=>{await page.dispatchEvent('[data-v6]','v6-measure');return page.locator('[data-v6]').evaluate(el=>({mode:el.dataset.mode,world:el.dataset.mode==='webgl'?JSON.parse(el.dataset.measurement):null,tracking:JSON.parse(el.dataset.tracking)}));};
const shot=async name=>{await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/${name}.webp`);evidence.push({name,...await measure()});await page.locator('[data-debug]').evaluate(el=>el.style.visibility='');};
const goto=async(isolate=false)=>{await page.goto(`http://127.0.0.1:4173/en/lab/living-architecture-v6?debug=1&freeze=1${isolate?'&isolate=1':''}`);await ready();await page.evaluate(()=>document.fonts.ready);};
const native=async p=>{await page.evaluate(p=>{const a=JSON.parse(document.querySelector('[data-v6]').dataset.landmarks),s=Math.min(3,Math.floor(p*4));scrollTo(0,a[s]+(a[s+1]-a[s])*(p*4-s));},p);await page.waitForTimeout(100);};
await goto(true);await seek(1);await page.locator('[data-signals]').uncheck();await shot('final-no-signals');
if(!process.env.V63_QUICK){for(let i=0;i<=10;i++){await seek(i/10);await shot(`fixed-${i*10}`);}for(const t of [0,2,5,8]){await time(t);await shot(`life-${t}`);}}
await goto();await shot('hero');await native(1);await time(1.5);await shot('final-editorial');
for(const [name,p,t] of [['leadership',.17,1.5],['local',.3,1.5],['teams',.48,7.5],['department',.64,7.5],['global',.83,13.5]]){if(process.env.V63_QUICK&&name!=='teams')continue;await native(p);await time(t);await shot(name);}
if(!process.env.V63_QUICK){
 await native(1);for(const t of [.2,1.5,2.8]){await time(t);await shot(`tracked-${t}`);}for(const yaw of [-25,25]){await page.locator('[data-camera]').fill(String(yaw));await page.locator('[data-camera]').dispatchEvent('change');await time(1.5);await shot(`camera-${yaw}`);}
 await page.locator('[data-camera]').fill('0');await page.locator('[data-camera]').dispatchEvent('change');
 for(let i=0;i<=10;i++){await native(i/10);await shot(`desktop-${i*10}`);}
 await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');await sharp(await page.screenshot({fullPage:true})).webp().toFile(`${output}/desktop-full-page.webp`);
}
await page.setViewportSize({width:390,height:844});await goto();await shot('mobile-hero');await native(1);await time(1.5);await shot('mobile-final');
if(!process.env.V63_QUICK){for(let i=0;i<=10;i++){await native(i/10);await shot(`mobile-${i*10}`);}await sharp(await page.screenshot({fullPage:true})).webp().toFile(`${output}/mobile-full-page.webp`);await page.setViewportSize({width:320,height:740});await goto();await shot('narrow');await page.emulateMedia({reducedMotion:'reduce'});await shot('reduced');await page.locator('canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await shot('fallback');}
const names=evidence.map(e=>e.name),cols=3,w=480,h=300;
await sharp({create:{width:w*cols,height:h*Math.ceil(names.length/cols),channels:3,background:'#090c10'}}).composite(await Promise.all(names.map(async(name,i)=>({input:await sharp(`${output}/${name}.webp`).resize(w,h,{fit:'contain',background:'#090c10'}).toBuffer(),left:i%cols*w,top:Math.floor(i/cols)*h})))).webp().toFile(`${output}/sheet.webp`);
await fs.writeFile(`${output}/results.json`,JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceDiff:execFileSync('git',['diff','--','src'],{encoding:'utf8'}),errors,evidence},null,2));await browser.close();console.log(`Captured ${names.length} frames in ${output}; runtime errors ${errors.length}`);
