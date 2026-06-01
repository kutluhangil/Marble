'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useLangStore } from '@/store/useLangStore';
import { useT } from '@/lib/i18n/useT';
import type { GeoPoint } from '@/lib/data/types';
import { fmtCoord, fmtMag, timeAgo } from '@/lib/utils/format';

const LAYER_COLOR: Record<GeoPoint['layer'], string> = {
  quake: 'var(--data-quake)',
  iss: 'var(--data-iss)',
  weather: 'var(--data-weather)',
  flight: 'var(--data-flight)',
};

function num(v: unknown): number | null {
  return typeof v === 'number' ? v : null;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-ink-muted">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}

function Body({ e }: { e: GeoPoint }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const c = t.card;

  if (e.layer === 'quake') {
    return (
      <>
        <div className="font-mono text-3xl text-ink">
          {fmtMag(e.magnitude ?? 0)}
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <Detail label={c.depth} value={`${num(e.meta.depth)?.toFixed(1) ?? '—'} km`} />
          <Detail label={c.location} value={fmtCoord(e.lat, e.lng)} />
          <Detail label={c.when} value={timeAgo(e.timestamp, lang)} />
        </div>
        {typeof e.meta.url === 'string' && (
          <a
            href={e.meta.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm text-ink underline underline-offset-4"
          >
            {c.viewUsgs}
          </a>
        )}
      </>
    );
  }
  if (e.layer === 'iss') {
    return (
      <div className="mt-1 space-y-1 text-sm">
        <Detail label={c.altitude} value={`${num(e.alt)?.toFixed(0) ?? '—'} km`} />
        <Detail label={c.speed} value={`${num(e.meta.velocity)?.toFixed(0) ?? '—'} km/h`} />
        <Detail label={c.over} value={fmtCoord(e.lat, e.lng)} />
      </div>
    );
  }
  if (e.layer === 'weather') {
    const code = num(e.meta.weatherCode);
    return (
      <>
        <div className="font-mono text-3xl text-ink">
          {num(e.meta.temperature)?.toFixed(1) ?? '—'}°C
        </div>
        <div className="mt-3 space-y-1 text-sm">
          <Detail
            label={c.conditions}
            value={code != null ? (c.wmo[code] ?? `#${code}`) : '—'}
          />
          <Detail label={c.location} value={fmtCoord(e.lat, e.lng)} />
        </div>
      </>
    );
  }
  // flight
  return (
    <div className="mt-1 space-y-1 text-sm">
      <Detail label={c.altitude} value={`${num(e.alt)?.toFixed(1) ?? '—'} km`} />
      <Detail label={c.speed} value={`${num(e.meta.velocity)?.toFixed(0) ?? '—'} m/s`} />
      <Detail label={c.heading} value={`${num(e.meta.heading)?.toFixed(0) ?? '—'}°`} />
      <Detail label={c.position} value={fmtCoord(e.lat, e.lng)} />
    </div>
  );
}

/** Detail card for the selected event. Driven by the UI store; Esc closes. */
export default function EventCard() {
  const t = useT();
  const e = useUIStore((s) => s.selectedEvent);
  const select = useUIStore((s) => s.select);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  if (!e) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-card border border-border-hair bg-surface p-5 shadow-float">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: LAYER_COLOR[e.layer] }}
          />
          {t.card.layer[e.layer]}
        </div>
        <button
          onClick={() => select(null)}
          aria-label={t.card.close}
          className="text-ink-faint transition-colors hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 font-display text-lg tracking-display">{e.label}</div>
      <div className="mt-2">
        <Body e={e} />
      </div>
    </div>
  );
}
