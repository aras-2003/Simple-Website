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
