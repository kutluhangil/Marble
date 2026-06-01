'use client';

import { Html } from '@react-three/drei';
import type { GeoPoint, Layer } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';
import { useDataStore } from '@/store/useDataStore';

function findPoint(
  events: Record<Layer, GeoPoint[]>,
  id: string,
): GeoPoint | null {
  for (const layer of Object.keys(events) as Layer[]) {
    const p = events[layer].find((e) => e.id === id);
    if (p) return p;
  }
  return null;
}

/** Floating label for the hovered marker. Sits in the world group so it tracks
 *  the globe's rotation. */
export default function HoverTooltip() {
  const hoveredId = useUIStore((s) => s.hoveredId);
  const events = useDataStore((s) => s.events);
  if (!hoveredId) return null;

  const p = findPoint(events, hoveredId);
  if (!p) return null;

  const radius = 1.06 + (p.alt ? Math.min(p.alt / 6371, 0.1) : 0);
  const pos = latLngToVector3(p.lat, p.lng, radius);

  return (
    <Html position={pos} center style={{ pointerEvents: 'none' }}>
      <div className="glass whitespace-nowrap rounded-pill border border-border-soft px-2.5 py-1 font-mono text-xs text-ink shadow-card backdrop-blur">
        {p.label}
      </div>
    </Html>
  );
}
