'use client';

import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';

/**
 * Root R3F canvas. The realistic Earth scene graph is added in later phases;
 * for now this mounts the canvas with the target camera, tone mapping, and a
 * placeholder sphere so the page renders.
 */
export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={2.5} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#8aa0b5" roughness={0.85} metalness={0} />
      </mesh>
    </Canvas>
  );
}
