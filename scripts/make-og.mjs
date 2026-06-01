#!/usr/bin/env node
/**
 * Generate the static social/OG image (public/og.png, 1200x630).
 * A WebGL globe can't be rendered in the OG pipeline, so this composites the
 * Blue Marble day map into a disc on the editorial paper background.
 *
 * Usage: node scripts/make-og.mjs
 */
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;
const D = 430;

const mask = Buffer.from(
  `<svg width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`,
);

const earth = await sharp(join(ROOT, 'public/textures/earth-day-2k.jpg'))
  .resize(D, D, { fit: 'cover' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const text = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="84" y="300" font-family="Georgia, serif" font-size="96" fill="#18181b">MARBLE</text>
  <text x="88" y="356" font-family="Arial, sans-serif" font-size="30" fill="#44403c">A live portrait of Earth</text>
  <text x="88" y="398" font-family="Arial, sans-serif" font-size="22" fill="#78716c">Real-time data on a hyper-realistic planet</text>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 4, background: '#fafaf9' },
})
  .composite([
    { input: earth, left: W - D - 70, top: Math.round((H - D) / 2) },
    { input: text, left: 0, top: 0 },
  ])
  .png()
  .toFile(join(ROOT, 'public/og.png'));

console.log('public/og.png written');
