'use client';

import { useEffect, useMemo } from 'react';
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
} from 'three';

const DEG2RAD = Math.PI / 180;

/** Latitude/longitude grid lines for the atlas globe. */
export default function Graticule() {
  const obj = useMemo(() => {
    const pts: number[] = [];
    const R = 1.002;
    const seg = 64;

    const push = (lat: number, lng: number) => {
      const phi = (90 - lat) * DEG2RAD;
      const theta = (lng + 180) * DEG2RAD;
      pts.push(
        -R * Math.sin(phi) * Math.cos(theta),
        R * Math.cos(phi),
        R * Math.sin(phi) * Math.sin(theta),
      );
    };

    // parallels
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let i = 0; i < seg; i++) {
        push(lat, -180 + (360 * i) / seg);
        push(lat, -180 + (360 * (i + 1)) / seg);
      }
    }
    // meridians
    for (let lng = -180; lng < 180; lng += 30) {
      for (let i = 0; i < seg; i++) {
        push(-90 + (180 * i) / seg, lng);
        push(-90 + (180 * (i + 1)) / seg, lng);
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(pts, 3));
    const material = new LineBasicMaterial({
      color: '#8a857c',
      transparent: true,
      opacity: 0.35,
    });
    return new LineSegments(geometry, material);
  }, []);

  useEffect(
    () => () => {
      obj.geometry.dispose();
      (obj.material as LineBasicMaterial).dispose();
    },
    [obj],
  );

  return <primitive object={obj} />;
}
