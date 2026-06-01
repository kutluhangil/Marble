'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import {
  Color,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';

const MAX = 512;
const UP = new Vector3(0, 1, 0);
const tmpT = new Vector3();
const tmpB = new Vector3();

const vertexShader = /* glsl */ `
  attribute float aMag;
  attribute float aPhase;
  varying vec2 vUv;
  varying float vMag;
  varying float vPhase;
  void main() {
    vUv = uv;
    vMag = aMag;
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

// Procedural expanding seismic wavefronts. Small quakes = one faint ring;
// stronger quakes spawn more, larger, brighter wavefronts.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vMag;
  varying float vPhase;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;
    float rings = vMag >= 7.0 ? 3.0 : (vMag >= 5.0 ? 2.0 : 1.0);
    float a = 0.0;
    for (int k = 0; k < 3; k++) {
      if (float(k) >= rings) break;
      float ph = fract(uTime * 0.45 + vPhase + float(k) * 0.34);
      a += smoothstep(0.07, 0.0, abs(r - ph)) * (1.0 - ph);
    }
    a *= 0.85;
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/** Every earthquake rendered as an animated seismic wavefront, scaled by
 *  magnitude. No dots. One draw call; a sphere proxy handles clicks. */
export default function SeismicLayer({ points }: { points: GeoPoint[] }) {
  const hover = useUIStore((s) => s.hover);
  const select = useUIStore((s) => s.select);
  const reduce = useReducedMotion();
  const uTime = useRef({ value: 0 });

  const mesh = useMemo(() => {
    const geo = new PlaneGeometry(1, 1);
    geo.setAttribute('aMag', new InstancedBufferAttribute(new Float32Array(MAX), 1));
    geo.setAttribute('aPhase', new InstancedBufferAttribute(new Float32Array(MAX), 1));
    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: { uTime: uTime.current, uColor: { value: new Color('#ff3b30') } },
    });
    const m = new InstancedMesh(geo, mat, MAX);
    m.count = 0;
    m.frustumCulled = false;
    return m;
  }, []);

  const proxy = useMemo(() => {
    const m = new InstancedMesh(
      new SphereGeometry(1, 8, 8),
      new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      MAX,
    );
    m.count = 0;
    m.frustumCulled = false;
    return m;
  }, []);

  useEffect(() => {
    const aMag = mesh.geometry.getAttribute('aMag') as InstancedBufferAttribute;
    const aPhase = mesh.geometry.getAttribute('aPhase') as InstancedBufferAttribute;
    const count = Math.min(points.length, MAX);
    const matrix = new Matrix4();
    for (let i = 0; i < count; i++) {
      const p = points[i];
      const mag = p.magnitude ?? 1;
      const pos = latLngToVector3(p.lat, p.lng, 1.012);
      const normal = pos.clone().normalize();
      tmpT.copy(UP).cross(normal);
      if (tmpT.lengthSq() < 1e-6) tmpT.set(1, 0, 0);
      tmpT.normalize();
      tmpB.copy(normal).cross(tmpT).normalize();
      const scale = 0.05 + mag * 0.022;
      matrix.makeBasis(tmpT, tmpB, normal);
      matrix.setPosition(pos.x, pos.y, pos.z);
      matrix.scale(new Vector3(scale, scale, 1));
      mesh.setMatrixAt(i, matrix);

      const pm = new Matrix4().makeScale(scale * 0.5, scale * 0.5, scale * 0.5);
      pm.setPosition(pos.x, pos.y, pos.z);
      proxy.setMatrixAt(i, pm);

      aMag.setX(i, mag);
      aPhase.setX(i, Math.random() * 6.283);
    }
    mesh.count = count;
    proxy.count = count;
    mesh.instanceMatrix.needsUpdate = true;
    proxy.instanceMatrix.needsUpdate = true;
    aMag.needsUpdate = true;
    aPhase.needsUpdate = true;
  }, [points, mesh, proxy]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as ShaderMaterial).dispose();
      proxy.geometry.dispose();
      (proxy.material as MeshBasicMaterial).dispose();
    },
    [mesh, proxy],
  );

  useFrame((_, dt) => {
    if (!reduce) uTime.current.value += dt;
  });

  return (
    <>
      <primitive object={mesh} />
      <primitive
        object={proxy}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          if (e.instanceId != null) hover(points[e.instanceId]?.id ?? null);
        }}
        onPointerOut={() => hover(null)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (e.instanceId != null) select(points[e.instanceId] ?? null);
        }}
      />
    </>
  );
}
