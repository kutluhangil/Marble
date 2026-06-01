'use client';

import { useT } from '@/lib/i18n/useT';

export default function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-border-hair">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-2 px-6 py-10 text-sm text-ink-muted sm:flex-row">
        <span>MARBLE — {t.footer.tagline}</span>
        <span>USGS · NASA · Open-Meteo · OpenSky</span>
      </div>
    </footer>
  );
}
