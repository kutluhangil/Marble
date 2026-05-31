#!/usr/bin/env node
/**
 * Download and optimize the Earth textures into public/textures/.
 *
 * Sources are public-domain NASA imagery. Day, night, and clouds are fetched
 * directly; the normal and roughness maps are derived from the day map
 * (Sobel relief + ocean/land mask) so the whole set comes from one run.
 *
 * Usage: node scripts/fetch-textures.mjs
 * The optimized output is committed so the app deploys without this step.
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'textures');

const SOURCES = {
  day: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg',
  night: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/55000/55167/earth_lights_lrg.jpg',
  clouds: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg',
};

const SIZES = { '4k': [4096, 2048], '2k': [2048, 1024] };

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function writeResized(buf, base, opts = {}) {
  for (const [tag, [w, h]] of Object.entries(SIZES)) {
    const out = join(OUT, `${base}${tag === '4k' ? '' : '-2k'}.${opts.png ? 'png' : 'jpg'}`);
    let img = sharp(buf).resize(w, h, { fit: 'fill' });
    img = opts.png ? img.png({ quality: 80 }) : img.jpeg({ quality: 82, mozjpeg: true });
    await img.toFile(out);
  }
}

/** Build a tangent-space normal map from the day image luminance (Sobel). */
async function deriveNormal(dayBuf) {
  const w = 2048;
  const h = 1024;
  const { data } = await sharp(dayBuf)
    .resize(w, h, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(w * h * 3);
  const at = (x, y) => data[((y + h) % h) * w + ((x + w) % w)];
  const strength = 2.0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) / 255;
      const dy = (at(x, y - 1) - at(x, y + 1)) / 255;
      const nx = dx * strength;
      const ny = dy * strength;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * w + x) * 3;
      out[i] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      out[i + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      out[i + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
    }
  }
  const png = await sharp(out, { raw: { width: w, height: h, channels: 3 } })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await writeResized(png, 'earth-normal');
}

/** Ocean (blue-dominant, dark) → low roughness; land → high roughness. */
async function deriveRoughness(dayBuf) {
  const w = 2048;
  const h = 1024;
  const { data } = await sharp(dayBuf)
    .resize(w, h, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(w * h);
  for (let p = 0; p < w * h; p++) {
    const r = data[p * 3];
    const g = data[p * 3 + 1];
    const b = data[p * 3 + 2];
    const ocean = b > r && b > g - 10 && b < 140;
    out[p] = ocean ? 40 : 220; // low vs high roughness
  }
  const jpg = await sharp(out, { raw: { width: w, height: h, channels: 1 } })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await sharp(jpg).resize(2048, 1024, { fit: 'fill' }).toFile(join(OUT, 'earth-roughness.jpg'));
  await sharp(jpg).resize(1024, 512, { fit: 'fill' }).toFile(join(OUT, 'earth-roughness-2k.jpg'));
}

async function main() {
  await mkdir(OUT, { recursive: true });

  console.log('Downloading day map…');
  const dayBuf = await download(SOURCES.day);
  await writeResized(dayBuf, 'earth-day');

  console.log('Downloading night map…');
  await writeResized(await download(SOURCES.night), 'earth-night');

  console.log('Downloading cloud map…');
  await writeResized(await download(SOURCES.clouds), 'earth-clouds', { png: true });

  console.log('Deriving normal map…');
  await deriveNormal(dayBuf);

  console.log('Deriving roughness map…');
  await deriveRoughness(dayBuf);

  // Report total size.
  let total = 0;
  for (const f of [
    'earth-day.jpg', 'earth-day-2k.jpg',
    'earth-night.jpg', 'earth-night-2k.jpg',
    'earth-clouds.png', 'earth-clouds-2k.png',
    'earth-normal.jpg', 'earth-normal-2k.jpg',
    'earth-roughness.jpg', 'earth-roughness-2k.jpg',
  ]) {
    try {
      total += (await stat(join(OUT, f))).size;
    } catch {
      /* missing file */
    }
  }
  console.log(`Done. Total: ${(total / 1e6).toFixed(1)} MB (budget < 10 MB).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
