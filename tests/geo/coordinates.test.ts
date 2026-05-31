import { describe, it, expect } from 'vitest';
import { latLngToVector3 } from '@/lib/geo/coordinates';

describe('latLngToVector3', () => {
  it('maps (0,0) to (1,0,0) per the formula', () => {
    const v = latLngToVector3(0, 0, 1);
    expect(v.x).toBeCloseTo(1, 5);
    expect(v.y).toBeCloseTo(0, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it('maps the north pole to +Y', () => {
    const v = latLngToVector3(90, 0, 1);
    expect(v.y).toBeCloseTo(1, 5);
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it('maps the south pole to -Y', () => {
    const v = latLngToVector3(-90, 0, 1);
    expect(v.y).toBeCloseTo(-1, 5);
  });

  it('adds altitude along the radial direction', () => {
    const v = latLngToVector3(90, 0, 1, 0.5);
    expect(v.y).toBeCloseTo(1.5, 5);
  });

  it('returns unit length at radius 1, altitude 0', () => {
    const v = latLngToVector3(37.77, -122.42, 1);
    expect(v.length()).toBeCloseTo(1, 5);
  });
});
