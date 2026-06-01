import type { City } from '../normalize';

/** Curated, globally distributed major cities for the weather layer, enriched
 *  with light "about this place" context (approximate metro figures). */
export const CITIES: City[] = [
  { name: 'Tokyo', lat: 35.68, lng: 139.69, country: 'Japan', population: '37.4M', elevation: 40 },
  { name: 'Delhi', lat: 28.61, lng: 77.21, country: 'India', population: '32.9M', elevation: 216 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47, country: 'China', population: '28.5M', elevation: 4 },
  { name: 'São Paulo', lat: -23.55, lng: -46.63, country: 'Brazil', population: '22.6M', elevation: 760 },
  { name: 'Mexico City', lat: 19.43, lng: -99.13, country: 'Mexico', population: '22.3M', elevation: 2240 },
  { name: 'Cairo', lat: 30.04, lng: 31.24, country: 'Egypt', population: '21.9M', elevation: 23 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88, country: 'India', population: '21.3M', elevation: 14 },
  { name: 'Beijing', lat: 39.9, lng: 116.41, country: 'China', population: '21.3M', elevation: 43 },
  { name: 'New York', lat: 40.71, lng: -74.01, country: 'United States', population: '18.8M', elevation: 10 },
  { name: 'Buenos Aires', lat: -34.6, lng: -58.38, country: 'Argentina', population: '15.4M', elevation: 25 },
  { name: 'Istanbul', lat: 41.01, lng: 28.98, country: 'Türkiye', population: '15.6M', elevation: 39 },
  { name: 'Lagos', lat: 6.52, lng: 3.38, country: 'Nigeria', population: '15.4M', elevation: 41 },
  { name: 'Los Angeles', lat: 34.05, lng: -118.24, country: 'United States', population: '12.5M', elevation: 93 },
  { name: 'Moscow', lat: 55.76, lng: 37.62, country: 'Russia', population: '12.6M', elevation: 156 },
  { name: 'Paris', lat: 48.86, lng: 2.35, country: 'France', population: '11.1M', elevation: 35 },
  { name: 'London', lat: 51.51, lng: -0.13, country: 'United Kingdom', population: '9.5M', elevation: 11 },
  { name: 'Jakarta', lat: -6.21, lng: 106.85, country: 'Indonesia', population: '11.3M', elevation: 8 },
  { name: 'Lima', lat: -12.04, lng: -77.04, country: 'Peru', population: '11.0M', elevation: 154 },
  { name: 'Bangkok', lat: 13.76, lng: 100.5, country: 'Thailand', population: '11.1M', elevation: 2 },
  { name: 'Johannesburg', lat: -26.2, lng: 28.05, country: 'South Africa', population: '6.2M', elevation: 1753 },
  { name: 'Sydney', lat: -33.87, lng: 151.21, country: 'Australia', population: '5.3M', elevation: 58 },
  { name: 'Nairobi', lat: -1.29, lng: 36.82, country: 'Kenya', population: '5.1M', elevation: 1795 },
  { name: 'Toronto', lat: 43.65, lng: -79.38, country: 'Canada', population: '6.4M', elevation: 76 },
  { name: 'Berlin', lat: 52.52, lng: 13.41, country: 'Germany', population: '3.6M', elevation: 34 },
  { name: 'Reykjavík', lat: 64.15, lng: -21.94, country: 'Iceland', population: '0.13M', elevation: 14 },
  { name: 'Anchorage', lat: 61.22, lng: -149.9, country: 'United States', population: '0.29M', elevation: 31 },
  { name: 'Honolulu', lat: 21.31, lng: -157.86, country: 'United States', population: '0.35M', elevation: 6 },
  { name: 'Auckland', lat: -36.85, lng: 174.76, country: 'New Zealand', population: '1.7M', elevation: 196 },
];

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'surface_pressure',
  'wind_speed_10m',
  'wind_direction_10m',
  'weather_code',
  'is_day',
].join(',');

/** Build the Open-Meteo multi-coordinate "current weather" URL. */
export function openMeteoUrl(cities: City[]): string {
  const params = new URLSearchParams({
    latitude: cities.map((c) => c.lat).join(','),
    longitude: cities.map((c) => c.lng).join(','),
    current: CURRENT_FIELDS,
    daily: 'sunrise,sunset',
    timezone: 'auto',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

/** Fetch current conditions for the city list in a single request. */
export async function fetchWeather(cities: City[] = CITIES): Promise<unknown> {
  const res = await fetch(openMeteoUrl(cities), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);
  return res.json();
}
