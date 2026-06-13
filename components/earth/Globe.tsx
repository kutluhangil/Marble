'use client';

import {
  Suspense,
  useEffect,
  useRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  ACESFilmicToneMapping,
  type Group,
  type PerspectiveCamera,
} from 'three';
import EarthScene from './EarthScene';
import Lighting from './Lighting';
import ContactShadow from './ContactShadow';
import LayersRoot from '@/components/layers/LayersRoot';
import HoverTooltip from '@/components/layers/HoverTooltip';
import { latLngToVector3 } from '@/lib/geo/coordinates';
import { useGlobeStore } from '@/store/useGlobeStore';
import { useUIStore } from '@/store/useUIStore';

type Controls = ComponentRef<typeof OrbitControls>;

/** How much of the view the globe (radius 1) should occupy — leaves a margin so
 *  the full sphere is always visible regardless of aspect ratio. */
const FIT = 1.32;

/** Frames the globe so it fully fits any viewport, re-fitting on resize. */
function CameraFit({ controls }: { controls: React.RefObject<Controls> }) {
  const camera = useThree((s) => s.camera as PerspectiveCamera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    const vfov = (camera.fov * Math.PI) / 180;
    const aspect = width / Math.max(1, height);
    // Distance that fits vertically; widen for narrow (portrait) viewports.
    const dist = (FIT / Math.tan(vfov / 2)) * Math.max(1, 1 / aspect);
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
    const c = controls.current;
    if (c) {
      c.target.set(0, 0, 0);
      c.update();
    }
  }, [camera, width, height, controls]);

  return null;
}

/** The spinning world group. Auto-rotates, pauses on drag, and flies the
 *  selected event to the front of the globe. */
function World({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const dragging = useGlobeStore((s) => s.dragging);
  const selected = useUIStore((s) => s.selectedEvent);
  const flyTarget = useRef<number | null>(null);

  useEffect(() => {
    if (!selected) return;
    const p = latLngToVector3(selected.lat, selected.lng, 1);
    flyTarget.current = -Math.atan2(p.x, p.z);
  }, [selected]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;

    if (dragging) {
      flyTarget.current = null;
      return;
    }

    if (flyTarget.current !== null) {
      let diff = flyTarget.current - g.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      if (Math.abs(diff) < 0.003) {
        g.rotation.y = flyTarget.current;
        flyTarget.current = null;
      } else {
        g.rotation.y += diff * Math.min(1, dt * 4);
      }
      return;
    }

    g.rotation.y += dt * 0.04;
  });

  return <group ref={ref}>{children}</group>;
}

export default function Globe() {
  const setDragging = useGlobeStore((s) => s.setDragging);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const controls = useRef<Controls>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
      }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <World>
          <EarthScene />
          <LayersRoot />
          <HoverTooltip />
        </World>
        <ContactShadow />
        <OrbitControls
          ref={controls}
          makeDefault
          enablePan={false}
          minDistance={2}
          maxDistance={12}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
          onStart={() => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
            setDragging(true);
          }}
          onEnd={() => {
            resumeTimer.current = setTimeout(() => setDragging(false), 1500);
          }}
        />
        <CameraFit controls={controls} />
      </Suspense>
    </Canvas>
  );
}
