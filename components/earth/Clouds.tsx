'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, MeshStandardMaterial, type Mesh } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';
import { cloudState } from '@/lib/earth/cloudState';

/**
 * Cloud shell just above the surface. The cloud image is white-on-black, so it
 * drives alpha (transparency); the mesh adds a slow extra spin for parallax on
 * top of the world group's rotation. Receives the same lighting, so night-side
 * clouds darken naturally.
 */
export default function Clouds() {
  const tex = useEarthTextures();
  const ref = useRef<Mesh>(null);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#ffffff'),
        alphaMap: tex.clouds,
        transparent: true,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
        opacity: 0.92,
      }),
    [tex],
  );

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.006;
      cloudState.rotation = ref.current.rotation.y;
    }
  });

  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[1.003, 64, 64]} />
    </mesh>
  );
}
