// Rebuild the web derivatives from original, text-free artwork. Never upscale.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const output = 'public/images/writing';
await mkdir(output, { recursive: true });
const families = ['architecture', 'portfolio', 'transformation', 'ai', 'delivery'];
const requested = process.argv.slice(2);
if (requested.some((name) => !families.includes(name))) throw new Error('Unknown artwork family');
for (const name of requested.length ? requested : families) {
  for (const width of [768, 1536]) {
    const source = sharp(`design/writing/${name}.png`).resize({ width, withoutEnlargement: true });
    await source.clone().avif({ quality: 65, effort: 6 }).toFile(`${output}/${name}-${width}.avif`);
    await source.clone().webp({ quality: 84, effort: 6 }).toFile(`${output}/${name}-${width}.webp`);
  }
}
