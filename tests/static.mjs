import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const distUrl = new URL('../dist/', import.meta.url);
const dist = fileURLToPath(distUrl);
const siteOrigin = new URL(process.env.SITE_BASE_URL || 'https://arkadiuszkamrowski.com').origin;
const escapedSiteOrigin = siteOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const noteSlugs = ['architecture-as-decision-system', 'portfolio-as-strategy-in-motion', 'ai-governance-without-theatre', 'transformation-operating-model'];
const plSharedSlugs = ['', 'about', 'oaf', 'wspolpraca', 'perspektywa', 'contact', 'privacy'];
const enSharedSlugs = ['', 'about', 'oaf', 'advisory', 'perspective', 'contact', 'privacy'];
const requiredRoutes = [
  ...plSharedSlugs.map((slug) => slug ? `/${slug}` : '/'),
  ...noteSlugs.map((slug) => `/perspektywa/${slug}`),
  ...enSharedSlugs.map((slug) => slug ? `/en/${slug}` : '/en'),
  ...noteSlugs.map((slug) => `/en/perspective/${slug}`),
];
const articleRoutes = new Set([
  ...noteSlugs.map((slug) => `/perspektywa/${slug}`),
  ...noteSlugs.map((slug) => `/en/perspective/${slug}`),
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
  const expectedCanonical = `${siteOrigin}${route === '/' ? '/' : route}`;
  const checks = [
    [new RegExp(`<html[^>]+lang=["']${expectedLang}["']`), 'correct html lang'],
    [/<title>[^<]+<\/title>/, 'title'],
    [/<meta name="description" content="[^"]+"/, 'meta description'],
    [new RegExp(`<link rel="canonical" href="${expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`), 'canonical'],
    [/<link rel="alternate" hreflang="pl"/, 'PL hreflang'],
    [/<link rel="alternate" hreflang="en"/, 'EN hreflang'],
    [/<main id="main"/, 'main landmark'],
    [/class="skip-link"/, 'skip link'],
    [/<nav[^>]+aria-label=/, 'labelled navigation'],
    [new RegExp(`<meta property="og:image" content="${escapedSiteOrigin}/assets/og-card\\.png"`), 'raster OG image'],
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

// Buyer-path contracts apply in both languages; visual class counts are not the product.
for (const locale of ['pl', 'en']) {
  const prefix = locale === 'pl' ? '' : '/en';
  const home = await readFile(routeFile(prefix || '/'), 'utf8');
  const nav = home.match(/<nav id="primary-navigation"[\s\S]*?<\/nav>/)?.[0] ?? '';
  if (/href="[^"]*\/oaf"/.test(nav)) errors.push(`${prefix}: OAF must be secondary navigation`);
  if (!portraitAsset.test(home)) errors.push(`${prefix}: Home must identify the person with a portrait`);
  if (!home.includes('signature-choices')) errors.push(`${prefix}: signature choice visual missing`);
  const hero = home.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  if (!hero.includes(`href="${prefix}/contact"`)) errors.push(`${prefix}: direct contact path missing from hero`);
  const work = await readFile(routeFile(locale === 'pl' ? '/wspolpraca' : '/en/advisory'), 'utf8');
  if ((work.match(/class="engagement"/g) || []).length !== 3) errors.push(`${prefix}: expected three engagement containers`);
  const engagements = [...work.matchAll(/<article class="engagement">([\s\S]*?)<\/article>/g)];
  for (const [,engagement] of engagements) if ((engagement.match(/<dt>/g)||[]).length !== 5) errors.push(`${prefix}: incomplete engagement decision/process/input/output/change`);
  if (!work.includes('decision-brief')) errors.push(`${prefix}: illustrative decision artifact missing`);
  const about = await readFile(routeFile(`${prefix}/about`), 'utf8');
  if (!portraitAsset.test(about) || !about.includes('trajectory')) errors.push(`${prefix}: human trajectory missing`);
  const writing = await readFile(routeFile(locale === 'pl' ? '/perspektywa' : '/en/perspective'), 'utf8');
  if (writing.includes('publishing-standard') || writing.includes('benchmark-signal')) errors.push(`${prefix}: meta-content must not precede writing`);
  const oaf = await readFile(routeFile(`${prefix}/oaf`), 'utf8');
  if ((oaf.match(/<details>/g)||[]).length !== 2) errors.push(`${prefix}: expected two method disclosures`);
  const form = await readFile(routeFile(`${prefix}/contact`), 'utf8');
  if (!/<form[^>]*method="post"/.test(form) || !form.includes('<noscript>')) errors.push(`${prefix}: no-JS contact fallback missing`);
}
for (const path of articleRoutes) {
  const html = await readFile(routeFile(path), 'utf8');
  const footer = html.match(/<footer class="note-footer[\s\S]*?<\/footer>/)?.[0] ?? '';
  if (!footer.includes('/contact') || !/\/(?:advisory|wspolpraca)/.test(footer) || !/\/(?:perspective|perspektywa)\//.test(footer)) errors.push(`${path}: reader-intent next paths missing`);
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
  if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap-index.xml`)) errors.push('robots.txt: missing canonical sitemap declaration');
} catch {
  errors.push('robots.txt: missing generated public file');
}

try {
  const sitemapIndex = await readFile(join(dist, 'sitemap-index.xml'), 'utf8');
  if (!sitemapIndex.includes(siteOrigin)) errors.push('sitemap-index.xml: configured origin expected');
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
console.log(`STATIC VALIDATION PASS · ${requiredRoutes.length} translated routes + executive narrative/visual/SEO/privacy/internal-link/robots/sitemap gates · ${siteOrigin}`);
