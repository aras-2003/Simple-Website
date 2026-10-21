import {test} from 'node:test';
import assert from 'node:assert/strict';
import {volumes,dimensions} from '../src/scripts/lab/v7/model.ts';
const inside=(x,y,polygon)=>{
 let found=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [xi,yi]=polygon[i],[xj,yj]=polygon[j];
  if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)found=!found;
 }return found;
};
const contains=(v,x,y,z)=>inside(v.axis==='side'?z:x,y,v.section)&&(v.axis==='side'?x:z)>v.depth[0]&&(v.axis==='side'?x:z)<v.depth[1];
const edge=(a,b)=>[a,b].sort().join('|');
// Interior cells cover every axis-aligned nominal solid on the authored 0.15 grid.
// Fillets and thin surface finishes are deliberately excluded from this structural test.
const cells=new Map(),contacts=new Set(),overlaps=[];
for(let x=0;x<48;x++)for(let y=0;y<54;y++)for(let z=0;z<40;z++){
 const owners=volumes.filter(v=>contains(v,-3.6+(x+.5)*.15,(y+.5)*.15,-3+(z+.5)*.15));
 if(owners.length>1)overlaps.push({x,y,z,ids:owners.map(v=>v.id)});
 if(owners.length)cells.set(`${x},${y},${z}`,owners[0].id);
}
for(const [key,id] of cells){const [x,y,z]=key.split(',').map(Number);for(const neighbor of [`${x+1},${y},${z}`,`${x},${y+1},${z}`,`${x},${y},${z+1}`]){const other=cells.get(neighbor);if(other&&other!==id)contacts.add(edge(id,other));}}
test('canonical profiles use one modular orthogonal grammar and unique stable identities',()=>{
 assert.equal(new Set(volumes.map(v=>v.id)).size,volumes.length);
 for(const v of volumes){assert.ok(v.purpose.length>20);assert.ok(v.depth[1]>v.depth[0]);for(let i=0;i<v.section.length;i++){const a=v.section[i],b=v.section[(i+1)%v.section.length];assert.ok(a[0]===b[0]||a[1]===b[1],`${v.id} non-orthogonal edge`);for(const n of a)assert.ok(Math.abs(n/.15-Math.round(n/.15))<1e-7);}}
 assert.deepEqual([dimensions.width,dimensions.height,dimensions.depth],[7.2,8.1,6]);
});
test('nominal solids do not intersect; every declared structural connection is a real face contact',()=>{
 assert.deepEqual(overlaps,[]);
 for(const v of volumes)for(const join of v.joins){assert.ok(volumes.some(other=>other.id===join),`missing ${join}`);assert.ok(contacts.has(edge(v.id,join)),`${v.id} -> ${join} has no contact`);}
});
test('the complete target is connected in depth; chambers contain true through-space',()=>{
 const seen=new Set([volumes[0].id]);let previous=0;
 while(previous!==seen.size){previous=seen.size;for(const pair of contacts){const [a,b]=pair.split('|');if(seen.has(a)||seen.has(b)){seen.add(a);seen.add(b);}}}
 assert.equal(seen.size,volumes.length,'no disconnected or floating macro-volume');
 for(const z of [-2,-1,0,1])assert.ok(!volumes.some(v=>contains(v,-2,6.9,z)),'western upper through-void must stay open');
 assert.ok(volumes.some(v=>contains(v,0,4,-2.5)),'rear spine must be a real structural mass');
});
