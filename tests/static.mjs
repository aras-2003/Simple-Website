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

function requireOrderedClasses(html, route, classes, label) {
  const positions = classes.map((token) => html.indexOf(token));
  classes.forEach((token, index) => {
    if (positions[index] < 0) errors.push(`${route}: missing ${label} ${token}`);
  });
  for (let i = 1; i < positions.length; i++) {
    if (positions[i - 1] >= 0 && positions[i] >= 0 && positions[i] <= positions[i - 1]) {
      errors.push(`${route}: ${label} order is incorrect`);
    }
  }
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
requireOrderedClasses(home, '/', [
  'executive-hero',
  'executive-trigger-section',
  'executive-output-section',
  'executive-proof-section',
  'executive-method-section',
  'executive-close',
], 'executive narrative section');
for (const required of ['decision-system', 'outcome-blueprint', 'executive-case-rail']) {
  if (!home.includes(required)) errors.push(`/: missing visual storytelling layer ${required}`);
}
for (const removed of ['problem-section-light', 'evidence-section-home', 'deeper-paths', 'thesis-section', 'perspective-teaser', 'practice-teaser', 'author-teaser']) {
  if (home.includes(removed)) errors.push(`/: legacy narrative layer ${removed} must stay off executive Home`);
}
if (!home.includes('Współpraca')) errors.push('/: executive navigation/advisory label expected');
if (!home.includes('Opisz problem')) errors.push('/: problem-led contact CTA expected');

const homeEn = await readFile(routeFile('/en'), 'utf8');
if (!homeEn.includes('Advisory')) errors.push('/en: executive Advisory navigation label expected');
if (!homeEn.includes('Discuss a decision')) errors.push('/en: problem-led contact CTA expected');
for (const required of ['decision-system', 'outcome-blueprint', 'executive-case-rail']) {
  if (!homeEn.includes(required)) errors.push(`/en: missing visual storytelling layer ${required}`);
}

const about = await readFile(routeFile('/about'), 'utf8');
if (!portraitAsset.test(about)) errors.push('/about: portrait expected on About');
if (!about.includes('career-river')) errors.push('/about: career trajectory expected');
if (!about.includes('brand-profile')) errors.push('/about: brand profile expected');
if (about.includes('Dyrektor Departamentu') || about.includes('Director of Enterprise Architecture, Strategy & PMO')) errors.push('/about: employment title must not define the brand profile');

const perspective = await readFile(routeFile('/writing'), 'utf8');
if (!perspective.includes('benchmark-signal-field')) errors.push('/writing: visual benchmark signal field expected');
const benchmarkCount = (perspective.match(/class="benchmark-signal"/g) || []).length;
if (benchmarkCount !== 3) errors.push(`/writing: expected 3 benchmark signals, found ${benchmarkCount}`);
if (perspective.includes('benchmark-signal-ruler')) errors.push('/writing: benchmark signals must not imply a shared quantitative scale');
if (!perspective.includes('publishing-standard')) errors.push('/writing: publishing standard expected');
if (/\b\d+\s+min\b/.test(perspective)) errors.push('/writing: reading-time metadata should not be shown in the library');

const practice = await readFile(routeFile('/work'), 'utf8');
requireOrderedClasses(practice, '/work', [
  'engagement-section',
  'advisory-canvas-section',
  'advisory-domains-section',
  'executive-case-study-section',
  'advisory-close',
], 'advisory narrative section');
for (const required of ['decision-architecture-delta', 'engagement-grid', 'portfolio-tradeoff-matrix', 'advisory-domain-grid', 'case-study-list', 'case-proof-item']) {
  if (!practice.includes(required)) errors.push(`/work: missing advisory layer ${required}`);
}
const caseCount = (practice.match(/class="case-study-item case-proof-item"/g) || []).length;
if (caseCount !== 3) errors.push(`/work: expected 3 anonymized proof blueprints, found ${caseCount}`);
const proofSvgCount = (practice.match(/class="proof-exhibit-svg"/g) || []).length;
if (proofSvgCount !== 3) errors.push(`/work: expected 3 schematic proof artifacts, found ${proofSvgCount}`);
const engagementCount = (practice.match(/<article>\s*<div class="engagement-index"/g) || []).length;
if (engagementCount !== 3) errors.push(`/work: expected 3 engagement formats, found ${engagementCount}`);

const oaf = await readFile(routeFile('/oaf'), 'utf8');
requireOrderedClasses(oaf, '/oaf', [
  'oaf-executive-questions',
  'oaf-model-section-executive',
  'oaf-misfit-executive',
  'oaf-application-executive',
  'oaf-reference-section',
], 'executive OAF section');
for (const required of ['oaf-question-grid', 'oaf-system', 'oaf-misfit-rail', 'oaf-use-rail', 'oaf-reference-grid', 'oaf-boundary-strip']) {
  if (!oaf.includes(required)) errors.push(`/oaf: missing executive OAF layer ${required}`);
}
const oafNodeCount = (oaf.match(/class="oaf-system-node /g) || []).length;
if (oafNodeCount !== 4) errors.push(`/oaf: expected 4 canonical OAF nodes, found ${oafNodeCount}`);
const detailCount = (oaf.match(/<details>/g) || []).length;
if (detailCount < 2) errors.push(`/oaf: expected progressive disclosure for supporting depth, found ${detailCount} details sections`);
for (const removed of ['lineage-river', 'convergence-map', 'decision-contract-section', 'principle-strips', 'oaf-use-section-polished']) {
  if (oaf.includes(removed)) errors.push(`/oaf: legacy always-visible depth layer ${removed} should be removed`);
}

const privacyPl = await readFile(routeFile('/privacy'), 'utf8');
for (const term of ['Administrator danych', 'Cel i podstawa prawna', 'Transfer poza EOG', 'Twoje prawa']) {
  if (!privacyPl.includes(term)) errors.push(`/privacy: missing GDPR information layer ${term}`);
}
const privacyEn = await readFile(routeFile('/en/privacy'), 'utf8');
for (const term of ['Data controller', 'Purpose and legal basis', 'Transfers outside the EEA', 'Your rights']) {
  if (!privacyEn.includes(term)) errors.push(`/en/privacy: missing GDPR information layer ${term}`);
}

try {
  const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
  if (!robots.includes('User-agent: *')) errors.push('robots.txt: missing crawler policy');
  if (!robots.includes(`Sitemap: ${productionOrigin}/sitemap-index.xml`)) errors.push('robots.txt: missing canonical sitemap declaration');
} catch {
  errors.push('robots.txt: missing generated public file');
}

try {
  const sitemapIndex = await readFile(join(dist, 'sitemap-index.xml'), 'utf8');
  if (!sitemapIndex.includes(productionOrigin)) errors.push('sitemap-index.xml: production origin expected');
  if (sitemapIndex.includes('localhost')) errors.push('sitemap-index.xml: localhost URL leaked');
} catch {
  errors.push('sitemap-index.xml: missing generated sitemap index');
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
console.log(`STATIC VALIDATION PASS · ${requiredRoutes.length} translated routes + executive narrative/visual/SEO/privacy/internal-link/robots/sitemap gates`);