import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const output=process.env.V5_PROFILE_OUTPUT||'artifacts/decision-theatre-v5/final/profile.json';await fs.mkdir(path.dirname(output),{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const reports=[];
for(const config of [{name:'desktop',viewport:{width:1600,height:1000},deviceScaleFactor:2},{name:'phone-emulation',viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}]){
 const {name,...options}=config;const context=await browser.newContext(options),page=await context.newPage();await page.goto('http://127.0.0.1:4173/en/lab/decision-theatre-v5?debug=1&lock=1&isolate=1',{waitUntil:'networkidle'});await page.waitForSelector('[data-v5][data-mode="webgl"]',{state:'attached'});
 const data=await page.evaluate(async()=>{
  const root=document.querySelector('[data-v5]'),host=document.querySelector('[data-canvas]'),seek=document.querySelector('[data-seek]');const frames=[],deform=[],longTasks=[];const observer=new PerformanceObserver(list=>longTasks.push(...list.getEntries().map(e=>e.duration)));observer.observe({type:'longtask',buffered:false});let previous=0;
  for(let i=0;i<=240;i++){await new Promise(requestAnimationFrame);const now=performance.now();if(previous)frames.push(now-previous);previous=now;seek.value=String(i<=120?i/120:2-i/120);seek.dispatchEvent(new Event('input',{bubbles:true}));deform.push(Number(host.dataset.deformMs));}
  const before=Number(host.dataset.renders);await new Promise(r=>setTimeout(r,700));root.dispatchEvent(new Event('v5-measure'));observer.disconnect();return {framesMs:frames,deformMs:deform,longTasksMs:longTasks,idleRenders:Number(host.dataset.renders)-before,measurement:JSON.parse(root.dataset.measurement)};
 });reports.push({name,...data});await context.close();
}
await browser.close();await fs.writeFile(output,JSON.stringify(reports,null,2));console.log('Saved V5 profile',output);
