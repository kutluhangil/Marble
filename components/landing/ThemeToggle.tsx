'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useT } from '@/lib/i18n/useT';

export default function ThemeToggle() {
  const t = useT();
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button
      onClick={toggle}
      aria-label={t.theme.toggle}
      className="text-base leading-none text-ink-soft transition-colors hover:text-ink"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
