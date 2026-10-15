import fs from 'node:fs';
import path from 'node:path';

/** Only assets reachable exclusively from noindex lab HTML may use the lab budget.
 * Anything shared with a public route remains inside the original site budget. */
export function artifactScopes(root, files) {
  const labs = files.filter(file => /(?:^|\/)lab\/decision-theatre-v2\/index\.html$/.test(file));
  const resolve = (from, reference) => reference.startsWith('/')
    ? path.join(root, reference)
    : path.resolve(path.dirname(from), reference);
  function graph(roots) {
    const found = new Set();
    const visit = file => {
      if (found.has(file) || !files.includes(file)) return;
      found.add(file);
      if (!/\.(html|js)$/.test(file)) return;
      const source = fs.readFileSync(file, 'utf8');
      const references = file.endsWith('.html')
        ? [...source.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(m => m[1])
        : [...source.matchAll(/["'`]([^"'`\s]+\.js)["'`]/g)].map(m => m[1]);
      for (const reference of references) visit(resolve(file, reference));
    };
    roots.forEach(visit);
    return found;
  }
  const publicGraph = graph(files.filter(file => file.endsWith('.html') && !labs.includes(file)));
  const labGraph = graph(labs);
  const labOnly = new Set([...labGraph].filter(file => !publicGraph.has(file)));
  return { labOnly, mainFiles: files.filter(file => !labOnly.has(file)), labFiles: files.filter(file => labOnly.has(file)) };
}
