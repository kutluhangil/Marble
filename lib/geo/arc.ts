import { Vector3 } from 'three';
import { latLngToVector3 } from './coordinates';

/**
 * Generate points along the great-circle arc between two coordinates.
 * The arc bulges away from the surface, peaking at the midpoint by `maxAlt`,
 * which gives flight/orbit lines their lift.
 *
 * @returns `segments + 1` points from `a` to `b`.
 */
export function greatCirclePoints(
  a: [number, number],
  b: [number, number],
  segments = 48,
  maxAlt = 0.15,
): Vector3[] {
  const va = latLngToVector3(a[0], a[1], 1).normalize();
  const vb = latLngToVector3(b[0], b[1], 1).normalize();

  const dot = Math.min(1, Math.max(-1, va.dot(vb)));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);

  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    let point: Vector3;
    if (sinOmega < 1e-6) {
      // Endpoints coincide or are antipodal-degenerate: fall back to lerp.
      point = va.clone().lerp(vb, t).normalize();
    } else {
      const wa = Math.sin((1 - t) * omega) / sinOmega;
      const wb = Math.sin(t * omega) / sinOmega;
      point = va
        .clone()
        .multiplyScalar(wa)
        .add(vb.clone().multiplyScalar(wb));
    }

    const lift = 1 + maxAlt * Math.sin(Math.PI * t);
    points.push(point.multiplyScalar(lift));
  }

  return points;
}
