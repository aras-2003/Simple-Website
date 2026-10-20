import type {Page} from '@playwright/test';
/** Actual touch events, rather than Chromium's platform-dependent synthesized gesture helper. */
export async function swipeDocument(page:Page){
 const cdp=await page.context().newCDPSession(page);
 try{
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:620,id:1}]});
  for(let step=1;step<=12;step++){
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:620-step*35,id:1}]});
   await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }finally{await cdp.detach();}
}
