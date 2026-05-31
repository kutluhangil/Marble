import { describe, it, expect } from 'vitest';
import { greatCirclePoints } from '@/lib/geo/arc';
import { latLngToVector3 } from '@/lib/geo/coordinates';

const SF: [number, number] = [37.77, -122.42];
const NYC: [number, number] = [40.71, -74.0];

describe('greatCirclePoints', () => {
  it('returns segments + 1 points', () => {
    expect(greatCirclePoints(SF, NYC, 32, 0.2)).toHaveLength(33);
  });

  it('arcs above the surface at the midpoint when maxAlt > 0', () => {
    const pts = greatCirclePoints(SF, NYC, 32, 0.2);
    expect(pts[16].length()).toBeGreaterThan(1.0);
  });

  it('keeps endpoints on the unit sphere when maxAlt is 0', () => {
    const pts = greatCirclePoints(SF, NYC, 8, 0);
    expect(pts[0].length()).toBeCloseTo(1, 4);
    expect(pts[8].length()).toBeCloseTo(1, 4);
  });

  it('starts and ends at the input coordinates', () => {
    const pts = greatCirclePoints(SF, NYC, 8, 0);
    const a = latLngToVector3(SF[0], SF[1], 1);
    const b = latLngToVector3(NYC[0], NYC[1], 1);
    expect(pts[0].distanceTo(a)).toBeCloseTo(0, 4);
    expect(pts[8].distanceTo(b)).toBeCloseTo(0, 4);
  });
});
