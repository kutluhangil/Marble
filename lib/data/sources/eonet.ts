const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

/** Fetch open natural events from NASA EONET for a category (keyless). */
export async function fetchEonet(category: string): Promise<unknown> {
  const url = `${EONET_URL}?category=${category}&status=open&limit=200`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`EONET request failed: ${res.status}`);
  return res.json();
}
