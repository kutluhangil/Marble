'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import type { Layer } from '@/lib/data/types';
import { useT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils/cn';

const META: { layer: Layer; color: string }[] = [
  { layer: 'quake',   color: 'var(--data-quake)'   },
  { layer: 'iss',     color: 'var(--data-iss)'     },
  { layer: 'weather', color: 'var(--data-weather)' },
  { layer: 'flight',  color: 'var(--data-flight)'  },
  { layer: 'volcano', color: 'var(--data-volcano)' },
  { layer: 'fire',    color: 'var(--data-fire)'    },
];

const SOURCE_URL: Record<Layer, string> = {
  quake:   'https://earthquake.usgs.gov',
  iss:     'https://wheretheiss.at',
  weather: 'https://open-meteo.com',
  flight:  'https://opensky-network.org',
  volcano: 'https://eonet.gsfc.nasa.gov',
  fire:    'https://eonet.gsfc.nasa.gov',
};

/** Static ISS orbital parameters (well-known constants) */
const ISS_PARAMS = {
  altitude:    '~408 km',
  speed:       '~27,600 km/h',
  period:      '~92 min',
  inclination: '51.6°',
  crew:        '7',
};

type StatusKind = 'live' | 'idle' | 'unavailable';

function InfoIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.6" />
      <line x1="8" y1="7.2" x2="8" y2="11.2" strokeLinecap="round" />
      <circle cx="8" cy="4.8" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <line x1="3" y1="3" x2="13" y2="13" strokeLinecap="round" />
      <line x1="13" y1="3" x2="3"  y2="13" strokeLinecap="round" />
    </svg>
  );
}

function StatusDot({ kind }: { kind: StatusKind }) {
  if (kind === 'live') {
    return (
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
      </span>
    );
  }
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: kind === 'unavailable' ? '#d97706' : 'var(--ink-faint)' }}
    />
  );
}

/** Full-screen ISS modal with orbital facts */
function ISSModal({
  open,
  onClose,
  color,
}: {
  open: boolean;
  onClose: () => void;
  color: string;
}) {
  const t = useT();
  const m = t.issModal;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="iss-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal card */}
          <motion.div
            key="iss-modal"
            role="dialog"
            aria-modal="true"
            aria-label={m.title}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card border border-border-hair p-6 shadow-float backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-ink-faint transition-colors hover:text-ink"
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 h-3 w-3 flex-none rounded-full ring-2 ring-offset-1"
                style={{ background: color }}
              />
              <div>
                <h2 className="font-display text-base tracking-display text-ink">
                  {m.title}
                </h2>
                <p className="mt-0.5 text-xs text-ink-muted">{m.subtitle}</p>
              </div>
            </div>

            {/* Orbital stats grid */}
            <dl className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: m.altitude,    value: ISS_PARAMS.altitude    },
                { label: m.speed,       value: ISS_PARAMS.speed       },
                { label: m.period,      value: ISS_PARAMS.period      },
                { label: m.inclination, value: ISS_PARAMS.inclination },
                { label: m.crew,        value: ISS_PARAMS.crew        },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-border-hair px-3 py-2.5"
                >
                  <dt className="text-[10px] uppercase tracking-widest text-ink-muted">{label}</dt>
                  <dd className="mt-0.5 font-mono text-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            {/* About paragraph */}
            <p className="mt-4 border-t border-border-hair pt-4 text-xs leading-relaxed text-ink-soft">
              {m.about}
            </p>

            {/* Links */}
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.nasa.gov/international-space-station/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                {m.nasaLink} →
              </a>
              <a
                href={SOURCE_URL.iss}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                {m.liveLink} →
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function LayerPills() {
  const t = useT();
  const active         = useLayersStore((s) => s.active);
  const toggle         = useLayersStore((s) => s.toggle);
  const flightAvailable = useLayersStore((s) => s.flightAvailable);
  const events         = useDataStore((s) => s.events);

  const [hovered, setHovered] = useState<Layer | null>(null);
  const [pinned,  setPinned]  = useState<Layer | null>(null);
  const [issOpen, setIssOpen] = useState(false);

  // Close a tapped (pinned) popover when tapping elsewhere.
  useEffect(() => {
    if (pinned === null) return;
    const close = () => setPinned(null);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [pinned]);

  const statusOf = (layer: Layer): StatusKind => {
    if (layer === 'flight' && !flightAvailable) return 'unavailable';
    return active[layer] ? 'live' : 'idle';
  };

  return (
    <>
      {/* ISS full-screen modal */}
      <ISSModal
        open={issOpen}
        onClose={() => setIssOpen(false)}
        color="var(--data-iss)"
      />

      <div className="flex flex-wrap items-center justify-center gap-2">
        {META.map(({ layer, color }) => {
          const on       = active[layer];
          const disabled = layer === 'flight' && !flightAvailable;
          const count    = events[layer].length;
          // ISS uses modal, others use hover popover
          const open     = layer !== 'iss' && (hovered === layer || pinned === layer);
          const info     = t.layerInfo[layer];
          const status   = statusOf(layer);

          return (
            <div
              key={layer}
              className="relative"
              onMouseEnter={() => setHovered(layer)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={cn(
                  'flex items-center rounded-pill border text-sm transition-all',
                  disabled
                    ? 'border-border-hair text-ink-faint'
                    : on
                      ? 'border-ink text-ink'
                      : 'border-border-soft text-ink-soft hover:border-ink',
                )}
              >
                {/* Toggle button */}
                <button
                  disabled={disabled}
                  onClick={() => toggle(layer)}
                  className={cn(
                    'inline-flex items-center gap-2 py-1.5 pl-3.5 pr-1.5',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
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

                {/* Info button — ISS opens modal, others pin popover */}
                <button
                  aria-label={layer === 'iss' ? t.issModal.title : info.source}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    if (layer === 'iss') {
                      setIssOpen(true);
                    } else {
                      setPinned((p) => (p === layer ? null : layer));
                    }
                  }}
                  className="py-1.5 pl-1 pr-3 text-ink-faint transition-colors hover:text-ink"
                >
                  <InfoIcon />
                </button>
              </div>

              {/* Hover / pin popover — only for non-ISS layers */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="glass absolute bottom-full left-1/2 z-50 mb-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-card border border-border-hair p-4 text-left shadow-float backdrop-blur"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: color }}
                      />
                      <span className="font-display text-sm tracking-display text-ink">
                        {t.pills[layer]}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                      {info.desc}
                    </p>

                    <dl className="mt-3 space-y-1.5 border-t border-border-hair pt-3 text-xs">
                      <Row label={t.infoLabels.source}   value={info.source}   />
                      <Row label={t.infoLabels.updates}  value={info.updates}  />
                      <Row label={t.infoLabels.coverage} value={info.coverage} />
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-ink-muted">{t.infoLabels.status}</dt>
                        <dd className="flex items-center gap-1.5 text-ink">
                          <StatusDot kind={status} />
                          {t.status[status]}
                        </dd>
                      </div>
                    </dl>

                    <a
                      href={SOURCE_URL[layer]}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                    >
                      {t.infoLabels.learnMore} →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-ink-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
