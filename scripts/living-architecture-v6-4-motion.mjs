import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const output=process.env.V64_MOTION_OUTPUT||'artifacts/living-architecture-v6-4';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1}),page=await context.newPage();
const framesDir=`${output}/screencast-frames`;await fs.mkdir(framesDir,{recursive:true});
const cdp=await context.newCDPSession(page),frames=[],pending=new Set(),errors=[],frameErrors=[];
page.on('pageerror',error=>errors.push(error.message));
const onFrame=frame=>{
 const name=`frame-${String(frames.length).padStart(5,'0')}.jpg`;
 frames.push({name,timestamp:frame.metadata.timestamp});
 const write=fs.writeFile(`${framesDir}/${name}`,Buffer.from(frame.data,'base64')).then(()=>cdp.send('Page.screencastFrameAck',{sessionId:frame.sessionId})).catch(error=>frameErrors.push(error.message));
 pending.add(write);void write.then(()=>pending.delete(write));
};
cdp.on('Page.screencastFrame',onFrame);
await cdp.send('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:1280,maxHeight:800,everyNthFrame:1});
await page.goto('http://127.0.0.1:4173/lab/living-architecture-v6-4');await page.waitForSelector('[data-v64][data-mode="webgl"]',{state:'attached'});
await page.evaluate(async()=>{
 const marks=JSON.parse(document.querySelector('[data-v64]').dataset.landmarks);
 const hold=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 await hold(3500);
 for(const p of [.25,.5,.75,1]){
  const from=scrollY,to=marks[Math.round(p*4)],start=performance.now();
  while(performance.now()-start<1800){await new Promise(requestAnimationFrame);const u=Math.min(1,(performance.now()-start)/1800);scrollTo(0,from+(to-from)*u);}
  scrollTo(0,to);await hold(5200);
 }
 document.querySelector('[data-rear]').click();await hold(2600);document.querySelector('[data-rear]').click();await hold(1400);
 const start=performance.now(),from=scrollY;
 while(performance.now()-start<4000){await new Promise(requestAnimationFrame);scrollTo(0,from*(1-Math.min(1,(performance.now()-start)/4000)));}
});
await cdp.send('Page.stopScreencast');cdp.off('Page.screencastFrame',onFrame);await Promise.all(pending);await context.close();await browser.close();
if(frames.length<10)throw new Error('Screencast produced insufficient frames');
const concat=frames.map((frame,i)=>`file 'screencast-frames/${frame.name}'\nduration ${Math.max(.001,(frames[i+1]?.timestamp??frame.timestamp+1/30)-frame.timestamp)}`).join('\n')+`\nfile 'screencast-frames/${frames.at(-1).name}'\n`;
await fs.writeFile(`${output}/frames.txt`,concat);
execFileSync(process.env.FFMPEG_PATH||'ffmpeg',['-y','-f','concat','-safe','0','-i',path.resolve(output,'frames.txt'),'-an','-vf','scale=1280:800:force_original_aspect_ratio=decrease,pad=1280:800:(ow-iw)/2:(oh-ih)/2','-c:v','libx264','-preset','fast','-crf','24','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',path.resolve(output,'morph-life-native-scroll.mp4')],{stdio:'pipe'});
const bytes=(await fs.stat(`${output}/morph-life-native-scroll.mp4`)).size;if(bytes<1000)throw new Error('Encoded recording is empty');
await fs.writeFile(`${output}/motion.json`,JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),method:'Actual Chrome CDP screencast frames with captured timestamps; instrumented recording, not a performance benchmark.',frames:frames.length,bytes,errors,frameErrors},null,2));
console.log(`Saved ${frames.length} screencast frames and ${bytes} encoded bytes to ${output}`);
