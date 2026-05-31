# 🌐 MARBLE

> **The planet, as a museum piece.** Karanlık uzay temalı globe'lar her yerde. MARBLE farklı: gri-beyaz, editoryal, premium bir landing page. Hiper-gerçekçi bir Dünya, temiz bir alanda yüzüyor, yavaşça dönüyor — ve üzerinde gezegenin canlı verisi akıyor. NASA'nın "Blue Marble" fotoğrafı ile mermer materyalinin buluşması.

```
version:   v1.0.0-blueprint
target:    Claude Code (VS Code)
stack:     Next.js 14 · Three.js · R3F · custom PBR shaders
deploy:    Vercel
aesthetic: editorial light · warm gray/white · ink accent (#18181b)
hero:      hyper-realistic rotating Earth, centered
build:     9 specialized agents
```

---

## 📌 TL;DR

Mevcut globe'ların neredeyse tamamı siyah uzay arkaplanında. Bu güzel ama klişe oldu. **MARBLE** tam tersini yapıyor:

- **Gri-beyaz editoryal tasarım** — bir gezegeni siyah uzayda değil, temiz bir galeri/stüdyo alanında sunmak. Apple ürün sayfası + NYT data journalism estetiği.
- **Hiper-gerçekçi Dünya** — NASA 8K texture'ları, PBR shading, normal/roughness/cloud map'leri, stüdyo aydınlatması, yumuşak temas gölgesi. Müze parçası gibi yüzüyor.
- **Yavaş dönen** — sakin, hipnotize edici rotasyon
- **Canlı veri** — depremler, ISS, uçuşlar globe üzerinde zarif noktalar/arklar olarak
- **Landing page formatı** — Dünya ortada hero, üstte minimal başlık, altında veri katmanları + canlı istatistikler
- **Premium UI** — bol beyaz alan, editoryal tipografi, floating refined controls

Bu dosya Claude Code için yazıldı. **9 ajan halinde organize edildi.**

İsim alternatifleri: `MARBLE` (önerilen), `TERRA`, `ATLAS`, `ORBIS`, `MERIDIAN`.

---

## 📋 İÇİNDEKİLER

1. [Vizyon & Farklılaştırıcılar](#-vizyon--farklılaştırıcılar)
2. [Tasarım Felsefesi](#-tasarım-felsefesi)
3. [Görsel Sistem](#-görsel-sistem)
4. [Hiper-Gerçekçi Dünya — Teknik Spec](#-hiper-gerçekçi-dünya--teknik-spec)
5. [Landing Page Yapısı](#-landing-page-yapısı)
6. [Teknoloji Yığını](#-teknoloji-yığını)
7. [Veri Kaynakları](#-veri-kaynakları)
8. [Klasör Yapısı](#-klasör-yapısı)
9. [Ajan Sistemi](#-ajan-sistemi)
10. [Performans Hedefleri](#-performans-hedefleri)
11. [Vercel Deploy](#-vercel-deploy)
12. [README Şablonu](#-readme-şablonu)

---

## 🎯 VİZYON & FARKLILAŞTIRICILAR

**Hedef:** Açıldığında "bu nasıl bu kadar gerçek görünüyor?" dedirten, sakin, premium bir landing page. Dünya bir mücevher gibi sunuluyor — temiz, aydınlık, zarif.

### Klişe Globe vs MARBLE

| Özellik | Tipik Globe | MARBLE |
|---|---|---|
| Arkaplan | Siyah uzay | **Gri-beyaz galeri** |
| Estetik | Sci-fi / tech | **Editorial / premium** |
| Earth kalitesi | globe.gl default veya orta | **Hiper-gerçekçi PBR** |
| Aydınlatma | Tek directional | **Stüdyo 3-point + soft shadow** |
| Yüzey detayı | Düz texture | **Normal + roughness + cloud + relief** |
| Hava durumu | Yok | **Atmosfer rim + bulut gölgeleri** |
| Format | Full dashboard | **Sakin landing page** |
| Tipografi | Mono everywhere | **Editorial serif + grotesk** |
| His | "veri ekranı" | **"müze parçası"** |

### Hedef Etki

- ✅ "Bu bir 3D render mı, fotoğraf mı?" tepkisi
- ✅ LinkedIn'de sakin, zarif estetik dikkat çeker (herkes dark yapıyor, sen beyaz yapıyorsun)
- ✅ Portfolyo hero'su veya bağımsız showcase olarak çalışır
- ✅ Hacker News "Show HN" potansiyeli
- ✅ Gerçekçilik teknik bir başarı olarak konuşulur
- ✅ ~3 haftalık solo dev (Earth realism'i zaman alır)

---

## 🎨 TASARIM FELSEFESİ

**Editorial Light Premium.** Bir gezegeni galeri ışığında sergilemek. Sessizlik, beyaz alan, zarif tipografi. Dünya kahraman; her şey ona nefes aldırır.

### Prensipler

1. **The Earth floats like a jewel.** Yumuşak temas gölgesi, stüdyo ışığı — bir obje gibi sunulmuş.
2. **White space is luxury.** Cömert boşluk. Hiçbir şey sıkışık değil.
3. **Ink on paper.** Metin koyu mürekkep (#18181b), zemin kağıt beyazı. Editorial.
4. **Realism is the flex.** Dünya o kadar gerçekçi ki teknik başarı kendini gösterir.
5. **Calm motion.** Yavaş dönüş, yumuşak geçişler. Hiçbir şey aceleci değil.
6. **Data is delicate.** Veri noktaları zarif, çok parlak değil; gezegene saygılı.
7. **Light, not dark.** Sektör dark yapıyor; biz tam tersini, daha zor olanı yapıyoruz.

### Mood Board

- Apple ürün sayfaları (AirPods Pro, iPhonePro render'ları)
- NYT / Bloomberg data journalism grafikleri
- Kinfolk dergisi beyaz alanı
- Teenage Engineering ürün fotoğrafçılığı
- Stripe'ın editoryal temizliği (ama light)
- Bir müzede vitrindeki cam küre
- "Earthrise" fotoğrafı ama stüdyo ışığında

---

## 🌫️ GÖRSEL SİSTEM

### Renk Paleti

```css
/* Canvas / backgrounds — warm grays */
--paper:        #fafaf9;   /* ana zemin, sıcak beyaz */
--paper-soft:   #f5f5f4;   /* section alternatif */
--paper-edge:   #ebebe9;   /* radial gradient kenar */
--surface:      #ffffff;   /* card, floating panel */
--surface-soft: #f7f7f6;

/* Borders */
--border-hair:  #e7e5e4;   /* en ince ayırıcı */
--border-soft:  #d6d3d1;
--border-ink:   #18181b;

/* Text — ink */
--ink:          #18181b;   /* primary, neredeyse siyah */
--ink-soft:     #44403c;   /* secondary */
--ink-muted:    #78716c;   /* meta, captions */
--ink-faint:    #a8a29e;   /* disabled, hints */

/* Accent — minimal, ink-based */
--accent:       #18181b;   /* primary action = ink */
--accent-warm:  #c2410c;   /* nadir vurgular için sıcak (deprem vb) */

/* Data layer colors — refined, editorial */
--data-quake:   #dc2626;   /* deprem — refined kırmızı */
--data-iss:     #ca8a04;   /* ISS — amber/altın */
--data-flight:  #44403c;   /* uçuş — koyu ink-gri */
--data-fire:    #ea580c;   /* yangın — turuncu */
--data-volcano: #be185d;   /* volkan — koyu pembe */

/* Earth atmosphere (subtle on light) */
--atmo-tint:    #bfdbfe;   /* çok hafif mavi-beyaz rim */

/* Shadow */
--shadow-contact: rgba(24, 24, 27, 0.12);  /* globe altı temas gölgesi */
```

### Tipografi

```css
/* Display / hero — editorial serif veya distinctive grotesk */
--font-display: "Fraunces", "Editorial New", Georgia, serif;
/* alternatif: clean grotesk → "Söhne", "Inter Tight" */

/* UI / body */
--font-sans: "Inter", system-ui, sans-serif;

/* Data / coordinates — technical credibility */
--font-mono: "JetBrains Mono", "Söhne Mono", monospace;

/* Skala — editorial, geniş */
--text-xs:    12px;   /* captions, coords */
--text-sm:    14px;   /* meta */
--text-base:  16px;   /* body */
--text-lg:    18px;
--text-xl:    24px;
--text-2xl:   36px;   /* section headers */
--text-3xl:   56px;   /* hero (serif) */
--text-4xl:   80px;   /* big hero */

/* Editorial: geniş line-height, negatif letter-spacing display'de */
--lh-tight:   1.05;   /* hero */
--lh-snug:    1.3;
--lh-normal:  1.6;    /* body */
--ls-display: -0.02em;
```

### Layout Ölçüleri

```css
--container:    1280px;
--gutter:       24px;
--section-pad:  120px;   /* dikey section boşluğu — cömert */
--radius-card:  16px;
--radius-pill:  999px;

--shadow-card:  0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06);
--shadow-float: 0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.08);
```

### Background Treatment

Zemin düz beyaz DEĞİL. Derinlik için:
- **Radial gradient:** merkez `--paper` → kenar `--paper-edge` (globe'u öne çıkarır)
- **Subtle dot grid veya kartografik ince çizgiler** (opsiyonel, opacity 0.03) — editoryal/harita hissi
- **Çok hafif film grain** (opsiyonel, premium dokunuş)

### Animasyon

- **Globe rotation:** 0.04 rad/s, sürekli, sakin
- **Hero reveal:** fade up 600ms cubic-bezier(0.16, 1, 0.3, 1)
- **Data point spawn:** scale 0→1 spring + subtle pulse
- **Arc draw:** progressive 0.8s
- **Hover transitions:** 160ms ease
- **Section reveal (scroll):** intersection observer, fade up 24px
- **Layer toggle:** veri fade in/out 400ms

---

## 🌍 HİPER-GERÇEKÇİ DÜNYA — TEKNİK SPEC

Bu projenin can damarı. Earth o kadar gerçekçi olmalı ki render mı fotoğraf mı belli olmasın. Agent 3 ve 4'ün ortak referansı.

### Texture Katmanları (NASA kaynakları)

| Map | Kaynak | Çözünürlük | Amaç |
|---|---|---|---|
| **Albedo (day)** | NASA Blue Marble Next Gen | 8K → 4K optimize | Yüzey rengi |
| **Normal map** | NASA topography (GEBCO/SRTM) | 4K | Dağ kabartması ışık yakalar |
| **Roughness map** | Land/ocean mask türevi | 2K | Okyanus parlak, kara mat |
| **Cloud map** | NASA cloud composite | 8K → 4K | Ayrı şeffaf sphere |
| **Night lights** | NASA Black Marble | 4K | Gece tarafı şehir ışıkları (emissive) |
| **Bathymetry** | NASA ocean depth | 2K | Okyanus derinlik tonu (subtle) |
| **Water specular mask** | Land/ocean | 2K | Sun glint sadece okyanusta |

Tüm texture'lar `sharp`/`mozjpeg` ile optimize, anisotropic filtering 16x.

### Earth Surface Shading

**PBR yaklaşımı** (MeshStandardMaterial + custom shader injection veya tam custom):

1. **Albedo:** Blue Marble day texture
2. **Normal mapping:** Dağlar, sıradağlar ışık altında kabartmalı görünür. Terminator yakınında belirginleşir.
3. **Roughness split:**
   - Okyanus: düşük roughness (0.1) → güneş yansıması, parlak
   - Kara: yüksek roughness (0.9) → mat
   - Roughness map ile kontrol
4. **Sun glint (specular):** Güneş yönünden okyanusta parlak nokta — gerçek uydu fotoğraflarındaki o ışıltı
5. **Subtle relief:** Normal map yeterli; istenirse hafif displacement (mountains)
6. **Geometry:** SphereGeometry 128-256 segment (smooth silhouette)

### Day/Night Terminator

- Gerçek güneş pozisyonu (gerçek tarih/saate göre subsolar point hesabı)
- DirectionalLight güneş yönünde
- **Gündüz tarafı:** tam albedo, stüdyo ışığı
- **Gece tarafı:** karanlık DEĞİL (gri-beyaz temada pure black çirkin) → yumuşak koyu mavi-gri + delikat şehir ışıkları (emissive map)
- Terminator çizgisi: yumuşak smoothstep geçiş, hafif sıcak gün batımı tonu

### Cloud Layer

- Ayrı sphere, radius 1.003 (yüzeyin hemen üstünde)
- Cloud texture, alpha transparency
- Bağımsız yavaş rotasyon (yüzeyden farklı hız → parallax)
- **Cloud shadows (advanced):** Bulutlar yüzeye gölge düşürür (shader'da cloud map'i yüzey shading'ine çarp)
- Gece tarafında bulutlar koyulaşır

### Atmosphere (Light Theme İçin Özel)

Karanlık temadaki parlak glow BURADA ÇALIŞMAZ. Light tema için:
- Çok ince, delikat bir rim — gerçek atmosferin gündüz fotoğraftaki hali
- BackSide sphere, radius 1.015
- Fresnel-based ama **düşük yoğunluk** (light bg'de boğulmamalı)
- Renk: çok hafif mavi-beyaz (`--atmo-tint`), kenar gümüşi
- Üstte hafif "haze" — gezegenin nefes aldığı hissi

### Studio Lighting (Premium "Floating Marble" Look)

Gerçek bir ürün fotoğrafçısı gibi 3-point setup:
1. **Key light:** Güneş (DirectionalLight), terminator yaratır
2. **Fill light:** Yumuşak hemisphere veya ambient → gece tarafı pure black olmaz
3. **Rim light:** Arkadan ince ışık → silhouette ayrışır, atmosfer parlar
4. **Environment:** Çok hafif HDRI veya gradient environment → PBR yansımalar doğal

### Contact Shadow (Yüzen His)

- Globe'un altında yumuşak, bulanık elips gölge
- Shadow-catcher plane VEYA CSS blur ellipse (canvas altında)
- Bu, gezegenin "bir yüzeyde duruyor / yüzüyor" hissini verir → premium product-shot estetiği

### Post-Processing

- **Tone mapping:** ACES Filmic veya AgX (gerçekçi renk)
- **Subtle bloom:** Sadece sun glint ve şehir ışıkları için, çok hafif
- **Ambient occlusion (opsiyonel):** Bulut-yüzey arası derinlik
- **Color grading:** Hafif warm, editorial film hissi
- **Anti-aliasing:** MSAA veya SMAA (kenarlar tertemiz olmalı)

### Kalite Kontrol Kriterleri

Earth "gerçek" sayılması için:
- [ ] Dağlar terminator yakınında ışık/gölge yakalıyor (normal map)
- [ ] Okyanusta güneş yansıması (glint) var
- [ ] Bulutlar yüzeyden bağımsız dönüyor + gölge düşürüyor
- [ ] Gece tarafı şehir ışıkları var ama abartısız
- [ ] Atmosfer rim ince ve zarif (light bg'de boğulmuyor)
- [ ] Kenarlar tertemiz (AA)
- [ ] Texture grazing angle'da net (anisotropic)
- [ ] Temas gölgesi gezegeni "yüzdürüyor"

---

## 📐 LANDING PAGE YAPISI

Tek sayfa, dikey scroll. Dünya hero'da ortada. Sakin, editorial.

```
┌─────────────────────────────────────────────────────┐
│  MARBLE                              About  GitHub   │  ← minimal nav (sticky, glass)
│                                                       │
│                                                       │
│              A live portrait of Earth                 │  ← hero başlık (serif, ortada)
│         Real-time data, on the most realistic         │
│              planet you've seen in a browser          │
│                                                       │
│                   ╭─────────────╮                     │
│                 ╱  HİPER-GERÇEK  ╲                   │
│                │   DÖNEN DÜNYA    │                   │  ← globe (ortada, büyük)
│                │  (stüdyo ışığı)  │                   │
│                 ╲   soft shadow  ╱                    │
│                   ╰─────────────╯                     │
│                  ____________                         │  ← temas gölgesi
│                                                       │
│        ● Earthquakes   ○ ISS   ○ Flights              │  ← veri katman pills
│                                                       │
│         147 events today · M6.2 max · live            │  ← canlı istatistik şeridi
├─────────────────────────────────────────────────────┤
│                                                       │
│   [scroll reveal] — "How it works" / data sources    │  ← opsiyonel ikinci section
│   Earthquakes from USGS. ISS live. Flights via        │
│   OpenSky. Updated every minute.                      │
│                                                       │
├─────────────────────────────────────────────────────┤
│   [scroll reveal] — "Built with" tech credits         │  ← teknik şeffaflık
│   Three.js · NASA textures · custom PBR shaders       │
├─────────────────────────────────────────────────────┤
│  MARBLE · by kutluhan.gil · GitHub · LinkedIn         │  ← footer
└─────────────────────────────────────────────────────┘
```

### Bölümler

1. **Nav** — sticky, glass (light), minimal: logo + About + GitHub
2. **Hero** — başlık (editorial serif) + alt başlık + büyük dönen globe + veri pills + canlı stat şeridi
3. **Interaction** — globe ile etkileşim (drag rotate, hover event, click detail)
4. **How it works** (scroll reveal) — veri kaynakları, güncelleme sıklığı
5. **Built with** (scroll reveal) — teknik şeffaflık, tech stack
6. **Footer** — credits, linkler

### Globe Etkileşimi (landing içinde)

- **Default:** yavaş otomatik dönüş
- **Drag:** kullanıcı döndürebilir (otomatik dönüş duraklar, bırakınca devam)
- **Hover event:** nokta highlight + tooltip
- **Click event:** detail card (yumuşak)
- **Scroll:** globe sabit kalır (hero'da), diğer section'lar üstüne kayar — veya globe küçülür/köşeye gider (advanced)

---

## 🛠️ TEKNOLOJİ YIĞINI

| Katman | Teknoloji | Sebep |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR landing + edge API |
| Dil | **TypeScript** (strict) | Tip güvenliği |
| 3D | **Three.js** + **R3F** + **Drei** | Earth rendering |
| Post-FX | **@react-three/postprocessing** | Bloom, AA, tone mapping |
| Styling | **Tailwind CSS** + CSS Vars | Editorial design system |
| State | **Zustand** | Layer + globe state |
| Animation | **Framer Motion** | Landing reveals, transitions |
| Scroll | **Lenis** (smooth scroll) | Premium scroll feel |
| Fonts | **next/font** (Fraunces + Inter + JetBrains Mono) | Editorial type |
| Data | **Public APIs** (USGS, ISS, OpenSky) | Real-time |
| Geo | **satellite.js** | ISS/satellite propagation |
| Deploy | **Vercel** | Edge runtime |

### Bağımlılıklar

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "three": "^0.165.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.108.0",
    "@react-three/postprocessing": "^2.16.0",
    "postprocessing": "^6.35.0",
    "satellite.js": "^5.0.0",
    "lenis": "^1.1.0",
    "clsx": "^2.1.0"
  }
}
```

---

## 🛰️ VERİ KAYNAKLARI

Hero için 3 ana katman yeterli (sakin kalsın). Hepsi ücretsiz, çoğu key'siz.

| Katman | Kaynak | Endpoint | Key | Tip |
|---|---|---|---|---|
| **Depremler** | USGS | `earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson` | ❌ | Polling 60s |
| **ISS** | wheretheiss.at | `api.wheretheiss.at/v1/satellites/25544` | ❌ | Polling 5s |
| **Uçuşlar** | OpenSky | `opensky-network.org/api/states/all` | ⚠️ opsiyonel | Polling 15s |

Opsiyonel ekstra katmanlar (sonradan): NASA FIRMS (yangın), volkanlar.

### Veri Stratejisi

- Edge API proxy (CORS + cache + key gizleme)
- Normalize → ortak `GeoPoint` formatı:
  ```ts
  interface GeoPoint {
    id: string;
    layer: 'quake' | 'iss' | 'flight';
    lat: number;
    lng: number;
    alt?: number;
    magnitude?: number;
    label: string;
    timestamp: number;
    meta: Record<string, any>;
  }
  ```
- Cache: depremler 60s, ISS 5s, uçuşlar 15s (Edge cache)
- Tab gizliyken polling durur

---

## 📁 KLASÖR YAPISI

```
marble/
├── app/
│   ├── layout.tsx                    # fonts, smooth scroll, metadata
│   ├── page.tsx                      # landing page (hero + sections)
│   ├── globals.css
│   └── api/
│       ├── earthquakes/route.ts
│       ├── iss/route.ts
│       ├── flights/route.ts
│       └── og/route.tsx              # dynamic OG
│
├── components/
│   ├── earth/
│   │   ├── Globe.tsx                 # R3F canvas root
│   │   ├── Earth.tsx                 # earth mesh + PBR shaders
│   │   ├── Clouds.tsx                # cloud layer + shadows
│   │   ├── Atmosphere.tsx            # subtle light-theme rim
│   │   ├── Lighting.tsx              # 3-point studio rig
│   │   ├── ContactShadow.tsx         # floating shadow
│   │   ├── PostFX.tsx                # tone mapping, bloom, AA
│   │   └── shaders/
│   │       ├── earth.vert.glsl
│   │       ├── earth.frag.glsl       # day/night/glint/relief
│   │       ├── atmosphere.vert.glsl
│   │       └── atmosphere.frag.glsl
│   │
│   ├── layers/
│   │   ├── PointLayer.tsx            # instanced points (quakes)
│   │   ├── ArcLayer.tsx              # arcs (flights)
│   │   ├── RingLayer.tsx             # spawn ripples
│   │   └── ISSMarker.tsx             # ISS model + orbit
│   │
│   ├── landing/
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── HeroHeadline.tsx
│   │   ├── LayerPills.tsx
│   │   ├── LiveStats.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BuiltWith.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/
│   │   ├── EventCard.tsx             # tıklanan event detayı
│   │   ├── Tooltip.tsx
│   │   └── primitives/
│   │       ├── Pill.tsx
│   │       ├── Badge.tsx
│   │       └── Glass.tsx
│   │
│   └── motion/
│       ├── Reveal.tsx                # scroll reveal wrapper
│       └── SmoothScroll.tsx          # Lenis provider
│
├── lib/
│   ├── geo/
│   │   ├── coordinates.ts            # lat/lng → Vector3
│   │   ├── arc.ts                    # great circle
│   │   ├── sun-position.ts           # terminator
│   │   └── satellite.ts              # TLE propagation
│   │
│   ├── data/
│   │   ├── sources/
│   │   │   ├── earthquakes.ts
│   │   │   ├── iss.ts
│   │   │   └── flights.ts
│   │   ├── normalize.ts
│   │   └── poller.ts
│   │
│   ├── textures/
│   │   └── loader.ts                 # texture preload + optimize
│   │
│   └── utils/
│       ├── cn.ts
│       └── format.ts
│
├── store/
│   ├── useGlobeStore.ts              # rotation, drag, camera
│   ├── useLayersStore.ts             # active layers
│   ├── useDataStore.ts               # events
│   └── useUIStore.ts                 # selected event, sections
│
├── public/
│   ├── textures/
│   │   ├── earth-day-4k.jpg          # NASA Blue Marble
│   │   ├── earth-normal-4k.jpg       # topography
│   │   ├── earth-roughness-2k.jpg
│   │   ├── earth-night-4k.jpg        # city lights
│   │   ├── earth-clouds-4k.png
│   │   └── earth-bathymetry-2k.jpg
│   ├── models/
│   │   └── iss.glb
│   ├── og.png
│   └── favicon.svg
│
├── tests/
│   └── geo/
│       └── coordinates.test.ts
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── vercel.json
├── package.json
├── README.md
└── .env.local.example
```

---

## 🤖 AJAN SİSTEMİ

**9 specialized agent.** Earth realism'e ekstra ağırlık verildi (Agent 3 + 4 birlikte gezegeni kusursuzlaştırıyor).

### Ajanlar Genel Görünüm

```
[1] ARCHITECT          →  İskelet, store, landing page yapısı
[2] AESTHETICIAN       →  Gri/beyaz editorial design system, landing UI
[3] EARTH SMITH        →  Hiper-gerçekçi yüzey: texture, PBR, relief, clouds
[4] LIGHT & ATMOSPHERE →  Stüdyo aydınlatma, atmosfer, post-fx, contact shadow
[5] CARTOGRAPHER       →  Geo dönüşüm, veri rendering, kamera, etkileşim
[6] DATA PIPELINE      →  USGS/ISS/OpenSky API + real-time
[7] LAYER CONDUCTOR    →  Katman pills, canlı stats, event card
[8] MOTION DIRECTOR    →  Landing reveal'lar, smooth scroll, globe motion
[9] POLISHER           →  Vercel deploy, SEO, performance, README
```

### Bağımlılık Grafiği

```
[1] ──┬──> [2] ────────────────> [8]
      ├──> [3] ──> [4] ──> [5] ──┬──> [7]
      ├──> [6] ──────────────────┘
      └──> [9] (son adım)
```

---

### 🟢 AJAN 1 — THE ARCHITECT

**Rol:** İskelet, landing page yapısı, store'lar, R3F canvas mount.

**Sahip Olduğu Dosyalar:**
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `vercel.json`
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- `components/earth/Globe.tsx` (boş canvas iskelet)
- `components/landing/*.tsx` (boş section iskeletleri)
- `store/*.ts` (iskelet)
- `lib/utils/cn.ts`, `format.ts`
- `.env.local.example`, `.gitignore`

**Görevler:**

1. Next.js 14 App Router + TypeScript strict
2. Tailwind config: editorial light theme, CSS variables
3. Tüm klasör yapısını oluştur
4. Fontlar: Fraunces (display serif) + Inter (sans) + JetBrains Mono (`next/font`)
5. **Landing page iskeleti** (`app/page.tsx`):
   ```tsx
   <main>
     <Nav />
     <Hero />          {/* globe burada */}
     <HowItWorks />
     <BuiltWith />
     <Footer />
   </main>
   ```
6. **Globe canvas iskelet:**
   ```tsx
   <Canvas
     camera={{ position: [0, 0, 3.2], fov: 35 }}
     gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
     dpr={[1, 2]}
   >
     <color attach="background" args={['#fafaf9']} />
     {/* agents fill */}
   </Canvas>
   ```
   - NOT: arkaplan transparent OR paper rengi — CSS gradient ile birleşecek
7. **Zustand stores:**
   ```ts
   // useGlobeStore: autoRotate, dragging, cameraTarget
   // useLayersStore: { quake: bool, iss: bool, flight: bool }
   // useDataStore: events by layer
   // useUIStore: selectedEvent
   ```
8. Hero placeholder: başlık + boş globe alanı
9. ESLint + Prettier + Husky

**Acceptance Criteria:**
- `pnpm dev` çalışıyor, paper-beyaz zeminde boş canvas
- `pnpm build` başarılı, 0 type error
- Landing section'lar yerinde (boş ama doğru sırada)
- Fontlar yüklü (Fraunces hero'da görünür)
- Stores devtools'ta

---

### 🎨 AJAN 2 — THE AESTHETICIAN

**Rol:** Gri/beyaz editorial design system. Landing UI component'leri, nav, hero metni, pills, footer.

**Sahip Olduğu Dosyalar:**
- `app/globals.css` (CSS variables, background treatment)
- `components/ui/primitives/*.tsx` (Pill, Badge, Glass, Tooltip)
- `components/landing/Nav.tsx`, `HeroHeadline.tsx`, `LayerPills.tsx`, `LiveStats.tsx`, `HowItWorks.tsx`, `BuiltWith.tsx`, `Footer.tsx`
- `components/ui/EventCard.tsx`

**Görevler:**

1. **CSS Variables:** Editorial light palette, typography, layout
2. **Background Treatment:**
   - Radial gradient (paper center → paper-edge)
   - Opsiyonel: subtle dot grid (opacity 0.03)
   - Opsiyonel: hafif film grain
3. **Nav:**
   - Sticky, glass-light (backdrop-blur, white/60)
   - Logo (MARBLE — clean wordmark) + About + GitHub linkleri
   - Minimal, ince border-bottom hairline
4. **Hero Headline:**
   - Editorial serif (Fraunces), büyük, ortada
   - "A live portrait of Earth" tarzı
   - Alt başlık (sans, ink-soft)
   - Fade-up reveal (Motion Director bağlayacak)
5. **Layer Pills:**
   - Refined pills: renk dot + isim + (event count)
   - Active: ink border + filled dot
   - Inactive: hairline border + outline dot
   - Hover: subtle lift
6. **Live Stats:**
   - Yatay şerit: "147 events today · M6.2 max · ● live"
   - Mono font sayılar
   - "live" yanında yeşil pulse dot
7. **Event Card:**
   - Globe'da event tıklanınca beliren kart
   - Beyaz surface, soft shadow, radius
   - Layer renk indicator + tip
   - Magnitude (büyük, mono) + koordinat + konum + time-ago
   - USGS link
   - Close + Esc
8. **How It Works section:**
   - Editorial: başlık + 3 sütun (USGS, ISS, OpenSky açıklamaları)
   - Bol beyaz alan
9. **Built With section:**
   - Tech stack zarif listesi
   - "Three.js · NASA textures · custom PBR shaders · USGS · OpenSky"
10. **Footer:**
    - Minimal: MARBLE · by kutluhan.gil · GitHub · LinkedIn
    - Hairline üst border

**Acceptance Criteria:**
- Tüm landing UI editorial light estetiğinde tutarlı
- Hero serif tipografi premium görünüyor
- Background radial gradient derinlik veriyor
- Pills ve stats refined
- Mobile responsive (hero stack, globe küçülür)
- Accessibility 100

---

### 🌍 AJAN 3 — THE EARTH SMITH

**Rol:** Dünya yüzeyi. Texture'lar, PBR shading, relief, okyanus glint, bulutlar. **Bu projenin teknik kalbi — gerçekçilik buradan gelir.**

**Sahip Olduğu Dosyalar:**
- `components/earth/Globe.tsx` (mount logic)
- `components/earth/Earth.tsx`
- `components/earth/Clouds.tsx`
- `components/earth/shaders/earth.vert.glsl`, `earth.frag.glsl`
- `lib/textures/loader.ts`
- `lib/geo/sun-position.ts`
- `public/textures/*` (NASA texture'ları indir + optimize)

**Görevler:**

1. **Texture Hazırlama:**
   - NASA Blue Marble (day) → 4K JPG, optimize
   - NASA topography → normal map 4K
   - Roughness map (land/ocean) → 2K
   - NASA Black Marble (night) → 4K
   - Cloud composite → 4K PNG (alpha)
   - Bathymetry → 2K
   - Hepsi `sharp` ile optimize, `public/textures/`
   - Texture loader: anisotropy 16x, correct color space (sRGB albedo, linear data maps)

2. **Earth Mesh:**
   - SphereGeometry(1, 128, 128) — smooth silhouette
   - Custom ShaderMaterial VEYA MeshStandardMaterial + onBeforeCompile injection

3. **Earth Fragment Shader** (`earth.frag.glsl`):
   - **Albedo:** day texture
   - **Normal mapping:** dağlar ışık yakalar (TBN matrix)
   - **Day/night blend:**
     ```glsl
     float sunDot = dot(normal, sunDirection);
     float dayFactor = smoothstep(-0.15, 0.25, sunDot);
     vec3 dayColor = texture(dayMap, vUv).rgb;
     vec3 nightColor = texture(nightMap, vUv).rgb * cityLightBoost;
     // night side: koyu mavi-gri + city lights (pure black DEĞİL)
     vec3 nightBase = mix(vec3(0.04, 0.05, 0.08), nightColor, nightLightMask);
     vec3 surface = mix(nightBase, dayColor, dayFactor);
     ```
   - **Ocean glint (specular):**
     ```glsl
     // sadece okyanusta (roughness map), güneş yönünde
     float oceanMask = 1.0 - texture(roughnessMap, vUv).r;
     vec3 reflectDir = reflect(-sunDirection, normal);
     float glint = pow(max(dot(reflectDir, viewDir), 0.0), 80.0) * oceanMask;
     surface += glint * sunColor * dayFactor;
     ```
   - **Terminator warmth:** terminator yakınında hafif sıcak ton (gün batımı)
   - **Roughness:** okyanus düşük, kara yüksek

4. **Sun Position** (`sun-position.ts`):
   - Gerçek tarih → subsolar point (declination + hour angle)
   - sunDirection uniform + DirectionalLight için
   - Gerçek zamanlı terminator

5. **Cloud Layer** (`Clouds.tsx`):
   - Sphere radius 1.003
   - Cloud texture, alpha transparent
   - Bağımsız yavaş rotasyon (parallax)
   - **Cloud shadows:** cloud map'i yüzey shading'inde kullan (advanced — bulutlar yüzeye gölge düşürür)
   - Gece tarafında bulutlar koyulaşır

6. **Auto-rotation:**
   - Earth + clouds yavaş döner (useFrame)
   - useGlobeStore.autoRotate kontrolü
   - Drag sırasında durur (Cartographer bağlayacak)

7. **Quality:**
   - Anisotropic filtering (grazing angle netlik)
   - Mipmaps
   - sRGB color space doğru

**Acceptance Criteria:**
- Earth fotorealistik (Blue Marble seviyesi)
- Dağlar terminator yakınında kabartmalı (normal map)
- Okyanusta güneş glint'i var
- Gündüz/gece terminatörü gerçek saate göre
- Gece tarafı koyu ama pure black değil, şehir ışıkları var
- Bulutlar bağımsız dönüyor + (mümkünse) gölge düşürüyor
- Yavaş otomatik rotasyon
- 60fps

---

### 💡 AJAN 4 — THE LIGHT & ATMOSPHERE

**Rol:** Stüdyo aydınlatma, atmosfer, post-processing, contact shadow. **"Floating marble" premium görünümü buradan gelir.**

**Sahip Olduğu Dosyalar:**
- `components/earth/Lighting.tsx`
- `components/earth/Atmosphere.tsx`
- `components/earth/ContactShadow.tsx`
- `components/earth/PostFX.tsx`
- `components/earth/shaders/atmosphere.vert.glsl`, `atmosphere.frag.glsl`

**Görevler:**

1. **Studio Lighting (3-point):**
   - **Key light:** DirectionalLight güneş yönünde (Earth Smith'in sunDirection'ı ile sync), intensity yüksek
   - **Fill light:** HemisphereLight veya soft ambient → gece tarafı görünür kalır, light bg ile uyumlu
   - **Rim light:** Arkadan ince DirectionalLight → silhouette ve atmosfer parlar
   - **Environment:** Çok hafif gradient environment (Drei `<Environment>`) → PBR yansımalar doğal
   - Light bg'de Earth'ün "yüzen obje" hissi için doğru exposure

2. **Atmosphere (Light Theme Special):**
   - BackSide sphere, radius 1.015
   - `atmosphere.frag.glsl`:
     ```glsl
     float fresnel = pow(1.0 - dot(normal, viewDir), 2.5);
     // DÜŞÜK yoğunluk — light bg'de boğulmamalı
     vec3 atmoColor = mix(vec3(0.75, 0.85, 0.95), vec3(0.6, 0.75, 0.9), fresnel);
     float alpha = fresnel * 0.4;  // çok subtle
     // güneş yönünde biraz daha parlak
     gl_FragColor = vec4(atmoColor, alpha);
     ```
   - Delikat, gümüşi-mavi ince rim
   - Gerçek atmosferin gündüz fotoğraftaki hali

3. **Contact Shadow:**
   - Globe altında yumuşak bulanık gölge
   - Drei `<ContactShadows>` VEYA custom shadow-catcher plane VEYA CSS blur ellipse
   - Bu, gezegenin "yüzdüğü" premium hissini verir
   - Opacity, blur, scale tuning

4. **Post-Processing** (`PostFX.tsx`):
   - **Tone mapping:** ACES Filmic (Canvas'ta ayarlı)
   - **Bloom:** Çok hafif (sadece sun glint + city lights için), threshold yüksek
   - **SMAA:** Anti-aliasing (kenarlar tertemiz)
   - **Vignette:** Çok subtle (opsiyonel, light bg'de hafif)
   - **Color grading:** Hafif warm, editorial film hissi (opsiyonel LUT)

5. **Exposure & Balance:**
   - Light bg ile Earth'ün dengesini ayarla
   - Earth ne çok parlak ne çok karanlık
   - Premium product-render dengesi

**Acceptance Criteria:**
- Earth stüdyo ışığında "yüzen mücevher" gibi görünüyor
- Atmosfer rim ince, zarif, light bg'de boğulmuyor
- Contact shadow gezegeni yüzdürüyor
- Kenarlar tertemiz (SMAA)
- Tone mapping renkleri gerçekçi
- Genel görünüm: "render mı fotoğraf mı?" tepkisi
- 60fps korunuyor

---

### 🧭 AJAN 5 — THE CARTOGRAPHER

**Rol:** Coğrafi veri → 3D. Nokta/ark/ring rendering, kamera, etkileşim (drag, hover, click).

**Sahip Olduğu Dosyalar:**
- `lib/geo/coordinates.ts`, `arc.ts`, `satellite.ts`
- `components/layers/PointLayer.tsx`, `ArcLayer.tsx`, `RingLayer.tsx`, `ISSMarker.tsx`
- `components/earth/Globe.tsx` (camera + controls + interaction bağlama)

**Görevler:**

1. **Coordinate Conversion** (`coordinates.ts`):
   ```ts
   function latLngToVector3(lat, lng, radius = 1, alt = 0): Vector3 {
     const phi = (90 - lat) * Math.PI / 180;
     const theta = (lng + 180) * Math.PI / 180;
     const r = radius + alt;
     return new Vector3(
       -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
     );
   }
   ```
   - Earth rotation ile sync (globe dönerken noktalar da döner — noktalar Earth'ün child'ı)

2. **Point Layer (Instanced):**
   - Depremler: InstancedMesh, magnitude → scale
   - Renk: `--data-quake` (refined kırmızı), magnitude'a göre yoğunluk
   - Spawn animation: scale 0→1 spring
   - Subtle glow (light bg'de delikat)
   - Hover: highlight + scale up
   - Click: event seç

3. **Arc Layer:**
   - Uçuşlar / great circle arcs
   - `arc.ts`: great circle points + yükseklik
   - Refined ink-gri renk (`--data-flight`)
   - Progressive draw animation
   - Gradient opacity (uçlar soluk)

4. **Ring Layer:**
   - Yeni deprem → genişleyen halka (deprem dalgası hissi)
   - RingGeometry, scale + fade
   - 2-3s sonra kaybolur

5. **ISS Marker:**
   - GLB model (low-poly) VEYA zarif nokta + amber renk
   - `satellite.js` ile gerçek pozisyon
   - Orbit path çizgisi (ince, kesikli)
   - Yörüngede hareket

6. **Camera & Controls:**
   - OrbitControls (Drei): drag rotate, sınırlı zoom, no pan
   - Auto-rotate ile entegrasyon: drag sırasında auto durur, bırakınca devam (gecikme ile)
   - Damping (yumuşak)
   - Zoom limits

7. **Interaction:**
   - Raycaster: hover detection
   - Hover → tooltip (Aesthetician'ın Tooltip'i)
   - Click → event seç → useUIStore → EventCard açılır
   - Click → opsiyonel: kamera o noktaya hafif döner

**Acceptance Criteria:**
- lat/lng → 3D doğru (bilinen şehirler doğru yerde)
- Noktalar Earth ile birlikte dönüyor (child relationship)
- 1000+ nokta 60fps (instanced)
- Arc'lar great circle
- ISS gerçek pozisyonda, yörüngede
- Drag rotate çalışıyor, auto-rotate ile uyumlu
- Hover tooltip + click event card

---

### 📡 AJAN 6 — THE DATA PIPELINE

**Rol:** Real-time veri. USGS, ISS, OpenSky API proxy + polling.

**Sahip Olduğu Dosyalar:**
- `app/api/earthquakes/route.ts`, `iss/route.ts`, `flights/route.ts`
- `lib/data/sources/*.ts`
- `lib/data/normalize.ts`
- `lib/data/poller.ts`
- `.env.local.example`

**Görevler:**

1. **API Proxy Routes** (CORS + cache):
   - `/api/earthquakes` → USGS all_day feed, edge cache 60s
   - `/api/iss` → wheretheiss.at, cache 5s
   - `/api/flights` → OpenSky, cache 15s, rate limit handling, opsiyonel auth
   - Error handling, timeout, fallback

2. **Source Adapters:**
   - `fetchEarthquakes()`, `fetchISS()`, `fetchFlights()`
   - Her biri raw veri döner

3. **Normalization** (`normalize.ts`):
   - Hepsi → `GeoPoint` formatı
   - Deprem: magnitude, depth, place, url
   - ISS: lat/lng/alt, velocity
   - Uçuş: callsign, altitude, velocity, heading

4. **Polling Manager** (`poller.ts`):
   - Aktif katmanlar için ayrı interval
   - Sadece toggle açık katmanlar polling
   - Tab gizliyse durur (Page Visibility)
   - Exponential backoff
   - Yeni veri → useDataStore

5. **OpenSky Rate Limit:**
   - Anonim: agresif rate limit → 15s polling + cache
   - Opsiyonel auth (env credentials) ile artırılabilir

**Acceptance Criteria:**
- Depremler USGS'ten, 60s güncelleme
- ISS canlı (5s)
- Uçuşlar OpenSky (rate limit'e takılmadan)
- Tümü GeoPoint'e normalize
- API key'ler client'a sızmıyor
- Tab gizliyken polling duruyor

---

### 🎛️ AJAN 7 — THE LAYER CONDUCTOR

**Rol:** Katman kontrolü. Pills, canlı stats, event card logic.

**Sahip Olduğu Dosyalar:**
- `store/useLayersStore.ts` (tam)
- `store/useUIStore.ts` (tam)
- `components/landing/LayerPills.tsx` (logic)
- `components/landing/LiveStats.tsx` (logic)
- `components/ui/EventCard.tsx` (logic)

**Görevler:**

1. **Layer System:**
   - 3 katman: Earthquakes, ISS, Flights
   - Toggle → poller başlat/durdur (Agent 6 ile)
   - Çoklu aktif olabilir
   - State persiste (localStorage)

2. **Layer Pills (logic):**
   - Toggle aksiyon
   - Event count canlı (her katmanın aktif event sayısı)
   - Active/inactive görsel state

3. **Live Stats (logic):**
   - Aktif katman istatistikleri
   - Deprem: bugünkü toplam, en büyük magnitude, son saat
   - ISS: yükseklik, hız, şu an üzerinde olduğu bölge (reverse geocode opsiyonel)
   - Canlı güncelleme
   - "live" pulse indicator

4. **Event Card (logic):**
   - Click event → useUIStore.selectedEvent
   - Layer'a göre içerik
   - Deprem: M6.2, depth, place, time, USGS link
   - Uçuş: callsign, altitude, speed
   - Close → deselect

**Acceptance Criteria:**
- 3 katman toggle, çoklu aktif
- Pills event count canlı gösteriyor
- Live stats güncelleniyor (deprem sayısı, max magnitude)
- Event click → doğru detail card
- "live" indicator pulse atıyor

---

### 🎬 AJAN 8 — THE MOTION DIRECTOR

**Rol:** Landing page hareketi. Smooth scroll, section reveal'lar, globe motion polish, hero animation.

**Sahip Olduğu Dosyalar:**
- `components/motion/SmoothScroll.tsx` (Lenis)
- `components/motion/Reveal.tsx`
- `components/landing/Hero.tsx` (animation orchestration)
- Globe motion polish (useGlobeStore ile)

**Görevler:**

1. **Smooth Scroll (Lenis):**
   - Lenis provider, premium yumuşak scroll
   - RAF entegrasyonu

2. **Hero Reveal:**
   - Sayfa yüklendiğinde: başlık fade-up (stagger), globe fade-in + scale
   - Editorial timing: yavaş, zarif
   - `cubic-bezier(0.16, 1, 0.3, 1)`

3. **Section Reveal:**
   - `Reveal` component: Intersection Observer
   - HowItWorks, BuiltWith → scroll'da fade up 24px
   - Stagger (alt elementler sırayla)

4. **Globe Motion Polish:**
   - Auto-rotate easing (sabit hız değil, çok hafif breathing)
   - Drag → auto durur, bırakınca 1.5s sonra yavaşça devam
   - Scroll davranışı: hero'da globe sabit; aşağı scroll'da opsiyonel olarak hafif küçülme/parallax (advanced)

5. **Micro-interactions:**
   - Pill hover lift
   - Stat sayı değişiminde count-up animation
   - Event card spring entrance

6. **Reduced Motion:**
   - `prefers-reduced-motion` → animasyonları kapat/azalt
   - Accessibility

**Acceptance Criteria:**
- Smooth scroll premium hissediyor
- Hero reveal zarif (başlık + globe stagger)
- Section'lar scroll'da fade up
- Globe drag/auto-rotate geçişi yumuşak
- Reduced motion destekleniyor
- Hiçbir animasyon jank yapmıyor

---

### ✨ AJAN 9 — THE POLISHER

**Rol:** Son rötuş. Vercel deploy, SEO, performance, README.

**Sahip Olduğu Dosyalar:**
- `vercel.json`, `next.config.js` (production)
- `app/layout.tsx` (metadata)
- `app/sitemap.ts`, `app/robots.ts`
- `app/api/og/route.tsx`
- `public/og.png`, `favicon.svg`
- `README.md`, `LICENSE`

**Görevler:**

1. **SEO Meta:**
   - Title: "MARBLE — A Live Portrait of Earth"
   - Description: "Real-time earthquakes, the ISS, and flight traffic on the most realistic Earth you've seen in a browser. Built with Three.js and NASA imagery."
   - OG image: globe render (light theme, hero shot)
   - Twitter card, JSON-LD WebApplication

2. **Dynamic OG Image:**
   - `/api/og` → light theme globe + başlık
   - 1200x630, edge cache

3. **Performance:**
   - **Texture optimizasyon kritik:** 4K JPG'ler ağır → progressive load (1K placeholder → 4K), opsiyonel KTX2/Basis
   - Three.js dynamic import
   - Texture preload (hero için kritik)
   - Adaptive: mobile'da 2K texture
   - `next/image` landing görselleri
   - Lenis + R3F RAF tek loop

4. **Lighthouse Hedefleri:**
   - Performance: 85+ (3D ağır, texture'lar büyük)
   - Accessibility: 100
   - Best Practices: 100
   - SEO: 100

5. **Vercel Config:**
   ```json
   {
     "framework": "nextjs",
     "regions": ["fra1"],
     "functions": {
       "app/api/og/route.tsx": { "runtime": "edge" }
     }
   }
   ```

6. **Environment Variables:**
   ```
   OPENSKY_USERNAME=    (opsiyonel, rate limit)
   OPENSKY_PASSWORD=
   NEXT_PUBLIC_SITE_URL=
   ```

7. **WebGL Fallback:**
   - WebGL desteklemeyen tarayıcıda: statik güzel Earth görseli + mesaj

8. **README** (LinkedIn-ready):
   - Banner (globe hero shot)
   - Features
   - "The realism breakdown" — texture'lar, shader teknikleri (eğitici)
   - Data sources credit (NASA, USGS, OpenSky)
   - Tech stack
   - Quick start
   - License (MIT)

9. **Custom Domain:**
   - Öneriler: `marble.earth`, `marble.live`, `seemarble.com`, `marbleglobe.dev`

10. **Launch Checklist:**
    - [ ] Texture'lar optimize (toplam <10MB)
    - [ ] Earth realistik görünüyor (kalite kontrol listesi)
    - [ ] Custom domain SSL
    - [ ] OG preview test
    - [ ] Mobile responsive + smooth
    - [ ] WebGL fallback
    - [ ] Lighthouse 85+
    - [ ] GitHub public + README
    - [ ] LinkedIn post (globe rotating, light theme — dikkat çeker)
    - [ ] HN Show HN draft

**Acceptance Criteria:**
- Vercel deploy başarılı, custom domain aktif
- Texture'lar optimize, hızlı yükleniyor
- OG image LinkedIn'de doğru
- Lighthouse hedefleri tutuyor
- Mobile responsive
- README "realism breakdown" içeriyor (eğitici + etkileyici)

---

## ⚡ PERFORMANS HEDEFLERİ

| Metrik | Hedef |
|---|---|
| Lighthouse Performance | ≥ 85 (3D + texture ağır) |
| Lighthouse SEO / A11y | 100 |
| First Contentful Paint | < 1.5s |
| Globe ilk görünüm | < 2.5s (texture yükleme) |
| Globe render | 60fps |
| 1000+ event render | 60fps (instanced) |
| Texture total | < 10MB (optimize) |
| First Load JS | < 280KB (Three.js dynamic) |
| Mobile | 60fps mid-range (2K texture) |

### Optimizasyon Stratejileri

- Progressive texture loading (1K → 4K)
- Adaptive texture resolution (mobile 2K)
- Instanced rendering (noktalar)
- Polling pause hidden tab
- Texture preload + cache
- SMAA (MSAA'dan ucuz)
- LOD opsiyonel (uzaktan az segment)

---

## 🚀 VERCEL DEPLOY

### Step-by-Step

1. **Repo + Vercel Import** (Next.js auto-detect)
2. **Environment Variables:**
   ```
   OPENSKY_USERNAME       (opsiyonel — uçuş rate limit)
   OPENSKY_PASSWORD
   NEXT_PUBLIC_SITE_URL   https://marble.earth
   ```
3. **Edge Functions:** OG route edge
4. **Custom Domain:**
   - Öneriler: `marble.earth`, `marble.live`, `seemarble.com`
   - DNS + SSL otomatik
5. **Analytics:** Vercel Analytics + Speed Insights

### Domain Önerileri

- **marble.earth** — isimle birebir, .earth tld konuya uygun
- **marble.live** — canlı veri vurgusu
- **seemarble.com** — davet edici

### Maliyet

- Vercel Hobby: $0
- Tüm API'ler ücretsiz
- NASA texture'ları public domain (ücretsiz)
- Domain: ~$15-30/yıl

---

## 📝 README ŞABLONU

```markdown
# 🌐 MARBLE

> A live portrait of Earth. Real-time data on the most realistic planet you've seen in a browser.

[![Live Demo](https://img.shields.io/badge/demo-marble.earth-18181b)](https://marble.earth)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

![MARBLE Banner](public/banner.png)

## ✨ Features

- 🌍 **Hyper-realistic Earth** — NASA 8K textures, custom PBR shaders, studio lighting
- 🪨 **Editorial light design** — the planet as a museum piece, not a sci-fi dashboard
- 🌗 **Real-time terminator** — accurate day/night line, city lights, ocean sun-glint
- ☁️ **Animated clouds** — independent rotation, cloud shadows on the surface
- 📡 **Live data** — earthquakes (USGS), the ISS, flight traffic (OpenSky)
- 🎬 **Calm motion** — slow rotation, smooth scroll, gentle reveals

## 🔬 The Realism Breakdown

MARBLE's Earth uses: albedo (Blue Marble), normal mapping (topography),
roughness split (reflective oceans, matte land), specular sun-glint,
a separate animated cloud layer with surface shadows, a real-time solar
terminator, and a subtle daylight atmosphere — all under 3-point studio
lighting with ACES tone mapping.

## 🛰 Data Sources

USGS (earthquakes) · NASA (Earth textures) · wheretheiss.at (ISS) · OpenSky (flights)

## 🚀 Quick Start

\`\`\`bash
git clone https://github.com/kutluhangil/marble
cd marble
pnpm install
pnpm dev
\`\`\`

## 🛠️ Tech Stack

Next.js 14 · TypeScript · Three.js · React Three Fiber · custom PBR/GLSL · Lenis · Vercel

## 🙏 Inspiration

NASA's Blue Marble, Apple product pages, NYT data journalism, the overview effect.

## 📄 License

MIT — fork it, learn from it, build your own planet.

---

Made with care by [@kutluhangil](https://github.com/kutluhangil) · [LinkedIn](https://linkedin.com/in/kutluhangil)
```

---

## 🗓️ İMPLEMENTASYON SIRASI (Claude Code İçin)

Her ajan ayrı Claude Code session. Session sonu commit.

```
Day 1-2:   Agent 1 (Architect)          → "feat: scaffold + landing structure"
Day 3-4:   Agent 2 (Aesthetician)       → "feat: editorial light design system"
Day 5-8:   Agent 3 (Earth Smith)        → "feat: hyper-realistic earth surface"  (EN KRİTİK)
Day 9-10:  Agent 4 (Light & Atmosphere) → "feat: studio lighting + atmosphere"
Day 11-13: Agent 5 (Cartographer)       → "feat: geo + data rendering + camera"
Day 14:    Agent 6 (Data Pipeline)      → "feat: USGS/ISS/OpenSky APIs"
Day 15:    Agent 7 (Layer Conductor)    → "feat: layers + stats + event card"
Day 16-17: Agent 8 (Motion Director)    → "feat: smooth scroll + reveals + motion"
Day 18-19: Agent 9 (Polisher)           → "chore: deploy + SEO + perf"
Day 20:    Launch
```

**~3 hafta solo dev.** Agent 3 + 4 (Earth Smith + Light & Atmosphere) bu projenin can damarı — gezegen gerçekçi görünmezse hiçbir şey kurtarmaz. Texture optimizasyonu, shader tuning, ışık dengesine bol zaman ayır. "Render mı fotoğraf mı?" testini geçene kadar uğraş.

---

## 🎬 SON SÖZ

Bu proje bittiğinde elinde:

- 🟢 Sektörün dark globe'larından ayrışan, editorial light bir başyapıt
- 🟢 "Render mı fotoğraf mı?" dedirten hiper-gerçekçi bir Dünya
- 🟢 Premium product-shot estetiği (yüzen mücevher)
- 🟢 Gerçek API'lerle canlı veri
- 🟢 LinkedIn'de **herkes dark yaparken senin light yapman** dikkat çeker
- 🟢 Show HN potansiyeli
- 🟢 README'deki "realism breakdown" hem eğitici hem etkileyici
- 🟢 9 farklı teknik alanda derinleşmiş kas:
  - PBR shading & custom GLSL
  - NASA texture pipeline & optimization
  - Studio lighting (3-point)
  - Atmospheric & terminator shading
  - Coğrafi koordinat matematiği
  - Real-time data integration
  - Editorial design system (light theme — zor olan)
  - Smooth scroll & premium motion
  - Performance (büyük texture'lar)

**Şimdi başla. Agent 1'i Claude Code'a hand off et.**

```
~/marble ➜  pnpm create next-app marble --typescript --tailwind --app
[+] scaffolding...
[+] beginning Agent 1: The Architect
[+] target acquired: a pale blue dot, lit like a jewel 🌐
```

---

`end of blueprint` · `v1.0.0` · `built with ❤️ for kutluhan.gil`
