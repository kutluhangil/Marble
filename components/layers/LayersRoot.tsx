'use client';

import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import type { GeoPoint } from '@/lib/data/types';
import IconLayer from './IconLayer';
import SeismicLayer from './SeismicLayer';
import ISSLayer from './ISSLayer';
import FocusPlume from './FocusPlume';
import { ICON } from '@/lib/icons/atlas';

type RGB = [number, number, number];

function weatherCell(p: GeoPoint): number {
  const c = (p.meta.weatherCode as number | null) ?? null;
  if (c == null) return ICON.cloud;
  if (c <= 1) return ICON.sun;
  if (c <= 3) return ICON.cloud;
  if (c === 45 || c === 48) return ICON.fog;
  if ([71, 73, 75, 77, 85, 86].includes(c)) return ICON.snow;
  if (c >= 95) return ICON.storm;
  return ICON.rain;
}
function weatherTint(p: GeoPoint): RGB {
  switch (weatherCell(p)) {
    case ICON.sun:
      return [0.96, 0.62, 0.12];
    case ICON.rain:
      return [0.22, 0.6, 0.9];
    case ICON.storm:
      return [0.5, 0.45, 0.95];
    case ICON.snow:
      return [0.7, 0.85, 0.96];
    case ICON.fog:
      return [0.68, 0.72, 0.78];
    default:
      return [0.55, 0.62, 0.7];
  }
}

const VOLCANO_TINT: RGB = [0.9, 0.28, 0.2];
const FIRE_TINT: RGB = [0.97, 0.45, 0.1];
const FLIGHT_TINT: RGB = [0.42, 0.4, 0.36];

const volcanoCell = () => ICON.volcano;
const volcanoTint = () => VOLCANO_TINT;
const fireCell = () => ICON.flame;
const fireTint = () => FIRE_TINT;
const flightCell = () => ICON.plane;
const flightTint = () => FLIGHT_TINT;

/** Active data layers, each with its own visual language, inside the spinning
 *  world group so they stay pinned to geography. */
export default function LayersRoot() {
  const active = useLayersStore((s) => s.active);
  const events = useDataStore((s) => s.events);
  const iss = events.iss[0];

  return (
    <group>
      {active.quake && <SeismicLayer points={events.quake} />}
      {active.weather && (
        <IconLayer
          points={events.weather}
          cellFor={weatherCell}
          tintFor={weatherTint}
          size={0.06}
        />
      )}
      {active.flight && (
        <IconLayer
          points={events.flight}
          cellFor={flightCell}
          tintFor={flightTint}
          size={0.05}
        />
      )}
      {active.volcano && (
        <IconLayer
          points={events.volcano}
          cellFor={volcanoCell}
          tintFor={volcanoTint}
          size={0.07}
        />
      )}
      {active.fire && (
        <IconLayer
          points={events.fire}
          cellFor={fireCell}
          tintFor={fireTint}
          size={0.06}
        />
      )}
      {active.iss && iss && <ISSLayer point={iss} />}
      <FocusPlume />
    </group>
  );
}
