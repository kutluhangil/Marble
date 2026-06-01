'use client';

import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';

export function issRadius(p: GeoPoint): number {
  return 1.005 + Math.min((p.alt ?? 420) / 6371, 0.1);
}

/** The ISS as a small amber marker at its live position. */
export default function ISSMarker({ point }: { point: GeoPoint }) {
  const select = useUIStore((s) => s.select);
  const hover = useUIStore((s) => s.hover);
  const pos = useMemo(
    () => latLngToVector3(point.lat, point.lng, issRadius(point)),
    [point.lat, point.lng, point.alt],
  );

  return (
    <mesh
      position={pos}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        select(point);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        hover(point.id);
      }}
      onPointerOut={() => hover(null)}
    >
      <sphereGeometry args={[0.016, 16, 16]} />
      <meshBasicMaterial color="#ca8a04" toneMapped={false} />
    </mesh>
  );
}
