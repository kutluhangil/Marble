const USGS_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

/** Fetch the USGS "all earthquakes, past day" GeoJSON feed. */
export async function fetchEarthquakes(): Promise<unknown> {
  const res = await fetch(USGS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`USGS request failed: ${res.status}`);
  return res.json();
}
