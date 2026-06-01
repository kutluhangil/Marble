export type Lang = 'en' | 'tr';

export interface Dict {
  nav: { about: string };
  hero: { title: string; subtitle: string; noWebgl: string };
  pills: {
    quake: string;
    iss: string;
    weather: string;
    flight: string;
    volcano: string;
    fire: string;
    na: string;
  };
  stats: {
    quakes: (n: number) => string;
    max: (m: string) => string;
    iss: (s: string) => string;
    live: string;
  };
  how: {
    title: string;
    intro: string;
    sources: { name: string; desc: string; cadence: string }[];
  };
  built: { title: string; body: string };
  footer: { tagline: string };
  style: { realistic: string; illustrated: string; atlas: string };
  time: { caption: string; now: string };
  card: {
    layer: {
      quake: string;
      iss: string;
      weather: string;
      flight: string;
      volcano: string;
      fire: string;
    };
    depth: string;
    category: string;
    location: string;
    when: string;
    altitude: string;
    speed: string;
    over: string;
    conditions: string;
    position: string;
    heading: string;
    viewUsgs: string;
    close: string;
    wmo: Record<number, string>;
  };
}

const en: Dict = {
  nav: { about: 'About' },
  hero: {
    title: 'A live portrait of Earth',
    subtitle:
      'Real-time data on the most realistic planet you’ve seen in a browser.',
    noWebgl: 'Your browser doesn’t support WebGL — showing a still image.',
  },
  pills: {
    quake: 'Earthquakes',
    iss: 'ISS',
    weather: 'Weather',
    flight: 'Flights',
    volcano: 'Volcanoes',
    fire: 'Wildfires',
    na: 'n/a',
  },
  stats: {
    quakes: (n) => `${n} quakes today`,
    max: (m) => `M${m} max`,
    iss: (s) => `ISS ${s} km/h`,
    live: 'live',
  },
  how: {
    title: 'How it works',
    intro:
      'Every layer is drawn from a public, real-time source and refreshed while you watch.',
    sources: [
      { name: 'USGS', desc: 'Earthquakes from the past 24 hours.', cadence: 'every 60s' },
      { name: 'wheretheiss.at', desc: 'Live International Space Station position.', cadence: 'every 5s' },
      { name: 'Open-Meteo', desc: 'Current conditions across major cities.', cadence: 'every 5m' },
      { name: 'OpenSky', desc: 'Live flight traffic (optional).', cadence: 'every 15s' },
    ],
  },
  built: {
    title: 'Built with',
    body: 'Three.js · React Three Fiber · custom PBR shading · NASA Blue Marble and Black Marble imagery · a real-time solar terminator · USGS · Open-Meteo · OpenSky.',
  },
  footer: { tagline: 'A live portrait of Earth' },
  style: { realistic: 'Realistic', illustrated: 'Illustrated', atlas: 'Atlas' },
  time: { caption: 'Sun', now: 'now' },
  card: {
    layer: {
      quake: 'Earthquake',
      iss: 'International Space Station',
      weather: 'Weather',
      flight: 'Flight',
      volcano: 'Volcano',
      fire: 'Wildfire',
    },
    depth: 'Depth',
    category: 'Category',
    location: 'Location',
    when: 'When',
    altitude: 'Altitude',
    speed: 'Speed',
    over: 'Over',
    conditions: 'Conditions',
    position: 'Position',
    heading: 'Heading',
    viewUsgs: 'View on USGS',
    close: 'Close',
    wmo: {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime fog',
      51: 'Light drizzle',
      61: 'Light rain',
      63: 'Rain',
      65: 'Heavy rain',
      71: 'Light snow',
      73: 'Snow',
      80: 'Rain showers',
      95: 'Thunderstorm',
    },
  },
};

const tr: Dict = {
  nav: { about: 'Hakkında' },
  hero: {
    title: 'Dünya’nın canlı portresi',
    subtitle:
      'Tarayıcıda gördüğünüz en gerçekçi gezegen üzerinde gerçek zamanlı veriler.',
    noWebgl: 'Tarayıcınız WebGL desteklemiyor — sabit görsel gösteriliyor.',
  },
  pills: {
    quake: 'Depremler',
    iss: 'ISS',
    weather: 'Hava',
    flight: 'Uçuşlar',
    volcano: 'Volkanlar',
    fire: 'Yangınlar',
    na: 'yok',
  },
  stats: {
    quakes: (n) => `bugün ${n} deprem`,
    max: (m) => `M${m} maks`,
    iss: (s) => `ISS ${s} km/sa`,
    live: 'canlı',
  },
  how: {
    title: 'Nasıl çalışır',
    intro:
      'Her katman herkese açık, gerçek zamanlı bir kaynaktan çiziliyor ve siz izlerken yenileniyor.',
    sources: [
      { name: 'USGS', desc: 'Son 24 saatteki depremler.', cadence: '60sn’de bir' },
      { name: 'wheretheiss.at', desc: 'Uluslararası Uzay İstasyonu’nun canlı konumu.', cadence: '5sn’de bir' },
      { name: 'Open-Meteo', desc: 'Büyük şehirlerde anlık hava durumu.', cadence: '5dk’da bir' },
      { name: 'OpenSky', desc: 'Canlı uçuş trafiği (opsiyonel).', cadence: '15sn’de bir' },
    ],
  },
  built: {
    title: 'Kullanılan teknolojiler',
    body: 'Three.js · React Three Fiber · özel PBR gölgeleme · NASA Blue Marble ve Black Marble görüntüleri · gerçek zamanlı gündoğumu çizgisi · USGS · Open-Meteo · OpenSky.',
  },
  footer: { tagline: 'Dünya’nın canlı portresi' },
  style: { realistic: 'Gerçekçi', illustrated: 'İllüstrasyon', atlas: 'Atlas' },
  time: { caption: 'Güneş', now: 'şimdi' },
  card: {
    layer: {
      quake: 'Deprem',
      iss: 'Uluslararası Uzay İstasyonu',
      weather: 'Hava Durumu',
      flight: 'Uçuş',
      volcano: 'Volkan',
      fire: 'Yangın',
    },
    depth: 'Derinlik',
    category: 'Kategori',
    location: 'Konum',
    when: 'Zaman',
    altitude: 'Yükseklik',
    speed: 'Hız',
    over: 'Üzerinde',
    conditions: 'Koşullar',
    position: 'Konum',
    heading: 'Yön',
    viewUsgs: 'USGS’de görüntüle',
    close: 'Kapat',
    wmo: {
      0: 'Açık',
      1: 'Çoğunlukla açık',
      2: 'Parçalı bulutlu',
      3: 'Kapalı',
      45: 'Sis',
      48: 'Kırağılı sis',
      51: 'Hafif çisenti',
      61: 'Hafif yağmur',
      63: 'Yağmur',
      65: 'Şiddetli yağmur',
      71: 'Hafif kar',
      73: 'Kar',
      80: 'Sağanak',
      95: 'Gök gürültülü fırtına',
    },
  },
};

export const dictionaries: Record<Lang, Dict> = { en, tr };
