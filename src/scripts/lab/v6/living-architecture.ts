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
 const cameraYaw=input('camera'),tracker=root.querySelector<SVGSVGElement>('[data-tracker]')!,leader=root.querySelector<SVGPathElement>('[data-leader]')!,endpoint=root.querySelector<SVGCircleElement>('[data-endpoint]')!;
 let captionSafe=false,captionOrigin=[0,0],canvasOffset=[0,0],readingBoxes:number[][]=[];
 const english=document.documentElement.lang==='en',notes=english?['Leadership activates coordination.','A new connection changes the system.','Decision-making reshapes dependencies.']:['Przywództwo uruchamia koordynację.','Nowe połączenie zmienia system.','Decyzja zmienia układ zależności.'];
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
  const canvasRect=host.getBoundingClientRect();canvasOffset=[canvasRect.left,canvasRect.top];
  const pad=innerWidth<=700?14:18;
  const holes=boxes.map(r=>`<rect x="${r.x-pad}" y="${r.y-pad}" width="${r.width+pad*2}" height="${r.height+pad*2}" rx="12" fill="black"/>`).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${innerWidth}" height="${innerHeight}"><defs><filter id="soft"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="100%" height="100%" fill="white"/><g filter="url(#soft)">${holes}</g></svg>`;
  host.style.maskImage=holes?`url("data:image/svg+xml,${encodeURIComponent(svg)}")`:'';
  root!.dataset['readingWindows']=JSON.stringify(boxes.map(r=>[r.x-pad,r.y-pad,r.right+pad,r.bottom+pad]));
  const collides=(rect:{left:number;right:number;top:number;bottom:number})=>boxes.some(r=>r.left<rect.right+8&&r.right>rect.left-8&&r.top<rect.bottom+8&&r.bottom>rect.top-8);
  annotation.hidden=false;
  const caption=annotation.getBoundingClientRect();captionSafe=!collides(caption)&&!isolate.checked;captionOrigin=innerWidth<=700?[caption.left+caption.width/2,caption.top-12]:[caption.right+12,caption.top+caption.height/2];annotation.hidden=true;readingBoxes=boxes.map(r=>[r.left-pad,r.top-pad,r.right+pad,r.bottom+pad]);tracker.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
  const legend=root!.querySelector<HTMLElement>('.v6-legend')!;
  legend.style.visibility=collides(legend.getBoundingClientRect())?'hidden':'';
  motion.style.top='';motion.style.bottom='';
  const button=motion.getBoundingClientRect();
  if(collides(button)){
   const headerBottom=document.querySelector('.v6-header')?.getBoundingClientRect().bottom??0;
   const candidates=[Math.max(12,headerBottom+12),...boxes.flatMap(r=>[r.bottom+12,r.top-button.height-12])];
   const top=candidates.find(y=>y>=12&&y+button.height<=innerHeight-12&&!collides({left:button.left,right:button.right,top:y,bottom:y+button.height}));
   if(top!==undefined){motion.style.top=`${top}px`;motion.style.bottom='auto';}
  }
 }
 function draw(){
 if(!world||!visible||document.hidden)return;
 protectReading();
 const progress=reduced.matches?1:manual?Number(seek.value):head.value,time=reduced.matches?0:Number(offset.value)+(freeze.checked?0:elapsed);
 const key=[progress,time,candidate.value,groups.checked,signals.checked&&!reduced.matches,bounds.checked,cameraYaw.value,innerWidth,innerHeight].join("|");
 if(key===renderedKey){updateOverlay(world.measure());dirty=false;return;}renderedKey=key;
 world.render({progress,time,candidate:candidate.value as Candidate,groups:groups.checked,signals:signals.checked&&!reduced.matches,bounds:bounds.checked,cameraYaw:Number(cameraYaw.value)});
 root!.dataset['progress']=String(progress);dirty=false;
 updateOverlay(world.measure());
 }
 function updateOverlay(report:ReturnType<ReturnType<typeof createWorld>['measure']>){
 const kind=report.event.kind;
 // At most one quiet annotation, stable during each event and its hold interval.
 if(kind&&kind!==lastAnnotation){annotation.textContent=notes[kind-1]!;lastAnnotation=kind;}
 const x=report.anchor.screen[0]!+canvasOffset[0]!,y=report.anchor.screen[1]!+canvasOffset[1]!,[sx,sy]=captionOrigin;
 // Sample the thin connector against cached editorial rectangles; never point through reserved copy.
 const elbowX=Math.max(sx!+24,...readingBoxes.filter(r=>r[3]!>0&&r[1]!<innerHeight).map(r=>r[2]!+20));
 const elbow=innerWidth<=700?[sx!,sy!-24]:[elbowX,sy!];
 const points=[[sx!,sy!],elbow,[x!,y!]];
 let crosses=false;for(let part=0;part<2;part++)for(let n=0;n<=24;n++){const u=n/24,a=points[part]!,b=points[part+1]!,px=a[0]!+(b[0]!-a[0]!)*u,py=a[1]!+(b[1]!-a[1]!)*u;if(readingBoxes.some(r=>px>r[0]!&&px<r[2]!&&py>r[1]!&&py<r[3]!)){crosses=true;break;}}
 const show=captionSafe&&!crosses&&!reduced.matches&&report.anchor.visible&&!!kind;
 annotation.hidden=!show;tracker.toggleAttribute('data-hidden',!show);
 if(show){const opacity=Math.min(1,report.event.amount*3);annotation.style.opacity=String(opacity);tracker.style.opacity=String(opacity*.55);leader.setAttribute('d',`M ${sx} ${sy} L ${elbow[0]} ${elbow[1]} L ${x} ${y}`);endpoint.setAttribute('cx',String(x));endpoint.setAttribute('cy',String(y));}
 root!.dataset['tracking']=JSON.stringify({visible:show,module:report.anchor.module,endpoint:[x,y],world:report.anchor.world,reason:!captionSafe?'caption-collision':crosses?'reading-window':reduced.matches?'reduced-motion':report.anchor.reason});
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
 function fallback(){cancelAnimationFrame(raf);trigger?.kill();timeline?.kill();world?.dispose();world=undefined;root!.classList.remove('v6-ready');root!.dataset['mode']='fallback';annotation.hidden=true;tracker.setAttribute('data-hidden','');motion.hidden=true;root!.querySelector<HTMLElement>('[data-fallback-status]')!.hidden=false;}
 on(host,'v6-context-lost',fallback);
 on(seek,'input',()=>{manual=true;dirty=true;draw();measure();});
 for(const control of [offset,signals,groups,candidate,bounds,cameraYaw])on(control,'change',()=>{dirty=true;draw();measure();});
 on(freeze,'change',()=>{offset.value=String(Number(offset.value)+elapsed);elapsed=0;dirty=true;draw();measure();schedule();});
 on(isolate,'change',()=>{root!.classList.toggle('v6-isolate',isolate.checked);document.body.classList.toggle('v6-isolated',isolate.checked);renderedKey="";dirty=true;draw();});
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
 // This listener must survive pagehide cleanup so a cached page recreates its disposed world.
 window.addEventListener('pageshow',event=>{if((event as PageTransitionEvent).persisted)location.reload();});
}
