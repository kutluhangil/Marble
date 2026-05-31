'use client';

import dynamic from 'next/dynamic';

// WebGL is client-only; load the canvas without SSR.
const Globe = dynamic(() => import('@/components/earth/Globe'), { ssr: false });

export default function Hero() {
  return (
    <section className="mx-auto max-w-container px-6 pb-24 pt-16 text-center">
      <h1 className="mx-auto max-w-3xl font-display text-3xl leading-tight tracking-display sm:text-4xl">
        A live portrait of Earth
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
        Real-time data on the most realistic planet you&rsquo;ve seen in a
        browser.
      </p>

      <div className="relative mx-auto mt-10 h-[60vh] min-h-[420px] w-full">
        <Globe />
      </div>
    </section>
  );
}
