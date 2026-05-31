import { describe, it, expect } from 'vitest';
import { subsolarPoint, sunDirectionWorld } from '@/lib/geo/sun-position';

describe('subsolarPoint', () => {
  it('is about +23.4° latitude at the June solstice', () => {
    const p = subsolarPoint(new Date('2025-06-21T00:00:00Z'));
    expect(p.lat).toBeCloseTo(23.4, 0);
  });

  it('is near the equator at the September equinox', () => {
    const p = subsolarPoint(new Date('2025-09-22T18:00:00Z'));
    expect(Math.abs(p.lat)).toBeLessThan(1.5);
  });

  it('puts the subsolar longitude near 0 at 12:00 UTC', () => {
    const p = subsolarPoint(new Date('2025-03-20T12:00:00Z'));
    expect(Math.abs(p.lng)).toBeLessThan(1);
  });
});

describe('sunDirectionWorld', () => {
  it('returns a unit-length vector', () => {
    expect(sunDirectionWorld(new Date()).length()).toBeCloseTo(1, 4);
  });
});
