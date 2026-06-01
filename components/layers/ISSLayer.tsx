'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  CatmullRomCurve3,
  Mesh,
  MeshBasicMaterial,
  TubeGeometry,
  Vector3,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import IconLayer from './IconLayer';
import { ICON } from '@/lib/icons/atlas';

const DEG2RAD = Math.PI / 180;
const INCL = 51.6 * DEG2RAD;
const Y = new Vector3(0, 1, 0);
const ISS_TINT: [number, number, number] = [0.98, 0.78, 0.25];
const TRAIL = 60;

function issR(p: GeoPoint): number {
  return 1.02 + Math.min((p.alt ?? 420) / 6371, 0.1);
}

const issCell = () => ICON.iss;
const issTint = () => ISS_TINT;

/** ISS as a recognizable spacecraft sprite with an always-visible orbit tube
 *  (full trajectory) and a live trail tube of where it has been. */
export default function ISSLayer({ point }: { point: GeoPoint }) {
  const R = issR(point);
  const issArr = useMemo(() => [point], [point]);
  const pos = useMemo(
    () => latLngToVector3(point.lat, point.lng, R),
    [point.lat, point.lng, R],
  );

  const orbit = useMemo(() => {
    const rotY = (point.lng + 180) * DEG2RAD;
    const pts: Vector3[] = [];
    const N = 128;
    for (let i = 0; i < N; i++) {
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
    const curve = new CatmullRomCurve3(pts, true);
    const geo = new TubeGeometry(curve, 200, 0.0035, 8, true);
    const mat = new MeshBasicMaterial({
      color: '#d97706',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      toneMapped: false,
    });
    return new Mesh(geo, mat);
  }, [point.lng, R]);

  const history = useRef<Vector3[]>([]);
  const trailRef = useRef<Mesh>(null);

  useEffect(() => {
    const h = history.current;
    const last = h[h.length - 1];
    if (!last || last.distanceTo(pos) > 1e-4) {
      h.push(pos.clone());
      if (h.length > TRAIL) h.shift();
    }
    if (trailRef.current && h.length >= 2) {
      const curve = new CatmullRomCurve3(h, false);
      const geo = new TubeGeometry(curve, Math.max(8, h.length * 2), 0.004, 8, false);
      trailRef.current.geometry.dispose();
      trailRef.current.geometry = geo;
    }
  }, [pos]);

  useEffect(
    () => () => {
      orbit.geometry.dispose();
      (orbit.material as MeshBasicMaterial).dispose();
    },
    [orbit],
  );

  return (
    <group>
      <primitive object={orbit} />
      <mesh ref={trailRef}>
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.9}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <IconLayer points={issArr} cellFor={issCell} tintFor={issTint} size={0.11} />
    </group>
  );
}
