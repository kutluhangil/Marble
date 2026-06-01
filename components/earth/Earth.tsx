'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, MeshStandardMaterial, Vector3 } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';
import { sunDirectionWorld } from '@/lib/geo/sun-position';
import { simDate } from '@/store/useTimeStore';

/**
 * The Earth surface. A MeshStandardMaterial provides PBR shading (albedo,
 * relief, roughness split). An onBeforeCompile patch gates the emissive city
 * lights to the night side using the real-time sun direction.
 */
export default function Earth() {
  const tex = useEarthTextures();
  const camera = useThree((s) => s.camera);

  const uniforms = useMemo(
    () => ({ uSunDirView: { value: new Vector3(1, 0, 0) } }),
    [],
  );

  const material = useMemo(() => {
    const m = new MeshStandardMaterial({
      map: tex.day,
      normalMap: tex.normal,
      roughnessMap: tex.roughness,
      metalness: 0,
      roughness: 1,
      emissive: new Color('#fff3df'),
      emissiveMap: tex.night,
      emissiveIntensity: 1.6,
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uSunDirView = uniforms.uSunDirView;
      shader.fragmentShader =
        'uniform vec3 uSunDirView;\n' +
        shader.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           float dayFactor = smoothstep(-0.1, 0.25, dot(normalize(vNormal), uSunDirView));
           totalEmissiveRadiance *= (1.0 - dayFactor);`,
        );
    };
    m.customProgramCacheKey = () => 'earth-daynight';
    return m;
  }, [tex, uniforms]);

  useFrame(() => {
    const dir = sunDirectionWorld(simDate());
    // World sun direction expressed in view space (camera only, not the
    // spinning world group) so the terminator sweeps as the globe rotates.
    uniforms.uSunDirView.value
      .copy(dir)
      .transformDirection(camera.matrixWorldInverse);
  });

  const ref = useRef(null);
  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[1, 128, 128]} />
    </mesh>
  );
}
