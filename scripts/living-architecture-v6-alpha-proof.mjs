import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const output=process.env.V6_ALPHA_OUTPUT||'artifacts/living-architecture-v6/alpha-proof.json';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const reports=[];
for(const [name,width,height] of [['desktop',1600,1000],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});await page.goto('http://127.0.0.1:4173/en/lab/living-architecture-v6?debug=1&freeze=1&isolate=1');await page.waitForSelector('[data-v6][data-mode="webgl"]',{state:'attached'});
 const states=await page.evaluate(()=>{
 const input=document.querySelector('[data-seek]'),time=document.querySelector('[data-time]'),canvas=document.querySelector('canvas'),buffer=document.createElement('canvas');buffer.width=canvas.width;buffer.height=canvas.height;const ctx=buffer.getContext('2d',{willReadFrequently:true});
 const values=[];
 for(let i=0;i<=10;i++){
 input.value=String(i/10);input.dispatchEvent(new Event('input'));time.value='.00001';time.dispatchEvent(new Event('change'));time.value='0';time.dispatchEvent(new Event('change'));
 ctx.clearRect(0,0,buffer.width,buffer.height);ctx.drawImage(canvas,0,0);const pixels=ctx.getImageData(0,0,buffer.width,buffer.height).data;
 let count=0,xsum=0,ysum=0,minX=buffer.width,maxX=0,minY=buffer.height,maxY=0;
 for(let y=0;y<buffer.height;y++)for(let x=0;x<buffer.width;x++){if(pixels[(y*buffer.width+x)*4+3]>100){count++;xsum+=x;ysum+=y;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
 document.querySelector('[data-v6]').dispatchEvent(new Event('v6-measure'));
 values.push({progress:i/10,pixels:count,alphaCentroid:[xsum/count/buffer.width,ysum/count/buffer.height],alphaBounds:[minX/buffer.width,minY/buffer.height,maxX/buffer.width,maxY/buffer.height],moduleReport:JSON.parse(document.querySelector('[data-v6]').dataset.measurement)});
 }return values;
 });reports.push({name,viewport:[width,height],states});await page.close();
}
await fs.writeFile(output,JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),method:'Same-task canvas alpha readback at each fixed-camera pose; CSS reading windows disabled. Centroid is opaque pixel area, distinct from the projected persistent-module mass anchor.',reports},null,2));await browser.close();console.log(`Wrote ${output}`);
