# MARBLE — Live Data Source Research

Researched candidate data sources for new globe layers, ranked by value. No
implementation — this is a proposal. "Difficulty" is relative to the existing
pipeline (proxy route → normalize → `GeoPoint` → point/marker layer).

## Already shipped (v1)

| Layer | Source | Auth |
|---|---|---|
| Earthquakes | USGS `all_day` | none |
| ISS | wheretheiss.at | none |
| City weather | Open-Meteo | none |
| Volcanoes, Wildfires | NASA EONET | none |
| Flights | OpenSky | OAuth2 (optional) |

**Key insight:** the EONET integration already in place exposes *many* more
categories with zero new auth and a trivial code change (just a category param):
`severeStorms`, `dustHaze`, `floods`, `landslides`, `seaLakeIce`, `drought`,
`tempExtremes`, `waterColor`, `snow`. This is the cheapest breadth available.

---

## Space & Satellite

| Source | Provider / API | Cost | Auth | Coverage | Update | Difficulty | Visual impact | Tier |
|---|---|---|---|---|---|---|---|---|
| Satellite / Starlink positions | CelesTrak (TLE) + `satellite.js` propagation | Free | None | Global | TLE daily; positions computed live | Medium-high (client propagation, cap object count for perf) | Very high (moving constellation of dots/tracks) | **v2** |
| Satellite positions (hosted) | N2YO API | Free | API key | Global | Live | Low-medium | High | v2 (alt to CelesTrak) |
| Aurora oval forecast | NOAA SWPC OVATION (`/products/ovation_aurora_latest.json`) | Free | None | Global (polar) | ~30–60 min | Medium (render a probability grid as glowing arcs at high lat) | **Very high** (luminous polar ovals — on-brand) | **v2 (top pick)** |
| Geomagnetic / Kp index, solar wind | NOAA SWPC JSON products | Free | None | Global | 1–60 min | Low | Medium (better as a UI status badge than a globe layer) | v2 (badge) |
| Solar flares / CMEs | NASA DONKI | Free | API key (`DEMO_KEY` works) | n/a (sun) | Event-based | Low | Low on a globe (it's the sun) | future (badge) |

## Earth Observation

| Source | Provider / API | Cost | Auth | Coverage | Update | Difficulty | Visual impact | Tier |
|---|---|---|---|---|---|---|---|---|
| Live cloud imagery | NASA GIBS (WMTS, VIIRS/MODIS) | Free | None | Global | Near-real-time (daily passes) | High (project tiles onto the sphere) | Very high (today's real clouds) | future |
| Air quality | Open-Meteo Air Quality API | Free | None | Global | Hourly | Low (same shape as weather) | Medium-high (city dots by AQI) | **v2 (easy win)** |
| Air quality (stations) | OpenAQ | Free | API key (free) | Global | Hourly | Low | Medium | v2 (alt) |
| Tropical cyclones | NOAA NHC GIS feeds | Free | None | Atlantic / E-Pacific only | ~6 h | Medium | High (named storm tracks) | v2 (regional caveat) |
| Severe storms, dust/haze, floods | NASA EONET (categories) | Free | None | Global | Daily-ish | **Trivial** (reuse EONET fetcher) | Medium-high | **v2 (cheapest breadth)** |
| Ocean temp / SST anomalies | NOAA ERDDAP / Coral Reef Watch | Free | None | Global | Daily | High (gridded → surface texture) | High (SST heatmap) | future |

## Natural Events

| Source | Provider / API | Cost | Auth | Coverage | Update | Difficulty | Visual impact | Tier |
|---|---|---|---|---|---|---|---|---|
| Earthquakes | USGS | Free | None | Global | 1–5 min | — | High | **shipped** |
| Volcanoes / Wildfires | NASA EONET | Free | None | Global | Daily | — | High | **shipped** |
| Wildfires (granular) | NASA FIRMS | Free | API key (free `MAP_KEY`) | Global | 3 h / near-real-time | Medium | High (dense hotspots) | future (upgrade over EONET fires) |
| Lightning strikes | Blitzortung | Free | None (WebSocket) | Global | Real-time (seconds) | High (WS stream, **ToS limits commercial use**) | Very high (flashing strikes) | future (ToS caution) |
| Landslides / Floods | NASA EONET categories | Free | None | Global | Daily | Trivial | Medium | v2 |
| Tsunami alerts | NOAA / NWS | Free | None | Mostly US/Pacific | Event-based | Low | Low (rare) | future |

## Human Activity

| Source | Provider / API | Cost | Auth | Coverage | Update | Difficulty | Visual impact | Tier |
|---|---|---|---|---|---|---|---|---|
| Aircraft | OpenSky | Free | OAuth2 | Global | 15 s | — | High | **shipped (optional)** |
| Ship traffic (AIS) | AISStream.io | Free | API key (free, WebSocket) | Global (coastal) | Real-time | Medium-high (WS, high volume → cap) | Very high (thousands of vessels) | future |
| Internet outages | Cloudflare Radar / IODA | Free | API token | Global (country-level) | Hourly | Medium | Medium (country highlights) | future (niche) |
| Population / energy activity | — | — | — | — | — | No good free real-time global source | skip |

## Environmental Monitoring

| Source | Provider / API | Cost | Auth | Coverage | Update | Difficulty | Visual impact | Tier |
|---|---|---|---|---|---|---|---|---|
| Drought | NASA EONET `drought` | Free | None | Global | Daily | Trivial | Medium | v2 |
| Polar sea ice | NSIDC | Free | None | Polar | Daily | Medium (polar cap area) | Medium-high | future |
| Deforestation | Global Forest Watch (GLAD) | Freemium | API key | Global (tropics) | Weekly | Medium | Medium | future |
| CO₂ trend | NOAA GML (Mauna Loa) | Free | None | Single global value | Daily/monthly | Low | Low geo (good as a counter/badge) | future (stat) |
| Methane | TROPOMI via NASA GIBS | Free | None | Global | Daily | High (gridded) | Medium | future |

---

## Ranked recommendation (next additions)

1. **Aurora oval — NOAA SWPC OVATION.** Keyless, global, ~30-min refresh. Glowing
   polar ovals are the single most striking, on-brand "live Earth" visual still
   missing. Medium effort (render a probability grid at high latitudes).
2. **EONET category expansion — severe storms, dust/haze, floods, landslides,
   sea ice, drought.** Keyless, reuses the existing fetcher; near-zero effort for
   a large jump in breadth. Bundle under a "Natural events" group in the pills.
3. **Air quality — Open-Meteo Air Quality.** Keyless, same provider/shape as the
   weather layer; global city dots colored by AQI. Easy, fits the concept.
4. **Satellites / Starlink — CelesTrak + `satellite.js`.** Keyless, global, very
   high visual (a moving constellation). Medium-high: client-side TLE propagation
   and a capped object count for 60 fps.
5. **Space-weather badge — SWPC Kp index / solar wind.** Tiny effort; surfaced as
   a status chip in the stats strip rather than a globe layer.

**Deliberately deferred:** live cloud imagery (GIBS tiling), ship AIS (key +
volume), lightning (WebSocket + ToS), SST/methane grids (texture pipeline) — all
high effort or licensing caveats.

**Recommended v2 batch:** #1 Aurora + #2 EONET expansion + #3 Air quality — all
keyless, all reinforce "a live portrait of Earth," shippable with the current
architecture.
