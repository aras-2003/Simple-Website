import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type {Candidate} from './model';
import type {createWorld} from './world';
gsap.registerPlugin(ScrollTrigger);
const root=document.querySelector<HTMLElement>('[data-v6]');
if(root){
 const host=root.querySelector<HTMLElement>('[data-canvas]')!,debug=root.querySelector<HTMLElement>('[data-debug]')!,stats=root.querySelector<HTMLElement>('[data-stats]')!,motion=root.querySelector<HTMLButtonElement>('[data-motion]')!;
 const input=(name:string)=>root!.querySelector<HTMLInputElement>(`[data-${name}]`)!;
 const seek=input('seek'),freeze=input('freeze'),offset=input('time'),signals=input('signals'),groups=input('groups'),isolate=input('isolate'),bounds=input('bounds');
 const candidate=root.querySelector<HTMLSelectElement>('[data-candidate]')!,annotation=root.querySelector<HTMLElement>('[data-annotation]')!,boundsBox=root.querySelector<HTMLElement>('[data-bounds-box]')!,center=root.querySelector<HTMLElement>('[data-center]')!;
 const english=document.documentElement.lang==='en',notes=english?['A local initiative connects a team.','Shared interfaces emerge.','A decision realigns an interface.']:['Lokalna inicjatywa łączy zespół.','Powstają wspólne interfejsy.','Decyzja zmienia układ interfejsu.'];
 const params=new URLSearchParams(location.search),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 debug.hidden=params.get('debug')!=='1';freeze.checked=params.get('freeze')==='1';isolate.checked=params.get('isolate')==='1';root.classList.toggle('v6-isolate',isolate.checked);document.body.classList.toggle('v6-isolated',isolate.checked);
 let world:ReturnType<typeof createWorld>|undefined,alive=true,manual=false,paused=false,visible=true,raf=0,lastStamp=0,elapsed=0,dirty=true,lastAnnotation=-1;
 let renderedKey="",readingKey="";
 let timeline:gsap.core.Timeline|undefined,trigger:ScrollTrigger|undefined;
 const head={value:0};
 const disposers:Array<()=>void>=[];
 const on=(target:EventTarget,event:string,fn:EventListener)=>{target.addEventListener(event,fn);disposers.push(()=>target.removeEventListener(event,fn));};
 function measure(){
 if(!world)return;const r=world.measure();root!.dataset['measurement']=JSON.stringify(r);
 if(!debug.hidden)stats.textContent=`${Math.round(r.progress*100)}% · t=${r.time.toFixed(2)}s\n${r.modules} modules / ${r.teams} teams\n${r.renderInfo.calls} calls / ${r.renderInfo.triangles} triangles\nCPU update ${r.updateMs.toFixed(2)}ms\nSubmit ${r.submitMs.toFixed(2)}ms\n${r.renderer}`;
 return r;
 }
 function protectReading(){
  const next=[Math.round(scrollY),innerWidth,innerHeight,isolate.checked].join("|");if(readingKey===next)return;readingKey=next;
  // Preserve the optical anchor: editorial negative space is cut locally, never obtained by moving the camera.
  // Only the visitor composition uses these windows; isolated diagnostics expose the entire geometry.
  const boxes=isolate.checked?[]:Array.from(root!.querySelectorAll<HTMLElement>('.v6-copy')).map(node=>node.getBoundingClientRect()).filter(r=>r.bottom>0&&r.top<innerHeight);
  const pad=innerWidth<=700?14:18;
  const holes=boxes.map(r=>`<rect x="${r.x-pad}" y="${r.y-pad}" width="${r.width+pad*2}" height="${r.height+pad*2}" rx="12" fill="black"/>`).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${innerWidth}" height="${innerHeight}"><defs><filter id="soft"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="100%" height="100%" fill="white"/><g filter="url(#soft)">${holes}</g></svg>`;
  host.style.maskImage=holes?`url("data:image/svg+xml,${encodeURIComponent(svg)}")`:'';
  root!.dataset['readingWindows']=JSON.stringify(boxes.map(r=>[r.x-pad,r.y-pad,r.right+pad,r.bottom+pad]));
  const obstructed=boxes.some(r=>r.bottom>innerHeight-90&&r.top<innerHeight-45);
  annotation.hidden=obstructed;
  root!.querySelector<HTMLElement>('.v6-legend')!.style.visibility=obstructed?'hidden':'';
  motion.style.top=obstructed?'12px':'';motion.style.bottom=obstructed?'auto':'';
 }
 function draw(){
 if(!world||!visible||document.hidden)return;
 protectReading();
 const progress=reduced.matches?1:manual?Number(seek.value):head.value,time=reduced.matches?0:Number(offset.value)+(freeze.checked?0:elapsed);
 const key=[progress,time,candidate.value,groups.checked,signals.checked&&!reduced.matches,bounds.checked,innerWidth,innerHeight].join("|");
 if(key===renderedKey){dirty=false;return;}renderedKey=key;
 world.render({progress,time,candidate:candidate.value as Candidate,groups:groups.checked,signals:signals.checked&&!reduced.matches,bounds:bounds.checked});
 root!.dataset['progress']=String(progress);dirty=false;
 const report=world.measure(),kind=report.event.kind;
 // At most one quiet annotation, stable during each event and its hold interval.
 if(kind&&kind!==lastAnnotation){annotation.textContent=notes[kind-1]!;lastAnnotation=kind;}
 if(bounds.checked){const [x,y,x2,y2]=report.bounds;Object.assign(boundsBox.style,{left:`${x}px`,top:`${y}px`,width:`${x2!-x!}px`,height:`${y2!-y!}px`});Object.assign(center.style,{left:`${report.centroid[0]}px`,top:`${report.centroid[1]}px`});}
 boundsBox.hidden=center.hidden=!bounds.checked;
 }
 function running(){return alive&&!!world&&!reduced.matches&&!paused&&!freeze.checked&&visible&&!document.hidden;}
 function schedule(){if(!running()){cancelAnimationFrame(raf);raf=0;lastStamp=0;}else if(!raf)raf=requestAnimationFrame(frame);}
 function frame(stamp:number){
 raf=0;if(!alive||!world)return;
 if(stamp-lastStamp>=33){const delta=lastStamp?Math.min(.1,(stamp-lastStamp)/1000):0;lastStamp=stamp;
 const running=!reduced.matches&&!paused&&!freeze.checked&&visible&&!document.hidden;
 if(running)elapsed+=delta;
 if(dirty||running)draw();
 }
 schedule();
 }
 function synchronize(){if(!manual){dirty=true;draw();}}
 function layout(){
 if(!world||!alive)return;readingKey="";trigger?.kill();timeline?.kill();
 const sections=Array.from(root!.querySelectorAll<HTMLElement>('[data-act]'));
 const marks=sections.map((s,i)=>i===0?0:s.offsetTop);const end=marks[4]!;
 root!.dataset['landmarks']=JSON.stringify(marks);head.value=0;timeline=gsap.timeline({paused:true,onUpdate:synchronize});
 for(let i=1;i<marks.length;i++)timeline.to(head,{value:i/4,duration:marks[i]!-marks[i-1]!,ease:'none'});
 trigger=ScrollTrigger.create({start:0,end,animation:timeline,scrub:true,onRefresh:()=>{timeline?.totalTime(Math.min(end,scrollY),false);synchronize();}});trigger.refresh();trigger.update();timeline.totalTime(Math.min(end,scrollY),false);dirty=true;draw();
 }
 function fallback(){cancelAnimationFrame(raf);trigger?.kill();timeline?.kill();world?.dispose();world=undefined;root!.classList.remove('v6-ready');root!.dataset['mode']='fallback';motion.hidden=true;root!.querySelector<HTMLElement>('[data-fallback-status]')!.hidden=false;}
 on(host,'v6-context-lost',fallback);
 on(seek,'input',()=>{manual=true;dirty=true;draw();measure();});
 for(const control of [offset,signals,groups,candidate,bounds])on(control,'change',()=>{dirty=true;draw();measure();});
 on(freeze,'change',()=>{offset.value=String(Number(offset.value)+elapsed);elapsed=0;dirty=true;draw();measure();schedule();});
 on(isolate,'change',()=>{root!.classList.toggle('v6-isolate',isolate.checked);document.body.classList.toggle('v6-isolated',isolate.checked);protectReading();});
 on(root.querySelector('[data-resume]')!,'click',()=>{manual=false;layout();});
 on(root,'v6-measure',measure);
 on(motion,'click',()=>{paused=!paused;motion.setAttribute('aria-pressed',String(paused));motion.textContent=english?(paused?'Resume local motion':'Pause local motion'):(paused?'Wznów lokalny ruch':'Wstrzymaj lokalny ruch');schedule();});
 on(reduced,'change',()=>{dirty=true;motion.hidden=reduced.matches;draw();schedule();});
 let resizeTimer:ReturnType<typeof setTimeout>;
 on(window,'resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layout,100);});
 on(document,'visibilitychange',()=>{lastStamp=0;dirty=true;draw();schedule();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;dirty=true;lastStamp=0;schedule();});observer.observe(root);disposers.push(()=>observer.disconnect());
 void import('./world').then(({createWorld})=>{if(!alive)return;world=createWorld(host);root!.classList.add('v6-ready');root!.dataset['mode']='webgl';root!.querySelector<HTMLElement>('[data-fallback-status]')!.hidden=true;motion.hidden=reduced.matches;layout();schedule();void document.fonts.ready.then(()=>{if(alive)layout();});}).catch(fallback);
 on(window,'pagehide',()=>{alive=false;cancelAnimationFrame(raf);clearTimeout(resizeTimer);trigger?.kill();timeline?.kill();world?.dispose();disposers.splice(0).forEach(fn=>fn());});
 on(window,'pageshow',event=>{if((event as PageTransitionEvent).persisted)location.reload();});
}
