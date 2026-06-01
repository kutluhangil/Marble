import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';

/** Atlas cell index for each icon. */
export const ICON = {
  sun: 0,
  cloud: 1,
  rain: 2,
  storm: 3,
  snow: 4,
  fog: 5,
  volcano: 6,
  flame: 7,
  iss: 8,
  plane: 9,
} as const;

export type IconName = keyof typeof ICON;

const COLS = 4;
const ROWS = 4;
const CELL = 128;

// Authored white line/silhouette symbols (viewBox 0 0 24 24). Tinted per layer
// in the shader. No external assets.
const SVG: Record<IconName, string> = {
  sun: `<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="#fff" stroke="none"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="7" y2="7"/><line x1="17" y1="17" x2="19.1" y2="19.1"/><line x1="19.1" y1="4.9" x2="17" y2="7"/><line x1="7" y1="17" x2="4.9" y2="19.1"/></g>`,
  cloud: `<g fill="#fff"><circle cx="8" cy="14" r="4"/><circle cx="12.5" cy="11" r="5"/><circle cx="16.5" cy="14" r="4"/><rect x="8" y="13" width="8.5" height="5" rx="1"/></g>`,
  rain: `<g fill="#fff"><circle cx="8" cy="11" r="3.4"/><circle cx="12.5" cy="8.5" r="4.3"/><circle cx="16.5" cy="11" r="3.4"/><rect x="8" y="10.5" width="8.5" height="4" rx="1"/></g><g stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="9" y1="17" x2="8" y2="21"/><line x1="13" y1="17" x2="12" y2="21"/><line x1="17" y1="17" x2="16" y2="21"/></g>`,
  storm: `<g fill="#fff"><circle cx="8" cy="10" r="3.4"/><circle cx="12.5" cy="7.5" r="4.3"/><circle cx="16.5" cy="10" r="3.4"/><rect x="8" y="9.5" width="8.5" height="4" rx="1"/></g><polygon points="13,14 8,20 11.5,20 9.5,24 16,17 12.5,17 14.5,14" fill="#fff"/>`,
  snow: `<g stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="4" y1="7.5" x2="20" y2="16.5"/><line x1="20" y1="7.5" x2="4" y2="16.5"/></g>`,
  fog: `<g stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="5" y1="8" x2="19" y2="8"/><line x1="3.5" y1="12" x2="20.5" y2="12"/><line x1="6" y1="16" x2="18" y2="16"/><line x1="8" y1="20" x2="16" y2="20"/></g>`,
  volcano: `<polygon points="3,21 9,10 15,10 21,21" fill="#fff"/><polygon points="9,10 11,7 13,7 15,10" fill="#fff"/><g fill="#fff" opacity="0.75"><circle cx="12" cy="5" r="1.7"/><circle cx="9.5" cy="3.5" r="1.3"/><circle cx="14.5" cy="3.2" r="1.4"/></g>`,
  flame: `<path d="M12 2 C 14 6 17 7.5 17 13 a5 5 0 0 1 -10 0 c0 -2.5 1.2 -4 2.5 -5 c0.4 1.8 1.6 2.2 2.5 1.5 C 14.5 8.5 12.5 6 12 2 Z" fill="#fff"/>`,
  iss: `<g fill="#fff"><rect x="10.5" y="10.5" width="3" height="3" rx="0.5"/></g><g fill="#fff" opacity="0.92"><rect x="2.5" y="9" width="5.5" height="6" rx="0.6"/><rect x="16" y="9" width="5.5" height="6" rx="0.6"/></g><g stroke="#fff" stroke-width="1.6"><line x1="8" y1="12" x2="10.5" y2="12"/><line x1="13.5" y1="12" x2="16" y2="12"/></g>`,
  plane: `<path d="M2.5 12.5 L19 9 C 20.5 8.7 21 9.2 20.5 10.5 L 11 13.2 L 7.5 18 L 5.5 18 L 7 12.8 L 4 13.5 L 3 15.5 L 1.8 15.5 Z" fill="#fff"/>`,
};

let cached: Promise<Texture> | null = null;

function rasterize(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL}" height="${CELL}" viewBox="0 0 24 24">${svg}</svg>`;
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(doc)}`;
  });
}

/** Build (once) the icon atlas as a CanvasTexture. */
export function getIconAtlas(): Promise<Texture> {
  if (cached) return cached;
  cached = (async () => {
    const canvas = document.createElement('canvas');
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    const ctx = canvas.getContext('2d')!;
    await Promise.all(
      (Object.keys(SVG) as IconName[]).map(async (name) => {
        const img = await rasterize(SVG[name]);
        const idx = ICON[name];
        ctx.drawImage(img, (idx % COLS) * CELL, Math.floor(idx / COLS) * CELL, CELL, CELL);
      }),
    );
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  })();
  return cached;
}

export const ATLAS_COLS = COLS;
export const ATLAS_ROWS = ROWS;
