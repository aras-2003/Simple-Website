import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const output=process.env.V7_CAPTURE_OUTPUT||'artifacts/living-architecture-v7/iteration-1';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});const errors=[],warnings=[],reports={};page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))warnings.push(m.text());});
for(const view of ['primary','reverse','side']){
 await page.goto(`http://127.0.0.1:4173/lab/living-architecture-v7?view=${view}`);await page.waitForSelector('[data-v7][data-mode="webgl"]',{state:'attached'});await page.screenshot({path:`${output}/${view}.png`});const clean=await page.addStyleTag({content:'.v7-copy,.v7-tools,.v7-header,footer{visibility:hidden!important}'});await page.screenshot({path:`${output}/${view}-clean.png`});await clean.evaluate(el=>el.remove());reports[view]=JSON.parse(await page.locator('[data-canvas]').getAttribute('data-report'));
}
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/lab/living-architecture-v7');await page.waitForSelector('[data-mode="webgl"]',{state:'attached'});await page.screenshot({path:`${output}/mobile.png`,fullPage:true});
await fs.writeFile(`${output}/render-report.json`,JSON.stringify({errors,warnings,reports},null,2));await browser.close();console.log(JSON.stringify({output,errors,warnings}));
