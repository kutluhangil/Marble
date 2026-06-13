'use client';

import { useEarthTextures } from '@/lib/textures/loader';
import { MeshTransmissionMaterial } from '@react-three/drei';
import Graticule from './Graticule';

/**
 * A frosted glass and crystal globe style.
 * Oceans are clear and refractive crystal glass, while continents are frosted, matte glass.
 * Behind/through the globe, grid lines (graticules) are visible.
 */
export default function EarthGlass() {
  const tex = useEarthTextures();

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshTransmissionMaterial
          roughness={0.9}
          roughnessMap={tex.roughness}
          transmission={1.0}
          thickness={0.25}
          ior={1.5}
          chromaticAberration={0.05}
          anisotropicBlur={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          color="#fbfbfb"
          backside={true}
          backsideThickness={0.15}
        />
      </mesh>
      <Graticule />
    </group>
  );
}
