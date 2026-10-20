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
const centers:V3[]=[[-.7,-1.3,0],[-.6,0,0],[-.4,1.4,0],[.8,2.55,-.4],[-1.7,3.05,-.5],[-2.45,1.75,.2],[-3.8,1.85,.2],[-3.95,.1,.8],[-2.6,-.8,1.1],[.9,-1.3,.1],[2.3,-1.15,.1],[3.65,-1.05,-.5],[3.9,.65,-.5],[2.55,1.2,-1.3],[1.45,.4,-1.7],[.4,-2.8,1.1],[-1.6,-3.15,.8],[2.4,-2.85,1.4]];
const parents=[-1,0,1,2,2,2,5,6,0,0,9,10,11,2,13,0,15,9];
const strengths:Strength[]=['strong','strong','strong','moderate','loose','strong','moderate','loose','loose','strong','strong','moderate','loose','moderate','loose','moderate','loose','loose'];
export const departments=[{id:0,organization:0},{id:1,organization:0},{id:2,organization:1},{id:3,organization:2},{id:4,organization:2}];
export const organizations=[{id:0,group:0},{id:1,group:0},{id:2,group:0}];
const extents:V3[]=[[.72,1.6,1],[.8,1.7,.9],[1,1.2,.6],[.65,1.3,.75],[.6,.65,.5],[1.8,.6,.9],[1.5,.6,.5],[.8,1.1,1.2],[1.2,.7,.8],[1,1.4,.9],[1.5,.7,1.1],[.7,1.1,.6],[.6,1.6,.9],[1.4,.5,1.5],[.7,.8,1.3],[1.5,.65,.8],[.65,.9,.6],[1.15,.45,1]];
export const teams:Team[]=centers.map((center,id)=>({id,department:id<5?0:id<9?1:id<13?2:id<15?3:4,organization:id<9?0:id<13?1:2,size:[25,32,28,17,11,24,19,13,15,29,26,18,12,21,14,20,10,16][id]!,parent:parents[id]!,strength:strengths[id]!,center,extent:extents[id]!}));
export const modules:Module[]=teams.flatMap(team=>Array.from({length:team.size},(_,i)=>{
 const s=team.id*71+i+1,kind=i<4?'beam':i%11===0?'panel':i%5===0?'beam':'block';
 // Front/back framing around an aperture, with unequal, partially filled faces.
 const side=i%4,u=(Math.floor(i/4)/Math.ceil(team.size/4)-.5)*1.75;
 const local:V3=side===0?[u,-.43,(rand(s)-.5)*.62]:side===1?[.53,u*.7,(rand(s)-.5)*.75]:side===2?[u,.43,(rand(s)-.5)*.62]:[-.53,u*.7,(rand(s)-.5)*.75];
 const size:V3=kind==='panel'?[.48,.075,.42]:kind==='beam'?[.14,.58,.14]:[.20+rand(s+3)*.20,.16+rand(s+4)*.20,.19+rand(s+5)*.32];
 if(i<4){
   const horizontal=i%2===0;
   local[0]=horizontal?0:(i===1?.53:-.53);local[1]=horizontal?(i===0?-.43:.43):0;local[2]=-.22;
   size[0]=horizontal?1.2*team.extent[0]:.18;size[1]=horizontal?.16:.94*team.extent[1];size[2]=.34+rand(s)*.18;
 }
 if(team.department===0&&(i===4||i===5)){local[0]=i===4?-.18:.18;local[1]=.07;local[2]=.14;size[0]=.35;size[1]=.7*team.extent[1];size[2]=.32;}
 if(team.department===2&&i===4){local[0]=0;local[1]=.45;size[0]=1.15*team.extent[0];size[1]=.13;size[2]=.7;}
 if(team.department===4&&i===2){size[0]=.4;size[1]=.12;local[0]=.25;}
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
 const response=m.team===event.team?event.amount*smooth((event.phase-delay)*2):0;
 if(active)position[2]+=response*.14;
 const size:V3=[m.size[0]*mix(.58,1,cluster),m.size[1]*mix(.58,1,cluster),m.size[2]*mix(.58,1,cluster)];
 if(m.kind==='beam')size[1]*=mix(.65,1.35,integration);
 if(m.kind==='panel')size[0]*=1+response*.25;
 return {position,size,rotation:[(1-cluster)*(rand(m.seed+1)-.5)*1.4,(1-integration)*(rand(m.seed+2)-.5)*.9,0],signal:response,event:event.kind};
}
export function edgePose(edge:Edge,p:number,time:number,candidate:Candidate='spine',signals=true){
 const a=teamCenter(teams[edge.from]!,p*4,candidate),b=teamCenter(teams[edge.to]!,p*4,candidate);
 const distance=Math.hypot(...b.map((v,i)=>v-a[i]!));
 const onset=edge.strength==='strong'?.16:edge.strength==='moderate'?.36:.56;
 const growth=smooth((p-onset)/(.30+(edge.id%3)*.035));
 const e=eventState(p,time,signals),response=e.kind===2&&edge.id===18?e.amount:0;
 const thickness=(edge.strength==='strong'?.22:edge.strength==='moderate'?.105:.042)*(1+response*.65);
 return {a,b,distance,growth,thickness,response};
}
