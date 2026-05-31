import { NextResponse } from 'next/server';
import { fetchEarthquakes } from '@/lib/data/sources/earthquakes';
import { normalizeQuakes } from '@/lib/data/normalize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = await fetchEarthquakes();
    const points = normalizeQuakes(raw as Parameters<typeof normalizeQuakes>[0]);
    return NextResponse.json(points, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
