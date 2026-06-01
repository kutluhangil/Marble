'use client';

import { useDataStore } from '@/store/useDataStore';

export default function LiveStats() {
  const events = useDataStore((s) => s.events);
  const quakes = events.quake;
  const maxMag = quakes.reduce((m, q) => Math.max(m, q.magnitude ?? 0), 0);
  const iss = events.iss[0];
  const issSpeed =
    iss && typeof iss.meta.velocity === 'number'
      ? Math.round(iss.meta.velocity)
      : null;

  const parts: string[] = [`${quakes.length} quakes today`];
  if (maxMag > 0) parts.push(`M${maxMag.toFixed(1)} max`);
  if (issSpeed) parts.push(`ISS ${issSpeed.toLocaleString()} km/h`);

  return (
    <div className="flex items-center justify-center gap-3 font-mono text-xs text-ink-muted">
      <span>{parts.join(' · ')}</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
        </span>
        live
      </span>
    </div>
  );
}
