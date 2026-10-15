import type { Candidate, Frame, Quality, Study } from './world';
const root=document.querySelector<HTMLElement>('[data-v4]');
if(root){
  const host=root.querySelector<HTMLElement>('[data-v4-canvas]')!;
  const status=root.querySelector<HTMLElement>('[data-status]')!;
  const frameLabel=root.querySelector<HTMLElement>('[data-frame-label]')!;
  const caption=root.querySelector<HTMLElement>('[data-caption]')!;
  const frames=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-frame]'));
  const candidate=root.querySelector<HTMLSelectElement>('[data-candidate]')!;
  const quality=root.querySelector<HTMLSelectElement>('[data-quality]')!;
  const camera=root.querySelector<HTMLSelectElement>('[data-camera]')!;
  const params=new URLSearchParams(location.search);
  let study:Study={
    frame:params.get('frame')==='transformation'?'transformation':params.get('frame')==='coherence'?'coherence':'complexity',
    candidate:params.get('candidate')==='compression'?'compression':'incision',
    quality:params.get('quality')==='direct'?'direct':'studio',detail:params.get('detail')==='1',
  };
  let world:ReturnType<typeof import('./world')['createWorld']>|undefined;
  let alive=true;
  const labels:Record<Frame,[string,string]>={complexity:['01 / Complexity','Related volumes. Unresolved relationships.'],transformation:['02 / Transformation','The same structure. A different set of relationships.'],coherence:['03 / Coherence','A deliberate opening. One coherent direction.']};
  const sync=()=>{
    frames.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset['frame']===study.frame)));
    candidate.value=study.candidate;quality.value=study.quality;camera.value=study.detail?'detail':'wide';
    frameLabel.textContent=labels[study.frame][0];caption.textContent=labels[study.frame][1];
    root.dataset['frame']=study.frame;root.dataset['candidate']=study.candidate;root.dataset['quality']=study.quality;
    if(world){world.setStudy(study);root.dataset['renderMode']='webgl';}
  };
  frames.forEach(button=>button.addEventListener('click',()=>{study={...study,frame:button.dataset['frame'] as Frame};sync();}));
  candidate.addEventListener('change',()=>{study={...study,candidate:candidate.value as Candidate};sync();});
  quality.addEventListener('change',()=>{study={...study,quality:quality.value as Quality};sync();});
  camera.addEventListener('change',()=>{study={...study,detail:camera.value==='detail'};sync();});
  root.addEventListener('v4-capture',()=>{world?.setStudy(study);});
  root.addEventListener('v4-measure',()=>{if(world)root.dataset['measurement']=JSON.stringify(world.measure());});
  const fallback=()=>{world?.dispose();world=undefined;root.classList.remove('v4-ready');root.dataset['renderMode']='fallback';status.textContent='WebGL is unavailable. The static illustration and study brief remain available.';};
  host.addEventListener('v4-context-lost',fallback);
  sync();
  void import('./world').then(({createWorld})=>{
    if(!alive)return;
    world=createWorld(host);sync();root.classList.add('v4-ready');
    root.dataset['objectIds']=JSON.stringify(world.objectIds);
    status.textContent='Live Three.js rendering. Frame changes are immediate static poses; no motion sequence is implemented.';
  }).catch(fallback);
  window.addEventListener('pagehide',()=>{alive=false;world?.dispose();});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}
