import type { City } from '../normalize';

/** Curated, globally distributed major cities for the weather layer. */
export const CITIES: City[] = [
  { name: 'Tokyo', lat: 35.68, lng: 139.69 },
  { name: 'Delhi', lat: 28.61, lng: 77.21 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63 },
  { name: 'Mexico City', lat: 19.43, lng: -99.13 },
  { name: 'Cairo', lat: 30.04, lng: 31.24 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88 },
  { name: 'Beijing', lat: 39.9, lng: 116.41 },
  { name: 'New York', lat: 40.71, lng: -74.01 },
  { name: 'Buenos Aires', lat: -34.6, lng: -58.38 },
  { name: 'Istanbul', lat: 41.01, lng: 28.98 },
  { name: 'Lagos', lat: 6.52, lng: 3.38 },
  { name: 'Los Angeles', lat: 34.05, lng: -118.24 },
  { name: 'Moscow', lat: 55.76, lng: 37.62 },
  { name: 'Paris', lat: 48.86, lng: 2.35 },
  { name: 'London', lat: 51.51, lng: -0.13 },
  { name: 'Jakarta', lat: -6.21, lng: 106.85 },
  { name: 'Lima', lat: -12.04, lng: -77.04 },
  { name: 'Bangkok', lat: 13.76, lng: 100.5 },
  { name: 'Johannesburg', lat: -26.2, lng: 28.05 },
  { name: 'Sydney', lat: -33.87, lng: 151.21 },
  { name: 'Nairobi', lat: -1.29, lng: 36.82 },
  { name: 'Toronto', lat: 43.65, lng: -79.38 },
  { name: 'Berlin', lat: 52.52, lng: 13.41 },
  { name: 'Reykjavík', lat: 64.15, lng: -21.94 },
  { name: 'Anchorage', lat: 61.22, lng: -149.9 },
  { name: 'Honolulu', lat: 21.31, lng: -157.86 },
  { name: 'Auckland', lat: -36.85, lng: 174.76 },
];

/** Build the Open-Meteo multi-coordinate "current weather" URL. */
export function openMeteoUrl(cities: City[]): string {
  const params = new URLSearchParams({
    latitude: cities.map((c) => c.lat).join(','),
    longitude: cities.map((c) => c.lng).join(','),
    current: 'temperature_2m,weather_code',
    timezone: 'UTC',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

/** Fetch current conditions for the city list in a single request. */
export async function fetchWeather(cities: City[] = CITIES): Promise<unknown> {
  const res = await fetch(openMeteoUrl(cities), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);
  return res.json();
}
