'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGlobeStyleStore, type GlobeStyle } from '@/store/useGlobeStyleStore';
import { useT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils/cn';

const STYLES: GlobeStyle[] = [
  'realistic', 'illustrated', 'atlas', 'glass',
  'sculpture', 'infrared', 'parchment', 'blueprint',
];

/** Palette dot colour per style — matches the visual identity of each rendering */
const STYLE_COLOR: Record<GlobeStyle, string> = {
  realistic:  '#4a90d9',
  illustrated:'#f4a851',
  atlas:      '#6db36d',
  glass:      '#a0cce8',
  sculpture:  '#c8b89a',
  infrared:   '#c4694a',
  parchment:  '#b89b6e',
  blueprint:  '#8c8c7a',
};

export default function StylePills() {
  const t = useT();
  const style   = useGlobeStyleStore((s) => s.style);
  const setStyle = useGlobeStyleStore((s) => s.setStyle);

  const [hovered, setHovered] = useState<GlobeStyle | null>(null);

  return (
    <div className="glass inline-flex items-center gap-1 rounded-pill border border-border-hair p-1 text-sm backdrop-blur">
      {STYLES.map((s) => {
        const info  = t.styleInfo[s];
        const color = STYLE_COLOR[s];
        const open  = hovered === s;

        return (
          <div
            key={s}
            className="relative"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Pill button */}
            <button
              onClick={() => setStyle(s)}
              aria-pressed={style === s}
              className={cn(
                'rounded-pill px-3 py-1 transition-colors',
                style === s ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink',
              )}
            >
              {t.style[s]}
            </button>

            {/* Hover tooltip — same glass card design as LayerPills */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="glass pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-card border border-border-hair p-4 text-left shadow-float backdrop-blur"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 flex-none rounded-full"
                      style={{ background: color }}
                    />
                    <span className="font-display text-sm tracking-display text-ink">
                      {info.headline}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                    {info.desc}
                  </p>

                  {/* Tech line */}
                  <p className="mt-3 border-t border-border-hair pt-3 font-mono text-[10px] leading-relaxed text-ink-muted">
                    {info.tech}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
