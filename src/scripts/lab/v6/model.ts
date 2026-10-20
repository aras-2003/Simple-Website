/** Illustrative organization: authored topology, stable identities, seeded local variation. */
export type V3 = [number, number, number];
export type Candidate = 'spine' | 'mesh' | 'cantilever';
export type Strength = 'strong' | 'moderate' | 'loose';
export interface Team { id:number; department:number; organization:number; size:number; parent:number; strength:Strength; center:V3; extent:V3 }
export interface Module { id:number; team:number; department:number; organization:number; kind:'block'|'beam'|'panel'; local:V3; size:V3; seed:number }
export interface Edge { id:number; from:number; to:number; strength:Strength; cross:boolean }
export const smooth=(x:number)=>{const t=Math.min(1,Math.max(0,x));return t*t*t*(t*(t*6-15)+10);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const lerp=(a:V3,b:V3,t:number):V3=>[mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];
export const rand=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
// Unequal branches, shared sockets, open cavities; tuples are team centers, not building floors.
const centers:V3[]=[[-.6,-1.5,.2],[-.6,.05,.2],[-.6,1.65,.2],[.35,2.9,-.1],[-1.9,2.85,-.6],[-2.15,1.35,.15],[-3.5,1.3,.15],[-3.65,-.35,.5],[-2.35,-1.65,.65],[.9,-1.5,.2],[2.35,-1.4,.2],[3.5,-.9,-.25],[3.4,.65,-.25],[1.7,1.55,-1.2],[.45,.25,-1.35],[.25,-2.85,.7],[-1.5,-3.05,.5],[2.05,-2.7,.85]];
const parents=[-1,0,1,2,2,2,5,6,0,0,9,10,11,2,13,0,15,9];
const strengths:Strength[]=['strong','strong','strong','moderate','loose','strong','moderate','loose','loose','strong','strong','moderate','loose','moderate','loose','moderate','loose','loose'];
export const departments=[{id:0,organization:0},{id:1,organization:0},{id:2,organization:1},{id:3,organization:2},{id:4,organization:2}];
export const organizations=[{id:0,group:0},{id:1,group:0},{id:2,group:0}];
const extents:V3[]=[[1.1,1.55,1.6],[1.1,1.65,1.6],[1.2,1.3,1.55],[1.15,1.1,1.1],[1.1,.85,1.15],[1.85,1.05,1.5],[1.25,1.05,1.5],[1.05,1.3,1.3],[1.5,1.1,1.45],[1.75,1.35,1.8],[1.55,1.2,1.8],[1.05,1.15,1.4],[1.05,1.5,1.4],[1.65,1.1,1.5],[1.05,1.3,1.5],[1.9,.8,1.45],[1.15,.9,1.1],[1.5,.7,1.45]];
export const teams:Team[]=centers.map((center,id)=>({id,department:id<5?0:id<9?1:id<13?2:id<15?3:4,organization:id<9?0:id<13?1:2,size:[25,32,28,17,11,24,19,13,15,29,26,18,12,21,14,20,10,16][id]!,parent:parents[id]!,strength:strengths[id]!,center,extent:extents[id]!}));
export const modules:Module[]=teams.flatMap(team=>Array.from({length:team.size},(_,i)=>{
 const s=team.id*71+i+1,kind=i<5?'beam':i<8?'panel':i%11===0?'panel':i%5===0?'beam':'block';
 // Recessed architectural bays: two decks, unequal shear walls, inner core and service ribs.
 const [w,h,d]=team.extent;
 const local:V3=[0,0,0];let size:V3;
 if(i===0||i===2){local[1]=i===0?-.46:.46;size=[w*1.08,.14,d*1.12];}
 else if(i===1||i===3){local[0]=i===1?-.46:.46;local[2]=-.13;size=[.18,h*.96,d*.78];}
 else if(i===4){local[2]=-.42;size=[w*.74,h*.80,.16];}
 else if(i===5){local[0]=-.24;local[2]=.24;size=[w*.28,h*.62,d*.32];}
 else if(i===6){local[0]=.2;local[1]=.23;local[2]=.2;size=[w*.46,h*.22,d*.6];}
 else if(i===7){local[0]=.43;local[1]=-.21;local[2]=.3;size=[w*.22,h*.35,d*.36];}
 else {
  const rib=(i-8)%6,tier=Math.floor((i-8)/6),front=tier%2===0;
  local[0]=-.4+rib*.16;local[1]=-.31+(tier%3)*.29;local[2]=front?.46:-.48;
  size=i%5===0?[w*.25,.09,d*.12]:[.045+rand(s)*.045,h*(.12+rand(s+1)*.10),d*.09];
 }
 // Different architectural responsibilities, not eighteen copies of a portal.
 const profile=team.id%5;
 if(i===4){
  if(profile===0){local[0]=.18;local[2]=.06;size=[w*.55,h*.88,d*.72];}
  if(profile===1){local[0]=-.24;local[2]=.16;size=[w*.38,h*.96,d*.76];}
  if(profile===2){local[0]=.08;local[1]=.27;local[2]=.10;size=[w*.9,h*.35,d*.86];}
  if(profile===3){local[0]=-.21;local[2]=.07;size=[w*.48,h*.82,d*.85];}
 }
 if(i===6&&profile%2===0){local[0]=.12;local[1]=-.06;local[2]=.39;size=[w*.58,h*.55,.11];}
 if(i===2&&profile===3){local[0]=.16;size[0]*=.62;}
 if(i>7){
  // Recessed vertical fins and service strata within the larger volumes.
  local[2]*=.83;size[1]*=1.6;size[0]*=.64;
 }
 return {id:teams.slice(0,team.id).reduce((n,t)=>n+t.size,0)+i,team:team.id,department:team.department,organization:team.organization,kind,local,size,seed:s};
}));
export const edges:Edge[]=teams.filter(t=>t.parent>=0).map((t,id)=>({id,from:t.parent,to:t.id,strength:t.strength,cross:teams[t.parent]!.department!==t.department}));
edges.push({id:17,from:8,to:15,strength:'loose',cross:true},{id:18,from:5,to:14,strength:'moderate',cross:true},{id:19,from:10,to:17,strength:'loose',cross:true});
export function target(team:Team,candidate:Candidate):V3{
 const [x,y,z]=team.center;
 if(candidate==='mesh')return [x*.88+Math.sin(team.id*.8)*.45,y*.88,z+(team.id%3-1)*1.25];
 if(candidate==='cantilever')return [x*1.18,y*.62+(team.id<5?.9:0),z*.9+(team.id>12?1:0)];
 return [...team.center];
}
const hubs:V3[]=[[-.4,2,0],[-3,1,1],[2.5,-.6,0],[2.2,1.6,-1.6],[-.4,-2.7,1]];
function authoredCenter(team:Team,step:number,candidate:Candidate):V3{
 const end=target(team,candidate),hub=hubs[team.department]!;
 if(step===0)return [(rand(team.id+8)-.5)*9,(rand(team.id+33)-.5)*7,(rand(team.id+90)-.5)*4];
 if(step===1)return [end[0]*.7+(rand(team.id+4)-.5)*2.5,end[1]*.8+(rand(team.id+18)-.5)*2.8,(rand(team.id+39)-.5)*3];
 if(step===2)return lerp(hub,end,.58);
 if(step===3){const org:V3=team.organization===0?[-1.3,.7,0]:team.organization===1?[2,-.4,0]:[.8,-1.5,1];return lerp(org,[end[0],end[1],end[2]*1.3],.72);}
 return end;
}
// Author each pose around the same mass anchor once, never recenter/scale the rendered object.
const centersByCandidate=new Map<Candidate,V3[][]>();
for(const candidate of ['spine','mesh','cantilever'] as Candidate[]){
 const states=Array.from({length:5},(_,step)=>{
  const values=teams.map(team=>authoredCenter(team,step,candidate));
  const center:V3=[0,0,0];for(const team of teams)for(let axis=0;axis<3;axis++)center[axis]!+=values[team.id]![axis]!*team.size/modules.length;
  return values.map(v=>v.map((x,i)=>x-center[i]!) as V3);
 });centersByCandidate.set(candidate,states);
}
export function teamCenter(team:Team,phase:number,candidate:Candidate):V3{
 const states=centersByCandidate.get(candidate)!,p=Math.min(3,Math.max(0,Math.floor(phase)));
 return lerp(states[p]![team.id]!,states[p+1]![team.id]!,smooth(phase-p));
}
const localMeans=teams.map(team=>{
 const members=modules.filter(m=>m.team===team.id),local:V3=[0,0,0],agency:V3=[0,0,0];
 for(const m of members)for(let axis=0;axis<3;axis++){
  local[axis]!+=m.local[axis]!*team.extent[axis]!/members.length;
  agency[axis]!+=(rand(m.seed+[10,20,30][axis]!)-.5)*[2.5,2.1,2.6][axis]!/members.length;
 }return {local,agency};
});
export interface Pose {position:V3;size:V3;rotation:V3;signal:number; event:number}
export const semanticEvents=[
 {kind:1,origin:1,affected:[1,2],path:[1],trigger:'initiative',response:'Staggered panel extension and local interface activation',consequence:'Team capability becomes legible'},
 {kind:2,origin:5,affected:[5,14],path:[18],trigger:'collaboration',response:'Cross-department bridge widens; receiving panels extend',consequence:'Shared capability spans department boundaries'},
 {kind:3,origin:10,affected:[10,9,17],path:[9,19],trigger:'decision',response:'Decision panels retract and align at the shared deck',consequence:'Interface capacity is redistributed without global motion'},
] as const;
export function eventState(p:number,time:number,enabled=true){
 if(!enabled)return {kind:0,team:0,amount:0,phase:0};
 // Repeatable sparse schedule; scrolling also initiates deterministic events.
 const clock=time%18,scrollPhase=p*4,scrollAmount=Math.sin(Math.PI*(scrollPhase-Math.floor(scrollPhase)))**12*.6;
 const kind=clock<3?1:clock>=6&&clock<9?2:clock>=12&&clock<15?3:0;
 const phase=kind===1?clock:kind===2?clock-6:clock-12;
 const amount=kind?Math.sin(Math.PI*phase/3)**2:scrollAmount;
 return {kind:kind||(scrollAmount>.01?Math.min(3,Math.floor(scrollPhase)+1):0),team:kind===2?5:kind===3?10:1,amount,phase:kind?phase:(scrollPhase-Math.floor(scrollPhase))*3};
}
export function modulePose(m:Module,p:number,time:number,candidate:Candidate='spine',signals=true):Pose{
 const team=teams[m.team]!,phase=Math.max(0,Math.min(4,p*4)),c=teamCenter(team,phase,candidate);
 const localPhase=Math.max(0,Math.min(4,phase+(rand(m.team+5)-.5)*.32*Math.sin(phase*Math.PI/4)));
 const cluster=smooth(localPhase),integration=smooth((localPhase-1)/2);
 const agency:V3=[(rand(m.seed+10)-.5)*2.5,(rand(m.seed+20)-.5)*2.1,(rand(m.seed+30)-.5)*2.6];
 const means=localMeans[m.team]!;
 const local=m.local.map((v,i)=>v*team.extent[i]!-means.local[i]!) as V3;
 for(let axis=0;axis<3;axis++)agency[axis]!-=means.agency[axis]!;
 const position=lerp([c[0]+agency[0],c[1]+agency[1],c[2]+agency[2]],[c[0]+local[0],c[1]+local[1],c[2]+local[2]],cluster);
 // Only independent panels/sliders move in the assembled state. Structural seams stay fixed.
 const active=m.kind==='panel'||m.id%9===0;
 const micro=active?(.025+.025*rand(m.seed))*Math.sin(time*(.65+rand(m.seed+9)*.5)+m.seed):.018*(1-integration)*Math.sin(time*.8+m.seed);
 position[2]+=micro;
 const event=eventState(p,time,signals),delay=(m.id%7)*.16;
 const affected:readonly number[]=semanticEvents[event.kind-1]?.affected??[];
 const hop=affected.indexOf(m.team);
 const response=hop<0?0:event.amount*smooth((event.phase-delay-hop*.32)*2);
 if(active)position[2]+=response*(event.kind===3?-.22:.25);
 if(event.kind===1&&response>0)for(let axis=0;axis<3;axis++)position[axis]=mix(position[axis]!,c[axis]!+local[axis]!,response*.12*(1-cluster));
 const size:V3=[m.size[0]*mix(.58,1,cluster),m.size[1]*mix(.58,1,cluster),m.size[2]*mix(.58,1,cluster)];
 if(m.kind==='beam')size[1]*=mix(.78,1,integration);
 if(m.kind==='panel')size[0]*=1+response*.25;
 return {position,size,rotation:[(1-cluster)*(rand(m.seed+1)-.5)*1.4,(1-integration)*(rand(m.seed+2)-.5)*.9,0],signal:response,event:event.kind};
}
export function edgePose(edge:Edge,p:number,time:number,candidate:Candidate='spine',signals=true){
 const a=modulePose(modules.find(m=>m.team===edge.from)!,p,time,candidate,signals).position,b=modulePose(modules.find(m=>m.team===edge.to)!,p,time,candidate,signals).position;
 const distance=Math.hypot(...b.map((v,i)=>v-a[i]!));
 const onset=edge.strength==='strong'?.16:edge.strength==='moderate'?.36:.56;
 const growth=smooth((p-onset)/(.30+(edge.id%3)*.035));
 const e=eventState(p,time,signals),response=e.kind===2&&edge.id===18?e.amount:0;
 const thickness=(edge.strength==='strong'?.38:edge.strength==='moderate'?.15:.045)*(1+response*.65);
 return {a,b,distance,growth,thickness,response};
}

/** Known team-local relationships; leader and capability panels, never nearest-neighbor decoration. */
export const localLinks=teams.flatMap(team=>{
 const members=modules.filter(m=>m.team===team.id);
 return [5,6,7].map((index,order)=>({id:team.id*3+order,from:members[7]!.id,to:members[index===7?8:index]!.id,team:team.id,order}));
});
export function localLinkPose(link:typeof localLinks[number],p:number,time:number,candidate:Candidate='spine',signals=true){
 const a=modulePose(modules[link.from]!,p,time,candidate,signals).position,b=modulePose(modules[link.to]!,p,time,candidate,signals).position;
 const e=eventState(p,time,signals),response=link.team===e.team?e.amount*smooth((e.phase-link.order*.26)*2):0;
 return {a,b,growth:Math.max(smooth((p-.06-link.order*.04)/.2),response*.65),response};
}
export function eventAnchor(p:number,time:number,signals=true){
 const event=eventState(p,time,signals),member=modules.filter(m=>m.team===event.team)[7]!;
 return {event,module:member};
}
