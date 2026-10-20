import {test} from 'node:test';
import assert from 'node:assert/strict';
import {teams,modules,edges,modulePose,edgePose,eventState,target,departments,organizations} from '../src/scripts/lab/v6/model.ts';

test('persistent identities, heterogeneous membership and cross-department graph',()=>{
 assert.equal(new Set(modules.map(m=>m.id)).size,modules.length);assert.ok(modules.length>=300);
 assert.ok(new Set(teams.map(t=>t.size)).size>10);assert.equal(new Set(teams.map(t=>t.department)).size,5);
 assert.equal(organizations.length,3);for(const m of modules)assert.equal(m.organization,departments[m.department].organization);
 assert.deepEqual([...new Set(edges.map(e=>e.strength))].sort(),['loose','moderate','strong']);
 assert.ok(edges.some(e=>e.cross&&teams[e.to].parent!==e.from));
 const reached=new Set([0]);while(true){const n=reached.size;edges.forEach(e=>{if(reached.has(e.from))reached.add(e.to);});if(n===reached.size)break;}assert.equal(reached.size,teams.length);
});
test('frozen-time forward/reverse seek reproduces actual poses with continuous structural change',()=>{
 const checkpoints=Array.from({length:11},(_,i)=>i/10),saved=checkpoints.map(p=>modules.map(m=>modulePose(m,p,2)));
 for(let i=10;i>=0;i--)assert.deepEqual(modules.map(m=>modulePose(m,checkpoints[i],2)),saved[i]);
 for(const p of checkpoints)for(const m of modules){const a=modulePose(m,p,0),b=modulePose(m,Math.min(1,p+.00001),0);assert.ok(a.position.every(Number.isFinite));assert.ok(a.size.every(v=>v>0));assert.ok(Math.hypot(...a.position.map((v,i)=>v-b.position[i]))<.003);}
 assert.notDeepEqual(saved[0][0].size,saved[10][0].size);assert.notDeepEqual(saved[0][0].position,saved[10][0].position);
});
test('strength affects physical interfaces; all final edges connect and grow continuously',()=>{
 const sizes={};for(const e of edges){const end=edgePose(e,1,0);assert.equal(end.growth,1);sizes[e.strength]=end.thickness;assert.equal(edgePose(e,0,0).growth,0);}
 assert.ok(sizes.strong>sizes.moderate*1.5);assert.ok(sizes.moderate>sizes.loose*2);
});
test('final internal and peripheral agency; bounded motion, fixed seams, real signal consequences',()=>{
 for(const team of [1,7,10,16]){const ms=modules.filter(m=>m.team===team),changes=ms.map(m=>Math.abs(modulePose(m,1,0,'spine',false).position[2]-modulePose(m,1,2,'spine',false).position[2]));assert.ok(Math.max(...changes)>.01);assert.ok(Math.max(...changes)<.1);}
 const structural=modules.find(m=>m.kind==='beam'&&m.id%9!==0);assert.deepEqual(modulePose(structural,1,0,'spine',false),modulePose(structural,1,8,'spine',false));
 for(const [t,team,kind] of [[1.5,1,1],[7.5,5,2],[13.5,10,3]]){assert.equal(eventState(1,t).kind,kind);const m=modules.find(m=>m.team===team&&m.kind==='panel');assert.notDeepEqual(modulePose(m,1,t,'spine',true),modulePose(m,1,t,'spine',false));}
 assert.ok(edgePose(edges[18],1,7.5).thickness>edgePose(edges[18],1,7.5,'spine',false).thickness);
});
test('three genuinely different final spatial candidates retain an open unequal extent',()=>{
 const shapes=['spine','mesh','cantilever'].map(c=>teams.map(t=>target(t,c)));assert.equal(new Set(shapes.map(JSON.stringify)).size,3);
 for(const shape of shapes){const widths=[0,1,2].map(a=>Math.max(...shape.map(v=>v[a]))-Math.min(...shape.map(v=>v[a])));assert.ok(widths[0]>5);assert.ok(widths[1]>3);assert.ok(widths[2]>1);}
});
