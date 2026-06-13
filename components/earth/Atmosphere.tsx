'use client';

import { useMemo } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float fres = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 2.5);
    float alpha = clamp(fres * 0.45, 0.0, 0.6);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * A faint daylight atmosphere rim. BackSide sphere with a low-intensity
 * Fresnel so it reads as a delicate halo rather than a sci-fi glow on the
 * light background.
 */
export default function Atmosphere() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uColor: { value: new Color('#bfdbfe') } },
        transparent: true,
        side: BackSide,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh material={material}>
      <sphereGeometry args={[1.015, 48, 48]} />
    </mesh>
  );
}
