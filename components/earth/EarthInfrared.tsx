'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEarthTextures } from '@/lib/textures/loader';
import { Vector2, MeshStandardMaterial } from 'three';

/**
 * An artistic, dynamic Infrared Biosphere Heatmap style.
 * Maps land vegetation density (chlorophyll) and sea surface temperature (SST)
 * to an editorial palette: terracotta orange, sage green, sand beige, and charcoal gray.
 * Incorporates a subtle breathing animation.
 */
export default function EarthInfrared() {
  const tex = useEarthTextures();

  // Store uTime uniform in a stable object
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const material = useMemo(() => {
    const m = new MeshStandardMaterial({
      map: tex.day,
      normalMap: tex.normal,
      normalScale: new Vector2(1.5, 1.5),
      roughnessMap: tex.roughness,
      roughness: 0.8,
      metalness: 0.1,
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      m.userData.shader = shader; // save reference for useFrame

      shader.fragmentShader =
        'uniform float uTime;\n' +
        shader.fragmentShader.replace(
          '#include <map_fragment>',
          `#include <map_fragment>
           {
             // 1. Get roughness map value (roughnessMap is bound to tex.roughness)
             float landFactor = texture2D( roughnessMap, vMapUv ).r; // Land is ~1.0, Ocean is ~0.0
             
             // 2. Read the day map (map is bound to tex.day) to extract color details
             vec4 dayColor = texture2D( map, vMapUv );
             
             // 3. Compute vegetation/chlorophyll proxy on land (greenness index)
             float veg = clamp((dayColor.g - dayColor.r) * 5.0, 0.0, 1.0);
             
             // 4. Compute latitude-based sea surface temperature (SST) for ocean
             float sst = 1.0 - abs(vMapUv.y - 0.5) * 2.0; // peaks at equator
             float oceanLuminance = dot(dayColor.rgb, vec3(0.299, 0.587, 0.114));
             sst = clamp(sst * 0.65 + (1.0 - oceanLuminance) * 0.35, 0.0, 1.0);
             
             // 5. Dynamic organic breathing cycle using uTime
             float wave = sin(uTime * 0.8) * 0.05;
             sst = clamp(sst + wave, 0.0, 1.0);
             veg = clamp(veg + wave * 0.5, 0.0, 1.0);
             
             // 6. Editorial Artistic Palette Colors
             vec3 charcoal = vec3(0.08, 0.10, 0.11);    // #141a1c - Cold ocean / deep basins
             vec3 sand = vec3(0.88, 0.85, 0.80);        // #e0dad4 - Barren land / deserts
             vec3 sage = vec3(0.48, 0.55, 0.46);        // #7a8d75 - Temperate ocean / moderate veg
             vec3 terracotta = vec3(0.78, 0.36, 0.23);  // #c65d3b - Warm tropical ocean / lush forests
             
             // 7. Compute gradients
             vec3 oceanColor = mix(charcoal, sage, smoothstep(0.1, 0.5, sst));
             oceanColor = mix(oceanColor, terracotta, smoothstep(0.5, 0.9, sst));
             
             vec3 landColor = mix(sand, sage, veg);
             landColor = mix(landColor, terracotta, smoothstep(0.4, 0.9, veg));
             
             // Blend land and ocean using the landFactor mask
             float landMask = smoothstep(0.42, 0.55, landFactor);
             vec3 finalColor = mix(oceanColor, landColor, landMask);
             
             diffuseColor = vec4(finalColor, 1.0);
           }`
        );
    };

    m.customProgramCacheKey = () => 'earth-infrared-v1';
    return m;
  }, [tex, uniforms]);

  useFrame((state) => {
    // Keep uniforms.uTime updated
    uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh material={material}>
      <sphereGeometry args={[1, 128, 128]} />
    </mesh>
  );
}
