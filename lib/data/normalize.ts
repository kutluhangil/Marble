import type { GeoPoint } from './types';

// --- USGS earthquakes ---------------------------------------------------

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    url: string;
    tsunami?: number;
    alert?: string | null;
    felt?: number | null;
    sig?: number | null;
    magType?: string | null;
  };
  geometry: { coordinates: [number, number, number] };
}

interface UsgsFeed {
  features?: UsgsFeature[];
}

export function normalizeQuakes(feed: UsgsFeed): GeoPoint[] {
  return (feed.features ?? []).map((f) => {
    const [lng, lat, depth] = f.geometry.coordinates;
    return {
      id: f.id,
      layer: 'quake',
      lat,
      lng,
      magnitude: f.properties.mag ?? 0,
      label: f.properties.place ?? 'Unknown location',
      timestamp: f.properties.time,
      meta: {
        depth,
        place: f.properties.place,
        url: f.properties.url,
        mag: f.properties.mag,
        tsunami: f.properties.tsunami === 1,
        alert: f.properties.alert ?? null,
        felt: f.properties.felt ?? null,
        sig: f.properties.sig ?? null,
        magType: f.properties.magType ?? null,
      },
    };
  });
}

// --- ISS ----------------------------------------------------------------

interface IssResponse {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility?: string;
  timestamp: number;
}

export function normalizeISS(r: IssResponse): GeoPoint[] {
  return [
    {
      id: 'iss',
      layer: 'iss',
      lat: r.latitude,
      lng: r.longitude,
      alt: r.altitude,
      label: 'ISS',
      timestamp: r.timestamp * 1000,
      meta: { velocity: r.velocity, visibility: r.visibility, altitude: r.altitude },
    },
  ];
}

// --- Open-Meteo city weather --------------------------------------------

export interface City {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  population?: string;
  elevation?: number;
}

interface OpenMeteoLocation {
  timezone?: string;
  utc_offset_seconds?: number;
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
  daily?: { sunrise: string[]; sunset: string[] };
}

export function normalizeWeather(
  cities: City[],
  resp: OpenMeteoLocation[] | OpenMeteoLocation,
): GeoPoint[] {
  const arr = Array.isArray(resp) ? resp : [resp];
  return cities.map((c, i) => {
    const loc = arr[i];
    const cur = loc?.current;
    return {
      id: `weather-${c.name}`,
      layer: 'weather',
      lat: c.lat,
      lng: c.lng,
      label: c.name,
      timestamp: cur?.time ? Date.parse(cur.time) : Date.now(),
      meta: {
        temperature: cur?.temperature_2m ?? null,
        apparentTemperature: cur?.apparent_temperature ?? null,
        humidity: cur?.relative_humidity_2m ?? null,
        pressure: cur?.surface_pressure ?? null,
        windSpeed: cur?.wind_speed_10m ?? null,
        windDirection: cur?.wind_direction_10m ?? null,
        weatherCode: cur?.weather_code ?? null,
        isDay: cur?.is_day ?? 1,
        localTime: cur?.time ?? null,
        timezone: loc?.timezone ?? null,
        sunrise: loc?.daily?.sunrise?.[0] ?? null,
        sunset: loc?.daily?.sunset?.[0] ?? null,
        city: c.name,
        country: c.country ?? null,
        population: c.population ?? null,
        elevation: c.elevation ?? null,
      },
    };
  });
}

// --- OpenSky flights ----------------------------------------------------

type OpenSkyState = Array<string | number | boolean | null>;

interface OpenSkyResponse {
  time: number;
  states: OpenSkyState[] | null;
}

// --- NASA EONET (volcanoes, wildfires) ----------------------------------

interface EonetEvent {
  id: string;
  title: string;
  categories: { id: string; title: string }[];
  geometry: { date: string; type: string; coordinates: number[] }[];
}

export function normalizeEonet(
  json: { events?: EonetEvent[] },
  layer: 'volcano' | 'fire',
): GeoPoint[] {
  const out: GeoPoint[] = [];
  for (const e of json.events ?? []) {
    const g = e.geometry[e.geometry.length - 1];
    if (!g || g.type !== 'Point') continue;
    const [lng, lat] = g.coordinates;
    out.push({
      id: e.id,
      layer,
      lat,
      lng,
      label: e.title,
      timestamp: Date.parse(g.date) || Date.now(),
      meta: { category: e.categories[0]?.title ?? '' },
    });
  }
  return out;
}

export function normalizeFlights(r: OpenSkyResponse): GeoPoint[] {
  const out: GeoPoint[] = [];
  for (const s of r.states ?? []) {
    const lng = s[5] as number | null;
    const lat = s[6] as number | null;
    const onGround = s[8] as boolean;
    if (lat == null || lng == null || onGround) continue;

    const icao = s[0] as string;
    const callsign = ((s[1] as string | null) ?? '').trim();
    const geoAlt = (s[13] as number | null) ?? (s[7] as number | null) ?? 0;

    out.push({
      id: icao,
      layer: 'flight',
      lat,
      lng,
      alt: geoAlt / 1000,
      label: callsign || icao,
      timestamp: ((s[4] as number | null) ?? r.time) * 1000,
      meta: { callsign, velocity: s[9], heading: s[10] },
    });
  }
  return out;
}
