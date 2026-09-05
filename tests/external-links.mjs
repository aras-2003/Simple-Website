import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const ownHost = 'arkadiuszkamrowski.com';
const skipHosts = new Set(['www.linkedin.com', 'linkedin.com']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

async function check(url) {
  const options = {
    redirect: 'follow',
    signal: AbortSignal.timeout(10_000),
    headers: { 'User-Agent': 'ArkadiuszKamrowski-prelaunch-link-check/1.0' },
  };
  let response = await fetch(url, { ...options, method: 'HEAD' });
  if ([405, 501].includes(response.status)) response = await fetch(url, { ...options, method: 'GET' });
  return response.status;
}

const urls = new Set();
for (const file of await walk(dist)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\bhref="(https:\/\/[^"#]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'));
    if (url.hostname === ownHost || skipHosts.has(url.hostname)) continue;
    urls.add(url.href);
  }
}

const broken = [];
const uncertain = [];
for (const url of [...urls].sort()) {
  try {
    const status = await check(url);
    if ([404, 410].includes(status)) broken.push(`${status} ${url}`);
    else if (status >= 500) uncertain.push(`${status} ${url}`);
    else console.log(`EXTERNAL LINK ${status} ${url}`);
  } catch (error) {
    uncertain.push(`network ${url} · ${error?.name || 'error'}`);
  }
}

for (const item of uncertain) console.warn(`EXTERNAL LINK UNVERIFIED · ${item}`);
if (broken.length) {
  console.error('EXTERNAL LINK CHECK FAILED');
  broken.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`EXTERNAL LINK CHECK PASS · ${urls.size} references checked, ${uncertain.length} temporarily unverifiable`);
