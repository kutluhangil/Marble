# MARBLE — v1 Technical Design

> A live portrait of Earth: a hyper-realistic, slowly rotating planet on a clean
> editorial-light landing page, with real-time data layers. Status: design, pre-implementation.

- **Stack:** Next.js 14 (App Router) · React 18 · TypeScript (strict) · Three.js + React Three Fiber + Drei · Tailwind + CSS variables · Zustand · Framer Motion
- **Deploy target:** Vercel
- **Source of truth:** this document. The original `MARBLE-blueprint.md` is the vision; where the two differ, this spec wins.

---

## Section 1 — Scope & v1 boundary (APPROVED)

### In scope (v1)

**Earth realism**
- Day albedo + normal (relief) + roughness-split (shiny ocean / matte land) via `MeshStandardMaterial` maps + `onBeforeCompile`.
- Day/Night cycle: real-time terminator from the actual current date/time (subsolar point). Night side = dark blue-gray base + Black Marble city lights (emissive), never pure black.
- Clouds: separate sphere, static NASA cloud texture, independent slow rotation.
- Atmosphere: subtle Fresnel rim (BackSide sphere, custom GLSL).
- Studio lighting: key (sun `DirectionalLight`) + fill (hemisphere/ambient) + rim.
- Slow auto-rotation; drag-to-rotate; auto resumes after release.

**Data layers** (keyless except flights)
- Earthquakes — USGS `all_day`, 60 s.
- ISS — wheretheiss.at, ~5 s — marker + indicative orbit path (no `.glb`).
- City weather — Open-Meteo, current conditions for a curated city list, markers.
- Flights — OpenSky, optional, 15 s, graceful disable when no credentials.

**Interaction & UI**
- Layer toggle pills + live counts · live-stats strip · hover tooltip · click → event card.
- Landing sections: Nav · Hero · LayerPills · LiveStats · HowItWorks · BuiltWith · Footer.
- Editorial light design system (tokens, radial-gradient background) · responsive (desktop-first; mobile stacks, smaller globe, 2K textures).

**Motion (basic)**
- Hero fade-up · section scroll-reveals (IntersectionObserver) · pill hover · `prefers-reduced-motion`.

**Infra**
- API proxy routes (edge cache) · `GeoPoint` normalization · poller (pauses on hidden tab) · static OG image · SEO meta + sitemap/robots · `vercel.json` · Vitest for pure logic · texture fetch+optimize script + committed optimized assets + placeholders.

### Out of scope / deferred (later phases)

Advanced post-FX (bloom, vignette, color-grade/LUT, SMAA) · explicit ocean sun-glint highlight · cloud-shadows-on-surface · quake ring ripples · Lenis smooth-scroll · globe shrink/parallax-on-scroll · camera fly-to-on-click · dynamic OG route · NASA FIRMS / volcano layers · bathymetry map · `satellite.js` TLE propagation (ISS position comes from the API directly).

### Locked judgment calls

| Item | Call | Reason |
|---|---|---|
| Contact shadow | **In** | Cheap (Drei `<ContactShadows>`), core to the "floating marble" look |
| Ocean sun-glint | **Out** | Keep only free PBR ocean specular (low roughness); mirror-glint is extra shader work |
| Lenis smooth-scroll | **Out** | Native scroll + IO reveals are enough for v1 |
| WebGL fallback | **In (light)** | Detect WebGL, show static hero PNG + message |
| Anti-aliasing | MSAA via `antialias: true` only | SMAA lives in the deferred post-FX bucket |

---

## Section 2 — Architecture & module boundaries

### Layers of the system

1. **Pure logic** (`lib/geo`, `lib/data/normalize`) — no React, no Three. Deterministic, unit-tested.
2. **Data access** (`app/api/*`, `lib/data/sources`, `lib/data/poller`) — fetch, cache, normalize, poll.
3. **State** (`store/*`) — Zustand stores, thin and single-purpose.
4. **Rendering** (`components/earth`, `components/layers`) — R3F scene graph, consumes state + textures.
5. **Presentation** (`components/landing`, `components/ui`, `components/motion`) — DOM, design system, motion.

Each unit has one purpose and a narrow interface. Rendering consumes state and pure-logic outputs; it never fetches. Data access never imports React.

### State (four small Zustand stores)

```ts
// store/useGlobeStore.ts
interface GlobeStore {
  autoRotate: boolean;
  dragging: boolean;
  setDragging(v: boolean): void;
  setAutoRotate(v: boolean): void;
}

// store/useLayersStore.ts   (persisted to localStorage)
type Layer = 'quake' | 'iss' | 'weather' | 'flight';
interface LayersStore {
  active: Record<Layer, boolean>;
  flightAvailable: boolean;          // set false when API reports disabled
  toggle(layer: Layer): void;
  setFlightAvailable(v: boolean): void;
}

// store/useDataStore.ts
interface DataStore {
  events: Record<Layer, GeoPoint[]>;
  setEvents(layer: Layer, points: GeoPoint[]): void;
}

// store/useUIStore.ts
interface UIStore {
  selectedEvent: GeoPoint | null;
  hoveredId: string | null;
  select(e: GeoPoint | null): void;
  hover(id: string | null): void;
}
```

### Shared data shape

```ts
// lib/data/types.ts
type Layer = 'quake' | 'iss' | 'weather' | 'flight';

interface GeoPoint {
  id: string;
  layer: Layer;
  lat: number;
  lng: number;
  alt?: number;            // km above surface (ISS, flights)
  magnitude?: number;      // quakes; drives marker scale
  label: string;
  timestamp: number;       // epoch ms
  meta: Record<string, unknown>;
}
```

### Scene graph & rotation model

```
<Canvas camera={{ position:[0,0,3.2], fov:35 }}
        gl={{ antialias:true, toneMapping: ACESFilmicToneMapping }}
        dpr={[1,2]}>
  <SceneBackground/>            // paper color / transparent (CSS gradient shows through)
  <Lighting/>                   // key (sun) + hemisphere fill + rim — world space, fixed
  <group ref={world}>          // AUTO-ROTATES (paused while dragging)
    <Earth/>                    //   day/night/normal/roughness material
    <CloudsInner/>             //   slightly faster sub-rotation for parallax
    <LayersRoot/>              //   points/markers — children, so they stay pinned to geography
  </group>
  <Atmosphere/>                 // fixed BackSide rim
  <ContactShadow/>              // fixed, below globe
  <OrbitControls/>             // camera drag + clamped zoom, no pan, autoRotate OFF
  <PostFXNoop/>                 // none in v1 (ACES set on gl)
</Canvas>
```

- The **world group spins** (Earth rotates under a fixed real-time sun). Data points are children, so they stay locked to their coordinates.
- The **sun** is fixed in world space at the real-time subsolar direction. Auto-rotation is a stylized "museum turntable," not a 24-hour clock simulation.
- **Drag** rotates the camera (OrbitControls). On pointer-down the world spin pauses (`useGlobeStore.dragging`); it resumes ~1.5 s after pointer-up.
- The Canvas mounts via `next/dynamic` with `ssr: false` (WebGL is client-only) and lazy-loads Three to keep First-Load JS down.

### Folder structure

```
app/                       layout, page, globals.css, api/*, sitemap.ts, robots.ts
components/
  earth/   Globe Earth Clouds Atmosphere Lighting ContactShadow  shaders/*.glsl
  layers/  PointLayer ISSMarker OrbitPath
  landing/ Nav Hero HeroHeadline LayerPills LiveStats HowItWorks BuiltWith Footer
  ui/      EventCard Tooltip  primitives/{Pill,Badge,Glass}
  motion/  Reveal
lib/
  geo/     coordinates arc sun-position
  data/    types sources/{earthquakes,iss,weather,flights} normalize poller
  textures/loader
  utils/   cn format webgl
store/     useGlobeStore useLayersStore useDataStore useUIStore
public/textures/* public/og.png public/fallback.jpg public/favicon.svg
scripts/   fetch-textures.mjs
tests/     geo/* data/*
```

---

## Section 3 — Earth rendering

### Geometry & material
- `SphereGeometry(1, 128, 128)`.
- `MeshStandardMaterial`: `map` = day (sRGB), `normalMap` = topography, `roughnessMap` (ocean low → reflective, land high → matte), `emissiveMap` = night lights, `metalness = 0`, `toneMapped = true`.

### `onBeforeCompile` injections
- Uniform `uSunDirView` (sun direction in **view space**, updated each frame from the world-space subsolar vector × camera view matrix).
- Night-light gating in the fragment shader: `dayFactor = smoothstep(-0.1, 0.25, dot(normalize(vNormal), uSunDirView))`; multiply emissive (city lights) by `(1.0 - dayFactor)` so lights appear only on the dark side.
- Night base is lifted off pure black by the hemisphere/ambient fill light, not by the texture.
- Terminator warmth tint: deferred (kept out for v1 cleanliness).

### Sun position (`lib/geo/sun-position.ts`)
- `subsolarPoint(date) → { lat, lng }` via solar declination + UTC hour angle (NOAA low-precision formulae; accuracy well within visual tolerance).
- `sunDirectionWorld(date) → Vector3` = `latLngToVector3(subsolar)`. Feeds both the `DirectionalLight` position and the material uniform — single source of truth.

### Clouds (`Clouds.tsx`)
- `SphereGeometry(1.003, 128, 128)`, cloud texture as `map`/`alphaMap`, `transparent`, `depthWrite:false`.
- Sub-group rotates slightly faster than the world group (parallax). Night-side clouds darken automatically because they receive the same directional light.

### Atmosphere (`Atmosphere.tsx` + GLSL)
- `SphereGeometry(1.015, 64, 64)`, `BackSide`, custom `ShaderMaterial`, `transparent`, `depthWrite:false`.
- Fresnel: `pow(1.0 - dot(normal, viewDir), 2.5)`, low alpha (≤ ~0.4), silvery blue (`--atmo-tint`). Deliberately faint so it does not drown on a light background.

### Lighting (`Lighting.tsx`)
- Key: `DirectionalLight` along the subsolar vector, intensity tuned (~3).
- Fill: `HemisphereLight` (dim) + tiny `ambientLight` → dark side reads as deep blue-gray, not black.
- Rim: low `DirectionalLight` from behind to separate the silhouette.
- No HDRI environment in v1 (keep it simple; 3-point + ACES is enough).

### Contact shadow & tone mapping
- Drei `<ContactShadows>` under the globe — soft, blurred, low opacity → "floating" read.
- `ACESFilmicToneMapping` set on the Canvas `gl`; exposure tuned ~1.0. (A renderer setting, not a post-FX pass.)

### Texture loader (`lib/textures/loader.ts`)
- Loads the map set; sets `colorSpace` = `SRGBColorSpace` for day + night, linear/`NoColorSpace` for normal + roughness; `anisotropy` = min(renderer max, 16); mipmaps on.
- Adaptive resolution: 4K on desktop, 2K on mobile (`matchMedia`/device check).
- Suspense boundary with the committed low-res placeholders so the scene renders before full assets resolve.

### Texture set & sourcing (`scripts/fetch-textures.mjs`)
Core maps (committed, optimized, total < 10 MB):

| File | Source | Color space | Res |
|---|---|---|---|
| `earth-day.jpg` | NASA Blue Marble Next Gen | sRGB | 4K/2K |
| `earth-normal.jpg` | NASA topography (GEBCO/SRTM-derived) | linear | 4K/2K |
| `earth-roughness.jpg` | land/ocean mask derivative | linear | 2K |
| `earth-night.jpg` | NASA Black Marble | sRGB | 4K/2K |
| `earth-clouds.png` | NASA cloud composite (alpha) | sRGB | 4K/2K |

- The script downloads from documented public-domain NASA URLs and optimizes with `sharp` to the budget. Tiny placeholders are committed so the app renders before the script runs. The optimized full-res assets are then committed (clone-and-run, zero-step deploy).

---

## Section 4 — Data pipeline

### API routes (`app/api/*/route.ts`)
Server route handlers act as proxy + cache + key-hider. Responses carry `Cache-Control: s-maxage` for Vercel edge caching.

| Route | Upstream | Cadence / `s-maxage` | Notes |
|---|---|---|---|
| `/api/earthquakes` | USGS `all_day.geojson` | 60 s | keyless |
| `/api/iss` | `api.wheretheiss.at/v1/satellites/25544` | 5 s | keyless |
| `/api/weather` | Open-Meteo current, multi-coord | 300 s | keyless; one request for the whole city list |
| `/api/flights` | OpenSky `states/all` (bbox-limited, capped count) | 15 s | OAuth2 client-credentials; returns `{ disabled: true }` when no creds |

- **OpenSky auth (2025):** `client_credentials` grant against `auth.opensky-network.org/.../token`, cached bearer; env `OPENSKY_CLIENT_ID` / `OPENSKY_CLIENT_SECRET` (server-only). Absent → route responds disabled; UI hides/greys the flights pill.
- Each route normalizes upstream → `GeoPoint[]` before responding. Timeouts + try/catch with a safe empty fallback.

### Normalization (`lib/data/normalize.ts`)
Pure functions, one per source, each → `GeoPoint`:
- quake: `magnitude`, `meta { depth, place, url }`.
- iss: `alt`, `meta { velocity }`.
- weather: `meta { temperature, weatherCode, city }`.
- flight: `alt`, `meta { callsign, velocity, heading }`.

### Poller (`lib/data/poller.ts`, client)
- One interval per **active** layer at its cadence; only active layers poll.
- Page Visibility API: pause when hidden, refetch immediately on return.
- Exponential backoff on errors (capped). Cleanup on toggle-off/unmount.
- On success → `useDataStore.setEvents(layer, points)`.

### City list (weather)
- Curated constant (~24–30 globally distributed major cities) in `lib/data/sources/weather.ts`. Open-Meteo accepts comma-joined coordinates → a single request covers all of them.

---

## Section 5 — Geo, layers & interaction

### Geo math (pure, tested)
- `coordinates.ts` — `latLngToVector3(lat, lng, radius=1, alt=0)` per the blueprint formula. Verified against known cities.
- `arc.ts` — great-circle interpolation (slerp of unit vectors) + altitude bump; used for the ISS orbit path and any flight tails.
- `sun-position.ts` — subsolar point (Section 3).

### Layers
- **PointLayer** (`InstancedMesh`) — shared by quakes and weather. Per instance: position at r≈1.005, scale (quake: magnitude→scale; weather: fixed), color from the layer token. Spawn = scale lerp 0→1. Hover via `instanceId` raycast → highlight + tooltip. Click → select.
- **Flights** — rendered as subtle points (reuse PointLayer) coloured `--data-flight`; `heading` available in meta. True OD-pair arcs are out of scope (state vectors have no destination).
- **ISSMarker** — small amber marker at the current position.
- **OrbitPath** — indicative ground-track line at ISS inclination (~51.6°) oriented through the current position (great-circle ring). Avoids TLE/`satellite.js`.

### Camera & controls
- Drei `<OrbitControls>`: `enablePan=false`, clamped `min/maxDistance`, `enableDamping`, modest `rotateSpeed`, `autoRotate=false` (the world group provides spin).
- Pointer-down → `dragging=true` (pause world spin); pointer-up → resume after ~1.5 s.

### Interaction wiring
- R3F pointer events on instanced meshes (`onPointerOver/Out/onClick`).
- Tooltip via Drei `<Html>` anchored to the hovered point; content from `useUIStore.hoveredId`.
- Click → `useUIStore.select(event)` → DOM `EventCard` (layer-specific content, Esc/close).

---

## Section 6 — Landing UI, design system, motion, testing, phasing

### Design system
- `globals.css` defines the blueprint CSS variables (paper/ink/data/atmo/shadows, type scale, spacing). Tailwind config maps tokens → utilities.
- Fonts via `next/font`: Fraunces (display serif), Inter (sans), JetBrains Mono (mono).
- Background: radial gradient `--paper` → `--paper-edge` on the body. Dot-grid/grain: skipped in v1 (optional in the blueprint).

### Components
- **Nav** — sticky, `backdrop-blur` glass-light, MARBLE wordmark + About + GitHub, hairline border.
- **Hero** — Fraunces headline + Inter subhead + Globe canvas + LayerPills + LiveStats.
- **LayerPills** — quake/iss/weather/flight toggles (flight greyed when unavailable); colour dot + label + live count.
- **LiveStats** — strip: events today · max magnitude · live pulse.
- **EventCard** — layer-specific detail; magnitude (mono) / coords / place / time-ago / source link; Esc + close.
- **HowItWorks** — columns for USGS · ISS · Open-Meteo · OpenSky (cadence + credit).
- **BuiltWith** — tech credits line.
- **Footer** — minimal credits + links.
- **ui/primitives** — Pill, Badge, Glass.

### Motion
- Framer Motion: hero fade-up (stagger), `Reveal` (IntersectionObserver) for sections, pill hover.
- `prefers-reduced-motion` disables non-essential animation.
- WebGL fallback: `lib/utils/webgl.ts` detects support; if absent, Hero shows `public/fallback.jpg` + a short message instead of the Canvas.

### SEO / deploy
- `app/layout.tsx` metadata (title, description, OG/Twitter, JSON-LD WebApplication).
- Static `public/og.png` (committed placeholder; regen documented — Satori cannot render WebGL, so OG is a still image).
- `sitemap.ts`, `robots.ts`. `vercel.json`: `{ "framework": "nextjs", "regions": ["fra1"] }`.
- Env: `OPENSKY_CLIENT_ID`, `OPENSKY_CLIENT_SECRET` (optional), `NEXT_PUBLIC_SITE_URL`.

### Testing
- Vitest. Unit tests (TDD) for pure modules only:
  - `coordinates` — known cities land at expected vectors.
  - `arc` — endpoints match inputs; midpoint lies on the sphere.
  - `sun-position` — known dates → subsolar within tolerance.
  - `normalize` — sample upstream payloads → correct `GeoPoint`s.
- Shaders, lighting, and layout are verified by manual visual QA, not unit tests.

### Build phasing (drives the implementation plan)

| Phase | Deliverable | Gate |
|---|---|---|
| P1 Scaffold | configs, fonts, tokens, app + section shells, stores, utils | `pnpm build` clean, 0 type errors |
| P2 Design system + UI shells | landing components static (no data) | visual: editorial light, responsive skeleton |
| P3 Earth | texture script + placeholders, Earth/Clouds/Atmosphere/Lighting/ContactShadow, sun-position | realistic rotating globe at 60 fps |
| P4 Geo + layers + interaction | coords/arc, PointLayer, ISSMarker, OrbitPath, controls, raycast, tooltip/card wiring | markers pinned to geography; hover/click work |
| P5 Data pipeline | API routes, normalize, poller; pills/stats/card live | real data flowing; flights degrade gracefully |
| P6 Motion + responsive + fallback | reveals, reduced-motion, mobile, WebGL fallback | smooth, no jank, mobile OK |
| P7 Polish | SEO/OG/sitemap/robots, vercel.json, README, perf | Lighthouse targets, deploy-ready |

Pure-logic tests are written test-first within P3–P5.
