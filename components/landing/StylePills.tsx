'use client';

import { useGlobeStyleStore, type GlobeStyle } from '@/store/useGlobeStyleStore';
import { useT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils/cn';

const STYLES: GlobeStyle[] = ['realistic', 'illustrated', 'atlas', 'glass', 'sculpture', 'infrared'];

export default function StylePills() {
  const t = useT();
  const style = useGlobeStyleStore((s) => s.style);
  const setStyle = useGlobeStyleStore((s) => s.setStyle);

  return (
    <div className="glass inline-flex items-center gap-1 rounded-pill border border-border-hair p-1 text-sm backdrop-blur">
      {STYLES.map((s) => (
        <button
          key={s}
          onClick={() => setStyle(s)}
          aria-pressed={style === s}
          className={cn(
            'rounded-pill px-3 py-1 transition-colors',
            style === s ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink',
          )}
        >
          {t.style[s]}
        </button>
      ))}
    </div>
  );
}
