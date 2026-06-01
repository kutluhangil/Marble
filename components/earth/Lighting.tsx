'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type DirectionalLight } from 'three';
import { sunDirectionWorld } from '@/lib/geo/sun-position';
import { simDate } from '@/store/useTimeStore';

/**
 * Studio 3-point rig. The key light tracks the real-time sun (world space, so
 * the terminator matches the Earth material). A hemisphere fill keeps the night
 * side a deep blue-gray rather than pure black; a low back light separates the
 * silhouette and feeds the atmosphere rim.
 */
export default function Lighting() {
  const key = useRef<DirectionalLight>(null);

  useFrame(() => {
    if (key.current) {
      key.current.position.copy(sunDirectionWorld(simDate())).multiplyScalar(5);
    }
  });

  return (
    <>
      <directionalLight ref={key} intensity={3} color="#fff6ec" />
      <hemisphereLight args={['#cdd6e0', '#272c36', 0.45]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-5, -2, -4]} intensity={0.25} color="#bcd3ff" />
    </>
  );
}
