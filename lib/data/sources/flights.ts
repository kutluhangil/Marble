const TOKEN_URL =
  'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
const STATES_URL = 'https://opensky-network.org/api/states/all';

// Bounding box keeps the payload small. Europe is the busiest airspace and
// reads well on the globe.
const BBOX = { lamin: 35.0, lomin: -15.0, lamax: 62.0, lomax: 40.0 };

let cachedToken: { token: string; exp: number } | null = null;

/** True when OpenSky OAuth2 credentials are configured. */
export function hasOpenSkyCreds(): boolean {
  return Boolean(
    process.env.OPENSKY_CLIENT_ID && process.env.OPENSKY_CLIENT_SECRET,
  );
}

/** Obtain (and cache) an OpenSky access token via client credentials. */
export async function getOpenSkyToken(): Promise<string | null> {
  if (!hasOpenSkyCreds()) return null;

  const now = Date.now();
  if (cachedToken && cachedToken.exp > now + 5_000) return cachedToken.token;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.OPENSKY_CLIENT_ID as string,
    client_secret: process.env.OPENSKY_CLIENT_SECRET as string,
  });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  if (!res.ok) return null;

  const json = (await res.json()) as { access_token: string; expires_in?: number };
  cachedToken = {
    token: json.access_token,
    exp: now + (json.expires_in ?? 1800) * 1000,
  };
  return cachedToken.token;
}

/** Fetch airborne states within the bounding box. Returns null when no token. */
export async function fetchFlights(token: string | null): Promise<unknown | null> {
  if (!token) return null;
  const params = new URLSearchParams({
    lamin: String(BBOX.lamin),
    lomin: String(BBOX.lomin),
    lamax: String(BBOX.lamax),
    lomax: String(BBOX.lomax),
  });
  const res = await fetch(`${STATES_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}
