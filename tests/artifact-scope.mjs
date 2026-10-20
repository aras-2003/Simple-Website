import fs from 'node:fs';
import path from 'node:path';

/** Only assets reachable exclusively from noindex lab HTML may use the lab budget.
 * Anything shared with a public route remains inside the original site budget. */
export function artifactScopes(root, files) {
  const v3 = files.filter(file => /(?:^|\/)lab\/decision-theatre-v2\/index\.html$/.test(file));
  const v4 = files.filter(file => /(?:^|\/)lab\/decision-theatre-v4\/index\.html$/.test(file));
  const v5 = files.filter(file => /(?:^|\/)lab\/decision-theatre-v5\/index\.html$/.test(file));
  const v6 = files.filter(file => /(?:^|\/)lab\/living-architecture-v6\/index\.html$/.test(file));
  const v64 = files.filter(file => /(?:^|\/)lab\/living-architecture-v6-4\/index\.html$/.test(file));
  const labs = [...v3, ...v4, ...v5, ...v6, ...v64];
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
  const v3Graph = graph(v3);
  const v4Graph = graph(v4);
  const v5Graph = graph(v5);
  const v6Graph = graph(v6);
  const v64Graph = graph(v64);
  return { labOnly, mainFiles: files.filter(file => !labOnly.has(file)),
    labFiles: files.filter(file => v3Graph.has(file) && !publicGraph.has(file)),
    volumeFiles: files.filter(file => v64Graph.has(file) && !publicGraph.has(file)),
    livingFiles: files.filter(file => v6Graph.has(file) && !publicGraph.has(file)),
    morphFiles: files.filter(file => v5Graph.has(file) && !publicGraph.has(file)),
    spikeFiles: files.filter(file => v4Graph.has(file) && !publicGraph.has(file)) };
}
