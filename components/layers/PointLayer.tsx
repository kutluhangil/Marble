'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import {
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
} from 'three';
import type { GeoPoint, Layer } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';

const MAX = 1024;

const COLORS: Record<Layer, string> = {
  quake: '#dc2626',
  iss: '#ca8a04',
  weather: '#0ea5e9',
  flight: '#44403c',
  volcano: '#be185d',
  fire: '#ea580c',
};

function scaleFor(p: GeoPoint): number {
  if (p.layer === 'quake') return 0.006 + Math.max(0, p.magnitude ?? 0) * 0.004;
  if (p.layer === 'flight') return 0.009;
  if (p.layer === 'volcano') return 0.013;
  if (p.layer === 'fire') return 0.012;
  return 0.011; // weather
}

function radiusFor(p: GeoPoint): number {
  const altKm = p.alt ?? 0;
  return 1.005 + Math.min(altKm / 6371, 0.08);
}

/** Renders a single layer's GeoPoints as an instanced marker cloud. */
export default function PointLayer({
  points,
  layer,
}: {
  points: GeoPoint[];
  layer: Layer;
}) {
  const dummy = useMemo(() => new Object3D(), []);
  const hover = useUIStore((s) => s.hover);
  const select = useUIStore((s) => s.select);
  const spawn = useRef(0);

  const mesh = useMemo(() => {
    const geo = new SphereGeometry(1, 12, 12);
    const mat = new MeshBasicMaterial({ color: COLORS[layer], toneMapped: false });
    const m = new InstancedMesh(geo, mat, MAX);
    m.count = 0;
    m.frustumCulled = false;
    return m;
  }, [layer]);

  // Grow markers in once on mount; later updates appear at full scale (no
  // periodic blink when the data refreshes).
  useEffect(() => {
    spawn.current = 0;
  }, []);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as MeshBasicMaterial).dispose();
    },
    [mesh],
  );

  useFrame((_, dt) => {
    spawn.current = Math.min(1, spawn.current + dt * 2.5);
    const count = Math.min(points.length, MAX);
    for (let i = 0; i < count; i++) {
      const p = points[i];
      dummy.position.copy(latLngToVector3(p.lat, p.lng, radiusFor(p)));
      dummy.scale.setScalar(scaleFor(p) * spawn.current);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.instanceId != null) hover(points[e.instanceId]?.id ?? null);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.instanceId != null) select(points[e.instanceId] ?? null);
  };

  return (
    <primitive
      object={mesh}
      onPointerMove={onMove}
      onPointerOut={() => hover(null)}
      onClick={onClick}
    />
  );
}
