// Rebuild the web derivatives from original, text-free artwork. Never upscale.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const output = 'public/images/writing';
await mkdir(output, { recursive: true });
for (const name of ['architecture', 'portfolio', 'transformation', 'ai']) {
  for (const width of [768, 1536]) {
    const source = sharp(`design/writing/${name}.png`).resize({ width, withoutEnlargement: true });
    await source.clone().avif({ quality: 65, effort: 6 }).toFile(`${output}/${name}-${width}.avif`);
    await source.clone().webp({ quality: 84, effort: 6 }).toFile(`${output}/${name}-${width}.webp`);
  }
}
