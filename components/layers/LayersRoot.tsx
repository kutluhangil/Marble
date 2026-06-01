'use client';

import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import type { GeoPoint } from '@/lib/data/types';
import GlowLayer, { type GlowConfig } from './GlowLayer';
import WeatherLayer from './WeatherLayer';
import ISSLayer from './ISSLayer';
import SeismicRings from './SeismicRings';
import FocusPlume from './FocusPlume';

// Each layer has a distinct colour + motion identity.
const QUAKE: GlowConfig = { color: '#ff3b30', speed: 2.2, pulse: 0.22, size: 0.009, emissive: 1.6 };
const VOLCANO: GlowConfig = { color: '#ef4444', speed: 1.1, pulse: 0.14, size: 0.014, emissive: 1.5 };
const FIRE: GlowConfig = { color: '#f97316', speed: 7, pulse: 0.25, size: 0.011, emissive: 1.6 };
const FLIGHT: GlowConfig = { color: '#57534e', speed: 0, pulse: 0, size: 0.008, emissive: 0.9 };

const quakeSize = (p: GeoPoint) => 0.7 + (p.magnitude ?? 0) * 0.18;
const quakeIntensity = (p: GeoPoint) => Math.min(1, (p.magnitude ?? 0) / 8);

/** Active data layers, inside the spinning world group so markers stay pinned. */
export default function LayersRoot() {
  const active = useLayersStore((s) => s.active);
  const events = useDataStore((s) => s.events);
  const iss = events.iss[0];

  return (
    <group>
      {active.quake && (
        <GlowLayer
          points={events.quake}
          config={QUAKE}
          sizeBy={quakeSize}
          intensityBy={quakeIntensity}
        />
      )}
      {active.quake && <SeismicRings />}
      {active.weather && <WeatherLayer points={events.weather} />}
      {active.flight && <GlowLayer points={events.flight} config={FLIGHT} />}
      {active.volcano && <GlowLayer points={events.volcano} config={VOLCANO} />}
      {active.fire && <GlowLayer points={events.fire} config={FIRE} />}
      {active.iss && iss && <ISSLayer point={iss} />}
      <FocusPlume />
    </group>
  );
}
