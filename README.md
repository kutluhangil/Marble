<div align="center">

<img src="docs/media/hero.svg" alt="MARBLE — a globe on a plinth with the terminator moving, seismic wavefronts, the ISS and a museum panel, switching from realistic to parchment to blueprint" width="100%">

<p>
  <a href="https://marble-drab-delta.vercel.app"><img alt="Live demo" src="https://img.shields.io/badge/live%20demo-see%20the%20planet-4a90d9?style=for-the-badge&labelColor=0b1220"></a>
  <img alt="React Three Fiber" src="https://img.shields.io/badge/R3F-custom%20PBR-e8b04a?style=for-the-badge&labelColor=0b1220">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-App%20Router-5fbf8f?style=for-the-badge&labelColor=0b1220">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-4a90d9?style=for-the-badge&labelColor=0b1220">
</p>

<p><em>A hyper-realistic, slowly rotating Earth on a clean editorial page: the planet as a museum piece, not a sci-fi dashboard.<br>
On its surface, the world as it happens: earthquakes, the ISS, weather, volcanoes, wildfires and flights.</em></p>

<a href="https://marble-drab-delta.vercel.app"><img src="public/screenshots/globe-realistic.png" alt="The realistic globe style under studio lighting" width="100%"></a>

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## Eight ways to see one planet

<table>
  <tr>
    <td width="33%"><img src="public/screenshots/globe-glass.png" alt="Glass style"></td>
    <td width="33%"><img src="public/screenshots/globe-parchment.png" alt="Parchment style"></td>
    <td width="33%"><img src="public/screenshots/globe-blueprint.png" alt="Blueprint style"></td>
  </tr>
  <tr>
    <td align="center"><code>glass</code></td>
    <td align="center"><code>parchment</code> · 17th-century cartography</td>
    <td align="center"><code>blueprint</code></td>
  </tr>
  <tr>
    <td width="33%"><img src="public/screenshots/globe-infrared.png" alt="Infrared style"></td>
    <td width="33%"><img src="public/screenshots/globe-sculpture.png" alt="Sculpture style"></td>
    <td width="33%"><img src="public/screenshots/globe-illustrated.png" alt="Illustrated style"></td>
  </tr>
  <tr>
    <td align="center"><code>infrared</code></td>
    <td align="center"><code>sculpture</code></td>
    <td align="center"><code>illustrated</code></td>
  </tr>
</table>

Realistic, Illustrated, Atlas, Glass, Sculpture, Infrared, Parchment and Blueprint all switch instantly, on the same planet with the same live layers.

<img src="docs/media/divider.svg" width="100%" alt="">

## Features

| | |
|---|---|
| **Hyper-realistic Earth** | NASA Blue Marble albedo, relief and roughness maps, Black Marble city lights, animated clouds and atmosphere under studio lighting. |
| **Real-time terminator** | The day–night line from the actual date and time, with a draggable sun scrubber. |
| **Living data layers** | Earthquakes, ISS, weather, volcanoes, wildfires and flights, each with its own visual language instead of dots. |
| **ISS tracking** | A spacecraft sprite, an always-visible orbit tube and a live trail. |
| **Seismic wavefronts** | Quakes render as expanding waves scaled by magnitude, so M2 and M8 never look alike. |
| **Museum panels** | Click anything for enriched stats, Wikipedia imagery, ISS crew, nearest city and source attribution. |
| **Light and dark · TR / EN** | Editorial light and dark themes and full Turkish / English localisation. |
| **Share and export** | View URLs that keep style, layers and sun position, and one-click PNG capture. |

| Layer | Source |
|---|---|
| Earthquakes | USGS Earthquake Hazards Program |
| ISS position and crew | wheretheiss.at · Open-Notify |
| City weather | Open-Meteo |
| Volcanoes · wildfires | NASA EONET |
| Flights | OpenSky Network (optional OAuth2) |
| Place imagery | Wikipedia REST |

<img src="docs/media/divider.svg" width="100%" alt="">

## Each layer speaks its own language

Dots on a globe all look the same. MARBLE gives every kind of event a form that says what it is:

| Layer | How it is drawn | Why |
|---|---|---|
| **Earthquakes** | Procedural expanding wavefronts in one draw call. A small quake is one faint ring; a strong one spawns more, larger, brighter fronts. | M2 and M8 must never look alike. |
| **ISS** | A spacecraft sprite, an always-visible orbit tube for the full trajectory and a live trail of where it has been. | Position alone hides where it is going. |
| **Weather** | 28 cities with current Open-Meteo readings. | A few well-chosen points read better than a field of numbers. |
| **Volcanoes · wildfires · flights** | Icons from a single texture atlas, drawn in one call, with a hidden sphere proxy for hover and click. | Hundreds of markers without hundreds of draw calls. |
| **Flights** | OpenSky traffic within a European bounding box. | The busiest airspace reads well and keeps the payload small. |

Everything is pinned to the rotating world group, so markers stay on their geography while the planet turns.

<img src="docs/media/divider.svg" width="100%" alt="">

## Under the glass

| Piece | Detail |
|---|---|
| **Surface** | `MeshStandardMaterial` with Blue Marble albedo, relief and a roughness split for land and ocean. An `onBeforeCompile` patch lights the Black Marble city lights only on the night side, from the real sun direction. |
| **Sun** | The subsolar point is computed from the date and time; the terminator is real and the sun scrubber moves it. |
| **Clouds** | A separate shell just above the surface, alpha from a white-on-black cloud map, with a slow extra spin for parallax. Its rotation is shared with the Earth shader so cloud shadows line up. |
| **Atmosphere and stage** | An atmosphere rim, a graticule for the cartographic styles and a contact shadow on the page. |
| **Museum panels** | Click anything for enriched stats, the nearest city (haversine), ISS crew and a Wikipedia summary and image, cached per language and title. |
| **Tests** | Great-circle arcs, coordinate conversion, the sun position and data normalisation are unit-tested with Vitest. |

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**MARBLE**, temiz ve editoryal bir sayfada yavaşça dönen hiper-gerçekçi bir Dünya. NASA görüntüleri, özel PBR gölgeleme, gerçek zamanlı gece-gündüz çizgisi ve ayrı bir bulut katmanı sayesinde render mı fotoğraf mı ayırt etmek zor. Üzerinde depremler, ISS, hava durumu, volkanlar, yangınlar ve uçuşlar canlı olarak, her biri kendi görsel diliyle çiziliyor. Sekiz farklı küre stili, açık/koyu tema ve Türkçe/İngilizce arayüzü var.

<img src="docs/media/divider.svg" width="100%" alt="">

## Development

```sh
pnpm install
pnpm textures          # fetch the NASA texture set
cp .env.local.example .env.local   # optional OpenSky credentials
pnpm dev               # http://localhost:3000
pnpm test              # vitest
pnpm build
```

```
components/earth/     globe, shaders, clouds, atmosphere, styles
components/layers/    quakes, ISS, weather, volcanoes, fires, flights
components/landing/   editorial page sections
lib/                  data clients, geo maths, panel enrichment, i18n
store/                zustand stores for globe, layers, time, theme, language
```

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>Imagery from NASA Blue Marble and Black Marble · data from USGS, NASA EONET, Open-Meteo and OpenSky. · values in the banner are illustrative.</sub>
</div>
