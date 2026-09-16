import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const files = ['src/content/home.ts','src/content/about.ts','src/content/method.ts','src/content/contact.ts','src/content/privacy.ts','src/content/ui.ts','src/components/OafPage.astro','src/components/ContactForm.astro','src/pages/404.astro','src/pages/en/404.astro'];
for (const locale of ['pl','en']) for (const name of await readdir(`src/content/writing/${locale}`)) if (name.endsWith('.md')) files.push(`src/content/writing/${locale}/${name}`);
for (const file of files) {
  const text = await readFile(file, 'utf8');
  assert.ok(!text.includes('—'), `${file}: use en dash U+2013, not em dash U+2014`);
}
const en404 = await readFile('dist/en/404/index.html', 'utf8');
assert.match(en404, /<html[^>]+lang="en"/);
assert.match(en404, /404 – Page not found/);
console.log(`Editorial punctuation checked in ${files.length} sources; English 404 generated.`);
