/** Compact relative time, e.g. "12m ago". */
export function timeAgo(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Format a coordinate pair as "37.77°N, 122.42°W". */
export function fmtCoord(lat: number, lng: number): string {
  const la = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`;
  const lo = `${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`;
  return `${la}, ${lo}`;
}

/** Format an earthquake magnitude as "M6.2". */
export function fmtMag(n: number): string {
  return `M${n.toFixed(1)}`;
}
