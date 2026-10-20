/** One authored volume. Stable agency identities travel directly to their own target. */
import {modules as original, teams, organizations, modulePose as originalPose, rand, smooth, lerp, type V3} from '../v6/model.ts';
export {teams,organizations};
export type {V3};
export type Candidate='spine';
export interface Module {id:number;team:number;department:number;kind:'block'|'beam'|'panel';seed:number;face:number;role:number;target:V3;size:V3;normal:V3;initial:{position:V3;size:V3;rotation:V3}}
const turn=(v:V3,face:number):V3=>face===0?v:face===1?[v[2],v[1],-v[0]]:face===2?[-v[0],v[1],-v[2]]:[-v[2],v[1],v[0]];
export const modules:Module[]=[];
for(const team of teams){
 const members=original.filter(m=>m.team===team.id),count=Math.max(32,members.length);
 for(let i=0;i<count;i++){
  const face=(team.id<9?0:1)+(i>=count/2?2:0),bay=team.id%9,col=bay%3,row=Math.floor(bay/3),role=i%(count/2),cavity=(bay+face)%3!==0;
  const gap=team.strength==='strong'?0:team.strength==='moderate'?.10:.24,w=2.2-gap;
  // The recessed corner cuts a continuous volume, rather than flattening it into a facade.
  const z=col===2?1.95:3.3;
  let local:V3=[0,0,0],size:V3=[.1,.1,.1];
  if(role===0){local=[0,-1.04,-1.03];size=[w,.12,2.18];}
  else if(role===1){local=[-w/2+.06,0,-.06];size=[.12,2.18,.24];}
  else if(role===2){local=[0,cavity?.87:.75,-.08];size=[w,cavity?.32:.62,.25];}
  else if(role===3){local=[w/2-.06,0,-.06];size=[.12,2.18,.24];}
  else if(role===4){local=row===2?[col===1?.22:0,1.04,col===1?-.70:-1.03]:[0,cavity?-.25:-.12,cavity?-1.82:-.36];size=row===2?[col===1?w*.72:w,.12,col===1?1.45:2.18]:[w,cavity?1.25:1.65,cavity?.18:.8];}
  else if(role===5){local=[-.42,-.35,cavity?-.35:.13];size=[.58,.8,.17];}
  else if(role===6){local=[0,.30,-.34];size=[w-.2,.065,.10];}
  else if(role===7){local=bay===4?[.12,-.1,-.80]:[.5,-.33,-1.35];size=bay===4?[1.2,.85,1.25]:[.46,1.25,.95];}
  else {const j=role-8;local=[-.88+(j%8)*.25,.73-Math.floor(j/8)*.26,.08];size=[.028,.30,.09];}
  const position=turn([col*2.2-2.2+local[0],row*2.2-2.2+local[1],z+local[2]],face);
  const old=members[i],seed=team.id*101+i+1;
  const initial=old?originalPose(old,0,0,'spine',false):{position:originalPose(members[i%members.length]!,0,0,'spine',false).position.map((v,a)=>v+(rand(seed+a)-.5)*1.6) as V3,size:[.12+rand(seed)*.3,.15+rand(seed+1)*.3,.2] as V3,rotation:[rand(seed)*2,rand(seed+2)*2,rand(seed+3)*2] as V3};
  // Original ids are retained for the first 350 modules; additions follow them.
  modules.push({id:old?old.id:original.length+modules.filter(m=>m.id>=original.length).length,team:team.id,department:team.department,kind:role<5?'beam':role<8?'panel':'block',seed,face,role,target:position,size:face%2?[size[2],size[1],size[0]]:size,normal:turn([0,0,1],face),initial:{position:[...initial.position],size:[...initial.size],rotation:[...initial.rotation]}});
 }
}
// Fine window strata reveal room depth without turning into an external cable network.
for(let face=0;face<4;face++)for(let bay=0;bay<9;bay++)for(let j=0;j<12;j++){
 const teamId=(face%2)*9+bay,team=teams[teamId]!,col=bay%3,row=Math.floor(bay/3),z=col===2?1.95:3.3;
 const cavity=(bay+face)%3!==0,target=turn([col*2.2-2.2-.82+(j%4)*.53,row*2.2-2.2-.73+Math.floor(j/4)*.39,z+(cavity?-1.69:.035)],face);
 const seed=3000+face*120+bay*12+j;
 modules.push({id:modules.length,team:teamId,department:team.department,kind:'block',seed,face,role:8,target,size:face%2?[.06,.19,.055]:[.055,.19,.06],normal:turn([0,0,1],face),initial:{position:[(rand(seed)-.5)*9,(rand(seed+1)-.5)*7,(rand(seed+2)-.5)*6],size:[.035,.04,.045],rotation:[rand(seed)*2,rand(seed+1),rand(seed+2)]}});
}
// Inhabited internal spine, shared landings and cores connect all four sides in depth.
for(let i=0;i<18;i++){
 const level=Math.floor(i/6),r=i%6,team=teams[i]!;
 const target:V3=r===0?[0,level*2.2-2.2,0]:r===1?[0,level*2.2-3.24,0]:r===2?[-.65,level*2.2-2.2,.35]:r===3?[.65,level*2.2-2.2,-.35]:r===4?[0,level*2.2-2.6,1.1]:[1.1,level*2.2-2.6,0];
 const size:V3=r===0?[.35,2.2,.35]:r===1?[2.4,.14,2.4]:r<4?[.6,1.1,.8]:r===4?[.8,.12,2.2]:[2.2,.12,.8];
 modules.push({id:modules.length,team:i,department:team.department,kind:r===0||r===1?'beam':'panel',seed:1800+i,face:4,role:r,target,size,normal:[0,0,1],initial:{position:[(rand(i+180)-.5)*8,(rand(i+90)-.5)*7,(rand(i+340)-.5)*6],size:[.2,.3,.2],rotation:[1,.8,.4]}});
}
modules.sort((a,b)=>a.id-b.id);
export function phaseAt(p:number){return Math.min(4,Math.max(0,Math.floor(p*4+.000001)));}
const node=(team:number,role=5)=>modules.find(m=>m.team===team&&m.face<2&&m.role===role)!.id;
export const events=[
 {id:'hiring',kind:1,sources:[node(0)],links:[{from:node(0),to:node(0,7),start:1.1,duration:1},{from:node(0,7),to:node(1),start:2.5,duration:1.1}]},
 {id:'accountability',kind:3,sources:[node(3)],links:[{from:node(3),to:node(4),start:1.1,duration:1},{from:node(4),to:node(5),start:2.5,duration:1.1}]},
 {id:'merger',kind:2,sources:[node(6),node(9)],links:[{from:node(6),to:node(10),start:1.2,duration:1.3},{from:node(9),to:node(10),start:1.2,duration:1.3},{from:node(10),to:node(7),start:3,duration:1.1}]},
 {id:'transformation',kind:1,sources:[node(12)],links:[{from:node(12),to:node(13),start:1,duration:1.1},{from:node(12),to:node(15),start:1,duration:1.1},{from:node(13),to:node(16),start:2.6,duration:1.3}]},
 {id:'feedback',kind:3,sources:[node(11)],links:[{from:node(11),to:node(13),start:1,duration:1.1},{from:node(13),to:node(8),start:2.7,duration:1.3},{from:node(8),to:node(11),start:4.5,duration:1.2}]},
 {id:'remit',kind:2,sources:[node(5),node(12)],links:[{from:node(5),to:node(4),start:1.1,duration:1.1},{from:node(12),to:node(13),start:1.1,duration:1.1}]}
] as const;
export function eventState(p:number,time:number,enabled=true){
 const phase=phaseAt(p),cycle=Math.floor(Math.max(0,time)/11),event=events[phase===1&&cycle%2?5:phase]!,clock=Math.max(0,time)%11;
 const amount=enabled?smooth(clock/.55)*(1-smooth((clock-6.7)/1.3)):0;
 const arrivals:Record<number,number>={};for(const id of event.sources)arrivals[id]=0;
 for(const link of event.links)arrivals[link.to]=Math.min(arrivals[link.to]??Infinity,link.start+link.duration);
 const activation=(id:number)=>clock>=(arrivals[id]??Infinity)?amount*(.7+.3*Math.sin((clock-(arrivals[id]??0))*1.8)**2):0;
 return {id:event.id,index:events.indexOf(event),kind:event.kind,phase,clock,amount,sources:[...event.sources],links:event.links.map(l=>({...l,u:(clock-l.start)/l.duration})),arrivals,activation};
}
export function modulePose(m:Module,p:number,time:number,_candidate:Candidate='spine',signals=true){
 const onset=m.kind==='beam'?.25+rand(m.seed)*.18:rand(m.seed)*.12;
 const progress=smooth((p-onset)/(1-onset));
 const position:V3=progress===1?[...m.target]:lerp(m.initial.position,m.target,progress),size:V3=progress===1?[...m.size]:lerp(m.initial.size,m.size,progress),rotation:V3=progress===1?[0,0,0]:lerp(m.initial.rotation,[0,0,0],progress);
 const e=eventState(p,time,signals),signal=e.activation(m.id);
 // Decision and capability panels respond after arrival. Structural decks remain stable.
 if(m.kind==='panel'&&m.role===5&&signal){
  const travel=e.id==='merger'?-.10:e.id==='accountability'?.05:.10;
  for(let a=0;a<3;a++)position[a]!+=m.normal[a]!*travel*signal;
  if(e.id==='hiring')size[1]*=1+.12*signal;
  else if(e.id==='merger')size[m.face%2?2:0]*=1+.16*signal;
  else if(e.id==='transformation')size[1]*=1+.08*signal;
  else if(e.id==='feedback')rotation[1]+=.12*Math.sin(e.clock)*signal;
  else if(e.id==='remit')position[1]+=.08*signal;
 }
 return {position,size,rotation,signal,event:e.kind};
}
export function eventAnchor(p:number,time:number,signals=true){const event=eventState(p,time,signals);return {event,module:modules.find(m=>m.id===event.sources[0])!};}
