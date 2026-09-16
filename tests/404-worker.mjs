import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';
const origin = 'https://staging.arkadiuszkamrowski.com';
const fetched = [];
const env = {
  DEPLOYMENT_ENV: 'staging',
  ASSETS: { async fetch(request) {
    const pathname = new URL(request.url).pathname;
    fetched.push(pathname);
    if (pathname === '/en/404') return new Response('<html lang="en"><h1>That page isn\'t here.</h1></html>', {status:200,headers:{'Content-Type':'text/html; charset=utf-8'}});
    if (pathname === '/en/about') return new Response('<html lang="en">About</html>', {status:200});
    return new Response('<html lang="pl">Nie ma tu tej strony.</html>', {status:404,headers:{'Content-Type':'text/html; charset=utf-8'}});
  }},
};
const missingEn=await worker.fetch(new Request(origin+'/en/unknown-slug'), env);
assert.equal(missingEn.status,404);
assert.match(await missingEn.text(), /lang="en"/);
assert.equal(missingEn.headers.get('x-robots-tag'),'noindex, nofollow, noarchive');
assert.deepEqual(fetched,['/en/unknown-slug','/en/404']);
fetched.length=0;
const missingPl=await worker.fetch(new Request(origin+'/nie-ma'),env);
assert.equal(missingPl.status,404);
assert.match(await missingPl.text(), /lang="pl"/);
assert.deepEqual(fetched,['/nie-ma']);
fetched.length=0;
const existing=await worker.fetch(new Request(origin+'/en/about'),env);
assert.equal(existing.status,200);
assert.deepEqual(fetched,['/en/about']);
console.log('PL and EN 404 worker routing: PASS');
