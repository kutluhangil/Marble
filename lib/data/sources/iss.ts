const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const CREW_URL = 'http://api.open-notify.org/astros.json';

/** Fetch the current ISS position from wheretheiss.at. */
export async function fetchISS(): Promise<unknown> {
  const res = await fetch(ISS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`ISS request failed: ${res.status}`);
  return res.json();
}

interface AstrosResponse {
  people?: { name: string; craft: string }[];
}

/** Fetch the names of the crew currently aboard the ISS (Open-Notify). */
export async function fetchISSCrew(): Promise<string[]> {
  try {
    const res = await fetch(CREW_URL, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as AstrosResponse;
    return (data.people ?? [])
      .filter((p) => p.craft === 'ISS')
      .map((p) => p.name);
  } catch {
    return [];
  }
}
