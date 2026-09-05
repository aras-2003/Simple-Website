import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distUrl = new URL('../dist/', import.meta.url);
const dist = fileURLToPath(distUrl);
const productionOrigin = 'https://arkadiuszkamrowski.com';
const noteSlugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'ai-governance-without-theatre', 'transformation-operating-model'];
const sharedSlugs = ['', 'about', 'oaf', 'work', 'writing', 'contact', 'privacy'];
const requiredRoutes = [
  ...sharedSlugs.map((slug) => slug ? `/${slug}` : '/'),
  ...noteSlugs.map((slug) => `/writing/${slug}`),
  ...sharedSlugs.map((slug) => slug ? `/en/${slug}` : '/en'),
  ...noteSlugs.map((slug) => `/en/writing/${slug}`),
];
const articleRoutes = new Set([
  ...noteSlugs.map((slug) => `/writing/${slug}`),
  ...noteSlugs.map((slug) => `/en/writing/${slug}`),
]);
const forbiddenPlUi = ['Conversation', 'Working model', 'Context first', 'Cross-system leverage', 'System view', 'Direct message'];
const portraitAsset = /\/assets\/arkadiusz-kamrowski[^"'<> ]*\.(?:webp|png|jpe?g)/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function routeFile(route) {
  const clean = route.replace(/^\//, '');
  return join(dist, clean ? `${clean}/index.html` : 'index.html');
}

async function localTargetExists(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/, 1)[0]);
  if (!clean || clean === '/') return true;
  const relativePath = clean.replace(/^\//, '');
  const candidates = extname(relativePath)
    ? [join(dist, relativePath)]
    : [join(dist, relativePath, 'index.html'), join(dist, relativePath)];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return true;
    } catch {}
  }
  return false;
}

let errors = [];
for (const route of requiredRoutes) {
  const file = routeFile(route);
  let html;
  try { html = await readFile(file, 'utf8'); }
  catch { errors.push(`${route}: missing generated HTML`); continue; }
  const expectedLang = route.startsWith('/en') ? 'en' : 'pl';
  const expectedCanonical = `${productionOrigin}${route === '/' ? '/' : route}`;
  const checks = [
    [new RegExp(`<html[^>]+lang=["']${expectedLang}["']`), 'correct html lang'],
    [/<title>[^<]+<\/title>/, 'title'],
    [/<meta name="description" content="[^"]+"/, 'meta description'],
    [new RegExp(`<link rel="canonical" href="${expectedCanonical.replaceAll('.', '\\.')}"`), 'production canonical'],
    [/<link rel="alternate" hreflang="pl"/, 'PL hreflang'],
    [/<link rel="alternate" hreflang="en"/, 'EN hreflang'],
    [/<main id="main"/, 'main landmark'],
    [/class="skip-link"/, 'skip link'],
    [/<nav[^>]+aria-label=/, 'labelled navigation'],
    [/<meta property="og:image" content="https:\/\/arkadiuszkamrowski\.com\/assets\/og-card\.png"/, 'raster OG image'],
    [/<meta property="og:image:width" content="1200"/, 'OG image width'],
    [/<meta property="og:image:height" content="630"/, 'OG image height'],
    [/<meta property="og:image:alt" content="[^"]+"/, 'OG image alt'],
    [/<meta name="twitter:card" content="summary_large_image"/, 'Twitter card'],
  ];
  for (const [regex, name] of checks) if (!regex.test(html)) errors.push(`${route}: missing ${name}`);

  const h1s = (html.match(/<h1\b/g) || []).length;
  if (h1s !== 1) errors.push(`${route}: expected one h1, found ${h1s}`);
  if (/target="_blank"(?![^>]*rel="[^"]*noopener)/.test(html)) errors.push(`${route}: target=_blank without noopener`);
  if (/\{\{[A-Z0-9_]+\}\}/.test(html)) errors.push(`${route}: unresolved build token`);
  if (/<script(?![^>]*\bsrc=)[^>]*>/.test(html)) errors.push(`${route}: inline script found; CSP requires external scripts`);

  if (articleRoutes.has(route)) {
    if (!/<meta property="og:type" content="article"/.test(html)) errors.push(`${route}: article OG type expected`);
    if (!/<meta property="article:published_time" content="[^"]+"/.test(html)) errors.push(`${route}: article published time expected`);
    if (!/itemtype="https:\/\/schema\.org\/Article"/.test(html)) errors.push(`${route}: Article structured data expected`);
  } else if (!/<meta property="og:type" content="website"/.test(html)) {
    errors.push(`${route}: website OG type expected`);
  }

  if (expectedLang === 'pl') {
    for (const token of forbiddenPlUi) if (html.includes(`>${token}<`)) errors.push(`${route}: untranslated UI token ${token}`);
  }
}

const home = await readFile(routeFile('/'), 'utf8');
if (portraitAsset.test(home)) errors.push('/: portrait must not appear on Home');
if (home.includes('Dyrektor Departamentu')) errors.push('/: employment title must not appear on Home');
if (home.includes('Kozminski University')) errors.push('/: credentials must not appear on Home');
for (const cls of ['problem-section', 'evidence-section-home', 'oaf-teaser-home', 'deeper-paths']) {
  if (!home.includes(cls)) errors.push(`/: missing lightweight narrative section ${cls}`);
}
for (const removed of ['thesis-section', 'perspective-teaser', 'practice-teaser', 'author-teaser']) {
  if (home.includes(removed)) errors.push(`/: legacy heavy section ${removed} must stay off Home`);
}
const homeOrder = ['problem-section', 'evidence-section-home', 'oaf-teaser-home', 'deeper-paths'].map((token) => home.indexOf(token));
for (let i = 1; i < homeOrder.length; i++) if (homeOrder[i] <= homeOrder[i - 1]) errors.push('/: lightweight narrative order is incorrect');

const about = await readFile(routeFile('/about'), 'utf8');
if (!portraitAsset.test(about)) errors.push('/about: portrait expected on About');
if (!about.includes('career-river')) errors.push('/about: career trajectory expected');
if (!about.includes('brand-profile')) errors.push('/about: brand profile expected');
if (about.includes('Dyrektor Departamentu') || about.includes('Director of Enterprise Architecture, Strategy & PMO')) errors.push('/about: employment title must not define the brand profile');

const perspective = await readFile(routeFile('/writing'), 'utf8');
if (!perspective.includes('evidence-ledger')) errors.push('/writing: evidence ledger expected');
if (!perspective.includes('publishing-standard')) errors.push('/writing: publishing standard expected');
if (/\b\d+\s+min\b/.test(perspective)) errors.push('/writing: reading-time metadata should not be shown in the library');

const practice = await readFile(routeFile('/work'), 'utf8');
if (!practice.includes('case-study-list')) errors.push('/work: case studies expected');
const caseCount = (practice.match(/class="case-study-item"/g) || []).length;
if (caseCount !== 6) errors.push(`/work: expected 6 case studies, found ${caseCount}`);

const oaf = await readFile(routeFile('/oaf'), 'utf8');
for (const cls of ['lineage-river', 'convergence-map', 'oaf-orbit', 'misfit-grid', 'decision-contract-section', 'boundary-list', 'oaf-use-section-polished']) {
  if (!oaf.includes(cls)) errors.push(`/oaf: missing depth layer ${cls}`);
}

const privacyPl = await readFile(routeFile('/privacy'), 'utf8');
for (const term of ['Administrator danych', 'Cel i podstawa prawna', 'Transfer poza EOG', 'Twoje prawa']) {
  if (!privacyPl.includes(term)) errors.push(`/privacy: missing GDPR information layer ${term}`);
}
const privacyEn = await readFile(routeFile('/en/privacy'), 'utf8');
for (const term of ['Data controller', 'Purpose and legal basis', 'Transfers outside the EEA', 'Your rights']) {
  if (!privacyEn.includes(term)) errors.push(`/en/privacy: missing GDPR information layer ${term}`);
}

const allFiles = await walk(dist);
for (const file of allFiles.filter((entry) => entry.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const rel = relative(dist, file);
  if (html.includes('javascript:void')) errors.push(`${rel}: javascript:void link`);
  if (html.includes('Dyrektor Departamentu Architektury Korporacyjnej, Strategii i PMO')) errors.push(`${rel}: stale employment title exposed`);
  if (html.includes('Director of Enterprise Architecture, Strategy & PMO')) errors.push(`${rel}: stale employment title exposed`);

  const references = [...html.matchAll(/\b(?:href|src)="(\/[^"]+)"/g)].map((match) => match[1]);
  for (const reference of new Set(references)) {
    if (!(await localTargetExists(reference))) errors.push(`${rel}: broken internal reference ${reference}`);
  }
}

if (errors.length) {
  console.error('STATIC VALIDATION FAILED');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`STATIC VALIDATION PASS · ${requiredRoutes.length} translated routes + SEO/social/privacy/internal-link gates`);
