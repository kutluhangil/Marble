'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/useT';

export default function GlobeActions() {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const screenshot = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'marble.png';
    a.click();
  };

  const btn =
    'rounded-pill border border-border-hair px-3 py-1.5 text-ink-soft transition-colors hover:border-ink hover:text-ink';

  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <button onClick={share} className={btn}>
        {copied ? t.actions.copied : t.actions.share}
      </button>
      <button onClick={screenshot} className={btn}>
        {t.actions.screenshot}
      </button>
    </div>
  );
}
