'use client';

import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, Vector3 } from 'three';
import { useEarthTextures } from '@/lib/textures/loader';
import { sunDirectionWorld } from '@/lib/geo/sun-position';

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

const fragmentShader = /* glsl */ `
  uniform sampler2D dayMap;
  uniform vec3 uSunDirView;
  varying vec2 vUv;
  varying vec3 vNormalV;
  varying vec3 vPosV;
  void main() {
    vec3 base = texture2D(dayMap, vUv).rgb;
    base = floor(base * 5.0) / 5.0;                       // posterize
    float lum = dot(base, vec3(0.299, 0.587, 0.114));
    base = clamp(mix(vec3(lum), base, 1.3), 0.0, 1.0);    // boost saturation
    // toon banding by sun
    float nl = dot(normalize(vNormalV), normalize(uSunDirView));
    float band = nl > 0.25 ? 1.0 : (nl > -0.05 ? 0.78 : 0.52);
    vec3 col = base * band;
    // ink outline at the rim
    vec3 viewDir = normalize(-vPosV);
    float fres = pow(1.0 - max(dot(normalize(vNormalV), viewDir), 0.0), 3.0);
    col = mix(col, vec3(0.10, 0.10, 0.12), smoothstep(0.45, 0.85, fres));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** A cel-shaded, posterized "illustrated" Earth with an ink rim outline. */
export default function EarthIllustrated() {
  const tex = useEarthTextures();
  const camera = useThree((s) => s.camera);

  const uniforms = useMemo(
    () => ({
      dayMap: { value: tex.day },
      uSunDirView: { value: new Vector3(1, 0, 0) },
    }),
    [tex],
  );

  const material = useMemo(
    () => new ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
    [uniforms],
  );

  useFrame(() => {
    uniforms.uSunDirView.value
      .copy(sunDirectionWorld(new Date()))
      .transformDirection(camera.matrixWorldInverse);
  });

  return (
    <mesh material={material}>
      <sphereGeometry args={[1, 128, 128]} />
    </mesh>
  );
}
