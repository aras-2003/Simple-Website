import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {createWorld} from './world';

gsap.registerPlugin(ScrollTrigger);
const root=document.querySelector<HTMLElement>('[data-v4]');
if(root){
  const host=root.querySelector<HTMLElement>('[data-v4-canvas]')!;
  const debug=root.querySelector<HTMLElement>('[data-debug]')!;
  const status=root.querySelector<HTMLElement>('[data-status]')!;
  const seek=root.querySelector<HTMLInputElement>('[data-seek]')!;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  debug.hidden=new URLSearchParams(location.search).get('debug')!=='1';
  let world:ReturnType<typeof createWorld>|undefined;
  let alive=true,manual=false,detail=false;
  let timeline:gsap.core.Timeline|undefined;
  let trigger:ScrollTrigger|undefined;
  const playhead={value:0};
  let last=-1;
  const draw=()=>{
    if(!world||manual||document.hidden)return;
    const value=reduced.matches?0:playhead.value;
    if(Math.abs(value-last)<.00001)return;
    last=value;world.setProgress(value);
    root.dataset['progress']=value.toFixed(5);
  };
  const measure=()=>{
    if(!alive||!world)return;
    trigger?.kill();timeline?.kill();
    // All durations come from real editorial section geometry; no pin/spacer or text swaps.
    const sections=Array.from(root.querySelectorAll<HTMLElement>('[data-act]'));
    const offsets=sections.map((section,i)=>i===0?0:Math.max(1,section.getBoundingClientRect().top+scrollY-innerHeight*.16));
    const end=Math.max(offsets[4]!+1,document.documentElement.scrollHeight-innerHeight);
    offsets.push(end);
    playhead.value=0;
    timeline=gsap.timeline({paused:true,onUpdate:draw});
    for(let i=1;i<offsets.length;i++)timeline.to(playhead,{value:i===5?4.5:i,duration:Math.max(1,offsets[i]!-offsets[i-1]!),ease:'none'});
    root.dataset['landmarks']=JSON.stringify(offsets);
    const synchronize=()=>{
      // A rebuilt paused timeline starts at zero even when ScrollTrigger's cached
      // scroll position has not changed. Seek explicitly on refresh/restoration.
      timeline?.totalTime(Math.max(0,Math.min(end,window.scrollY)),false);
      last=-1;draw();
    };
    trigger=ScrollTrigger.create({start:0,end,animation:timeline,scrub:true,invalidateOnRefresh:true,onRefresh:synchronize});
    trigger.refresh();trigger.update();synchronize();
  };
  const fallback=()=>{
    trigger?.kill();timeline?.kill();world?.dispose();world=undefined;
    root.classList.remove('v4-ready');root.dataset['renderMode']='fallback';
    status.textContent='WebGL unavailable. The illustration, narrative and contact links remain available.';
  };
  host.addEventListener('v4-context-lost',fallback);
  root.addEventListener('v4-capture',()=>{if(world){if(manual){if(detail)world.setStudy({frame:'coherence',candidate:'incision',quality:'studio',detail:true});else world.setProgress(Number(seek.value));}else{last=-1;draw();}}});
  root.addEventListener('v4-measure',()=>{if(world)root.dataset['measurement']=JSON.stringify(world.measure());});
  seek.addEventListener('input',()=>{manual=true;detail=false;world?.setProgress(Number(seek.value));});
  root.querySelector('[data-resume]')!.addEventListener('click',()=>{manual=false;last=-1;draw();});
  root.querySelector('[data-detail]')!.addEventListener('click',()=>{manual=true;detail=true;world?.setStudy({frame:'coherence',candidate:'incision',quality:'studio',detail:true});});
  void import('./world').then(({createWorld})=>{
    if(!alive)return;
    world=createWorld(host);world.setProgress(0);
    root.classList.add('v4-ready');root.dataset['renderMode']='webgl';
    root.dataset['objectIds']=JSON.stringify(world.objectIds);
    status.textContent='One continuous scene. Native document scroll. Six persistent objects.';
    measure();
    void document.fonts.ready.then(()=>{if(alive)measure();});
  }).catch(fallback);
  let resizeTimer:ReturnType<typeof setTimeout>;
  const resize=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,180);};
  const restore=()=>{if(!document.hidden){last=-1;measure();}};
  const motion=()=>{manual=false;last=-1;draw();};
  window.addEventListener('resize',resize);
  document.addEventListener('visibilitychange',restore);
  reduced.addEventListener('change',motion);
  window.addEventListener('pagehide',()=>{
    alive=false;clearTimeout(resizeTimer);trigger?.kill();timeline?.kill();world?.dispose();
    window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',restore);reduced.removeEventListener('change',motion);
  });
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}
