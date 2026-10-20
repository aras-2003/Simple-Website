import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {artifactScopes} from './artifact-scope.mjs';

test('lab allowance includes dynamic dependencies but never shared or orphan assets',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'decision-artifact-'));
  try {
    const sources={
      'index.html':'<script src="/_astro/main.js"></script>',
      'lab/decision-theatre-v2/index.html':'<script src="/_astro/lab.js"></script>',
      '_astro/main.js':'import "./shared.js";',
      '_astro/lab.js':'import "./shared.js"; import(`./graphics.js`)',
      '_astro/graphics.js':'export const graphics=true;',
      '_astro/shared.js':'export const shared=true;',
      '_astro/orphan.js':'unreferencedPayload();',
    };
    for(const [name,source] of Object.entries(sources)){
      const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,source);
    }
    const files=Object.keys(sources).map(file=>path.join(root,file));
    let scope=artifactScopes(root,files);
    const lab=scope.labFiles.map(file=>path.relative(root,file)).sort();
    assert.deepEqual(lab,['_astro/graphics.js','_astro/lab.js','lab/decision-theatre-v2/index.html']);
    assert.ok(scope.mainFiles.includes(path.join(root,'_astro/orphan.js')));
    fs.appendFileSync(path.join(root,'_astro/main.js'),'import(`./graphics.js`);');
    scope=artifactScopes(root,files);
    assert.ok(scope.mainFiles.includes(path.join(root,'_astro/graphics.js')),'public use must charge graphics against the unchanged public limit');
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('shared experimental chunks are charged to both V3 and V4, while public use wins',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'decision-v4-scope-'));
 try{
  const sources={'index.html':'<script src="/_astro/public.js"></script>','lab/decision-theatre-v2/index.html':'<script src="/_astro/v3.js"></script>','lab/decision-theatre-v4/index.html':'<script src="/_astro/v4.js"></script>','_astro/v3.js':'import "./three.js"','_astro/v4.js':'import "./three.js"','_astro/three.js':'export const three=true','_astro/public.js':'export const publicSite=true','_astro/orphan.js':'orphan()'};
  for(const [name,source] of Object.entries(sources)){const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,source);}
  const files=Object.keys(sources).map(file=>path.join(root,file));let result=artifactScopes(root,files);const shared=path.join(root,'_astro/three.js');
  assert.ok(result.labFiles.includes(shared));assert.ok(result.spikeFiles.includes(shared));assert.ok(!result.mainFiles.includes(shared));assert.ok(result.mainFiles.includes(path.join(root,'_astro/orphan.js')));
  fs.appendFileSync(path.join(root,'_astro/public.js'),'import "./three.js"');result=artifactScopes(root,files);assert.ok(result.mainFiles.includes(shared));assert.ok(!result.spikeFiles.includes(shared));assert.ok(!result.labFiles.includes(shared));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('V5 is separately charged and its shared dependencies stay chargeable to public use',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'decision-v5-scope-'));
 try{
  const sources={'index.html':'<script src="/_astro/public.js"></script>','lab/decision-theatre-v4/index.html':'<script src="/_astro/v4.js"></script>','lab/decision-theatre-v5/index.html':'<script src="/_astro/v5.js"></script>','en/lab/decision-theatre-v5/index.html':'<script src="/_astro/v5.js"></script>','_astro/v4.js':'import "./three.js"','_astro/v5.js':'import "./three.js"','_astro/three.js':'export const three=true','_astro/public.js':'export const publicSite=true'};
  for(const [name,source] of Object.entries(sources)){const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,source);}
  const files=Object.keys(sources).map(file=>path.join(root,file)),shared=path.join(root,'_astro/three.js');
  let result=artifactScopes(root,files);assert.ok(result.morphFiles.includes(shared));assert.ok(result.spikeFiles.includes(shared));assert.ok(!result.mainFiles.includes(shared));
  fs.appendFileSync(path.join(root,'_astro/public.js'),'import "./three.js"');result=artifactScopes(root,files);assert.ok(result.mainFiles.includes(shared));assert.ok(!result.morphFiles.includes(shared));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('V6 includes bilingual roots and shared GPU chunks; public imports remain charged',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'living-v6-scope-'));
 try{
  const sources={'index.html':'<script src="/_astro/public.js"></script>','lab/living-architecture-v6/index.html':'<script src="/_astro/v6.js"></script>','en/lab/living-architecture-v6/index.html':'<script src="/_astro/v6.js"></script>','lab/decision-theatre-v5/index.html':'<script src="/_astro/v5.js"></script>','_astro/v6.js':'import "./three.js"','_astro/v5.js':'import "./three.js"','_astro/three.js':'export const three=true','_astro/public.js':'export const publicSite=true'};
  for(const [name,source] of Object.entries(sources)){const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,source);}
  const files=Object.keys(sources).map(file=>path.join(root,file)),shared=path.join(root,'_astro/three.js');let scope=artifactScopes(root,files);
  assert.ok(scope.livingFiles.includes(shared));assert.ok(scope.morphFiles.includes(shared));assert.ok(scope.livingFiles.includes(path.join(root,'en/lab/living-architecture-v6/index.html')));assert.ok(!scope.mainFiles.includes(shared));
  fs.appendFileSync(path.join(root,'_astro/public.js'),'import "./three.js"');scope=artifactScopes(root,files);assert.ok(scope.mainFiles.includes(shared));assert.ok(!scope.livingFiles.includes(shared));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
