import { Vector3 } from 'three';

const DEG2RAD = Math.PI / 180;

/**
 * Convert geographic coordinates to a position on (or above) a sphere.
 * Uses the equirectangular convention that aligns with a default Three.js
 * SphereGeometry and a standard Blue Marble texture.
 *
 * @param lat   latitude in degrees (-90..90)
 * @param lng   longitude in degrees (-180..180)
 * @param radius sphere radius (default 1)
 * @param alt   altitude added along the radial direction (default 0)
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius = 1,
  alt = 0,
): Vector3 {
  const phi = (90 - lat) * DEG2RAD;
  const theta = (lng + 180) * DEG2RAD;
  const r = radius + alt;
  return new Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}
