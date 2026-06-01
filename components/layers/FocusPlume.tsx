'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from 'three';
import { useUIStore } from '@/store/useUIStore';
import { latLngToVector3 } from '@/lib/geo/coordinates';

const UP = new Vector3(0, 1, 0);
const HEIGHT = 0.18;

const vertexShader = /* glsl */ `
  varying float vH;
  void main() {
    vH = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vH;
  void main() {
    float drift = 0.6 + 0.4 * sin(uTime * 1.5 + vH * 6.0);
    float a = (1.0 - vH) * 0.4 * drift;
    gl_FragColor = vec4(uColor, a);
  }
`;

/** A tasteful smoke/flame plume rising from the selected volcano or wildfire. */
export default function FocusPlume() {
  const e = useUIStore((s) => s.selectedEvent);
  const matRef = useRef<ShaderMaterial>(null);

  useFrame((s) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
  });

  const data = useMemo(() => {
    if (!e || (e.layer !== 'volcano' && e.layer !== 'fire')) return null;
    const base = latLngToVector3(e.lat, e.lng, 1.0);
    const dir = base.clone().normalize();
    return {
      position: base.clone().add(dir.clone().multiplyScalar(HEIGHT / 2)),
      quaternion: new Quaternion().setFromUnitVectors(UP, dir),
      color: e.layer === 'volcano' ? '#9ca3af' : '#f59e0b',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e?.id, e?.layer]);

  if (!data) return null;

  return (
    <mesh position={data.position} quaternion={data.quaternion}>
      <coneGeometry args={[0.03, HEIGHT, 18, 1, true]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uColor: { value: new Color(data.color) }, uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
