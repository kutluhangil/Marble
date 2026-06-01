'use client';

import { useTimeStore } from '@/store/useTimeStore';
import { useT } from '@/lib/i18n/useT';

const HOUR = 3_600_000;

function utcHHMM(d: Date): string {
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(
    d.getUTCMinutes(),
  ).padStart(2, '0')}`;
}

/** Drag to shift the sun ±12h and watch the terminator and city lights sweep. */
export default function TimeScrubber() {
  const t = useT();
  const offsetMs = useTimeStore((s) => s.offsetMs);
  const setOffset = useTimeStore((s) => s.setOffset);
  const reset = useTimeStore((s) => s.reset);

  const simDate = new Date(Date.now() + offsetMs);

  return (
    <div className="glass inline-flex items-center gap-3 rounded-pill border border-border-hair px-4 py-2 text-xs backdrop-blur">
      <span className="font-mono uppercase text-ink-muted">{t.time.caption}</span>
      <input
        type="range"
        min={-12}
        max={12}
        step={0.25}
        value={offsetMs / HOUR}
        onChange={(e) => setOffset(parseFloat(e.target.value) * HOUR)}
        aria-label={t.time.caption}
        className="h-1 w-40 cursor-pointer accent-ink"
      />
      <span className="font-mono tabular-nums text-ink">
        {utcHHMM(simDate)} UTC
      </span>
      {offsetMs !== 0 && (
        <button
          onClick={reset}
          className="font-mono lowercase text-ink-muted transition-colors hover:text-ink"
        >
          {t.time.now}
        </button>
      )}
    </div>
  );
}
