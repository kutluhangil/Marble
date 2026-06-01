'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { hasWebGL } from '@/lib/utils/webgl';
import { useT } from '@/lib/i18n/useT';
import LayerPills from './LayerPills';
import LiveStats from './LiveStats';
import StylePills from './StylePills';

// WebGL is client-only; load the canvas without SSR.
const Globe = dynamic(() => import('@/components/earth/Globe'), { ssr: false });

const EASE = [0.16, 1, 0.3, 1];

export default function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  return (
    <section className="mx-auto max-w-container px-6 pb-20 pt-16 text-center">
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-3xl font-display text-3xl leading-tight tracking-display sm:text-4xl"
      >
        {t.hero.title}
      </motion.h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        className="mx-auto mt-5 max-w-xl text-lg text-ink-soft"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={reduce ? {} : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="relative mx-auto mt-8 h-[58vh] min-h-[380px] w-full"
      >
        {webgl ? (
          <Globe />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div
              className="h-64 w-64 rounded-full bg-cover bg-center shadow-float"
              style={{ backgroundImage: 'url(/textures/earth-day-2k.jpg)' }}
              role="img"
              aria-label="Earth"
            />
            <p className="text-sm text-ink-muted">{t.hero.noWebgl}</p>
          </div>
        )}
      </motion.div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-center">
          <StylePills />
        </div>
        <LayerPills />
        <LiveStats />
      </div>
    </section>
  );
}
