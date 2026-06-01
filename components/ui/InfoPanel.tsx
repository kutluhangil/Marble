'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { useLangStore } from '@/store/useLangStore';
import { useT } from '@/lib/i18n/useT';
import type { GeoPoint } from '@/lib/data/types';
import type { Lang } from '@/lib/i18n/dict';
import { buildPanel } from '@/lib/panel/buildPanel';
import { wikiSummary } from '@/lib/panel/enrich';

interface Extra {
  extract?: string;
  thumb?: string;
  wikiUrl?: string;
  crew?: string[];
}

function useEnrichment(event: GeoPoint | null, lang: Lang): Extra {
  const [extra, setExtra] = useState<Extra>({});

  useEffect(() => {
    setExtra({});
    if (!event) return;
    let cancelled = false;

    (async () => {
      if (event.layer === 'iss') {
        try {
          const r = await fetch('/api/crew').then((res) => res.json());
          if (!cancelled) setExtra({ crew: r.crew ?? [] });
        } catch {
          /* ignore */
        }
      } else if (event.layer === 'volcano' || event.layer === 'weather') {
        const title =
          event.layer === 'volcano' ? event.label.split(',')[0].trim() : event.label;
        const w = await wikiSummary(title, lang);
        if (!cancelled && w) {
          setExtra({ extract: w.extract, thumb: w.thumb, wikiUrl: w.url });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [event, lang]);

  return extra;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
        {label}
      </dt>
      <dd className="font-mono text-sm text-ink">{value}</dd>
    </div>
  );
}

export default function InfoPanel() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const event = useUIStore((s) => s.selectedEvent);
  const select = useUIStore((s) => s.select);
  const extra = useEnrichment(event, lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [select]);

  const p = event ? buildPanel(event, t, lang) : null;
  const description = extra.extract ?? p?.description;

  return (
    <AnimatePresence>
      {event && p && (
        <motion.aside
          key={event.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 border border-border-hair bg-surface shadow-float max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[78vh] max-sm:overflow-y-auto max-sm:rounded-t-card max-sm:rounded-b-none sm:bottom-6 sm:right-6 sm:max-h-[80vh] sm:w-80 sm:overflow-y-auto sm:rounded-card"
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-muted">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: p.color }}
                />
                {t.card.layer[p.layer]}
              </div>
              <button
                onClick={() => select(null)}
                aria-label={t.card.close}
                className="text-ink-faint transition-colors hover:text-ink"
              >
                ✕
              </button>
            </div>

            <h2 className="mt-2 font-display text-xl tracking-display text-ink">
              {p.title}
            </h2>
            {p.subtitle && (
              <p className="text-sm text-ink-soft">{p.subtitle}</p>
            )}

            {extra.thumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={extra.thumb}
                alt={p.title}
                className="mt-3 h-32 w-full rounded-lg border border-border-hair object-cover"
              />
            )}

            {description && (
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {description}
              </p>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border-hair pt-4">
              {p.stats.map((s) => (
                <Stat key={s.label} label={s.label} value={s.value} />
              ))}
            </dl>

            {p.facts && p.facts.length > 0 && (
              <div className="mt-4 border-t border-border-hair pt-4">
                <div className="mb-2 text-[11px] uppercase tracking-wide text-ink-muted">
                  {t.panel.aboutLocation}
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {p.facts.map((s) => (
                    <Stat key={s.label} label={s.label} value={s.value} />
                  ))}
                </dl>
              </div>
            )}

            {extra.crew && extra.crew.length > 0 && (
              <div className="mt-4 border-t border-border-hair pt-4">
                <div className="mb-2 text-[11px] uppercase tracking-wide text-ink-muted">
                  {t.panel.crewAboard} · {extra.crew.length}
                </div>
                <ul className="space-y-0.5 text-sm text-ink-soft">
                  {extra.crew.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-hair pt-3 text-xs">
              <span className="text-ink-muted">
                {t.infoLabels.source}: {p.sourceName}
              </span>
              <a
                href={extra.wikiUrl ?? p.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                {t.infoLabels.learnMore} →
              </a>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
