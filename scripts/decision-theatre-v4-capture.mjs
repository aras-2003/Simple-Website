import {chromium} from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve(process.env.V4_CAPTURE_OUTPUT||'artifacts/decision-theatre-v42/iteration-1');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}),headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const base=process.env.PREVIEW_BASE_URL||'http://127.0.0.1:4173';
const errors=[],captures=[],measurements=[];
async function open(viewport,extras={}){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,...extras});
 page.setDefaultTimeout(90000);
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(base+'/lab/decision-theatre-v4?debug=1',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('[data-v4]').dataset.renderMode==='webgl');
 return page;
}
async function capture(page,name,progress){
 if(progress!==undefined){
  await page.evaluate(p=>{const stops=JSON.parse(document.querySelector('[data-v4]').dataset.landmarks);const n=Math.min(4,Math.floor(p));const t=p>=4?(p-4)/.5:p-n;scrollTo(0,stops[n]+(stops[n+1]-stops[n])*t);},progress);
  await page.waitForTimeout(220);
 }
 await page.evaluate(()=>{document.querySelector('[data-debug]').hidden=true;document.querySelector('[data-v4]').dispatchEvent(new Event('v4-capture'));});
 const file=path.join(output,name+'.webp');
 await sharp(await page.screenshot()).webp({lossless:true}).toFile(file);captures.push({name,file});
 const state=await page.evaluate(()=>({scrollY,progress:document.querySelector('[data-v4-canvas]').dataset.progress,camera:document.querySelector('[data-v4-canvas]').dataset.camera}));
 console.log(name,JSON.stringify(state));
}
try{
 const desktop=await open({width:1600,height:1000});
 const stops=[['hero',0],['hero-exit',.65],['complexity-entry',1],['complexity-midpoint',1.5],['decision-entry',2],['transformation-25',2.25],['transformation-50',2.5],['transformation-75',2.75],['coherence',3],['execution',4],['final-cta',4.5]];
 for(const [name,p] of stops)await capture(desktop,name,p);
 await capture(desktop,'reverse-decision',2.5);
 await capture(desktop,'reverse-hero',0);
 await desktop.evaluate(()=>{const r=document.querySelector('[data-v4]');r.dispatchEvent(new Event('v4-measure'));});
 measurements.push({device:'desktop',...JSON.parse(await desktop.locator('[data-v4]').getAttribute('data-measurement'))});
 await desktop.evaluate(()=>document.querySelector('[data-detail]').click());await capture(desktop,'material-detail');
 const mobile=await open({width:390,height:844},{isMobile:true,hasTouch:true});
 for(const [name,p] of [['mobile-hero',0],['mobile-complexity',1],['mobile-decision',2],['mobile-transformation',2.5],['mobile-coherence',3],['mobile-execution',4],['mobile-cta',4.5]])await capture(mobile,name,p);
 await mobile.evaluate(()=>document.querySelector('[data-v4]').dispatchEvent(new Event('v4-measure')));
 measurements.push({device:'mobile',...JSON.parse(await mobile.locator('[data-v4]').getAttribute('data-measurement'))});
 const narrow=await open({width:320,height:740});await capture(narrow,'narrow-hero',0);
 const reduced=await open({width:1440,height:900},{reducedMotion:'reduce'});await capture(reduced,'reduced-motion',2);
 const tileW=480,tileH=330,cols=3;
 const layers=await Promise.all(captures.map(async(c,i)=>[
 {input:await sharp(c.file).resize(tileW,tileH-25,{fit:'contain',background:'#090d12'}).png().toBuffer(),left:i%cols*tileW,top:Math.floor(i/cols)*tileH+25},
 {input:Buffer.from(`<svg width="${tileW}" height="25"><rect width="100%" height="100%" fill="#202a33"/><text x="10" y="17" fill="#eee9df" font-family="Arial" font-size="11">${c.name}</text></svg>`),left:i%cols*tileW,top:Math.floor(i/cols)*tileH},
 ]));
 await sharp({create:{width:cols*tileW,height:Math.ceil(captures.length/cols)*tileH,channels:3,background:'#090d12'}}).composite(layers.flat()).webp({lossless:true}).toFile(path.join(output,'contact-sheet.webp'));
 await fs.writeFile(path.join(output,'results.json'),JSON.stringify({date:new Date().toISOString(),errors,measurements,captures:captures.map(c=>c.name)},null,2)+'\n');
 console.log(JSON.stringify({output,count:captures.length,errors,measurements}));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}
