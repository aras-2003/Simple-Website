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
const homePath = path.join(root, 'index.html');
const homeBytes = fs.existsSync(homePath) ? bytes(homePath) : Number.POSITIVE_INFINITY;
const largestFile = files.reduce((largest, file) => !largest || bytes(file) > bytes(largest) ? file : largest, null);
const largestBytes = largestFile ? bytes(largestFile) : 0;

const KiB = 1024;
const budgets = [
  { label: 'total production artifact', actual: totalBytes, max: 700 * KiB },
  { label: 'compiled CSS (raw)', actual: cssBytes, max: 96 * KiB },
  { label: 'compiled CSS (gzip)', actual: cssGzipBytes, max: 20 * KiB },
  { label: 'client JavaScript', actual: jsBytes, max: 8 * KiB },
  { label: 'home HTML', actual: homeBytes, max: 20 * KiB },
  { label: `largest single file${largestFile ? ` (${rel(largestFile)})` : ''}`, actual: largestBytes, max: 96 * KiB },
];

const format = (value) => `${(value / KiB).toFixed(1)} KiB`;
let failed = false;

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
