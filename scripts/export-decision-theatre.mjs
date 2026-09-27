// Export the isolated compiled route as an offline review artifact.
// Run after SITE_BASE_URL=https://arkadiuszkamrowski.com npm run build.
import fs from 'node:fs';
import path from 'node:path';
const dist=path.resolve('dist');
const output=path.resolve(process.argv[2] || 'artifacts/Decision-Theatre-04.html');
let html=fs.readFileSync(path.join(dist,'lab/decision-theatre/index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,src)=>`<style>${fs.readFileSync(path.join(dist,src),'utf8')}</style>`);
html=html.replace(/<script type="module" src="([^"]+)"><\/script>/g,(_,src)=>`<script type="module">${fs.readFileSync(path.join(dist,src),'utf8').replaceAll('</script','<\\/script')}</script>`);
html=html.replace(/href="\/(?!\/)([^"]*)"/g,(_,url)=>`href="https://arkadiuszkamrowski.com/${url}"`);
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,html);
console.log(`${output}: ${Buffer.byteLength(html)} bytes`);
