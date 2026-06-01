'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  DoubleSide,
  type Mesh,
  type MeshBasicMaterial,
} from 'three';
import { useDataStore } from '@/store/useDataStore';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import type { GeoPoint } from '@/lib/data/types';

const PERIOD = 2.8;

function Ring({ p, offset }: { p: GeoPoint; offset: number }) {
  const ref = useRef<Mesh>(null);
  const mat = useRef<MeshBasicMaterial>(null);
  const pos = latLngToVector3(p.lat, p.lng, 1.012);
  const mag = p.magnitude ?? 6;
  const maxScale = 0.12 + (mag - 6) * 0.06;

  useFrame((s) => {
    const k = (s.clock.elapsedTime / PERIOD + offset) % 1;
    if (ref.current) ref.current.scale.setScalar(0.02 + k * maxScale);
    if (mat.current) mat.current.opacity = (1 - k) * 0.5;
  });

  return (
    <mesh ref={ref} position={pos} onUpdate={(self) => self.lookAt(0, 0, 0)}>
      <ringGeometry args={[0.72, 1, 56]} />
      <meshBasicMaterial
        ref={mat}
        color="#ff3b30"
        transparent
        opacity={0.5}
        side={DoubleSide}
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Continuous expanding rings for significant earthquakes — one wavefront for
 *  M6–7, multiple staggered wavefronts for M7+. */
export default function SeismicRings() {
  const quakes = useDataStore((s) => s.events.quake);
  const significant = useMemo(
    () => quakes.filter((q) => (q.magnitude ?? 0) >= 6).slice(0, 30),
    [quakes],
  );

  return (
    <>
      {significant.flatMap((q) => {
        const n = (q.magnitude ?? 6) >= 7 ? 3 : 1;
        return Array.from({ length: n }).map((_, i) => (
          <Ring key={`${q.id}-${i}`} p={q} offset={i / n} />
        ));
      })}
    </>
  );
}
