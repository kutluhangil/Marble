'use client';

import { useMemo } from 'react';
import type { GeoPoint } from '@/lib/data/types';
import GlowLayer, { type GlowConfig } from './GlowLayer';

type Cond = 'clear' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';

function condOf(code: number | null): Cond {
  if (code == null) return 'cloud';
  if (code <= 1) return 'clear';
  if (code <= 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if (code >= 95) return 'storm';
  return 'rain';
}

// Each condition gets its own colour and motion: sun glows warm and steady,
// rain pulses cool, storms flash fast, snow twinkles, fog/cloud stay soft.
const CONFIG: Record<Cond, GlowConfig> = {
  clear: { color: '#f59e0b', speed: 1.0, pulse: 0.14, size: 0.012, emissive: 1.5 },
  cloud: { color: '#94a3b8', speed: 0.6, pulse: 0.08, size: 0.012, emissive: 1.2 },
  fog: { color: '#cbd5e1', speed: 0.4, pulse: 0.06, size: 0.012, emissive: 1.1 },
  rain: { color: '#38bdf8', speed: 2.6, pulse: 0.18, size: 0.012, emissive: 1.4 },
  snow: { color: '#e0f2fe', speed: 1.6, pulse: 0.16, size: 0.012, emissive: 1.4 },
  storm: { color: '#818cf8', speed: 8.0, pulse: 0.3, size: 0.013, emissive: 1.7 },
};

const ORDER: Cond[] = ['clear', 'cloud', 'fog', 'rain', 'snow', 'storm'];

export default function WeatherLayer({ points }: { points: GeoPoint[] }) {
  const buckets = useMemo(() => {
    const map: Record<Cond, GeoPoint[]> = {
      clear: [],
      cloud: [],
      fog: [],
      rain: [],
      snow: [],
      storm: [],
    };
    for (const p of points) {
      map[condOf((p.meta.weatherCode as number | null) ?? null)].push(p);
    }
    return map;
  }, [points]);

  return (
    <>
      {ORDER.map((c) =>
        buckets[c].length ? (
          <GlowLayer key={c} points={buckets[c]} config={CONFIG[c]} />
        ) : null,
      )}
    </>
  );
}
