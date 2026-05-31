import { NextResponse } from 'next/server';
import { fetchISS } from '@/lib/data/sources/iss';
import { normalizeISS } from '@/lib/data/normalize';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = await fetchISS();
    const points = normalizeISS(raw as Parameters<typeof normalizeISS>[0]);
    return NextResponse.json(points, {
      headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10' },
    });
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
}
