'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import {
  Color,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';

const MAX = 1024;
const dummy = new Object3D();

export interface GlowConfig {
  color: string;
  /** Pulse speed (0 = static). */
  speed: number;
  /** Pulse amount (size + brightness). */
  pulse: number;
  /** Base marker radius. */
  size: number;
  /** Base emissive intensity. */
  emissive: number;
}

/**
 * Shared instanced glow markers. Animation (pulse/flicker) runs entirely on the
 * GPU from one `uTime` uniform; positions are written only when the data
 * changes. Color + speed + pulse give each layer its own visual identity.
 */
export default function GlowLayer({
  points,
  config,
  sizeBy,
  intensityBy,
}: {
  points: GeoPoint[];
  config: GlowConfig;
  sizeBy?: (p: GeoPoint) => number;
  intensityBy?: (p: GeoPoint) => number;
}) {
  const hover = useUIStore((s) => s.hover);
  const select = useUIStore((s) => s.select);
  const reduce = useReducedMotion();
  const uniforms = useRef({
    uTime: { value: 0 },
    uSpeed: { value: config.speed },
    uPulse: { value: config.pulse },
  });

  const mesh = useMemo(() => {
    const geo = new SphereGeometry(1, 14, 14);
    const aPhase = new Float32Array(MAX);
    const aIntensity = new Float32Array(MAX);
    for (let i = 0; i < MAX; i++) {
      aPhase[i] = Math.random() * Math.PI * 2;
      aIntensity[i] = 1;
    }
    geo.setAttribute('aPhase', new InstancedBufferAttribute(aPhase, 1));
    geo.setAttribute('aIntensity', new InstancedBufferAttribute(aIntensity, 1));

    const mat = new MeshStandardMaterial({
      color: '#000000',
      emissive: new Color(config.color),
      emissiveIntensity: config.emissive,
      roughness: 1,
      metalness: 0,
      toneMapped: false,
    });
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uniforms.current.uTime;
      sh.uniforms.uSpeed = uniforms.current.uSpeed;
      sh.uniforms.uPulse = uniforms.current.uPulse;
      sh.vertexShader =
        'attribute float aPhase;\nattribute float aIntensity;\nuniform float uTime;\nuniform float uSpeed;\nuniform float uPulse;\nvarying float vPulse;\n' +
        sh.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           float pulse = sin(uTime * uSpeed + aPhase);
           vPulse = pulse;
           transformed *= 1.0 + pulse * uPulse * (0.5 + 0.5 * aIntensity);`,
        );
      sh.fragmentShader =
        'varying float vPulse;\n' +
        sh.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           totalEmissiveRadiance *= (0.75 + 0.45 * vPulse);`,
        );
    };
    mat.customProgramCacheKey = () => `glow-${config.color}`;

    const m = new InstancedMesh(geo, mat, MAX);
    m.count = 0;
    m.frustumCulled = false;
    return m;
  }, [config.color, config.emissive]);

  useEffect(() => {
    const aInt = mesh.geometry.getAttribute('aIntensity') as InstancedBufferAttribute;
    const count = Math.min(points.length, MAX);
    for (let i = 0; i < count; i++) {
      const p = points[i];
      const r = 1.005 + Math.min((p.alt ?? 0) / 6371, 0.08);
      dummy.position.copy(latLngToVector3(p.lat, p.lng, r));
      dummy.scale.setScalar(config.size * (sizeBy ? sizeBy(p) : 1));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      aInt.setX(i, intensityBy ? intensityBy(p) : 1);
    }
    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
    aInt.needsUpdate = true;
  }, [points, mesh, config.size, sizeBy, intensityBy]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as MeshStandardMaterial).dispose();
    },
    [mesh],
  );

  useFrame((_, dt) => {
    if (!reduce) uniforms.current.uTime.value += dt;
  });

  return (
    <primitive
      object={mesh}
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
  );
}
