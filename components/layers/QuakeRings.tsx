'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Mesh, type MeshBasicMaterial } from 'three';
import { useDataStore } from '@/store/useDataStore';
import { latLngToVector3 } from '@/lib/geo/coordinates';

const MIN_MAG = 4.5;
const LIFE = 2.6; // seconds

function Ring({
  lat,
  lng,
  onDone,
}: {
  lat: number;
  lng: number;
  onDone: () => void;
}) {
  const ref = useRef<Mesh>(null);
  const mat = useRef<MeshBasicMaterial>(null);
  const t = useRef(0);
  const pos = latLngToVector3(lat, lng, 1.01);

  useFrame((_, dt) => {
    t.current += dt;
    const k = t.current / LIFE;
    if (k >= 1) {
      onDone();
      return;
    }
    if (ref.current) ref.current.scale.setScalar(0.02 + k * 0.2);
    if (mat.current) mat.current.opacity = (1 - k) * 0.6;
  });

  return (
    <mesh ref={ref} position={pos} onUpdate={(self) => self.lookAt(0, 0, 0)}>
      <ringGeometry args={[0.75, 1, 48]} />
      <meshBasicMaterial
        ref={mat}
        color="#dc2626"
        transparent
        opacity={0.6}
        side={DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Expanding ripple rings for newly arriving significant earthquakes. */
export default function QuakeRings() {
  const quakes = useDataStore((s) => s.events.quake);
  const seen = useRef<Set<string>>(new Set());
  const seeded = useRef(false);
  const [rings, setRings] = useState<
    { key: string; lat: number; lng: number }[]
  >([]);

  useEffect(() => {
    // Seed the first batch silently so we only ripple genuinely new quakes.
    if (!seeded.current) {
      if (quakes.length === 0) return;
      quakes.forEach((q) => seen.current.add(q.id));
      seeded.current = true;
      return;
    }
    const fresh = quakes.filter(
      (q) => !seen.current.has(q.id) && (q.magnitude ?? 0) >= MIN_MAG,
    );
    if (fresh.length === 0) return;
    fresh.forEach((q) => seen.current.add(q.id));
    setRings((r) => [
      ...r,
      ...fresh.map((q) => ({
        key: `${q.id}-${Date.now()}`,
        lat: q.lat,
        lng: q.lng,
      })),
    ]);
  }, [quakes]);

  const remove = (key: string) =>
    setRings((r) => r.filter((x) => x.key !== key));

  return (
    <>
      {rings.map((r) => (
        <Ring key={r.key} lat={r.lat} lng={r.lng} onDone={() => remove(r.key)} />
      ))}
    </>
  );
}
