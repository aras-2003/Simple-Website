/** Compose actual browser captures only. No synthesized or retouched sculpture. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const captures=process.env.V7_CAPTURE_OUTPUT||'artifacts/living-architecture-v7/final';
const output=process.env.V7_EVIDENCE_OUTPUT||'docs/lab/living-architecture-v7/evidence';
const references=process.env.V7_REFERENCE_DIR;
await fs.mkdir(output,{recursive:true});
const label=(text,width=600)=>Buffer.from(`<svg width="${width}" height="48" xmlns="http://www.w3.org/2000/svg"><text x="24" y="30" fill="#d4dcd8" font-size="15" font-family="sans-serif">${text}</text></svg>`);
const sculpture=async(file,crop)=>sharp(file).extract(crop).resize(600,590,{fit:'contain',background:'#0a1013'}).webp({quality:92}).toBuffer();
const crop={left:590,top:130,width:850,height:820};
const pieces=[];
for(const [i,view] of ['primary','reverse','side'].entries()){
 await sharp(`${captures}/${view}.png`).webp({quality:92}).toFile(`${output}/${view}.webp`);
 pieces.push({input:await sculpture(`${captures}/${view}-clean.png`,crop),left:i*600,top:48},{input:label(['01 / GŁÓWNY KADR','02 / OD TYŁU','03 / Z BOKU'][i]),left:i*600,top:0});
}
await sharp({create:{width:1800,height:650,channels:3,background:'#0a1013'}}).composite(pieces).webp({quality:92}).toFile(`${output}/three-views.webp`);
await sharp(`${captures}/mobile.png`).webp({quality:92}).toFile(`${output}/mobile.webp`);
const report=JSON.parse(await fs.readFile(`${captures}/render-report.json`,'utf8'));
await fs.writeFile(`${output}/render-report.json`,JSON.stringify(report,null,2)+'\n');
if(references){
 const old=await sculpture(path.join(references,'05_CURRENT_FINAL.png'),{left:680,top:125,width:920,height:825});
 const current=await sculpture(`${captures}/primary-clean.png`,crop);
 await sharp({create:{width:1200,height:650,channels:3,background:'#0a1013'}}).composite([{input:label('V6.4 / FINAŁ Z PAKIETU'),left:0,top:0},{input:old,left:0,top:48},{input:label('V7 / RZECZYWISTY RENDER'),left:600,top:0},{input:current,left:600,top:48}]).webp({quality:92}).toFile(`${output}/old-new.webp`);
 const inspiration=await sharp(path.join(references,'01_TARGET_REFERENCE.jpg')).resize(600,590,{fit:'contain',background:'#0a1013'}).toBuffer();
 // Keep the owner's external inspiration in local artifacts, outside the tracked site/repository.
 await sharp({create:{width:1800,height:650,channels:3,background:'#0a1013'}}).composite([{input:label('INSPIRACJA / PAKIET WŁAŚCICIELA'),left:0,top:0},{input:inspiration,left:0,top:48},{input:label('V6.4 / FINAŁ Z PAKIETU'),left:600,top:0},{input:old,left:600,top:48},{input:label('V7 / RZECZYWISTY RENDER'),left:1200,top:0},{input:current,left:1200,top:48}]).webp({quality:92}).toFile(`${captures}/inspiration-old-new.webp`);
}
const sources=['src/scripts/lab/v7/model.ts','src/scripts/lab/v7/world.ts','src/scripts/lab/v7/study.ts','src/styles/lab/v7/living-architecture.css','src/components/lab/LivingArchitectureV7Page.astro'];
const hashes={};for(const file of sources)hashes[file]=createHash('sha256').update(await fs.readFile(file)).digest('hex');
const evidence={};for(const file of (await fs.readdir(output)).filter(f=>/webp$/.test(f)))evidence[file]=createHash('sha256').update(await fs.readFile(`${output}/${file}`)).digest('hex');
await fs.writeFile(`${output}/manifest.json`,JSON.stringify({created:new Date().toISOString(),source:'Real headless Chrome / local Astro preview',viewport:[1600,1000],mobileViewport:[390,844],treatment:'Screenshots encoded as WebP. Contact sheets use additional captures with UI hidden (same canvas/camera), crop and resize uniformly; no model retouch, relighting or generated image.',sources:hashes,evidence},null,2)+'\n');
console.log(`Evidence: ${output}`);
