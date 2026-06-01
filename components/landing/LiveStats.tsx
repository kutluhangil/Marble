'use client';

import { useDataStore } from '@/store/useDataStore';
import { useT } from '@/lib/i18n/useT';

export default function LiveStats() {
  const t = useT();
  const events = useDataStore((s) => s.events);
  const quakes = events.quake;
  const maxMag = quakes.reduce((m, q) => Math.max(m, q.magnitude ?? 0), 0);
  const iss = events.iss[0];
  const issSpeed =
    iss && typeof iss.meta.velocity === 'number'
      ? Math.round(iss.meta.velocity)
      : null;

  const parts: string[] = [t.stats.quakes(quakes.length)];
  if (maxMag > 0) parts.push(t.stats.max(maxMag.toFixed(1)));
  if (issSpeed) parts.push(t.stats.iss(issSpeed.toLocaleString()));

  return (
    <div className="flex items-center justify-center gap-3 font-mono text-xs text-ink-muted">
      <span>{parts.join(' · ')}</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
        </span>
        {t.stats.live}
      </span>
    </div>
  );
}
