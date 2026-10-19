import {test} from 'node:test';
import assert from 'node:assert/strict';
import {deform,topology,RIBBONS,SEGMENTS,SIDES} from '../src/scripts/lab/v5/morph.ts';
const buffer=()=>new Float32Array(RIBBONS*(SEGMENTS+1)*SIDES*3);
const values=[0,.1,.25,.4,.5,.6,.75,.9,1];
const distance=(a,i,j)=>Math.hypot(a[i]-a[j],a[i+1]-a[j+1],a[i+2]-a[j+2]);
test('arbitrary progress is deterministic in both directions and has bounded local displacement',()=>{
 const frames=values.map(p=>{const a=buffer();deform(p,a);return a;});
 for(let i=values.length-1;i>=0;i--){const a=buffer();deform(values[i],a);assert.deepEqual(a,frames[i]);}
 const a=buffer(),b=buffer();
 for(let p=0;p<=1;p+=.0137){deform(p,a);deform(Math.min(1,p+.0001),b);let max=0;for(let i=0;i<a.length;i++)max=Math.max(max,Math.abs(a[i]-b[i]));assert.ok(max<.02,`discontinuity at ${p}: ${max}`);assert.ok(a.every(Number.isFinite));}
});
test('morph changes internal shape and relationships rather than applying rigid transforms',()=>{
 const lengths=values.map(p=>{const a=buffer();deform(p,a);return distance(a,0,Math.floor(SEGMENTS/2)*SIDES*3);});
 assert.ok(Math.max(...lengths)-Math.min(...lengths)>1,'within-ribbon distance must change');
 const a=buffer(),b=buffer();deform(0,a);deform(1,b);assert.ok(Math.abs(distance(a,0,(RIBBONS/3)*(SEGMENTS+1)*SIDES*3)-distance(b,0,(RIBBONS/3)*(SEGMENTS+1)*SIDES*3))>1,'family relationship must change');
});
test('one immutable valid closed topology covers every persistent band',()=>{
 const indices=topology(),vertices=RIBBONS*(SEGMENTS+1)*SIDES;
 assert.ok(indices.every(i=>Number.isInteger(i)&&i>=0&&i<vertices));
 const edges=new Map();for(let i=0;i<indices.length;i+=3)for(let k=0;k<3;k++){const a=indices[i+k],b=indices[i+(k+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(':');edges.set(key,(edges.get(key)||0)+1);}
 assert.ok([...edges.values()].every(count=>count===2),'closed manifold edge incidence');
});

test('deformation normals stay finite and unit length at intermediate progress',()=>{
 const positions=buffer(),normals=buffer();
 for(const p of values){deform(p,positions,normals);for(let i=0;i<normals.length;i+=3){assert.ok(Number.isFinite(normals[i]+normals[i+1]+normals[i+2]));assert.ok(Math.abs(Math.hypot(normals[i],normals[i+1],normals[i+2])-1)<.00001);}}
});
