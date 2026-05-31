import { NextResponse } from 'next/server';
import {
  fetchFlights,
  getOpenSkyToken,
  hasOpenSkyCreds,
} from '@/lib/data/sources/flights';
import { normalizeFlights } from '@/lib/data/normalize';

export const dynamic = 'force-dynamic';

const MAX_FLIGHTS = 200;

export async function GET() {
  if (!hasOpenSkyCreds()) {
    return NextResponse.json(
      { disabled: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  try {
    const token = await getOpenSkyToken();
    const raw = await fetchFlights(token);
    if (!raw) {
      return NextResponse.json(
        { disabled: true },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }
    const points = normalizeFlights(
      raw as Parameters<typeof normalizeFlights>[0],
    ).slice(0, MAX_FLIGHTS);
    return NextResponse.json(points, {
      headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
    });
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
