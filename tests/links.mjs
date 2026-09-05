import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const external = new Set();
const errors = [];
const warnings = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path));
    else out.push(path);
  }
  return out;
}

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function internalTargetExists(href, sourceFile) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return true;
  const decoded = decodeURIComponent(clean);
  if (decoded.startsWith('/')) {
    const relative = decoded.replace(/^\/+/, '');
    if (!relative) return exists(join(dist, 'index.html'));
    if (extname(relative)) return exists(join(dist, relative));
    return (await exists(join(dist, relative))) || (await exists(join(dist, relative, 'index.html'))) || (await exists(join(dist, `${relative}.html`)));
  }
  const base = dirname(sourceFile);
  const candidate = join(base, decoded);
  if (extname(decoded)) return exists(candidate);
  return (await exists(candidate)) || (await exists(join(candidate, 'index.html')));
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    if (/^https?:\/\//i.test(href)) {
      try { external.add(new URL(href).toString()); }
      catch { errors.push(`${file}: invalid external URL ${href}`); }
      continue;
    }
    if (!(await internalTargetExists(href, file))) errors.push(`${file}: broken internal link ${href}`);
  }
}

async function checkExternal(url) {
  const request = async (method) => fetch(url, {
    method,
    redirect: 'follow',
    headers: { 'User-Agent': 'ArkadiuszKamrowskiSite-LinkAudit/1.0' },
    signal: AbortSignal.timeout(10000),
  });
  try {
    let response = await request('HEAD');
    if (response.status === 405 || response.status === 501) response = await request('GET');
    if (response.status === 404 || response.status === 410) errors.push(`external link returned ${response.status}: ${url}`);
    else if (response.status >= 400) warnings.push(`external link returned ${response.status} (reachable but restricted/transient): ${url}`);
  } catch (error) {
    warnings.push(`external link could not be verified from CI (${error?.name || 'network error'}): ${url}`);
  }
}

const urls = [...external];
for (let i = 0; i < urls.length; i += 4) await Promise.all(urls.slice(i, i + 4).map(checkExternal));

for (const warning of warnings) console.warn(`LINK AUDIT WARNING · ${warning}`);
if (errors.length) {
  console.error('LINK AUDIT FAILED');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`LINK AUDIT PASS · ${htmlFiles.length} HTML files · ${urls.length} external URLs checked`);
