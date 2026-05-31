'use client';

import { Suspense, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ACESFilmicToneMapping, type Group } from 'three';
import Earth from './Earth';
import Clouds from './Clouds';
import Atmosphere from './Atmosphere';
import Lighting from './Lighting';
import ContactShadow from './ContactShadow';
import { useGlobeStore } from '@/store/useGlobeStore';

/** The spinning world group: Earth, clouds, and (later) data layers. */
function World({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const dragging = useGlobeStore((s) => s.dragging);

  useFrame((_, dt) => {
    if (ref.current && !dragging) ref.current.rotation.y += dt * 0.04;
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
          <Earth />
          <Clouds />
        </World>
        <Atmosphere />
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
