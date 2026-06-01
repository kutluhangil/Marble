'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import {
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  type Texture,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';
import { ATLAS_COLS, ATLAS_ROWS, getIconAtlas } from '@/lib/icons/atlas';

const MAX = 512;
const dummy = new Object3D();

function useAtlas(): Texture | null {
  const [tex, setTex] = useState<Texture | null>(null);
  useEffect(() => {
    let mounted = true;
    getIconAtlas().then((t) => mounted && setTex(t));
    return () => {
      mounted = false;
    };
  }, []);
  return tex;
}

const vertexShader = /* glsl */ `
  attribute float aCell;
  attribute float aSize;
  attribute vec3 aTint;
  attribute float aPhase;
  uniform float uCols;
  uniform float uRows;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vTint;
  void main() {
    vec4 center = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float s = aSize * (1.0 + 0.06 * sin(uTime * 1.5 + aPhase));
    center.xy += position.xy * s;
    gl_Position = projectionMatrix * center;
    float col = mod(aCell, uCols);
    float row = floor(aCell / uCols);
    vUv = (vec2(col, row) + vec2(uv.x, 1.0 - uv.y)) / vec2(uCols, uRows);
    vTint = aTint;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  varying vec2 vUv;
  varying vec3 vTint;
  void main() {
    vec4 t = texture2D(uAtlas, vUv);
    if (t.a < 0.04) discard;
    gl_FragColor = vec4(vTint * t.rgb, t.a);
  }
`;

/** Instanced billboard icon sprites sampled from the icon atlas (one draw call).
 *  A hidden sphere proxy provides hover/click hit-testing. */
export default function IconLayer({
  points,
  cellFor,
  tintFor,
  size = 0.06,
}: {
  points: GeoPoint[];
  cellFor: (p: GeoPoint) => number;
  tintFor: (p: GeoPoint) => [number, number, number];
  size?: number;
}) {
  const atlas = useAtlas();
  const hover = useUIStore((s) => s.hover);
  const select = useUIStore((s) => s.select);
  const uTime = useRef({ value: 0 });

  const mesh = useMemo(() => {
    const geo = new PlaneGeometry(1, 1);
    const aCell = new Float32Array(MAX);
    const aSize = new Float32Array(MAX).fill(size);
    const aTint = new Float32Array(MAX * 3).fill(1);
    const aPhase = new Float32Array(MAX);
    for (let i = 0; i < MAX; i++) aPhase[i] = Math.random() * 6.283;
    geo.setAttribute('aCell', new InstancedBufferAttribute(aCell, 1));
    geo.setAttribute('aSize', new InstancedBufferAttribute(aSize, 1));
    geo.setAttribute('aTint', new InstancedBufferAttribute(aTint, 3));
    geo.setAttribute('aPhase', new InstancedBufferAttribute(aPhase, 1));
    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: {
        uAtlas: { value: null },
        uCols: { value: ATLAS_COLS },
        uRows: { value: ATLAS_ROWS },
        uTime: uTime.current,
      },
    });
    const m = new InstancedMesh(geo, mat, MAX);
    m.count = 0;
    m.frustumCulled = false;
    return m;
  }, [size]);

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
    if (atlas) (mesh.material as ShaderMaterial).uniforms.uAtlas.value = atlas;
  }, [atlas, mesh]);

  useEffect(() => {
    const aCell = mesh.geometry.getAttribute('aCell') as InstancedBufferAttribute;
    const aTint = mesh.geometry.getAttribute('aTint') as InstancedBufferAttribute;
    const count = Math.min(points.length, MAX);
    for (let i = 0; i < count; i++) {
      const p = points[i];
      const r = 1.01 + Math.min((p.alt ?? 0) / 6371, 0.08);
      const pos = latLngToVector3(p.lat, p.lng, r);
      dummy.position.copy(pos);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(size * 0.8);
      dummy.updateMatrix();
      proxy.setMatrixAt(i, dummy.matrix);
      aCell.setX(i, cellFor(p));
      const [tr, tg, tb] = tintFor(p);
      aTint.setXYZ(i, tr, tg, tb);
    }
    mesh.count = count;
    proxy.count = count;
    mesh.instanceMatrix.needsUpdate = true;
    proxy.instanceMatrix.needsUpdate = true;
    aCell.needsUpdate = true;
    aTint.needsUpdate = true;
  }, [points, mesh, proxy, cellFor, tintFor, size]);

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
    uTime.current.value += dt;
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
