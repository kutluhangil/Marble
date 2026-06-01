'use client';

import { useEffect } from 'react';
import { useLangStore } from '@/store/useLangStore';
import type { Lang } from '@/lib/i18n/dict';
import { cn } from '@/lib/utils/cn';

const LANGS: Lang[] = ['en', 'tr'];

export default function LangToggle() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="inline-flex items-center gap-0.5 rounded-pill border border-border-hair p-0.5 text-xs">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'rounded-pill px-2 py-0.5 font-mono uppercase transition-colors',
            lang === l ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
