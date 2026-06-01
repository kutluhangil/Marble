'use client';

import { useLayersStore } from '@/store/useLayersStore';
import { useDataStore } from '@/store/useDataStore';
import PointLayer from './PointLayer';
import ISSMarker from './ISSMarker';
import OrbitPath from './OrbitPath';

/** Mounts the active data layers. Lives inside the spinning world group so
 *  markers stay pinned to their geography. */
export default function LayersRoot() {
  const active = useLayersStore((s) => s.active);
  const events = useDataStore((s) => s.events);
  const iss = events.iss[0];

  return (
    <group>
      {active.quake && <PointLayer points={events.quake} layer="quake" />}
      {active.weather && <PointLayer points={events.weather} layer="weather" />}
      {active.flight && <PointLayer points={events.flight} layer="flight" />}
      {active.iss && iss && (
        <>
          <ISSMarker point={iss} />
          <OrbitPath point={iss} />
        </>
      )}
    </group>
  );
}
