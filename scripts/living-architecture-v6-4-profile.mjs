import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const output=process.env.V64_PROFILE_OUTPUT||'artifacts/living-architecture-v6-4/profile.json';await fs.mkdir(output.slice(0,output.lastIndexOf('/')),{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const observations=[];
for(const [name,width,height,dpr] of [['desktop',1600,1000,2],['phone-emulation',390,844,3]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr});await page.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6-4?debug=1&freeze=1&isolate=1');await page.waitForSelector('[data-v64][data-mode="webgl"]',{state:'attached'});
 const result=await page.evaluate(async()=>{
 const root=document.querySelector('[data-v64]'),seek=document.querySelector('[data-seek]'),time=document.querySelector('[data-time]');
 const measure=()=>{root.dispatchEvent(new Event('v6-measure'));return JSON.parse(root.dataset.measurement);};
 const frameIntervals=[],updates=[],submissions=[],longTasks=[];let prev=0;
 const observer=new PerformanceObserver(list=>list.getEntries().forEach(e=>longTasks.push(e.duration)));try{observer.observe({type:'longtask',buffered:false});}catch{}
 for(let i=0;i<=180;i++){await new Promise(requestAnimationFrame);const stamp=performance.now();if(prev)frameIntervals.push(stamp-prev);prev=stamp;seek.value=String(i<=90?i/90:2-i/90);seek.dispatchEvent(new Event('input'));const r=measure();updates.push(r.updateMs);submissions.push(r.submitMs);}
 seek.value='1';seek.dispatchEvent(new Event('input'));const before=measure();
 document.querySelector('[data-freeze]').checked=false;document.querySelector('[data-freeze]').dispatchEvent(new Event('change'));
 await new Promise(resolve=>setTimeout(resolve,1800));const live=measure();
 document.querySelector('[data-motion]').click();const stopped=measure();await new Promise(resolve=>setTimeout(resolve,400));const idle=measure();
 observer.disconnect();return {fixed:before,live:live,idleExtraDraws:idle.draws-stopped.draws,liveDraws:live.draws-before.draws,frameIntervals,updates,submissions,longTasks};
 });observations.push({name,viewport:[width,height],inputDPR:dpr,...result});await page.close();
}
await fs.writeFile(output,JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),note:'Local ANGLE renderer reported below. CPU submission excludes GPU completion; phone is desktop emulation. No recording/capture browser should run concurrently.',observations},null,2));await browser.close();console.log(`Wrote ${output}`);
