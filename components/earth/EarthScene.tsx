'use client';

import { useGlobeStyleStore } from '@/store/useGlobeStyleStore';
import Earth from './Earth';
import Clouds from './Clouds';
import Atmosphere from './Atmosphere';
import EarthIllustrated from './EarthIllustrated';
import EarthAtlas from './EarthAtlas';
import EarthGlass from './EarthGlass';
import EarthSculpture from './EarthSculpture';
import EarthInfrared from './EarthInfrared';
import EarthParchment from './EarthParchment';
import EarthBlueprint from './EarthBlueprint';

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
  if (style === 'infrared') {
    return (
      <>
        <EarthInfrared />
        <Atmosphere />
      </>
    );
  }
  if (style === 'parchment') {
    return <EarthParchment />;
  }
  if (style === 'blueprint') {
    return <EarthBlueprint />;
  }
  return (
    <>
      <Earth />
      <Clouds />
      <Atmosphere />
    </>
  );
}
