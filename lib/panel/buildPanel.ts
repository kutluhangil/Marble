import type { GeoPoint } from '@/lib/data/types';
import type { Dict, Lang } from '@/lib/i18n/dict';
import { CITIES } from '@/lib/data/sources/weather';
import { haversineKm } from '@/lib/geo/distance';
import { fmtCoord, fmtMag, timeAgo } from '@/lib/utils/format';
import type { PanelModel, PanelStat } from './types';

function num(v: unknown): number | null {
  return typeof v === 'number' ? v : null;
}
function str(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}
function hhmm(iso: string | null): string {
  if (!iso) return '—';
  const t = iso.includes('T') ? iso.split('T')[1] : iso;
  return t.slice(0, 5);
}

function magBandKey(m: number): 'minor' | 'light' | 'moderate' | 'strong' | 'major' {
  if (m < 3) return 'minor';
  if (m < 4.5) return 'light';
  if (m < 6) return 'moderate';
  if (m < 7) return 'strong';
  return 'major';
}

/** Apparent local solar time at a longitude (ignores the equation of time). */
function solarTime(lng: number): string {
  const now = new Date();
  let mins = now.getUTCHours() * 60 + now.getUTCMinutes() + (lng / 15) * 60;
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Build a layer-specific panel model from a GeoPoint and the dictionary. */
export function buildPanel(e: GeoPoint, d: Dict, lang: Lang): PanelModel {
  const m = e.meta;

  if (e.layer === 'quake') {
    const mag = e.magnitude ?? 0;
    const stats: PanelStat[] = [
      { label: d.card.depth, value: `${num(m.depth)?.toFixed(1) ?? '—'} km` },
    ];
    let nearest: { name: string; km: number } | null = null;
    for (const c of CITIES) {
      const km = haversineKm(e.lat, e.lng, c.lat, c.lng);
      if (!nearest || km < nearest.km) nearest = { name: c.name, km };
    }
    if (nearest) {
      stats.push({
        label: d.panel.nearestCity,
        value: `${nearest.name} · ${Math.round(nearest.km).toLocaleString()} km`,
      });
    }
    stats.push({ label: d.card.when, value: timeAgo(e.timestamp, lang) });
    stats.push({
      label: d.panel.tsunami,
      value: m.tsunami ? d.panel.yes : d.panel.no,
    });
    const alert = str(m.alert);
    if (alert) {
      stats.push({
        label: d.panel.alert,
        value: alert.charAt(0).toUpperCase() + alert.slice(1),
      });
    }
    const band = d.panel.magBands[magBandKey(mag)];
    return {
      layer: 'quake',
      color: 'var(--data-quake)',
      title: fmtMag(mag),
      subtitle: e.label,
      stats,
      description: `${band.label} — ${band.blurb}`,
      status: 'live',
      sourceName: 'USGS',
      sourceUrl: str(m.url) ?? 'https://earthquake.usgs.gov',
    };
  }

  if (e.layer === 'iss') {
    const stats: PanelStat[] = [
      { label: d.card.altitude, value: `${num(e.alt)?.toFixed(0) ?? '—'} km` },
      { label: d.card.speed, value: `${num(m.velocity)?.toFixed(0) ?? '—'} km/h` },
      { label: d.panel.latitude, value: `${e.lat.toFixed(2)}°` },
      { label: d.panel.longitude, value: `${e.lng.toFixed(2)}°` },
      { label: d.panel.localTime, value: solarTime(e.lng) },
      { label: d.panel.period, value: '~92 min' },
      { label: d.panel.inclination, value: '51.6°' },
    ];
    return {
      layer: 'iss',
      color: 'var(--data-iss)',
      title: 'ISS',
      subtitle: d.card.layer.iss,
      stats,
      description: d.panel.issAbout,
      status: 'live',
      sourceName: 'wheretheiss.at',
      sourceUrl: 'https://wheretheiss.at',
    };
  }

  if (e.layer === 'weather') {
    const code = num(m.weatherCode);
    const stats: PanelStat[] = [
      { label: d.panel.temperature, value: `${num(m.temperature)?.toFixed(1) ?? '—'}°C` },
      { label: d.panel.feelsLike, value: `${num(m.apparentTemperature)?.toFixed(1) ?? '—'}°C` },
      { label: d.card.conditions, value: code != null ? (d.card.wmo[code] ?? `#${code}`) : '—' },
      { label: d.panel.humidity, value: `${num(m.humidity)?.toFixed(0) ?? '—'}%` },
      { label: d.panel.wind, value: `${num(m.windSpeed)?.toFixed(0) ?? '—'} km/h` },
      { label: d.panel.pressure, value: `${num(m.pressure)?.toFixed(0) ?? '—'} hPa` },
      { label: d.panel.sunrise, value: hhmm(str(m.sunrise)) },
      { label: d.panel.sunset, value: hhmm(str(m.sunset)) },
      { label: d.panel.localTime, value: hhmm(str(m.localTime)) },
    ];
    const facts: PanelStat[] = [];
    if (str(m.population)) facts.push({ label: d.panel.population, value: str(m.population) as string });
    if (num(m.elevation) != null) facts.push({ label: d.panel.elevation, value: `${num(m.elevation)} m` });
    if (str(m.timezone)) facts.push({ label: d.panel.timezone, value: str(m.timezone) as string });
    return {
      layer: 'weather',
      color: 'var(--data-weather)',
      title: e.label,
      subtitle: str(m.country) ?? undefined,
      stats,
      facts,
      status: 'live',
      sourceName: 'Open-Meteo',
      sourceUrl: 'https://open-meteo.com',
    };
  }

  if (e.layer === 'volcano' || e.layer === 'fire') {
    const parts = e.label.split(',');
    const name = parts[0].trim();
    const place = parts.slice(1).join(',').trim();
    const stats: PanelStat[] = [
      { label: d.panel.coordinates, value: fmtCoord(e.lat, e.lng) },
      { label: d.card.category, value: str(m.category) ?? '—' },
      { label: d.panel.detected, value: timeAgo(e.timestamp, lang) },
    ];
    return {
      layer: e.layer,
      color: e.layer === 'volcano' ? 'var(--data-volcano)' : 'var(--data-fire)',
      title: name,
      subtitle: place || undefined,
      stats,
      description: e.layer === 'fire' ? d.panel.fireAbout : undefined,
      status: 'live',
      sourceName: 'NASA EONET',
      sourceUrl: 'https://eonet.gsfc.nasa.gov',
    };
  }

  // flight
  return {
    layer: 'flight',
    color: 'var(--data-flight)',
    title: e.label,
    stats: [
      { label: d.card.altitude, value: `${num(e.alt)?.toFixed(1) ?? '—'} km` },
      { label: d.card.speed, value: `${num(m.velocity)?.toFixed(0) ?? '—'} m/s` },
      { label: d.card.heading, value: `${num(m.heading)?.toFixed(0) ?? '—'}°` },
      { label: d.card.position, value: fmtCoord(e.lat, e.lng) },
    ],
    status: 'live',
    sourceName: 'OpenSky Network',
    sourceUrl: 'https://opensky-network.org',
  };
}
