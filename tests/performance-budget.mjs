import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('dist');

if (!fs.existsSync(root)) {
  console.error('Performance budget: dist/ is missing. Run the production build first.');
  process.exit(2);
}

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else files.push(fullPath);
  }
};
walk(root);

const rel = (file) => path.relative(root, file).replaceAll(path.sep, '/');
const bytes = (file) => fs.statSync(file).size;
const sumByExt = (ext) => files.filter((file) => path.extname(file) === ext).reduce((sum, file) => sum + bytes(file), 0);
const gzipByExt = (ext) => files
  .filter((file) => path.extname(file) === ext)
  .reduce((sum, file) => sum + gzipSync(fs.readFileSync(file), { level: 9 }).length, 0);

const htmlFiles = files.filter((file) => file.endsWith('.html'));
const labHtmlFiles = htmlFiles.filter((file) => rel(file).startsWith('lab/'));
const productionHtmlFiles = htmlFiles.filter((file) => !rel(file).startsWith('lab/'));

const assetRefs = (htmlFiles) => {
  const refs = new Set();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:src|href)=["']\/([^"'?#]+)["']/g)) {
      if (match[1]?.startsWith('_astro/')) refs.add(match[1]);
    }
  }
  return refs;
};

const productionAssetRefs = assetRefs(productionHtmlFiles);
const labAssetRefs = assetRefs(labHtmlFiles);
const labOnlyAssetRefs = new Set([...labAssetRefs].filter((ref) => !productionAssetRefs.has(ref)));
const isLabOnlyAsset = (file) => labOnlyAssetRefs.has(rel(file));
const isLabHtml = (file) => rel(file).startsWith('lab/') && file.endsWith('.html');
const productionFiles = files.filter((file) => !isLabOnlyAsset(file) && !isLabHtml(file));

const totalBytes = productionFiles.reduce((sum, file) => sum + bytes(file), 0);
const cssBytes = productionFiles.filter((file) => path.extname(file) === '.css').reduce((sum, file) => sum + bytes(file), 0);
const cssGzipBytes = productionFiles.filter((file) => path.extname(file) === '.css')
  .reduce((sum, file) => sum + gzipSync(fs.readFileSync(file), { level: 9 }).length, 0);
const jsBytes = productionFiles.filter((file) => path.extname(file) === '.js').reduce((sum, file) => sum + bytes(file), 0);
const labJsBytes = files.filter((file) => isLabOnlyAsset(file) && path.extname(file) === '.js')
  .reduce((sum, file) => sum + bytes(file), 0);
const homePath = path.join(root, 'index.html');
const homeBytes = fs.existsSync(homePath) ? bytes(homePath) : Number.POSITIVE_INFINITY;
const largestFile = files.reduce((largest, file) => !largest || bytes(file) > bytes(largest) ? file : largest, null);
const largestBytes = largestFile ? bytes(largestFile) : 0;
const editorialFiles = files.filter((file) => rel(file).startsWith('images/writing/'));
const editorialBytes = editorialFiles.reduce((sum, file) => sum + bytes(file), 0);
const nonEditorialLargest = Math.max(...productionFiles.filter((file) => !editorialFiles.includes(file)).map(bytes));

const KiB = 1024;
const budgets = [
  // Five 2x artwork families, two widths and AVIF/WebP fallbacks.
  // Each essay downloads one selected derivative; per-image caps stay unchanged.
  { label: 'total production artifact', actual: totalBytes, max: 1800 * KiB },
  { label: 'all responsive editorial derivatives', actual: editorialBytes, max: 1400 * KiB },
  { label: 'largest non-editorial file', actual: nonEditorialLargest, max: 96 * KiB },
  { label: 'compiled CSS (raw)', actual: cssBytes, max: 96 * KiB },
  { label: 'compiled CSS (gzip)', actual: cssGzipBytes, max: 20 * KiB },
  { label: 'production client JavaScript', actual: jsBytes, max: 8 * KiB },
  // Lab-only bundles are excluded from production budgets but still capped independently.
  { label: 'isolated lab JavaScript', actual: labJsBytes, max: 128 * KiB },
  { label: 'home HTML', actual: homeBytes, max: 20 * KiB },
  { label: `largest single file${largestFile ? ` (${rel(largestFile)})` : ''}`, actual: largestBytes, max: 160 * KiB },
];

const format = (value) => `${(value / KiB).toFixed(1)} KiB`;
let failed = false;

for (const file of productionHtmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const asset of labOnlyAssetRefs) {
    if (html.includes(`/${asset}`)) {
      failed = true;
      console.error(`FAIL  lab-only asset leaked into production route: ${rel(file)} → ${asset}`);
    }
  }
}

console.log('Production performance budget');
for (const budget of budgets) {
  const pass = budget.actual <= budget.max;
  failed ||= !pass;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${budget.label}: ${format(budget.actual)} / ${format(budget.max)}`);
}

const sourceMaps = files.filter((file) => file.endsWith('.map'));
if (sourceMaps.length > 0) {
  failed = true;
  console.error(`FAIL  source maps shipped in production: ${sourceMaps.map(rel).join(', ')}`);
} else {
  console.log('PASS  no source maps shipped in production');
}

if (failed) process.exit(1);
