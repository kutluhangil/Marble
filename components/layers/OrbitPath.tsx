'use client';

import { useEffect, useMemo } from 'react';
import {
  BufferGeometry,
  LineBasicMaterial,
  LineLoop,
  Vector3,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { issRadius } from './ISSMarker';

const DEG2RAD = Math.PI / 180;
const INCLINATION = 51.6 * DEG2RAD; // ISS orbital inclination
const Y_AXIS = new Vector3(0, 1, 0);

/** Indicative ISS ground-track ring (tilted great circle) through the current
 *  longitude. Not a precise propagation — a calm visual cue. */
export default function OrbitPath({ point }: { point: GeoPoint }) {
  const line = useMemo(() => {
    const R = issRadius(point);
    const rotY = (point.lng + 180) * DEG2RAD;
    const pts: Vector3[] = [];
    const N = 128;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const v = new Vector3(
        Math.cos(t),
        Math.sin(t) * Math.sin(INCLINATION),
        -Math.sin(t) * Math.cos(INCLINATION),
      )
        .multiplyScalar(R)
        .applyAxisAngle(Y_AXIS, rotY);
      pts.push(v);
    }
    const geometry = new BufferGeometry().setFromPoints(pts);
    const material = new LineBasicMaterial({
      color: '#ca8a04',
      transparent: true,
      opacity: 0.3,
      toneMapped: false,
    });
    return new LineLoop(geometry, material);
    // Rebuild only when the orbit's position inputs change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [point.lng, point.alt]);

  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
    },
    [line],
  );

  return <primitive object={line} />;
}
