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

const totalBytes = files.reduce((sum, file) => sum + bytes(file), 0);
const cssBytes = sumByExt('.css');
const cssGzipBytes = gzipByExt('.css');
const jsBytes = sumByExt('.js');
// The isolated lab route never loads on production pages. Retain the existing
// production budget and give its optional prototype bundle a separate ceiling.
const labJsBytes = files.filter((file) => /\/DecisionTheatre\.[^/]+\.js$/.test(file))
  .reduce((sum, file) => sum + bytes(file), 0);
const homePath = path.join(root, 'index.html');
const homeBytes = fs.existsSync(homePath) ? bytes(homePath) : Number.POSITIVE_INFINITY;
const largestFile = files.reduce((largest, file) => !largest || bytes(file) > bytes(largest) ? file : largest, null);
const largestBytes = largestFile ? bytes(largestFile) : 0;
const editorialFiles = files.filter((file) => rel(file).startsWith('images/writing/'));
const editorialBytes = editorialFiles.reduce((sum, file) => sum + bytes(file), 0);
const nonEditorialLargest = Math.max(...files.filter((file) => !editorialFiles.includes(file)).map(bytes));

const KiB = 1024;
const budgets = [
  // Five 2x artwork families, two widths and AVIF/WebP fallbacks.
  // Each essay downloads one selected derivative; per-image caps stay unchanged.
  { label: 'total production artifact', actual: totalBytes, max: 1800 * KiB },
  { label: 'all responsive editorial derivatives', actual: editorialBytes, max: 1400 * KiB },
  { label: 'largest non-editorial file', actual: nonEditorialLargest, max: 96 * KiB },
  { label: 'compiled CSS (raw)', actual: cssBytes, max: 96 * KiB },
  { label: 'compiled CSS (gzip)', actual: cssGzipBytes, max: 20 * KiB },
  { label: 'production client JavaScript', actual: jsBytes - labJsBytes, max: 8 * KiB },
  { label: 'isolated Decision Theatre JavaScript', actual: labJsBytes, max: 3 * KiB },
  { label: 'home HTML', actual: homeBytes, max: 20 * KiB },
  { label: `largest single file${largestFile ? ` (${rel(largestFile)})` : ''}`, actual: largestBytes, max: 160 * KiB },
];

const format = (value) => `${(value / KiB).toFixed(1)} KiB`;
let failed = false;

for (const file of files.filter((file) => file.endsWith('.html') && !rel(file).startsWith('lab/'))) {
  if (/DecisionTheatre\.[^"']+\.js/.test(fs.readFileSync(file, 'utf8'))) {
    failed = true;
    console.error(`FAIL  lab script leaked into production route: ${rel(file)}`);
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
