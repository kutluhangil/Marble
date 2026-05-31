const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

/** Fetch the current ISS position from wheretheiss.at. */
export async function fetchISS(): Promise<unknown> {
  const res = await fetch(ISS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`ISS request failed: ${res.status}`);
  return res.json();
}
