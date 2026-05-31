export type Layer = 'quake' | 'iss' | 'weather' | 'flight';

export const LAYERS: Layer[] = ['quake', 'iss', 'weather', 'flight'];

/** A single normalized data point rendered on the globe. */
export interface GeoPoint {
  id: string;
  layer: Layer;
  lat: number;
  lng: number;
  /** Altitude above the surface, in kilometers (ISS, flights). */
  alt?: number;
  /** Earthquake magnitude; drives marker scale. */
  magnitude?: number;
  label: string;
  /** Event time, epoch milliseconds. */
  timestamp: number;
  meta: Record<string, unknown>;
}
