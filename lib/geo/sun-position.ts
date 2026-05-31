import { Vector3 } from 'three';
import { latLngToVector3 } from './coordinates';

const DEG2RAD = Math.PI / 180;

/**
 * Approximate the subsolar point (where the sun is directly overhead) for a
 * given instant. Low-precision: declination from day-of-year, longitude from
 * the UTC hour angle, ignoring the equation of time. Accurate to ~1°, which is
 * well within visual tolerance for the terminator.
 */
export function subsolarPoint(date: Date): { lat: number; lng: number } {
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (date.getTime() - yearStart) / 86_400_000;

  // Solar declination.
  const lat = -23.44 * Math.cos(DEG2RAD * (360 / 365) * (dayOfYear + 10));

  // Subsolar longitude: local solar noon sits where UTC + lng/15 = 12.
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  let lng = -15 * (utcHours - 12);
  lng = ((((lng + 180) % 360) + 360) % 360) - 180; // wrap to [-180, 180]

  return { lat, lng };
}

/** World-space unit vector pointing from the Earth's center toward the sun. */
export function sunDirectionWorld(date: Date): Vector3 {
  const { lat, lng } = subsolarPoint(date);
  return latLngToVector3(lat, lng, 1).normalize();
}
