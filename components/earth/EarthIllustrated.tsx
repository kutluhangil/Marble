'use client';

import { useMemo } from 'react';
import { ShaderMaterial } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalV;
  varying vec3 vPosV;
  void main() {
    vUv = uv;
    vNormalV = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosV = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

// Evenly lit, posterized, saturated "illustrated" globe. No day/night
// terminator — a soft camera-relative light gives it roundness while keeping
// the whole sphere bright and legible, finished with an ink rim outline.
const fragmentShader = /* glsl */ `
  uniform sampler2D dayMap;
  varying vec2 vUv;
  varying vec3 vNormalV;
  varying vec3 vPosV;
  void main() {
    vec3 base = texture2D(dayMap, vUv).rgb;
    base = clamp(base * 1.12, 0.0, 1.0);          // lift
    base = floor(base * 6.0) / 6.0;               // posterize into bands
    float lum = dot(base, vec3(0.299, 0.587, 0.114));
    base = clamp(mix(vec3(lum), base, 1.4), 0.0, 1.0); // saturate

    // Gentle form shading from a fixed light — never goes dark.
    float ndl = dot(normalize(vNormalV), normalize(vec3(0.45, 0.35, 0.82)));
    float shade = 0.84 + 0.16 * smoothstep(-0.4, 1.0, ndl);
    vec3 col = base * shade;

    // Ink rim outline.
    vec3 viewDir = normalize(-vPosV);
    float fres = pow(1.0 - max(dot(normalize(vNormalV), viewDir), 0.0), 3.0);
    col = mix(col, vec3(0.12, 0.12, 0.14), smoothstep(0.55, 0.92, fres));

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** A polished, evenly-lit illustrated globe (posterized + ink outline). */
export default function EarthIllustrated() {
  const tex = useEarthTextures();

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { dayMap: { value: tex.day } },
      }),
    [tex],
  );

  return (
    <mesh material={material}>
      <sphereGeometry args={[1, 80, 80]} />
    </mesh>
  );
}
