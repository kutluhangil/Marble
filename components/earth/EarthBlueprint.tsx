'use client';

import { useMemo } from 'react';
import { useEarthTextures } from '@/lib/textures/loader';
import { Vector2, MeshStandardMaterial } from 'three';
import Graticule from './Graticule';

/**
 * An Architectural Blueprint / Wireframe style.
 * Renders the Earth as a technical, laser-etched engineering blueprint with
 * procedural contour elevation lines, a vector dot matrix continental fill,
 * and a physical rotating 3D wireframe outline shell.
 */
export default function EarthBlueprint() {
  const tex = useEarthTextures();

  const material = useMemo(() => {
    const m = new MeshStandardMaterial({
      map: tex.day,
      normalMap: tex.normal,
      normalScale: new Vector2(0.3, 0.3), // subtle normal map elevation details
      roughnessMap: tex.roughness,
      roughness: 0.9, // flat architectural paper feel
      metalness: 0.0,
    });

    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>
         {
           // 1. Get roughness map value (roughnessMap is bound to tex.roughness)
           float baseHeight = texture2D( roughnessMap, vMapUv ).r; // Land is ~1.0, Ocean is ~0.0
           
           // 2. Add mountain height variations from the normal map (green/red channels represent slope)
           vec3 normalVal = texture2D( normalMap, vMapUv ).rgb * 2.0 - 1.0;
           float mountainRelief = abs(normalVal.x) + abs(normalVal.y);
           
           // Combine base continental height and mountain relief for procedural height map
           float totalHeight = clamp(baseHeight * 0.75 + mountainRelief * 0.25, 0.0, 1.0);
           
           // 3. Generate procedural contour lines (isolines) on land
           float landFrequency = 35.0;
           float landIsoline = sin(totalHeight * landFrequency * 3.14159);
           float landContour = smoothstep(0.85, 0.98, landIsoline) * smoothstep(0.35, 0.5, baseHeight);
           
           // 4. Procedural Vector Dot Matrix Pattern for continental shading
           vec2 dotUV = vMapUv * 360.0;
           float dots = length(fract(dotUV) - vec2(0.5));
           float dotMask = smoothstep(0.25, 0.15, dots) * 0.35; // clean micro dots
           float landDots = dotMask * smoothstep(0.42, 0.5, baseHeight);
           
           // 5. Razor-sharp coastline outlines via local derivative
           float texelSize = 1.0 / 2048.0;
           float lC = texture2D(roughnessMap, vMapUv).r;
           float lL = texture2D(roughnessMap, vMapUv + vec2(-texelSize, 0.0)).r;
           float lR = texture2D(roughnessMap, vMapUv + vec2(texelSize, 0.0)).r;
           float lU = texture2D(roughnessMap, vMapUv + vec2(0.0, -texelSize)).r;
           float lD = texture2D(roughnessMap, vMapUv + vec2(0.0, texelSize)).r;
           float grad = abs(lC - lL) + abs(lC - lR) + abs(lC - lU) + abs(lC - lD);
           float landOutline = smoothstep(0.04, 0.15, grad);
           
           // 6. Warm architectural paper-white and charcoal gray ink tones
           vec3 paperColor = vec3(0.96, 0.95, 0.93); // #f5f2ed warm architectural paper
           vec3 inkColor = vec3(0.24, 0.24, 0.25);    // #3d3d40 charcoal ink lines
           
           // 7. Combine
           vec3 finalColor = paperColor;
           
           // Apply contour lines on land
           finalColor = mix(finalColor, inkColor, landContour);
           
           // Apply dot matrix fill on land
           finalColor = mix(finalColor, inkColor, landDots * 0.6);
           
           // Apply coast outlines
           finalColor = mix(finalColor, inkColor, landOutline);
           
           diffuseColor = vec4(finalColor, 1.0);
         }`
      );
    };

    m.customProgramCacheKey = () => 'earth-blueprint-v1';
    return m;
  }, [tex]);

  return (
    <group>
      {/* 1. Base Map with contours and dot matrix */}
      <mesh material={material}>
        <sphereGeometry args={[1, 128, 128]} />
      </mesh>
      
      {/* 2. Outer Technical Wireframe Grid Shell */}
      <mesh>
        <sphereGeometry args={[1.002, 48, 48]} />
        <meshBasicMaterial
          wireframe={true}
          color="#3d3d40"
          transparent={true}
          opacity={0.06}
        />
      </mesh>
      
      {/* 3. Primary Latitude/Longitude Segments */}
      <Graticule />
    </group>
  );
}
