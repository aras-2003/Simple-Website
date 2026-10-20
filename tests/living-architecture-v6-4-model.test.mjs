import test from 'node:test';
import assert from 'node:assert/strict';
import {modules,events,eventState,modulePose,phaseAt,teams} from '../src/scripts/lab/v6-4/model.ts';
import {modules as original,modulePose as legacy} from '../src/scripts/lab/v6/model.ts';
test('all original identities preserve their actual chaotic pose',()=>{
 for(const m of original){const n=modules.find(n=>n.id===m.id);const p=modulePose(n,0,0,'spine',false),q=legacy(m,0,0,'spine',false);for(const key of ['position','size','rotation'])assert.deepEqual(p[key],q[key]);}
 assert.equal(new Set(modules.map(m=>m.id)).size,modules.length);assert.ok(modules.every((m,i)=>m.id===i));
});
test('four inhabited elevations and internal cores form a near-cubic volume',()=>{
 for(let f=0;f<4;f++){assert.equal(modules.filter(m=>m.face===f).length,252);assert.ok(modules.some(m=>m.face===f&&m.role===5));}
 assert.equal(modules.filter(m=>m.face===4).length,18);
 const spans=[0,1,2].map(a=>Math.max(...modules.map(m=>m.target[a]+m.size[a]/2))-Math.min(...modules.map(m=>m.target[a]-m.size[a]/2)));
 assert.ok(Math.max(...spans)/Math.min(...spans)<1.1);
});
test('every member exactly occupies its vision and is reversible independently of event time',()=>{
 for(const m of modules){const end=modulePose(m,1,0,'spine',false);assert.deepEqual(end.position,m.target);assert.deepEqual(end.size,m.size);assert.ok(end.rotation.every(n=>Math.abs(n)<1e-12));const forward=modulePose(m,.43,2,'spine',false);modulePose(m,.9,8);assert.deepEqual(modulePose(m,.43,2,'spine',false),forward);}
});
test('different dependencies yield shared floors, defined thresholds and larger separation',()=>{
 const widths=['strong','moderate','loose'].map(strength=>modules.find(m=>m.role===0&&m.face===0&&teams[m.team].strength===strength).size[0]);assert.ok(widths[0]>widths[1]&&widths[1]>widths[2]);
});
test('causal receivers activate only after arrival; merger has simultaneous origins',()=>{
 const e=events[2];assert.equal(e.sources.length,2);const first=e.links[0];assert.equal(eventState(.5,first.start+first.duration-.01).activation(first.to),0);assert.ok(eventState(.5,first.start+first.duration+.01).activation(first.to)>0);for(const source of e.sources)assert.ok(eventState(.5,.8).activation(source)>0);
});
test('phase clocks select events independently of scroll inside each phase',()=>{
 for(let phase=0;phase<4;phase++){assert.equal(phaseAt(phase/4),phase);assert.equal(eventState(phase/4+.01,3).id,eventState(phase/4+.2,3).id);}assert.equal(eventState(1,3).id,'feedback');assert.equal(eventState(.25,14).id,'remit');
});
test('only arrived capability panels respond; structural mass does not drift',()=>{
 const e=eventState(1,3.2);for(const m of modules){const a=modulePose(m,1,3.2),b=modulePose(m,1,3.2,'spine',false);if(m.kind==='beam'||!e.activation(m.id))assert.deepEqual(a.position,b.position);for(let i=0;i<3;i++)assert.ok(Math.abs(a.position[i]-b.position[i])<=.101);}
});
