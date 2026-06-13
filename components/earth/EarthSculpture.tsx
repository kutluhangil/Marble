'use client';

import { useMemo } from 'react';
import { Vector2 } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';

/**
 * A monochrome, matte travertine/plaster sculptural globe style.
 * Focuses entirely on light-shadow contrast (chiascuro) and topographic detail.
 */
export default function EarthSculpture() {
  const tex = useEarthTextures();

  const normalScale = useMemo(() => new Vector2(2.5, 2.5), []);

  return (
    <mesh>
      <sphereGeometry
        args={[1, 80, 80]}
        onUpdate={(self) => {
          if (!self.attributes.uv2) {
            self.setAttribute('uv2', self.attributes.uv);
          }
        }}
      />
      <meshStandardMaterial
        color="#f5f5f4"
        roughness={0.9}
        metalness={0.0}
        normalMap={tex.normal}
        normalScale={normalScale}
        aoMap={tex.roughness}
        aoMapIntensity={1.2}
      />
    </mesh>
  );
}
