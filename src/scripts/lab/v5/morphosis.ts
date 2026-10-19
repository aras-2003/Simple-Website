import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {createWorld} from './world';

gsap.registerPlugin(ScrollTrigger);
const root=document.querySelector<HTMLElement>('[data-v5]');
if(root){
 const host=root.querySelector<HTMLElement>('[data-canvas]')!;
 const debug=root.querySelector<HTMLElement>('[data-debug]')!,status=root.querySelector<HTMLElement>('[data-status]')!;
 const seek=root.querySelector<HTMLInputElement>('[data-seek]')!,lock=root.querySelector<HTMLInputElement>('[data-lock]')!,isolate=root.querySelector<HTMLInputElement>('[data-isolate]')!;
 const params=new URLSearchParams(location.search),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 debug.hidden=params.get('debug')!=='1';
 lock.checked=!debug.hidden&&params.get('lock')==='1';isolate.checked=!debug.hidden&&params.get('isolate')==='1';root.classList.toggle('v5-isolate',isolate.checked);
 let world:ReturnType<typeof createWorld>|undefined,alive=true,manual=false,detail=false,last=-1,lastTail=-1;
 let timeline:gsap.core.Timeline|undefined,trigger:ScrollTrigger|undefined;
 const playhead={value:0,tail:0};
 function draw(){
  if(!world||manual||document.hidden)return;
  const p=reduced.matches?0:playhead.value,tail=reduced.matches?0:playhead.tail;
  if(Math.abs(last-p)<.000001&&Math.abs(lastTail-tail)<.000001)return;
  last=p;lastTail=tail;world.setProgress(p,tail);root!.dataset['progress']=String(p);
 }
 function measure(){
  if(!world||!alive)return;
  trigger?.kill();timeline?.kill();
  const offsets=Array.from(root!.querySelectorAll<HTMLElement>('[data-act]')).map((el,i)=>i===0?0:Math.max(1,el.getBoundingClientRect().top+scrollY-(innerWidth<=650?0:innerHeight*.16)));
  playhead.value=0;playhead.tail=0;timeline=gsap.timeline({paused:true,onUpdate:draw});
  for(let i=1;i<offsets.length;i++)timeline.to(playhead,{value:i/4,duration:Math.max(1,offsets[i]!-offsets[i-1]!),ease:'none'});
  const contact=root!.querySelector<HTMLElement>('#conversation')!;
  const end=Math.max(offsets[4]!+1,contact.getBoundingClientRect().top+scrollY-(innerWidth<=650?0:innerHeight*.16));
  timeline.to(playhead,{value:1,tail:1,duration:end-offsets[4]!,ease:'none'});
  root!.dataset['landmarks']=JSON.stringify([...offsets,end]);
  const synchronize=()=>{timeline?.totalTime(Math.max(0,Math.min(end,scrollY)),false);last=-1;draw();};
  trigger=ScrollTrigger.create({start:0,end,animation:timeline,scrub:true,invalidateOnRefresh:true,onRefresh:synchronize});
  trigger.refresh();trigger.update();synchronize();
 }
 function fallback(){
  trigger?.kill();timeline?.kill();world?.dispose();world=undefined;
  root!.classList.remove('v5-ready');root!.dataset['mode']='fallback';
 }
 const seekChange=()=>{if(!world)return;manual=true;detail=false;world.setDetail(false);const p=reduced.matches?0:Number(seek.value);world.setProgress(p);root!.dataset['progress']=String(p);};
 seek.addEventListener('input',seekChange);
 lock.addEventListener('change',()=>world?.setCameraLocked(lock.checked));
 isolate.addEventListener('change',()=>root!.classList.toggle('v5-isolate',isolate.checked));
 root.querySelector('[data-detail]')!.addEventListener('click',()=>{detail=!detail;world?.setDetail(detail);});
 root.querySelector('[data-resume]')!.addEventListener('click',()=>{manual=false;detail=false;world?.setDetail(false);last=-1;draw();});
 const diagnose=()=>{if(world)root!.dataset['measurement']=JSON.stringify(world.measure());};
 if(!debug.hidden)root.addEventListener('v5-measure',diagnose);
 host.addEventListener('v5-context-lost',fallback);
 void import('./world').then(({createWorld})=>{
  if(!alive)return;
  world=createWorld(host);world.setCameraLocked(lock.checked);world.setProgress(0);
  root!.classList.add('v5-ready');root!.dataset['mode']='webgl';
  status.textContent='Persistent structural bands · one topology · reversible normalized progress';
  measure();void document.fonts.ready.then(()=>{if(alive)measure();});
 }).catch(fallback);
 let resizeTimer:ReturnType<typeof setTimeout>;
 const resize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,140);};
 const restore=()=>{if(!document.hidden)measure();};
 const motion=()=>{manual=false;last=-1;draw();};
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',restore);reduced.addEventListener('change',motion);
 window.addEventListener('pagehide',()=>{alive=false;clearTimeout(resizeTimer);trigger?.kill();timeline?.kill();world?.dispose();host.removeEventListener('v5-context-lost',fallback);root!.removeEventListener('v5-measure',diagnose);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',restore);reduced.removeEventListener('change',motion);},{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}
