import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output = path.resolve('artifacts/decision-theatre-v3');
await fs.mkdir(output, {recursive:true});
const browser = await chromium.launch({
  executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium',
  args:['--no-sandbox','--disable-dev-shm-usage'], headless:true,
});
const base=process.env.PREVIEW_BASE_URL || 'http://127.0.0.1:4173';
const errors=[],captures=[];
function observe(page){
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
}
async function settle(page){
 await page.waitForFunction(()=>{
  const d=document.querySelector('[data-theatre]').dataset;
  return Math.abs(Number(d.progress)-Number(d.targetProgress))<.0001;
 });
 await page.waitForTimeout(350);
}
async function ready(page,route='/en/lab/decision-theatre-v2'){
 observe(page);
 await page.goto(base+route,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('[data-theatre]').dataset.renderMode==='webgl');
 await settle(page);
}
async function seek(page,from,to=from,fraction=0){
 await page.evaluate(({from,to,fraction})=>{
  const anchors=JSON.parse(document.querySelector('[data-theatre]').dataset.anchors);
  window.scrollTo(0,anchors[from]+(anchors[to]-anchors[from])*fraction);
 },{from,to,fraction});
 await settle(page);
}
async function capture(page,name){
 const file=path.join(output,`${name}.png`);
 await page.screenshot({path:file});
 captures.push({name,file});
}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await ready(page);
 await capture(page,'hero-desktop-en');
 for(const [name,from,to,t] of [
  ['hero-to-complexity',0,1,.6],['complexity',1,1,0],['complexity-to-decisions',1,2,.55],
  ['decisions',2,2,0],['alignment-entry',2,3,.3],['alignment-midpoint',2,3,.6],
  ['alignment',3,3,0],['execution-entry',3,4,.55],['execution',4,4,0],['contact',5,5,0],
 ]){await seek(page,from,to,t);await capture(page,name);}
 await seek(page,2,3,.6);await capture(page,'reverse-alignment-midpoint');
 await seek(page,1);await capture(page,'reverse-complexity');
 const renders=await page.locator('[data-theatre]').getAttribute('data-renders');
 await page.waitForTimeout(450);
 const idle=renders===await page.locator('[data-theatre]').getAttribute('data-renders');
 await ready(page,'/lab/decision-theatre-v2');await capture(page,'hero-desktop-pl');
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await ready(phone);await capture(phone,'hero-mobile');
 for(const [name,from,to,t] of [['mobile-first-transition',0,1,.65],['mobile-complexity',1,1,0],['mobile-alignment-transition',2,3,.6],['mobile-execution',4,4,0],['mobile-contact',5,5,0]]){
  await seek(phone,from,to,t);await capture(phone,name);
 }
 const reduced=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await reduced.goto(base+'/en/lab/decision-theatre-v2',{waitUntil:'networkidle'});await capture(reduced,'reduced-motion');
 const fallback=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
 await fallback.goto(base+'/en/lab/decision-theatre-v2');await capture(fallback,'no-javascript');
 await fs.writeFile(path.join(output,'capture-results.json'),JSON.stringify({version:3,date:new Date().toISOString(),errors,idleRenderingStopped:idle,captures:captures.map(c=>path.basename(c.file))},null,2)+'\n');
 const cellW=480,cellH=370,columns=3;
 const tiles=await Promise.all(captures.map(async(c,i)=>{
  const image=await sharp(c.file).resize(cellW,cellH-32,{fit:'contain',background:'#e3e1d8'}).png().toBuffer();
  const label=Buffer.from(`<svg width="${cellW}" height="32"><rect width="100%" height="100%" fill="#253a31"/><text x="12" y="21" fill="#f4f0e7" font-size="13" font-family="Arial">${c.name}</text></svg>`);
  return [{input:label,left:(i%columns)*cellW,top:Math.floor(i/columns)*cellH},{input:image,left:(i%columns)*cellW,top:Math.floor(i/columns)*cellH+32}];
 }));
 await sharp({create:{width:columns*cellW,height:Math.ceil(captures.length/columns)*cellH,channels:3,background:'#e3e1d8'}}).composite(tiles.flat()).png().toFile(path.join(output,'contact-sheet.png'));
 console.log(JSON.stringify({output,captures:captures.length,idleRenderingStopped:idle,errors}));
 if(errors.length||!idle)process.exitCode=1;
}finally{await browser.close();}
