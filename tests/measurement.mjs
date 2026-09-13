import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';

const origin = 'https://arkadiuszkamrowski.com';
const env = {PRODUCT_MEASUREMENT:'1', DEPLOYMENT_ENV:'production', CONTACT_ALLOWED_ORIGINS:origin,
  MEASUREMENT_RATE_LIMITER:{limit:async () => ({success:true})}};
const data = {event:'contact_intent', page:'article', locale:'pl', source:'linkedin'};
const request = (body = data, headers = {}, url = `${origin}/api/events`) => new Request(url, {
  method:'POST', headers:{Origin:origin, 'Content-Type':'application/json', ...headers},
  body:typeof body === 'string' ? body : JSON.stringify(body),
});
const savedLog = console.log;
const logs = [];
console.log = entry => logs.push(entry);
try {
  // The actual routed Worker must accept only the exact non-identifying schema.
  assert.equal((await worker.fetch(request(),env)).status,204);
  assert.deepEqual(logs.pop(), {kind:'product_event', version:1, environment:'production', ...data});
  for (const bad of [null, [], 1, '{', {...data,email:'private@example.com'}, {...data,page:'/contact?email=private'}, {...data,source:'private.example.com'}, {...data,event:'private message'}, {...data,event:'form_success',page:'home'}, {...data,event:'advisory_intent',page:'about'}]) {
    assert.equal((await worker.fetch(request(bad === null ? 'null' : bad), env)).status,400);
  }
  assert.equal(logs.length,0,'rejected payloads must never enter product logs');
  // Cross-origin injection, oversized streaming bodies and exhausted limits must fail closed.
  assert.equal((await worker.fetch(request(data,{Origin:'https://evil.example'}),env)).status,403);
  assert.equal((await worker.fetch(request(data,{Origin:''}),env)).status,403);
  assert.equal((await worker.fetch(request(data,{'Content-Type':'text/plain'}),env)).status,415);
  assert.equal((await worker.fetch(request('x'.repeat(257)),env)).status,413);
  assert.equal((await worker.fetch(request(data,{},`${origin}/api/events?email=private`),env)).status,400);
  assert.equal((await worker.fetch(request(),{...env,MEASUREMENT_RATE_LIMITER:undefined})).status,503);
  assert.equal((await worker.fetch(request(),{...env,MEASUREMENT_RATE_LIMITER:{limit:async()=>({success:false})}})).status,429);
  // Opt-outs and disabled measurement must succeed silently without processing data.
  for (const headers of [{DNT:'1'},{'Sec-GPC':'1'}]) assert.equal((await worker.fetch(request(data,headers),env)).status,204);
  assert.equal((await worker.fetch(request(),{...env,PRODUCT_MEASUREMENT:'0'})).status,204);
  assert.equal(logs.length,0);
  // Every supported event is accepted with valid dimensions, and staging is isolated/noindex.
  for (const event of ['page_view','language_switch','form_start','form_success','form_error']) assert.equal((await worker.fetch(request({...data,event,page:'contact'}),env)).status,204);
  const staging = await worker.fetch(request(),{...env,DEPLOYMENT_ENV:'staging'});
  assert.equal(staging.headers.get('x-robots-tag'),'noindex, nofollow, noarchive');
  assert.equal(logs.at(-1).environment,'staging');
} finally { console.log = savedLog; }
console.log('MEASUREMENT PASS · strict schema, no PII logging, opt-outs, body limits, origin and separate rate limits');
