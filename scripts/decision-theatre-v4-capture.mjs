import {chromium} from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve('artifacts/decision-theatre-v4');await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
const base=process.env.PREVIEW_BASE_URL||'http://127.0.0.1:4173';const errors=[],captures=[],measurements=[];
const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
async function raw(page,name){
 const url=await page.evaluate(()=>{document.querySelector('[data-v4]').dispatchEvent(new Event('v4-capture'));return document.querySelector('canvas').toDataURL('image/png')});
 const file=path.join(output,`${name}.png`);await fs.writeFile(file,Buffer.from(url.split(',')[1],'base64'));captures.push({name,file});
}
async function ready(page,query=''){
 await page.goto(base+'/lab/decision-theatre-v4'+query,{waitUntil:'networkidle',timeout:90000});
 await page.waitForFunction(()=>document.querySelector('[data-v4]').dataset.renderMode==='webgl',{},{timeout:90000});
}
try{
 await ready(page);
 for(const candidate of ['incision','compression']){
  await page.selectOption('select[data-candidate]',candidate);
  for(const frame of ['complexity','transformation','coherence']){
   await page.locator(`button[data-frame="${frame}"]`).click();await raw(page,`${candidate}-${frame}-studio`);
  }
 }
 await page.selectOption('select[data-candidate]','incision');await page.locator('button[data-frame="complexity"]').click();
 for(const quality of ['direct','studio']){
  const study=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1});
  await ready(study,'?quality='+quality);await raw(study,`lighting-${quality}`);
  const measurement=await study.evaluate(()=>{const root=document.querySelector('[data-v4]');root.dispatchEvent(new Event('v4-measure'));return JSON.parse(root.dataset.measurement)});
  measurements.push(measurement);await study.close();
 }
 await page.selectOption('select[data-camera]','detail');await raw(page,'material-detail');
 await page.selectOption('select[data-camera]','wide');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,'desktop-ui.png')});captures.push({name:'desktop-ui',file:path.join(output,'desktop-ui.png')});
 const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 phone.on('pageerror',e=>errors.push(e.message));
 await ready(phone);await phone.screenshot({path:path.join(output,'mobile-ui.png')});captures.push({name:'mobile-ui',file:path.join(output,'mobile-ui.png')});await raw(phone,'mobile-render');
 await fs.writeFile(path.join(output,'results.json'),JSON.stringify({date:new Date().toISOString(),errors,measurements,captures:captures.map(c=>path.basename(c.file))},null,2)+'\n');
 const width=600,height=420,columns=3;
 const layers=await Promise.all(captures.map(async(c,i)=>{
  const tile=await sharp(c.file).resize(width,height-30,{fit:'contain',background:'#10151b'}).png().toBuffer();
  const label=Buffer.from(`<svg width="${width}" height="30"><rect width="100%" height="100%" fill="#202a33"/><text x="12" y="20" fill="#eee9df" font-family="Arial" font-size="13">${c.name}</text></svg>`);
  return [{input:label,left:i%columns*width,top:Math.floor(i/columns)*height},{input:tile,left:i%columns*width,top:Math.floor(i/columns)*height+30}];
 }));
 await sharp({create:{width:columns*width,height:Math.ceil(captures.length/columns)*height,channels:3,background:'#10151b'}}).composite(layers.flat()).png().toFile(path.join(output,'contact-sheet.png'));
 console.log(JSON.stringify({output,count:captures.length,errors,measurements}));if(errors.length)process.exitCode=1;
}finally{await browser.close();}
