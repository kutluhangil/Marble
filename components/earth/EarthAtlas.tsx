'use client';

import { useMemo } from 'react';
import { Color, ShaderMaterial } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';
import Graticule from './Graticule';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Use the roughness map (ocean ~ low, land ~ high) as a land/ocean mask for a
// flat two-tone editorial cartographic globe.
const fragmentShader = /* glsl */ `
  uniform sampler2D maskMap;
  uniform vec3 uLand;
  uniform vec3 uOcean;
  varying vec2 vUv;
  void main() {
    float r = texture2D(maskMap, vUv).r;
    float land = smoothstep(0.42, 0.6, r);
    gl_FragColor = vec4(mix(uOcean, uLand, land), 1.0);
  }
`;

/** Flat two-tone "atlas" globe (ink land on paper ocean) with a graticule. */
export default function EarthAtlas() {
  const tex = useEarthTextures();

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          maskMap: { value: tex.roughness },
          uLand: { value: new Color('#4b4842') },
          uOcean: { value: new Color('#f1efe9') },
        },
      }),
    [tex],
  );

  return (
    <group>
      <mesh material={material}>
        <sphereGeometry args={[1, 80, 80]} />
      </mesh>
      <Graticule />
    </group>
  );
}
