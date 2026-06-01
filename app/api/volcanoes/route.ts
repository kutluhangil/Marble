import { NextResponse } from 'next/server';
import { fetchEonet } from '@/lib/data/sources/eonet';
import { normalizeEonet } from '@/lib/data/normalize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = await fetchEonet('volcanoes');
    const points = normalizeEonet(
      raw as Parameters<typeof normalizeEonet>[0],
      'volcano',
    );
    return NextResponse.json(points, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' },
    });
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
