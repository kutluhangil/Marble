# MARBLE

> A live portrait of Earth. Real-time data on the most realistic planet you've seen in a browser.

MARBLE renders a hyper-realistic, slowly rotating Earth on a clean, editorial-light
landing page — the planet as a museum piece rather than a sci-fi dashboard — and
draws live data onto it: earthquakes, the International Space Station, city weather,
and (optionally) flight traffic.

## Features

- **Photoreal Earth** — NASA Blue Marble albedo, derived relief and roughness maps,
  Black Marble city lights, and a separate animated cloud shell, all under 3-point
  studio lighting with ACES tone mapping.
- **Real-time day/night** — the solar terminator is computed from the actual date and
  time; the night side glows with city lights instead of going pure black.
- **Editorial light design** — warm grays, generous white space, and editorial
  typography. No dark space background.
- **Live layers** — earthquakes (USGS), the ISS (wheretheiss.at), city weather
  (Open-Meteo), volcanoes and wildfires (NASA EONET), and flights (OpenSky,
  optional). Toggle them, hover for a label, click for detail.
- **Globe styles** — switch between Realistic, Illustrated (cel-shaded), and
  Atlas (flat two-tone cartographic) renderings.
- **Time scrubber** — drag the sun ±12h and watch the terminator and city lights sweep.
- **Light & dark** editorial themes, Turkish and English, shareable view URLs,
  and PNG export.
- **Calm motion** — a slow turntable rotation, ripple rings on new quakes,
  click-to-fly camera, gentle reveals, and smooth drag-to-rotate.

## The realism breakdown

The Earth uses a `MeshStandardMaterial` extended via `onBeforeCompile`:

- **Albedo** from the Blue Marble day map.
- **Normal mapping** from a relief map so terrain catches light near the terminator.
- **Roughness split** — oceans are smooth and reflective, land is matte.
- **Night side** — Black Marble city lights are gated to the dark hemisphere using the
  real-time sun direction, over a deep blue-gray base lifted by a hemisphere fill light.
- **Clouds** — a separate transparent shell with its own slow rotation for parallax.
- **Atmosphere** — a faint Fresnel rim tuned low so it reads as a halo on a light
  background, not a glow.

## Data sources

- **USGS** — earthquakes, past 24 hours.
- **wheretheiss.at** — live ISS position.
- **Open-Meteo** — current conditions for a curated list of major cities.
- **NASA EONET** — open volcano and wildfire events.
- **OpenSky** — live flight states (requires OAuth2 credentials; disabled gracefully
  without them).
- **NASA** — Blue Marble and Black Marble imagery (public domain).

## Quick start

```bash
pnpm install
pnpm textures   # optional: re-download and optimize the NASA maps
pnpm dev
```

Open <http://localhost:3000>. The optimized textures are committed, so `pnpm textures`
is only needed to refresh them.

### Environment

Copy `.env.local.example` to `.env.local`. All layers work without configuration
except flights, which needs OpenSky credentials:

```
OPENSKY_CLIENT_ID=
OPENSKY_CLIENT_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run the unit tests |
| `pnpm textures` | Download and optimize the Earth textures |

## Tech stack

Next.js 14 · TypeScript · Three.js · React Three Fiber · Drei · custom GLSL ·
Zustand · Framer Motion · Tailwind CSS · Vitest.

## License

MIT — see [LICENSE](LICENSE).
