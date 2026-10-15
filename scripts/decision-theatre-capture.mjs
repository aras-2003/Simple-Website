import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output = path.resolve('artifacts/decision-theatre');
await fs.mkdir(output, {recursive:true});
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium',
  args:['--no-sandbox','--disable-dev-shm-usage'], headless:true,
});
const base = process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:4173';
const errors=[];
const captures=[];
const page = await browser.newPage({viewport:{width:1440,height:1000}, deviceScaleFactor:1});
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
async function capture(page,name){
 const file=path.join(output,`${name}.png`);
 await page.screenshot({path:file});
 captures.push({name,file});
}
async function ready(page,route='/en/lab/decision-theatre-v2'){
 await page.goto(base+route,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('[data-theatre]')?.getAttribute('data-render-mode')==='webgl');
 await page.evaluate(()=>document.fonts.ready);
}
async function seek(page,p){
 await page.evaluate(p=>{
  const el=document.querySelector('[data-theatre]');
  const start=window.scrollY+el.getBoundingClientRect().top;
  window.scrollTo(0,start+(el.offsetHeight-innerHeight)*(.14+p*.86));
 },p);
 await page.waitForFunction(p=>Math.abs(Number(document.querySelector('[data-theatre]').getAttribute('data-progress'))-p)<.002,p);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
try{
 await ready(page);
 await capture(page,'hero-desktop-en');
 for(const percent of [0,25,50,75,100]){
  await seek(page,percent/100);
  await capture(page,`transformation-${String(percent).padStart(3,'0')}`);
 }
 const finalHash=await page.locator('[data-theatre]').getAttribute('data-renders');
 await page.waitForTimeout(400);
 const idleHash=await page.locator('[data-theatre]').getAttribute('data-renders');
 console.log('Idle rendering stopped:',finalHash===idleHash);
 for(const p of [0.75,0.5,0.25,0])await seek(page,p);
 await capture(page,'reverse-000');
 await page.locator('.dt-cta').scrollIntoViewIfNeeded();
 await capture(page,'final-cta');
 await ready(page,'/lab/decision-theatre-v2');
 await capture(page,'hero-desktop-pl');
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await ready(mobile);
 await capture(mobile,'hero-mobile');
 for(const p of [0,0.5,1]){await seek(mobile,p);await capture(mobile,`mobile-${p*100}`);}
 const reduced=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await reduced.goto(base+'/en/lab/decision-theatre-v2',{waitUntil:'networkidle'});
 await capture(reduced,'reduced-motion');
 const fallback=await browser.newPage({viewport:{width:1440,height:1000}});
 await fallback.addInitScript(()=>{const getContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl2'||type==='webgl')return null;return getContext.call(this,type,...args);};});
 await fallback.goto(base+'/en/lab/decision-theatre-v2',{waitUntil:'networkidle'});
 await capture(fallback,'webgl-fallback');
 await fs.writeFile(path.join(output,'capture-results.json'),JSON.stringify({date:new Date().toISOString(),errors,idleRenderingStopped:finalHash===idleHash,captures:captures.map(c=>path.basename(c.file))},null,2));
 // A labeled, inspectable sheet. Original captures remain full resolution.
 const cellW=480,cellH=370,columns=3;
 const tiles=await Promise.all(captures.map(async(c,i)=>{
  const image=await sharp(c.file).resize(cellW,cellH-32,{fit:'contain',background:'#e3e1d8'}).png().toBuffer();
  const label=Buffer.from(`<svg width="${cellW}" height="32"><rect width="100%" height="100%" fill="#253a31"/><text x="12" y="21" fill="#f4f0e7" font-size="13" font-family="Arial">${c.name}</text></svg>`);
  return [{input:label,left:(i%columns)*cellW,top:Math.floor(i/columns)*cellH},{input:image,left:(i%columns)*cellW,top:Math.floor(i/columns)*cellH+32}];
 }));
 await sharp({create:{width:columns*cellW,height:Math.ceil(captures.length/columns)*cellH,channels:3,background:'#e3e1d8'}}).composite(tiles.flat()).png().toFile(path.join(output,'contact-sheet.png'));
 console.log(JSON.stringify({output,captures:captures.length,errors}));
 if(errors.length)process.exitCode=1;
}finally{await browser.close()}
