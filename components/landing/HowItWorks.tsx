'use client';

import Reveal from '@/components/motion/Reveal';
import { useT } from '@/lib/i18n/useT';

export default function HowItWorks() {
  const t = useT();
  return (
    <section id="how" className="border-t border-border-hair">
      <div className="mx-auto max-w-container px-6 py-[var(--section-pad)]">
        <Reveal>
          <h2 className="font-display text-2xl tracking-display">
            {t.how.title}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">{t.how.intro}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.sources.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="border-t border-border-ink pt-4">
                <div className="font-mono text-sm text-ink">{s.name}</div>
                <p className="mt-2 text-sm text-ink-soft">{s.desc}</p>
                <div className="mt-3 font-mono text-xs text-ink-muted">
                  {s.cadence}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
