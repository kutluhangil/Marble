# MARBLE — Living, Interactive Layers: Architecture Proposal

Goal: turn flat markers into discoverable, museum-quality entities (hover →
selection → rich panel → tasteful animation) **without** visual chaos or frame
drops. The globe stays the hero. This is a proposal — no implementation yet.

---

## 1. Current architecture (review)

- **Render:** rotating `World` group → `EarthScene` + `LayersRoot`. Each active
  layer is an `InstancedMesh` (`PointLayer`) whose **per-instance matrices are
  recomputed on the CPU every frame** in `useFrame` (lat/lng→Vector3 ×N). 6
  layers = 6 draw calls. `QuakeRings` are React-managed ring meshes. ISS = one
  marker + an *indicative* `OrbitPath` ring (not the real track).
- **Interaction:** raycast on the instanced mesh → `useUIStore` (hover/select) →
  DOM `EventCard`. `HoverTooltip` is a single drei `<Html>`.
- **Data:** `poller` → `useDataStore`. `GeoPoint` carries `meta`.

**Bottlenecks for this request**
1. Per-frame CPU matrix loops don't scale once we add motion to every marker.
2. Naive "particles/plumes per marker" = hundreds of draw calls + overdraw → jank.
3. **Data gaps:** most requested panel fields are not in the current free feeds
   (see §4). Honest scoping is required before building exhibit cards.

---

## 2. Core principle: **Ambient on the GPU, rich on focus**

Two tiers keep it alive *and* fast:

- **Ambient (all markers, always):** one custom **instanced shader** per layer
  with per-instance attributes (`aPhase`, `aMagnitude`/`aIntensity`, `aColor`)
  and a single `uTime` uniform. Pulse / glow / breathing computed **on the GPU
  in one draw call per layer** — hundreds of markers animated at ~0 CPU.
  Positions live in a **static buffer updated only on data change**, not every
  frame (removes the current per-frame CPU loop entirely).
- **Rich (focused entity only — one at a time):** the elaborate effects
  (ISS orbit trail, volcano plume, rain/snow particles, multi-ring quake) mount
  **only for the hovered/selected object**. One object → trivial cost, zero
  chaos. Everything de-escalates to ambient when unfocused.

`prefers-reduced-motion` damps ambient to static; mobile lowers particle counts.

This directly satisfies "elegant, lightweight, globe stays hero."

---

## 3. Per-layer plan

| Layer | Ambient (instanced shader, all) | Focus effect (selected only) | Feasible? |
|---|---|---|---|
| **Earthquake** | pulse amplitude ∝ magnitude | expanding multi-ring scaled by magnitude (extend existing `QuakeRings`) | ✅ now |
| **ISS** | gentle marker glow | **real trail** from recent polled positions + **predicted arc** (great-circle, or `satellite.js` upgrade); orbit wrap | ✅ now (trail is free) |
| **Weather** | color/glow by condition; small billboard glyph (sun/cloud/rain…) via 1 texture atlas | condition micro-animation near marker (rain lines / snow / shimmer) | ✅ now |
| **Volcano** | warm glow pulse | soft additive smoke plume (single billboard/particle) on active/erupting | ⚠️ visuals ✅, rich data needs enrichment (§4) |
| **Wildfire** | warm glow pulse ∝ intensity | heat shimmer + smoke on select; scale by intensity | ⚠️ intensity needs FIRMS (§4) |
| **Flight** | subtle directional marker (heading) | short heading trail on select | ✅ now |

Ambient glyphs/particles are **billboarded instanced quads** (face camera) — cheap.

---

## 4. Data reality — what each panel field needs (honest)

**Achievable now from existing/derivable data:**
- **Earthquake:** USGS already returns `tsunami`, `alert`, `felt`, `sig`, depth,
  place, time, url — we currently drop most. **Nearest-city distance** =
  haversine vs our `CITIES` list. Magnitude-band explanation = short authored text.
- **Weather:** one Open-Meteo request can add `apparent_temperature`,
  `relative_humidity_2m`, `surface_pressure`, `wind_speed/direction_10m`,
  `is_day`, daily `sunrise`/`sunset`, and `timezone` → local time. Trivial.
- **ISS:** alt/speed/lat/lng (have) + derived **local solar time** (from lng+UTC)
  and **orbit count** (epoch math). Trail from polled history (free).

**Achievable with cheap, keyless enrichment (proposed):**
- **Wikipedia REST summary** (`/api/rest_v1/page/summary/{title}`, keyless, CORS):
  thumbnail image + extract + page link → powers **volcano "exhibit" media + blurb**
  and **city "About this location"** facts. This is the key unlock for media/context.
- **ISS crew:** Open-Notify `astros.json` (keyless; HTTP → proxied through our route).
- **City enrichment:** static authored table (country, population, elevation,
  timezone) for our ~28 cities — small, accurate, no API.

**NOT available free / needs a decision:**
- **Volcano** elevation / type / last-eruption: EONET has none. Options:
  (a) Wikipedia blurb + link-out only (keyless, recommended), (b) author a small
  table for well-known volcanoes (partial coverage), (c) integrate Smithsonian
  GVP WFS (complex; no images).
- **Wildfire** intensity / confidence / satellite: EONET has none. Needs
  **NASA FIRMS** (free `MAP_KEY`, you add env) — gives FRP/confidence/VIIRS-MODIS.
  "Nearby protected areas / environmental impact" = no free API → omit or author.
- **ISS country/ocean below:** needs reverse-geocoding (e.g., BigDataCloud
  keyless) — optional third-party call.

---

## 5. Universal Info Panel system

Replace `EventCard` with one `InfoPanel` driven by a normalized model, so every
layer looks identical and premium:

```ts
interface PanelModel {
  layer: Layer; color: string;
  title: string; subtitle?: string;
  stats: { label: string; value: string }[];   // grid
  description?: string;                          // authored/derived/Wikipedia
  facts?: { label: string; value: string }[];   // "About this location"
  media?: { src: string; caption?: string };    // Wikipedia thumbnail
  status: 'live' | 'idle' | 'unavailable';
  sourceName: string; sourceUrl: string;
}
```

- `buildPanel(event, lang)` per layer assembles it from `GeoPoint.meta` +
  enrichment. One component renders all layers (stat grid, optional media,
  description, source footer + learn-more).
- Desktop: floating card (current position). **Mobile: bottom-sheet** with drag/tap-out close.
- Framer Motion enter/exit; themed (light/dark); reuses the popover design language.
- Enrichment (Wikipedia/crew) fetched **lazily on selection**, cached per id,
  with graceful skeleton → never blocks selection or the globe.

---

## 6. Performance guardrails

- Static instanced position buffers; update only on poll, never per frame.
- Single `uTime` drives all ambient motion (GPU).
- Heavy particles/plumes: **focused entity only**, hard-capped; disabled under
  reduced-motion and scaled down on mobile (`dpr`/count).
- Cap concurrent quake rings; pool ring meshes.
- Billboard glyphs via **one shared texture atlas** (sun/cloud/rain/snow/storm/fog).
- Enrichment requests debounced + cached + abortable; off the render loop.
- Target unchanged: 60 fps desktop, smooth mobile, full-globe framing intact.

---

## 7. Phasing (proposed)

- **P1 — Universal panel + data enrichment (no heavy rendering).** Biggest value,
  lowest risk: rich panels for all layers using existing USGS/Open-Meteo fields,
  nearest-city, ISS derivations, Wikipedia media/facts, crew. Mobile sheet.
- **P2 — Ambient GPU animation.** Instanced shader: magnitude pulse, weather
  condition glyph/glow, volcano/fire warm glow, flight heading. Removes per-frame
  CPU loop. "Alive" without chaos.
- **P3 — Focus effects.** ISS real trail + predicted arc; volcano plume on select;
  weather condition micro-animation; quake multi-ring scaling; flight trail.
- **P4 — Optional/keyed.** NASA FIRMS fire intensity (needs key); reverse-geocode
  ISS country/ocean; richer volcano data (GVP) if wanted.

---

## 8. Decisions needed before building

1. **Phase order:** P1 (panels+data) first, or lead with the ISS orbit (it was
   emphasized)?
2. **Volcano/wildfire depth:** Wikipedia enrich + link-out (keyless) — or also
   wire **NASA FIRMS** for fire intensity (you add a free key) and/or GVP for
   volcano metadata?
3. **Enrichment consent:** OK to add keyless third-party calls (Wikipedia,
   Open-Notify crew, optional reverse-geocode) and some short **authored**
   context (magnitude bands, city facts)? Or stay strictly to live numeric data?
