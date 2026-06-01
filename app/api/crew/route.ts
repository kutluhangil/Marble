import { NextResponse } from 'next/server';
import { fetchISSCrew } from '@/lib/data/sources/iss';

export const dynamic = 'force-dynamic';

export async function GET() {
  const crew = await fetchISSCrew();
  return NextResponse.json(
    { crew },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
  );
}
