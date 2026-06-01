'use client';

import { useGlobeStyleStore } from '@/store/useGlobeStyleStore';
import Earth from './Earth';
import Clouds from './Clouds';
import Atmosphere from './Atmosphere';
import EarthIllustrated from './EarthIllustrated';
import EarthAtlas from './EarthAtlas';

/** Renders the Earth in the currently selected visual style. */
export default function EarthScene() {
  const style = useGlobeStyleStore((s) => s.style);

  if (style === 'illustrated') {
    return (
      <>
        <EarthIllustrated />
        <Atmosphere />
      </>
    );
  }
  if (style === 'atlas') {
    return <EarthAtlas />;
  }
  return (
    <>
      <Earth />
      <Clouds />
      <Atmosphere />
    </>
  );
}
