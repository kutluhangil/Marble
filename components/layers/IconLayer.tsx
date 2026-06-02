'use client';

import { useEffect, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  Points,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import type { GeoPoint } from '@/lib/data/types';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useUIStore } from '@/store/useUIStore';
import { ATLAS_COLS, ATLAS_ROWS, getIconAtlas } from '@/lib/icons/atlas';

const MAX = 512;
const dummy = new Object3D();

const vertexShader = /* glsl */ `
  attribute float aCell;
  attribute float aSize;
  attribute vec3 aTint;
  varying float vCell;
  varying vec3 vTint;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize;
    vCell = aCell;
    vTint = aTint;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uCols;
  uniform float uRows;
  varying float vCell;
  varying vec3 vTint;
  void main() {
    float col = mod(vCell, uCols);
    float row = floor(vCell / uCols);
    vec2 uv = (vec2(col, row) + vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y)) / vec2(uCols, uRows);
    vec4 t = texture2D(uAtlas, uv);
    if (t.a < 0.05) discard;
    gl_FragColor = vec4(vTint * t.rgb, t.a);
  }
`;

/** Icon markers drawn as GPU point sprites sampled from the icon atlas (one
 *  draw call). A hidden sphere proxy provides hover/click hit-testing. */
export default function IconLayer({
  points,
  cellFor,
  tintFor,
  pixelSize = 30,
}: {
  points: GeoPoint[];
  cellFor: (p: GeoPoint) => number;
  tintFor: (p: GeoPoint) => [number, number, number];
  pixelSize?: number;
}) {
  const hover = useUIStore((s) => s.hover);
  const select = useUIStore((s) => s.select);

  const sprites = useMemo(() => {
    const geo = new BufferGeometry();
    for (const [name, n] of [
      ['position', 3],
      ['aCell', 1],
      ['aSize', 1],
      ['aTint', 3],
    ] as const) {
      geo.setAttribute(
        name,
        new BufferAttribute(new Float32Array(MAX * n), n).setUsage(DynamicDrawUsage),
      );
    }
    geo.setDrawRange(0, 0);
    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uAtlas: { value: getIconAtlas() },
        uCols: { value: ATLAS_COLS },
        uRows: { value: ATLAS_ROWS },
      },
    });
    const p = new Points(geo, mat);
    p.frustumCulled = false;
    p.raycast = () => {};
    return p;
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
    const dpr =
      typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;
    const pos = sprites.geometry.getAttribute('position') as BufferAttribute;
    const aCell = sprites.geometry.getAttribute('aCell') as BufferAttribute;
    const aSize = sprites.geometry.getAttribute('aSize') as BufferAttribute;
    const aTint = sprites.geometry.getAttribute('aTint') as BufferAttribute;
    const count = Math.min(points.length, MAX);
    for (let i = 0; i < count; i++) {
      const p = points[i];
      const r = 1.012 + Math.min((p.alt ?? 0) / 6371, 0.08);
      const v = latLngToVector3(p.lat, p.lng, r);
      pos.setXYZ(i, v.x, v.y, v.z);
      aCell.setX(i, cellFor(p));
      aSize.setX(i, pixelSize * dpr);
      const [tr, tg, tb] = tintFor(p);
      aTint.setXYZ(i, tr, tg, tb);

      dummy.position.copy(v);
      dummy.scale.setScalar(0.03);
      dummy.updateMatrix();
      proxy.setMatrixAt(i, dummy.matrix);
    }
    sprites.geometry.setDrawRange(0, count);
    pos.needsUpdate = true;
    aCell.needsUpdate = true;
    aSize.needsUpdate = true;
    aTint.needsUpdate = true;
    proxy.count = count;
    proxy.instanceMatrix.needsUpdate = true;
  }, [points, sprites, proxy, cellFor, tintFor, pixelSize]);

  useEffect(
    () => () => {
      sprites.geometry.dispose();
      (sprites.material as ShaderMaterial).dispose();
      proxy.geometry.dispose();
      (proxy.material as MeshBasicMaterial).dispose();
    },
    [sprites, proxy],
  );

  return (
    <>
      <primitive object={sprites} />
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
