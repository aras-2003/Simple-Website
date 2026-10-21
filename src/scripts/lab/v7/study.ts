import type {createWorld} from './world';
import type {Viewpoint} from './model';
const root=document.querySelector<HTMLElement>('[data-v7]');
if(root){
 const host=root.querySelector<HTMLElement>('[data-canvas]')!,status=root.querySelector<HTMLElement>('[data-status]')!;
 const buttons=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-view]'));
 const params=new URLSearchParams(location.search);status.textContent=status.dataset['loading']!;
 if(params.get('isolate')==='1')document.documentElement.dataset['isolate']='';
 let world:ReturnType<typeof createWorld>|undefined,alive=true;
 const listeners:Array<()=>void>=[];
 const on=(target:EventTarget,type:string,listener:EventListener)=>{target.addEventListener(type,listener);listeners.push(()=>target.removeEventListener(type,listener));};
 function fallback(){world?.dispose();world=undefined;root!.dataset['mode']='fallback';status.textContent=status.dataset['fallback']!;status.hidden=false;buttons.forEach(button=>button.disabled=true);}
 on(host,'v7-context-lost',fallback);
 for(const button of buttons)on(button,'click',()=>{world?.render(button.dataset['view'] as Viewpoint);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
 void import('./world').then(({createWorld})=>{
  if(!alive)return;world=createWorld(host);const view=buttons.find(b=>b.dataset['view']===params.get('view'))?.dataset['view'] as Viewpoint|undefined;
  world.render(view);buttons.forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed',String(b.dataset['view']===(view??'primary')));});status.hidden=true;root!.dataset['mode']='webgl';
 }).catch(fallback);
 on(window,'pagehide',()=>{alive=false;world?.dispose();listeners.splice(0).forEach(f=>f());});
 window.addEventListener('pageshow',event=>{if((event as PageTransitionEvent).persisted)location.reload();});
}
