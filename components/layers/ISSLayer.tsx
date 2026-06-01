'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  Vector3,
  type Mesh,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';

const DEG2RAD = Math.PI / 180;
const INCL = 51.6 * DEG2RAD;
const Y = new Vector3(0, 1, 0);
const TRAIL = 90;

function issR(p: GeoPoint): number {
  return 1.005 + Math.min((p.alt ?? 420) / 6371, 0.1);
}

/**
 * Full ISS orbital tracking: an always-visible orbit ring, a live trail built
 * from the polled position history, and a pulsing marker at the current point.
 */
export default function ISSLayer({ point }: { point: GeoPoint }) {
  const select = useUIStore((s) => s.select);
  const hover = useUIStore((s) => s.hover);
  const R = issR(point);
  const pos = useMemo(
    () => latLngToVector3(point.lat, point.lng, R),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [point.lat, point.lng, point.alt],
  );

  // Orbit ring: tilted great circle through the current longitude.
  const orbit = useMemo(() => {
    const rotY = (point.lng + 180) * DEG2RAD;
    const pts: Vector3[] = [];
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      pts.push(
        new Vector3(
          Math.cos(t),
          Math.sin(t) * Math.sin(INCL),
          -Math.sin(t) * Math.cos(INCL),
        )
          .multiplyScalar(R)
          .applyAxisAngle(Y, rotY),
      );
    }
    const g = new BufferGeometry().setFromPoints(pts);
    const m = new LineBasicMaterial({
      color: '#ca8a04',
      transparent: true,
      opacity: 0.4,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    return new Line(g, m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point.lng, point.alt]);

  // Trail line built from polled position history.
  const history = useRef<Vector3[]>([]);
  const trail = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(new Float32Array(TRAIL * 3), 3));
    const m = new LineBasicMaterial({
      color: '#fbbf24',
      transparent: true,
      opacity: 0.85,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const l = new Line(g, m);
    l.frustumCulled = false;
    return l;
  }, []);

  useEffect(() => {
    const h = history.current;
    const last = h[h.length - 1];
    if (!last || last.distanceTo(pos) > 1e-4) {
      h.push(pos.clone());
      if (h.length > TRAIL) h.shift();
    }
    const arr = trail.geometry.getAttribute('position') as Float32BufferAttribute;
    for (let i = 0; i < TRAIL; i++) {
      const v = h[i] ?? h[0] ?? pos;
      arr.setXYZ(i, v.x, v.y, v.z);
    }
    arr.needsUpdate = true;
    trail.geometry.setDrawRange(0, Math.max(2, h.length));
  }, [pos, trail]);

  useEffect(
    () => () => {
      orbit.geometry.dispose();
      (orbit.material as LineBasicMaterial).dispose();
    },
    [orbit],
  );
  useEffect(
    () => () => {
      trail.geometry.dispose();
      (trail.material as LineBasicMaterial).dispose();
    },
    [trail],
  );

  const marker = useRef<Mesh>(null);
  useFrame((s) => {
    if (marker.current) {
      marker.current.scale.setScalar(0.02 * (1 + Math.sin(s.clock.elapsedTime * 3) * 0.18));
    }
  });

  return (
    <group>
      <primitive object={orbit} />
      <primitive object={trail} />
      <mesh
        ref={marker}
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
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </mesh>
    </group>
  );
}
