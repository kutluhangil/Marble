import Reveal from '@/components/motion/Reveal';

const SOURCES = [
  { name: 'USGS', desc: 'Earthquakes from the past 24 hours.', cadence: 'every 60s' },
  { name: 'wheretheiss.at', desc: 'Live International Space Station position.', cadence: 'every 5s' },
  { name: 'Open-Meteo', desc: 'Current conditions across major cities.', cadence: 'every 5m' },
  { name: 'OpenSky', desc: 'Live flight traffic (optional).', cadence: 'every 15s' },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-border-hair">
      <div className="mx-auto max-w-container px-6 py-[var(--section-pad)]">
        <Reveal>
          <h2 className="font-display text-2xl tracking-display">How it works</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Every layer is drawn from a public, real-time source and refreshed
            while you watch.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="border-t border-border-ink pt-4">
                <div className="font-mono text-sm text-ink">{s.name}</div>
                <p className="mt-2 text-sm text-ink-soft">{s.desc}</p>
                <div className="mt-3 font-mono text-xs text-ink-muted">
                  {s.cadence}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
