import Reveal from '@/components/motion/Reveal';

export default function BuiltWith() {
  return (
    <section className="border-t border-border-hair">
      <div className="mx-auto max-w-container px-6 py-[var(--section-pad)]">
        <Reveal>
          <h2 className="font-display text-2xl tracking-display">Built with</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Three.js · React Three Fiber · custom PBR shading · NASA Blue Marble
            and Black Marble imagery · a real-time solar terminator · USGS ·
            Open-Meteo · OpenSky.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
