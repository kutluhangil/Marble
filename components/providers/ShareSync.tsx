'use client';

import { useEffect } from 'react';
import { useGlobeStyleStore, type GlobeStyle } from '@/store/useGlobeStyleStore';
import { useLayersStore } from '@/store/useLayersStore';
import { useTimeStore } from '@/store/useTimeStore';
import { LAYERS, type Layer } from '@/lib/data/types';

const STYLES: GlobeStyle[] = ['realistic', 'illustrated', 'atlas'];
const HOUR = 3_600_000;

/** Two-way sync between URL query params and the view state (style, layers,
 *  sun offset) so a view can be shared and restored. Renders nothing. */
export default function ShareSync() {
  const style = useGlobeStyleStore((s) => s.style);
  const setStyle = useGlobeStyleStore((s) => s.setStyle);
  const active = useLayersStore((s) => s.active);
  const setActive = useLayersStore((s) => s.setActive);
  const offsetMs = useTimeStore((s) => s.offsetMs);
  const setOffset = useTimeStore((s) => s.setOffset);

  // Restore from URL once on mount.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);

    const st = p.get('style');
    if (st && (STYLES as string[]).includes(st)) setStyle(st as GlobeStyle);

    const layersParam = p.get('layers');
    if (layersParam !== null) {
      const on = new Set(layersParam.split(',').filter(Boolean));
      const next = {} as Record<Layer, boolean>;
      for (const l of LAYERS) next[l] = on.has(l);
      setActive(next);
    }

    const tt = p.get('t');
    if (tt !== null) {
      const h = parseFloat(tt);
      if (!Number.isNaN(h)) setOffset(h * HOUR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push state to the URL when it changes.
  useEffect(() => {
    const p = new URLSearchParams();
    p.set('style', style);
    p.set(
      'layers',
      (Object.keys(active) as Layer[]).filter((l) => active[l]).join(','),
    );
    if (offsetMs !== 0) p.set('t', (offsetMs / HOUR).toString());
    window.history.replaceState(null, '', `?${p.toString()}`);
  }, [style, active, offsetMs]);

  return null;
}
