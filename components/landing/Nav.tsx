'use client';

import { useT } from '@/lib/i18n/useT';
import LangToggle from './LangToggle';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const t = useT();
  return (
    <header className="glass sticky top-0 z-50 border-b border-border-hair backdrop-blur-md">
      <nav className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
        <span className="font-display text-lg tracking-display">MARBLE</span>
        <div className="flex items-center gap-5 text-sm text-ink-soft">
          <a href="#how" className="transition-colors hover:text-ink">
            {t.nav.about}
          </a>
          <a
            href="https://github.com/kutluhangil/marble"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <ThemeToggle />
          <LangToggle />
        </div>
      </nav>
    </header>
  );
}
