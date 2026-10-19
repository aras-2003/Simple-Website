import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const output=path.resolve(process.env.V4_PROFILE_OUTPUT||'artifacts/decision-theatre-v42/profile.json');
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox','--enable-unsafe-swiftshader']});
const results=[];
try{
  for(const [device,viewport] of [['desktop',{width:1600,height:1000}],['mobile-emulation',{width:390,height:844}]]){
    // Exercise the shipping 1.5 / 1.25 backing-buffer caps, not just DPR-1 captures.
    const requestedDpr=device==='desktop'?2:3;
    const page=await browser.newPage({viewport,deviceScaleFactor:requestedDpr,isMobile:device!=='desktop',hasTouch:device!=='desktop'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto((process.env.PREVIEW_BASE_URL||'http://127.0.0.1:4173')+'/lab/decision-theatre-v4',{waitUntil:'networkidle',timeout:90000});
    await page.waitForFunction(()=>document.querySelector('[data-v4]')?.dataset.landmarks,undefined,{timeout:90000});
    const profile=await page.evaluate(async()=>{
      const root=document.querySelector('[data-v4]'),host=document.querySelector('[data-v4-canvas]');
      const gl=host.querySelector('canvas').getContext('webgl2');
      const debug=gl.getExtension('WEBGL_debug_renderer_info');
      const renderer=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):'unavailable';
      const heap=()=>performance.memory?.usedJSHeapSize??null;
      const before=heap(),frames=[],longTasks=[],progressSamples=[];
      const initialRenders=Number(host.dataset.renders);
      const observer=new PerformanceObserver(list=>longTasks.push(...list.getEntries().map(e=>({startMs:e.startTime,durationMs:e.duration}))));
      if(PerformanceObserver.supportedEntryTypes.includes('longtask'))observer.observe({type:'longtask'});
      const end=document.documentElement.scrollHeight-innerHeight;
      let previous;
      for(let i=0;i<360;i++){
        const time=await new Promise(resolve=>requestAnimationFrame(resolve));
        if(previous!==undefined)frames.push(time-previous);
        previous=time;
        progressSamples.push(Number(host.dataset.progress));
        // One complete forward/reverse sweep and another to expose allocation growth.
        const t=(i%180)/179;scrollTo(0,end*(t<=.5?t*2:(1-t)*2));
      }
      await new Promise(resolve=>setTimeout(resolve,300));
      const rendersBefore=Number(host.dataset.renders);
      await new Promise(resolve=>setTimeout(resolve,700));
      const idleRenders=Number(host.dataset.renders)-rendersBefore;
      observer.disconnect();
      root.dispatchEvent(new Event('v4-measure'));
      const initialScene=JSON.parse(root.dataset.measurement),timingsByScene=[];
      const stops=JSON.parse(root.dataset.landmarks);
      for(const progress of [1,1.5,2,2.5,3,4.5]){
        const stage=Math.min(4,Math.floor(progress)),t=progress>=4?(progress-4)/.5:progress-stage;
        scrollTo(0,stops[stage]+(stops[stage+1]-stops[stage])*t);
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        root.dispatchEvent(new Event('v4-measure'));
        timingsByScene.push({progress,measurement:JSON.parse(root.dataset.measurement)});
      }
      const sorted=[...frames].sort((a,b)=>a-b),percentile=p=>sorted[Math.floor((sorted.length-1)*p)];
      return {renderer,scrollCoverage:{minProgress:Math.min(...progressSamples),maxProgress:Math.max(...progressSamples),sceneRenders:rendersBefore-initialRenders},rafFrameIntervalsMs:{samples:frames.length,median:percentile(.5),p95:percentile(.95),max:sorted.at(-1),over32:frames.filter(v=>v>32).length,over50:frames.filter(v=>v>50).length},longTasks,heapBytes:{before,after:heap(),note:'Unforced GC; Chromium-only diagnostic, not retained memory or a leak proof.'},idleRenders,scene:initialScene,timingsByScene};
    });
    results.push({device,viewport,requestedDpr,errors,...profile});
    await page.close();
  }
  await fs.mkdir(path.dirname(output),{recursive:true});
  await fs.writeFile(output,JSON.stringify({date:new Date().toISOString(),method:'360 native rAF scroll requests, two forward/reverse sweeps per emulated viewport; software rendering is functional evidence only.',results},null,2)+'\n');
  console.log(JSON.stringify({output,results}));
}finally{await browser.close();}
