'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type DirectionalLight, Vector3 } from 'three';
import { sunDirectionWorld } from '@/lib/geo/sun-position';
import { simDate } from '@/store/useTimeStore';

// Sun position is only updated every N seconds — the star moves ~0.5°/minute,
// which is imperceptible between individual frames.
const SUN_UPDATE_INTERVAL = 30; // seconds

/**
 * Studio 3-point rig. The key light tracks the real-time sun (world space, so
 * the terminator matches the Earth material). A hemisphere fill keeps the night
 * side a deep blue-gray rather than pure black; a low back light separates the
 * silhouette and feeds the atmosphere rim.
 */
export default function Lighting() {
  const key = useRef<DirectionalLight>(null);
  const lastUpdate = useRef(0);
  const cachedSunDir = useRef(new Vector3(5, 3, 5));

  useFrame((state) => {
    if (!key.current) return;
    const elapsed = state.clock.elapsedTime;
    if (elapsed - lastUpdate.current > SUN_UPDATE_INTERVAL) {
      cachedSunDir.current.copy(sunDirectionWorld(simDate())).multiplyScalar(5);
      lastUpdate.current = elapsed;
    }
    key.current.position.copy(cachedSunDir.current);
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
