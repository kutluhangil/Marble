import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { NoColorSpace, SRGBColorSpace, type Texture } from 'three';

export interface EarthTextures {
  day: Texture;
  normal: Texture;
  roughness: Texture;
  night: Texture;
  clouds: Texture;
}

const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 768px)').matches;

const suffix = isMobile ? '-2k' : '';

/**
 * Load the Earth texture set with correct color spaces and anisotropy.
 * Picks 2K assets on mobile. Suspends until all textures resolve.
 */
export function useEarthTextures(): EarthTextures {
  const [day, normal, roughness, night, clouds] = useTexture([
    `/textures/earth-day${suffix}.jpg`,
    `/textures/earth-normal${suffix}.jpg`,
    `/textures/earth-roughness${suffix}.jpg`,
    `/textures/earth-night${suffix}.jpg`,
    `/textures/earth-clouds${suffix}.png`,
  ]);

  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  return useMemo(() => {
    day.colorSpace = SRGBColorSpace;
    night.colorSpace = SRGBColorSpace;
    normal.colorSpace = NoColorSpace;
    roughness.colorSpace = NoColorSpace;
    clouds.colorSpace = NoColorSpace;

    const aniso = Math.min(16, maxAnisotropy);
    for (const t of [day, normal, roughness, night, clouds]) {
      t.anisotropy = aniso;
      t.needsUpdate = true;
    }

    return { day, normal, roughness, night, clouds };
  }, [day, normal, roughness, night, clouds, maxAnisotropy]);
}
