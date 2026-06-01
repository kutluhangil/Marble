'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, MeshStandardMaterial, Vector3 } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';
import { sunDirectionWorld } from '@/lib/geo/sun-position';
import { simDate } from '@/store/useTimeStore';
import { cloudState } from '@/lib/earth/cloudState';

/**
 * The Earth surface. A MeshStandardMaterial provides PBR shading (albedo,
 * relief, roughness split). An onBeforeCompile patch gates the emissive city
 * lights to the night side using the real-time sun direction.
 */
export default function Earth() {
  const tex = useEarthTextures();
  const camera = useThree((s) => s.camera);

  const uniforms = useMemo(
    () => ({
      uSunDirView: { value: new Vector3(1, 0, 0) },
      uCloudMap: { value: tex.clouds },
      uCloudOffset: { value: 0 },
    }),
    [tex],
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
      shader.uniforms.uCloudMap = uniforms.uCloudMap;
      shader.uniforms.uCloudOffset = uniforms.uCloudOffset;
      shader.fragmentShader =
        'uniform vec3 uSunDirView;\nuniform sampler2D uCloudMap;\nuniform float uCloudOffset;\n' +
        shader.fragmentShader
          .replace(
            '#include <map_fragment>',
            `#include <map_fragment>
             {
               // Soft cloud shadows on the day side, aligned with the cloud layer.
               float dayF = smoothstep(-0.1, 0.25, dot(normalize(vNormal), uSunDirView));
               float cloudD = texture2D(uCloudMap, vec2(vMapUv.x - uCloudOffset / 6.2831853, vMapUv.y)).r;
               diffuseColor.rgb *= (1.0 - cloudD * 0.32 * dayF);
             }`,
          )
          .replace(
            '#include <emissivemap_fragment>',
            `#include <emissivemap_fragment>
             float dayFactor = smoothstep(-0.1, 0.25, dot(normalize(vNormal), uSunDirView));
             totalEmissiveRadiance *= (1.0 - dayFactor);
             {
               // Ocean sun-glint: specular highlight on water, sun side only.
               vec3 Lv = normalize(uSunDirView);
               vec3 Nv = normalize(vNormal);
               vec3 Vv = normalize(vViewPosition);
               float ocean = 1.0 - smoothstep(0.3, 0.6, roughnessFactor);
               float glint = pow(max(dot(reflect(-Lv, Nv), Vv), 0.0), 90.0) * ocean * dayFactor;
               totalEmissiveRadiance += glint * vec3(1.0, 0.95, 0.85) * 1.3;
             }`,
          );
    };
    m.customProgramCacheKey = () => 'earth-daynight-v2';
    return m;
  }, [tex, uniforms]);

  useFrame(() => {
    const dir = sunDirectionWorld(simDate());
    // World sun direction expressed in view space (camera only, not the
    // spinning world group) so the terminator sweeps as the globe rotates.
    uniforms.uSunDirView.value
      .copy(dir)
      .transformDirection(camera.matrixWorldInverse);
    uniforms.uCloudOffset.value = cloudState.rotation;
  });

  const ref = useRef(null);
  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[1, 128, 128]} />
    </mesh>
  );
}
