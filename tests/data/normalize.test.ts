import { describe, it, expect } from 'vitest';
import {
  normalizeQuakes,
  normalizeISS,
  normalizeWeather,
  normalizeFlights,
} from '@/lib/data/normalize';

describe('normalizeQuakes', () => {
  const feed = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'us7000abcd',
        properties: {
          mag: 6.2,
          place: '100km S of Somewhere',
          time: 1_700_000_000_000,
          url: 'https://earthquake.usgs.gov/x',
        },
        geometry: { type: 'Point', coordinates: [-122.5, 37.8, 10.2] },
      },
    ],
  };

  it('maps a USGS feature to a GeoPoint', () => {
    const [p] = normalizeQuakes(feed);
    expect(p.layer).toBe('quake');
    expect(p.id).toBe('us7000abcd');
    expect(p.lat).toBe(37.8);
    expect(p.lng).toBe(-122.5);
    expect(p.magnitude).toBe(6.2);
    expect(p.label).toBe('100km S of Somewhere');
    expect(p.timestamp).toBe(1_700_000_000_000);
    expect(p.meta.depth).toBe(10.2);
    expect(p.meta.url).toBe('https://earthquake.usgs.gov/x');
  });
});

describe('normalizeISS', () => {
  const res = {
    name: 'iss',
    id: 25544,
    latitude: 12.34,
    longitude: 56.78,
    altitude: 420.5,
    velocity: 27500,
    visibility: 'daylight',
    timestamp: 1_700_000_000,
  };

  it('maps to a single ISS GeoPoint with ms timestamp', () => {
    const pts = normalizeISS(res);
    expect(pts).toHaveLength(1);
    const p = pts[0];
    expect(p.layer).toBe('iss');
    expect(p.id).toBe('iss');
    expect(p.lat).toBe(12.34);
    expect(p.lng).toBe(56.78);
    expect(p.alt).toBe(420.5);
    expect(p.timestamp).toBe(1_700_000_000_000);
    expect(p.meta.velocity).toBe(27500);
  });
});

describe('normalizeWeather', () => {
  const cities = [
    { name: 'Tokyo', lat: 35.68, lng: 139.69 },
    { name: 'Lima', lat: -12.04, lng: -77.04 },
  ];
  const resp = [
    { current: { time: '2025-05-31T12:00', temperature_2m: 21.4, weather_code: 3 } },
    { current: { time: '2025-05-31T12:00', temperature_2m: 18.1, weather_code: 1 } },
  ];

  it('maps cities to GeoPoints by index', () => {
    const pts = normalizeWeather(cities, resp);
    expect(pts).toHaveLength(2);
    expect(pts[0].label).toBe('Tokyo');
    expect(pts[0].lat).toBe(35.68);
    expect(pts[0].meta.temperature).toBe(21.4);
    expect(pts[0].meta.weatherCode).toBe(3);
    expect(pts[1].label).toBe('Lima');
    expect(pts[1].meta.temperature).toBe(18.1);
  });
});

describe('normalizeFlights', () => {
  const res = {
    time: 1_700_000_000,
    states: [
      ['abc123', 'SWR123  ', 'Switzerland', 1_700_000_000, 1_700_000_000, 8.5, 47.4, 11000, false, 250, 90, 0, null, 11200, null, false, 0],
      ['def456', '        ', 'Nowhere', 1_700_000_000, 1_700_000_000, null, null, null, true, 0, 0, 0, null, null, null, false, 0],
    ],
  };

  it('maps airborne states and skips null positions', () => {
    const pts = normalizeFlights(res);
    expect(pts).toHaveLength(1);
    const p = pts[0];
    expect(p.layer).toBe('flight');
    expect(p.id).toBe('abc123');
    expect(p.lat).toBe(47.4);
    expect(p.lng).toBe(8.5);
    expect(p.label).toBe('SWR123');
    expect(p.alt).toBeCloseTo(11.2, 3);
    expect(p.meta.heading).toBe(90);
  });
});
