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

type Ctx = CanvasRenderingContext2D;

function cloud(ctx: Ctx, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(44, cy, r, 0, Math.PI * 2);
  ctx.arc(66, cy - r * 0.6, r * 1.3, 0, Math.PI * 2);
  ctx.arc(88, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(44, cy - r * 0.2, 44, r + 6);
}

// Each icon is drawn white into a 128x128 cell with the Canvas 2D API
// (synchronous, no asset loading). Tinted per layer in the shader.
const DRAW: Record<IconName, (ctx: Ctx) => void> = {
  sun: (ctx) => {
    ctx.save();
    ctx.translate(64, 64);
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 34, Math.sin(a) * 34);
      ctx.lineTo(Math.cos(a) * 50, Math.sin(a) * 50);
      ctx.stroke();
    }
    ctx.restore();
  },
  cloud: (ctx) => cloud(ctx, 74, 22),
  rain: (ctx) => {
    cloud(ctx, 58, 18);
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    for (const x of [50, 66, 82]) {
      ctx.beginPath();
      ctx.moveTo(x, 92);
      ctx.lineTo(x - 4, 108);
      ctx.stroke();
    }
  },
  storm: (ctx) => {
    cloud(ctx, 54, 17);
    ctx.beginPath();
    ctx.moveTo(72, 74);
    ctx.lineTo(50, 104);
    ctx.lineTo(64, 104);
    ctx.lineTo(54, 122);
    ctx.lineTo(88, 90);
    ctx.lineTo(70, 90);
    ctx.closePath();
    ctx.fill();
  },
  snow: (ctx) => {
    ctx.save();
    ctx.translate(64, 64);
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(-Math.cos(a) * 38, -Math.sin(a) * 38);
      ctx.lineTo(Math.cos(a) * 38, Math.sin(a) * 38);
      ctx.stroke();
    }
    ctx.restore();
  },
  fog: (ctx) => {
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    const rows = [
      [26, 102, 44],
      [18, 110, 64],
      [30, 98, 84],
      [40, 88, 104],
    ];
    for (const [x1, x2, y] of rows) {
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }
  },
  volcano: (ctx) => {
    ctx.beginPath();
    ctx.moveTo(18, 108);
    ctx.lineTo(48, 56);
    ctx.lineTo(80, 56);
    ctx.lineTo(110, 108);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(48, 56);
    ctx.lineTo(57, 40);
    ctx.lineTo(71, 40);
    ctx.lineTo(80, 56);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 0.7;
    for (const [x, y, r] of [
      [64, 30, 10],
      [49, 22, 7],
      [79, 20, 7],
    ] as const) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
  flame: (ctx) => {
    ctx.save();
    ctx.translate(64, 70);
    ctx.beginPath();
    ctx.moveTo(0, -46);
    ctx.bezierCurveTo(30, -12, 32, 10, 0, 42);
    ctx.bezierCurveTo(-32, 10, -18, -6, -4, -16);
    ctx.bezierCurveTo(2, -2, 12, -6, 6, -22);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  iss: (ctx) => {
    ctx.fillRect(57, 57, 14, 14);
    ctx.fillRect(18, 50, 30, 28);
    ctx.fillRect(80, 50, 30, 28);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(48, 64);
    ctx.lineTo(57, 64);
    ctx.moveTo(71, 64);
    ctx.lineTo(80, 64);
    ctx.stroke();
  },
  plane: (ctx) => {
    ctx.save();
    ctx.translate(64, 64);
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.moveTo(-46, 6);
    ctx.lineTo(22, -8);
    ctx.lineTo(42, -4);
    ctx.lineTo(20, 2);
    ctx.lineTo(2, 4);
    ctx.lineTo(-6, 24);
    ctx.lineTo(-16, 24);
    ctx.lineTo(-12, 2);
    ctx.lineTo(-32, 8);
    ctx.lineTo(-40, 20);
    ctx.lineTo(-46, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};

let cached: Texture | null = null;

/** Build (once, synchronously) the icon atlas as a CanvasTexture. */
export function getIconAtlas(): Texture {
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  for (const name of Object.keys(DRAW) as IconName[]) {
    const idx = ICON[name];
    ctx.save();
    ctx.translate((idx % COLS) * CELL, Math.floor(idx / COLS) * CELL);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    DRAW[name](ctx);
    ctx.restore();
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.needsUpdate = true;
  cached = tex;
  return tex;
}

export const ATLAS_COLS = COLS;
export const ATLAS_ROWS = ROWS;
