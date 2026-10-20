import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const output=process.env.V6_CAPTURE_OUTPUT||'artifacts/living-architecture-v6/iteration-1';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const ready=()=>page.waitForSelector('[data-v6][data-mode="webgl"]',{state:'attached'});
const seek=async p=>{await page.locator('[data-seek]').evaluate((el,p)=>{el.value=String(p);el.dispatchEvent(new Event('input',{bubbles:true}));},p);};
const time=async t=>{await page.locator('[data-time]').fill(String(t));await page.locator('[data-time]').dispatchEvent('change');};
const shot=async name=>{await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');await sharp(await page.screenshot()).webp({lossless:true}).toFile(`${output}/${name}.webp`);await page.locator('[data-debug]').evaluate(el=>el.style.visibility='');};
const measure=async()=>{await page.dispatchEvent('[data-v6]','v6-measure');return JSON.parse(await page.locator('[data-v6]').getAttribute('data-measurement'));};
const sheet=async(names,name,w,h,cols)=>{const tiles=await Promise.all(names.map(async(n,i)=>({input:await sharp(`${output}/${n}.webp`).resize(w,h).toBuffer(),left:i%cols*w,top:Math.floor(i/cols)*h})));await sharp({create:{width:w*cols,height:h*Math.ceil(names.length/cols),channels:3,background:'#090c10'}}).composite(tiles).webp({lossless:true}).toFile(`${output}/${name}.webp`);};
await page.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6?debug=1&freeze=1&isolate=1');await ready();await page.evaluate(()=>document.fonts.ready);
await seek(1);const candidates=[];
for(const c of ['spine','mesh','cantilever']){await page.locator('[data-candidate]').selectOption(c);await shot(`candidate-${c}`);candidates.push({candidate:c,report:await measure()});}
await sheet(['candidate-spine','candidate-mesh','candidate-cantilever'],'candidates',640,400,3);await page.locator('[data-candidate]').selectOption('spine');
const fixed=[];for(let i=0;i<=10;i++){await seek(i/10);await time(0);await shot(`fixed-${i*10}`);fixed.push(await measure());}
await sheet(Array.from({length:11},(_,i)=>`fixed-${i*10}`),'fixed-camera-sheet',480,300,3);
const micro=[];await seek(1);for(const t of [0,2,5,8]){await time(t);await shot(`life-${t}`);micro.push(await measure());}await sheet([0,2,5,8].map(t=>`life-${t}`),'micro-life-sheet',640,400,2);
const signalsProof=[];
for(const [name,t] of [['initiative',1.5],['collaboration',7.5],['decision',13.5]]){
 await time(t);
 for(const enabled of [false,true]){await page.locator('[data-signals]').setChecked(enabled);await shot(`signal-${name}-${enabled?'on':'off'}`);signalsProof.push({name,enabled,report:await measure()});}
}
await sheet(['initiative','collaboration','decision'].flatMap(name=>[`signal-${name}-off`,`signal-${name}-on`]),'signals-sheet',640,400,2);await page.locator('[data-signals]').check();
// Native progress at all eleven checkpoints; no debug composition overrides.
const editorial={};for(const [device,width,height] of [['desktop',1600,1000],['mobile',390,844]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6?debug=1&freeze=1');await ready();
 const frames=[];for(let i=0;i<=10;i++){
 await page.evaluate(p=>{const a=JSON.parse(document.querySelector('[data-v6]').dataset.landmarks),s=Math.min(3,Math.floor(p*4));scrollTo(0,a[s]+(a[s+1]-a[s])*(p*4-s));},i/10);await page.waitForTimeout(80);
 const name=`${device}-${i*10}`;await shot(name);frames.push(name);
 editorial[name]={report:await measure(),copy:await page.locator('.v6-copy').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}))};
 }
 await sheet(frames,`${device}-sheet`,device==='mobile'?260:480,device==='mobile'?563:300,device==='mobile'?4:3);
 await page.locator('#conversation').scrollIntoViewIfNeeded();await shot(`${device}-cta`);
 await page.locator('[data-debug]').evaluate(el=>el.style.visibility='hidden');await sharp(await page.screenshot({fullPage:true})).webp().toFile(`${output}/${device}-full-page.webp`);
}
await page.setViewportSize({width:320,height:740});await page.goto('http://127.0.0.1:4173/lab/living-architecture-v6?debug=1&freeze=1');await ready();await shot('narrow-polish');
await page.emulateMedia({reducedMotion:'reduce'});await shot('reduced-motion');
const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),staticPage=await staticContext.newPage();await staticPage.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6');await sharp(await staticPage.screenshot()).webp().toFile(`${output}/fallback.webp`);await staticContext.close();
await fs.writeFile(`${output}/results.json`,JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),worktree:execFileSync('git',['status','--porcelain','--','src','scripts','tests','package.json','package-lock.json'],{encoding:'utf8'}).trim()||'clean source',errors,candidates,fixed,micro,signalsProof,editorial},null,2));await browser.close();console.log(`Captured ${output}; runtime errors: ${errors.length}`);
