'use client';

import Reveal from '@/components/motion/Reveal';
import { useT } from '@/lib/i18n/useT';

export default function BuiltWith() {
  const t = useT();
  return (
    <section className="border-t border-border-hair">
      <div className="mx-auto max-w-container px-6 py-[var(--section-pad)]">
        <Reveal>
          <h2 className="font-display text-2xl tracking-display">
            {t.built.title}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">{t.built.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
