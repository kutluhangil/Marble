import { NextResponse } from 'next/server';
import { CITIES, fetchWeather } from '@/lib/data/sources/weather';
import { normalizeWeather } from '@/lib/data/normalize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = await fetchWeather(CITIES);
    const points = normalizeWeather(
      CITIES,
      raw as Parameters<typeof normalizeWeather>[1],
    );
    return NextResponse.json(points, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
