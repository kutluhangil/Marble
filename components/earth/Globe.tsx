'use client';

import { Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, type Group } from 'three';
import EarthScene from './EarthScene';
import Lighting from './Lighting';
import ContactShadow from './ContactShadow';
import LayersRoot from '@/components/layers/LayersRoot';
import HoverTooltip from '@/components/layers/HoverTooltip';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useGlobeStore } from '@/store/useGlobeStore';
import { useUIStore } from '@/store/useUIStore';

/** The spinning world group. Auto-rotates, pauses on drag, and flies the
 *  selected event to the front of the globe. */
function World({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const dragging = useGlobeStore((s) => s.dragging);
  const selected = useUIStore((s) => s.selectedEvent);
  const flyTarget = useRef<number | null>(null);

  useEffect(() => {
    if (!selected) return;
    const p = latLngToVector3(selected.lat, selected.lng, 1);
    // Rotation that brings the point's longitude to face the camera (+Z).
    flyTarget.current = -Math.atan2(p.x, p.z);
  }, [selected]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;

    if (dragging) {
      flyTarget.current = null;
      return;
    }

    if (flyTarget.current !== null) {
      let diff = flyTarget.current - g.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // shortest path
      if (Math.abs(diff) < 0.003) {
        g.rotation.y = flyTarget.current;
        flyTarget.current = null;
      } else {
        g.rotation.y += diff * Math.min(1, dt * 4);
      }
      return;
    }

    g.rotation.y += dt * 0.04;
  });

  return <group ref={ref}>{children}</group>;
}

export default function Globe() {
  const setDragging = useGlobeStore((s) => s.setDragging);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <World>
          <EarthScene />
          <LayersRoot />
          <HoverTooltip />
        </World>
        <ContactShadow />
        <OrbitControls
          enablePan={false}
          minDistance={1.8}
          maxDistance={6}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          onStart={() => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
            setDragging(true);
          }}
          onEnd={() => {
            resumeTimer.current = setTimeout(() => setDragging(false), 1500);
          }}
        />
      </Suspense>
    </Canvas>
  );
}
