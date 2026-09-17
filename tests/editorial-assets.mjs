// Headers alone passed for the old truncated images; force complete decoding.
import sharp from 'sharp';
import { readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
for (const name of ['architecture', 'portfolio', 'transformation', 'ai', 'delivery']) {
  for (const width of [768, 1536]) {
    for (const format of ['avif', 'webp']) {
      const file = `public/images/writing/${name}-${width}.${format}`;
      const input = await readFile(file);
      const { info } = await sharp(input, { failOn: 'warning' }).raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.width, width, file);
      assert.equal(info.height, width * 2 / 3, file);
      assert.ok((await stat(file)).size <= (width === 768 ? 48 : 160) * 1024, `${file}: transfer budget`);
    }
  }
}
console.log('PASS: all 20 editorial derivatives fully decode, have exact dimensions and meet transfer budgets.');
