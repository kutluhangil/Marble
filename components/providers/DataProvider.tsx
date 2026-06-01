'use client';

import { useEffect, useState } from 'react';
import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import type { GeoPoint, Layer } from '@/lib/data/types';

const CADENCE: Record<Layer, number> = {
  quake: 60_000,
  iss: 5_000,
  weather: 300_000,
  flight: 15_000,
  volcano: 600_000,
  fire: 600_000,
};

const ENDPOINT: Record<Layer, string> = {
  quake: 'earthquakes',
  iss: 'iss',
  weather: 'weather',
  flight: 'flights',
  volcano: 'volcanoes',
  fire: 'fires',
};

/**
 * Polls active layers and pushes results into the data store. Pauses while the
 * tab is hidden, refetches on return, and backs off on errors. Renders nothing.
 */
export default function DataProvider() {
  const active = useLayersStore((s) => s.active);
  const setFlightAvailable = useLayersStore((s) => s.setFlightAvailable);
  const setEvents = useDataStore((s) => s.setEvents);
  const [visible, setVisible] = useState(true);

  // Track page visibility.
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    onVis();
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Probe flight availability once on mount.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/flights')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setFlightAvailable(!(d && d.disabled));
      })
      .catch(() => {
        if (!cancelled) setFlightAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [setFlightAvailable]);

  // One self-scheduling loop per active layer.
  useEffect(() => {
    if (!visible) return;

    const activeLayers = (Object.keys(active) as Layer[]).filter(
      (l) => active[l],
    );
    const timers: ReturnType<typeof setTimeout>[] = [];
    let stopped = false;

    for (const layer of activeLayers) {
      let failures = 0;

      const tick = async () => {
        try {
          const res = await fetch(`/api/${ENDPOINT[layer]}`);
          const data = (await res.json()) as GeoPoint[] | { disabled: true };
          if (Array.isArray(data)) {
            setEvents(layer, data);
            failures = 0;
          } else if (layer === 'flight' && data?.disabled) {
            setFlightAvailable(false);
          }
        } catch {
          failures = Math.min(failures + 1, 4);
        }
        if (stopped) return;
        const backoff = failures > 0 ? 2 ** failures * 1000 : 0;
        timers.push(setTimeout(tick, CADENCE[layer] + backoff));
      };

      void tick();
    }

    return () => {
      stopped = true;
      timers.forEach(clearTimeout);
    };
  }, [active, visible, setEvents, setFlightAvailable]);

  return null;
}
