'use client';

import { useMemo } from 'react';
import { useEarthTextures } from '@/lib/textures/loader';
import { Vector2, MeshStandardMaterial } from 'three';
import Graticule from './Graticule';

/**
 * An Antique Parchment / 17th Century Map style.
 * Renders the Earth as an old hand-drawn map with coffee stains, sepia land washes,
 * concentric engraving wave ripples, and fine ink coastlines, utilizing standard PBR
 * normal mapping to give ink lines physical depth.
 */
export default function EarthParchment() {
  const tex = useEarthTextures();

  const material = useMemo(() => {
    const m = new MeshStandardMaterial({
      map: tex.day,
      normalMap: tex.normal,
      normalScale: new Vector2(0.8, 0.8), // subtle normal map for ink/embossing texture
      roughnessMap: tex.roughness,
      roughness: 0.9,
      metalness: 0.05,
    });

    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
         {
           // 1. Get roughness map value (roughnessMap is bound to tex.roughness)
           float landFactor = texture2D( roughnessMap, vMapUv ).r; // Land is ~1.0, Ocean is ~0.0
           
           // 2. Read the day map (map is bound to tex.day) to extract color details
           vec4 dayColor = texture2D( map, vMapUv );
           
           // 3. Procedural aged paper / parchment texture (stains & fibers)
           // Primary large-scale coffee stains
           float stain = sin(vMapUv.x * 12.0) * cos(vMapUv.y * 12.0) * 0.04;
           stain += sin(vMapUv.x * 35.0 + vMapUv.y * 22.0) * 0.02;
           stain += cos(vMapUv.x * 3.0 + vMapUv.y * 5.0) * 0.03;
           
           // Fine paper grain noise
           float grain = sin(vMapUv.x * 3500.0) * cos(vMapUv.y * 3500.0) * 0.02;
           grain += sin(vMapUv.x * 1200.0 - vMapUv.y * 1800.0) * 0.01;
           
           // Warm yellowish parchment base tones
           vec3 paperBase = vec3(0.93, 0.86, 0.75); // Cream paper
           vec3 paperStained = paperBase - vec3(0.08, 0.15, 0.24) * (stain + grain + 0.03);
           
           // 4. Coastline Ink Outlines
           // Sample roughness map in cardinal directions to detect coastlines
           float texelSize = 1.0 / 2048.0;
           float lC = texture2D(roughnessMap, vMapUv).r;
           float lL = texture2D(roughnessMap, vMapUv + vec2(-texelSize, 0.0)).r;
           float lR = texture2D(roughnessMap, vMapUv + vec2(texelSize, 0.0)).r;
           float lU = texture2D(roughnessMap, vMapUv + vec2(0.0, -texelSize)).r;
           float lD = texture2D(roughnessMap, vMapUv + vec2(0.0, texelSize)).r;
           float grad = abs(lC - lL) + abs(lC - lR) + abs(lC - lU) + abs(lC - lD);
           float inkLine = smoothstep(0.03, 0.12, grad);
           
           // 5. Concentric Shoreline Ripples / Wave Engravings (classic 17th Century style)
           // Optimized: 2 iterations (was 4) to halve texture fetches without visual loss.
           float ripples = 0.0;
           for (int i = 1; i <= 2; i++) {
             float dist = float(i) * 0.004;
             float rN = texture2D(roughnessMap, vMapUv + vec2(0.0, dist)).r;
             float rS = texture2D(roughnessMap, vMapUv + vec2(0.0, -dist)).r;
             float rE = texture2D(roughnessMap, vMapUv + vec2(dist, 0.0)).r;
             float rW = texture2D(roughnessMap, vMapUv + vec2(-dist, 0.0)).r;
             float rippleGrad = abs(rN - rS) + abs(rE - rW);
             ripples += smoothstep(0.05, 0.22, rippleGrad) * (1.0 - float(i)/3.0);
           }
           
           // 6. Sepia Land Shading (faded ink wash)
           float dayLum = dot(dayColor.rgb, vec3(0.299, 0.587, 0.114));
           vec3 landBase = vec3(0.86, 0.78, 0.66); // faded brown sepia wash
           vec3 sepiaLand = mix(landBase * 0.8, landBase * 1.02, dayLum);
           
           // 7. Combine Layers
           float landMask = smoothstep(0.42, 0.55, landFactor);
           vec3 finalColor = mix(paperStained, sepiaLand, landMask);
           
           // Apply dark sepia ink (#3c2d20) to coastline outlines and wave engravings
           vec3 inkColor = vec3(0.24, 0.18, 0.13); 
           finalColor = mix(finalColor, inkColor, clamp(inkLine + ripples * 0.6, 0.0, 1.0));
           
           diffuseColor = vec4(finalColor, 1.0);
         }`
      );
    };

    m.customProgramCacheKey = () => 'earth-parchment-v1';
    return m;
  }, [tex]);

  return (
    <group>
      <mesh material={material}>
        <sphereGeometry args={[1, 80, 80]} />
      </mesh>
      <Graticule />
    </group>
  );
}
