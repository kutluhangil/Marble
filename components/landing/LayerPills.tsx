'use client';

import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import type { Layer } from '@/lib/data/types';
import { cn } from '@/lib/utils/cn';

const META: { layer: Layer; label: string; color: string }[] = [
  { layer: 'quake', label: 'Earthquakes', color: 'var(--data-quake)' },
  { layer: 'iss', label: 'ISS', color: 'var(--data-iss)' },
  { layer: 'weather', label: 'Weather', color: 'var(--data-weather)' },
  { layer: 'flight', label: 'Flights', color: 'var(--data-flight)' },
];

export default function LayerPills() {
  const active = useLayersStore((s) => s.active);
  const toggle = useLayersStore((s) => s.toggle);
  const flightAvailable = useLayersStore((s) => s.flightAvailable);
  const events = useDataStore((s) => s.events);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {META.map(({ layer, label, color }) => {
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
            {label}
            {on && !disabled && count > 0 && (
              <span className="font-mono text-xs text-ink-muted">{count}</span>
            )}
            {disabled && (
              <span className="font-mono text-[10px] uppercase text-ink-faint">
                n/a
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
