'use client';

import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import type { Layer } from '@/lib/data/types';
import { useT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils/cn';

const META: { layer: Layer; color: string }[] = [
  { layer: 'quake', color: 'var(--data-quake)' },
  { layer: 'iss', color: 'var(--data-iss)' },
  { layer: 'weather', color: 'var(--data-weather)' },
  { layer: 'flight', color: 'var(--data-flight)' },
];

export default function LayerPills() {
  const t = useT();
  const active = useLayersStore((s) => s.active);
  const toggle = useLayersStore((s) => s.toggle);
  const flightAvailable = useLayersStore((s) => s.flightAvailable);
  const events = useDataStore((s) => s.events);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {META.map(({ layer, color }) => {
        const on = active[layer];
        const disabled = layer === 'flight' && !flightAvailable;
        const count = events[layer].length;
        return (
          <button
            key={layer}
            disabled={disabled}
            onClick={() => toggle(layer)}
            className={cn(
              'inline-flex items-center gap-2 rounded-pill border px-3.5 py-1.5 text-sm transition-all',
              disabled
                ? 'cursor-not-allowed border-border-hair text-ink-faint'
                : on
                  ? 'border-ink text-ink'
                  : 'border-border-soft text-ink-soft hover:-translate-y-px hover:border-ink',
            )}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: on && !disabled ? color : 'transparent',
                boxShadow: `inset 0 0 0 1.5px ${disabled ? 'var(--ink-faint)' : color}`,
              }}
            />
            {t.pills[layer]}
            {on && !disabled && count > 0 && (
              <span className="font-mono text-xs text-ink-muted">{count}</span>
            )}
            {disabled && (
              <span className="font-mono text-[10px] uppercase text-ink-faint">
                {t.pills.na}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
