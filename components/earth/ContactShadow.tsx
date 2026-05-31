'use client';

import { ContactShadows } from '@react-three/drei';

/** Soft blurred shadow beneath the globe that gives the "floating" read. */
export default function ContactShadow() {
  return (
    <ContactShadows
      position={[0, -1.25, 0]}
      opacity={0.35}
      scale={4}
      blur={2.8}
      far={2}
      color="#18181b"
    />
  );
}
