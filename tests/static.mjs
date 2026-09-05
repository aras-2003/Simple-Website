import { readFile, readdir, access } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distUrl = new URL('../dist/', import.meta.url);
const dist = fileURLToPath(distUrl);
const siteBase = new URL(process.env.SITE_BASE_URL).origin;
const noteSlugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'ai-governance-without-theatre', 'transformation-operating-model'];
const sharedSlugs = ['', 'about', 'oaf', 'work', 'writing', 'contact', 'privacy'];
const requiredRoutes = [
  ...sharedSlugs.map((slug) => slug ? `/${slug}` : '/'),
  ...noteSlugs.map((slug) => `/writing/${slug}`),
  ...sharedSlugs.map((slug) => slug ? `/en/${slug}` : '/en'),
  ...noteSlugs.map((slug) => `/en/writing/${slug}`),
];
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

let errors = [];
for (const route of requiredRoutes) {
  const file = routeFile(route);
  let html;
  try { html = await readFile(file, 'utf8'); }
  catch { errors.push(`${route}: missing generated HTML`); continue; }
  const expectedLang = route.startsWith('/en') ? 'en' : 'pl';
  const expectedSwitch = expectedLang === 'pl' ? 'EN' : 'PL';
  const checks = [
    [new RegExp(`<html[^>]+lang=["']${expectedLang}["']`), 'correct html lang'],
    [/<title>[^<]+<\/title>/, 'title'],
    [/<meta name="description" content="[^"]+"/, 'meta description'],
    [/<link rel="canonical" href="[^"]+"/, 'canonical'],
    [/<link rel="alternate" hreflang="pl"/, 'PL hreflang'],
    [/<link rel="alternate" hreflang="en"/, 'EN hreflang'],
    [/<meta http-equiv="Content-Security-Policy" content="[^"]+"/, 'CSP meta'],
    [/<meta property="og:image" content="[^"]+\/assets\/og-card\.png"/, 'raster OG image'],
    [/<meta property="og:image:width" content="1200"/, 'OG image width'],
    [/<meta property="og:image:height" content="630"/, 'OG image height'],
    [/<main id="main"/, 'main landmark'],
    [/class="skip-link"/, 'skip link'],
    [/<nav[^>]+aria-label=/, 'labelled navigation'],
    [new RegExp(`class="language-link"[^>]*>${expectedSwitch}<\/a>`), 'compact language switch'],
  ];
  for (const [regex, name] of checks) if (!regex.test(html)) errors.push(`${route}: missing ${name}`);

  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonicalMatch?.[1]?.startsWith(siteBase)) errors.push(`${route}: canonical is not based on SITE_BASE_URL`);
  if (html.includes('127.0.0.1:8080') || html.includes('localhost:8080')) errors.push(`${route}: local origin leaked into production metadata`);
  if (/Content-Security-Policy"[^>]+unsafe-inline/.test(html)) errors.push(`${route}: CSP must not allow unsafe-inline scripts`);
  if (/<script(?![^>]*(?:src=|type="application\/ld\+json"))[^>]*>/.test(html)) errors.push(`${route}: unexpected inline executable script`);

  const h1s = (html.match(/<h1\b/g) || []).length;
  if (h1s !== 1) errors.push(`${route}: expected one h1, found ${h1s}`);
  if (/target="_blank"(?![^>]*rel="[^"]*noopener)/.test(html)) errors.push(`${route}: target=_blank without noopener`);
  if (/\{\{[A-Z0-9_]+\}\}/.test(html)) errors.push(`${route}: unresolved build token`);
  if (expectedLang === 'pl') {
    for (const token of forbiddenPlUi) if (html.includes(`>${token}<`)) errors.push(`${route}: untranslated UI token ${token}`);
  }

  if (/\/writing\//.test(route)) {
    if (!/<meta property="og:type" content="article"/.test(html)) errors.push(`${route}: article OG type expected`);
    if (!/<meta property="article:published_time" content="2026-09-04"/.test(html)) errors.push(`${route}: publication metadata expected`);
    if (!html.includes('"@type":"Article"')) errors.push(`${route}: Article JSON-LD expected`);
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
for (const cls of ['lineage-river', 'convergence-map', 'oaf-orbit', 'misfit-grid', 'boundary-list', 'oaf-use-section-polished']) {
  if (!oaf.includes(cls)) errors.push(`/oaf: missing depth layer ${cls}`);
}

const privacy = await readFile(routeFile('/privacy'), 'utf8');
for (const token of ['Administrator danych', 'Cele i podstawy prawne', 'Transfer poza EOG', 'Twoje prawa']) {
  if (!privacy.includes(token)) errors.push(`/privacy: missing privacy disclosure ${token}`);
}
const privacyEn = await readFile(routeFile('/en/privacy'), 'utf8');
for (const token of ['Data controller', 'Purposes and legal bases', 'Transfers outside the EEA', 'Your rights']) {
  if (!privacyEn.includes(token)) errors.push(`/en/privacy: missing privacy disclosure ${token}`);
}

try { await access(join(dist, 'scripts/contact-form.js')); }
catch { errors.push('/scripts/contact-form.js: external contact client missing from build'); }
try { await access(join(dist, 'assets/og-card.png')); }
catch { errors.push('/assets/og-card.png: raster social card missing from build'); }

const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${siteBase}/sitemap-index.xml`)) errors.push('/robots.txt: production sitemap origin mismatch');
const sitemap = await readFile(join(dist, 'sitemap-index.xml'), 'utf8');
if (!sitemap.includes(siteBase) || sitemap.includes('127.0.0.1') || sitemap.includes('localhost')) errors.push('/sitemap-index.xml: invalid production origin');

const allFiles = await walk(dist);
for (const file of allFiles.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  if (html.includes('javascript:void')) errors.push(`${relative(dist, file)}: javascript:void link`);
  if (html.includes('Dyrektor Departamentu Architektury Korporacyjnej, Strategii i PMO')) errors.push(`${relative(dist, file)}: stale employment title exposed`);
  if (html.includes('Director of Enterprise Architecture, Strategy & PMO')) errors.push(`${relative(dist, file)}: stale employment title exposed`);
}

if (errors.length) {
  console.error('STATIC VALIDATION FAILED');
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}
console.log(`STATIC VALIDATION PASS · ${requiredRoutes.length} canonical translated routes checked + security/SEO/brand gates`);
