'use client';

import { useGlobeStyleStore } from '@/store/useGlobeStyleStore';
import Earth from './Earth';
import Clouds from './Clouds';
import Atmosphere from './Atmosphere';
import EarthIllustrated from './EarthIllustrated';
import EarthAtlas from './EarthAtlas';
import EarthGlass from './EarthGlass';
import EarthSculpture from './EarthSculpture';

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
  if (style === 'glass') {
    return (
      <>
        <EarthGlass />
        <Atmosphere />
      </>
    );
  }
  if (style === 'sculpture') {
    return (
      <>
        <EarthSculpture />
        <Atmosphere />
      </>
    );
  }
  return (
    <>
      <Earth />
      <Clouds />
      <Atmosphere />
    </>
  );
}
