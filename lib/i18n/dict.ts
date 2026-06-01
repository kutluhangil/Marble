import type { Layer } from '@/lib/data/types';

export type Lang = 'en' | 'tr';

interface LayerInfo {
  desc: string;
  source: string;
  updates: string;
  coverage: string;
}

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
  actions: { share: string; copied: string; screenshot: string };
  theme: { toggle: string };
  layerInfo: Record<Layer, LayerInfo>;
  infoLabels: {
    source: string;
    updates: string;
    coverage: string;
    status: string;
    learnMore: string;
  };
  status: { live: string; idle: string; unavailable: string };
  panel: {
    nearestCity: string;
    tsunami: string;
    alert: string;
    latitude: string;
    longitude: string;
    localTime: string;
    period: string;
    inclination: string;
    crewAboard: string;
    temperature: string;
    feelsLike: string;
    humidity: string;
    wind: string;
    pressure: string;
    sunrise: string;
    sunset: string;
    population: string;
    elevation: string;
    timezone: string;
    aboutLocation: string;
    coordinates: string;
    detected: string;
    yes: string;
    no: string;
    magBands: Record<
      'minor' | 'light' | 'moderate' | 'strong' | 'major',
      { label: string; blurb: string }
    >;
    issAbout: string;
    fireAbout: string;
  };
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
  actions: { share: 'Share', copied: 'Copied!', screenshot: 'Save PNG' },
  theme: { toggle: 'Toggle theme' },
  layerInfo: {
    quake: {
      desc: 'Live earthquake activity detected worldwide over the last 24 hours.',
      source: 'USGS Earthquake Hazards Program',
      updates: 'Every 60 seconds',
      coverage: 'Global',
    },
    iss: {
      desc: 'Real-time position and orbital path of the International Space Station.',
      source: 'wheretheiss.at',
      updates: 'Every 5 seconds',
      coverage: 'Orbital, worldwide',
    },
    weather: {
      desc: 'Current conditions sampled from major cities around the globe.',
      source: 'Open-Meteo',
      updates: 'Every 5 minutes',
      coverage: 'Major cities worldwide',
    },
    flight: {
      desc: 'Live commercial aircraft positions.',
      source: 'OpenSky Network',
      updates: 'Every 15 seconds',
      coverage: 'Europe (sample)',
    },
    volcano: {
      desc: 'Recently active and monitored volcano locations.',
      source: 'NASA EONET',
      updates: 'Every 10 minutes',
      coverage: 'Global',
    },
    fire: {
      desc: 'Active wildfire events detected by satellite monitoring.',
      source: 'NASA EONET',
      updates: 'Every 10 minutes',
      coverage: 'Global',
    },
  },
  infoLabels: {
    source: 'Source',
    updates: 'Updates',
    coverage: 'Coverage',
    status: 'Status',
    learnMore: 'Learn more',
  },
  status: { live: 'Live', idle: 'Idle', unavailable: 'Unavailable' },
  panel: {
    nearestCity: 'Nearest city',
    tsunami: 'Tsunami risk',
    alert: 'Alert level',
    latitude: 'Latitude',
    longitude: 'Longitude',
    localTime: 'Local time',
    period: 'Orbital period',
    inclination: 'Inclination',
    crewAboard: 'Crew aboard',
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    population: 'Population',
    elevation: 'Elevation',
    timezone: 'Time zone',
    aboutLocation: 'About this place',
    coordinates: 'Coordinates',
    detected: 'Detected',
    yes: 'Yes',
    no: 'No',
    magBands: {
      minor: { label: 'Minor', blurb: 'Rarely felt; recorded by instruments.' },
      light: { label: 'Light', blurb: 'Often felt, but seldom causes damage.' },
      moderate: { label: 'Moderate', blurb: 'Can damage weak structures near the epicenter.' },
      strong: { label: 'Strong', blurb: 'Can cause damage in populated areas.' },
      major: { label: 'Major', blurb: 'Capable of serious damage over a large area.' },
    },
    issAbout:
      'The International Space Station orbits Earth roughly every 90 minutes at about 28,000 km/h, some 400 km above the surface.',
    fireAbout:
      'Detected from satellite thermal monitoring. Open events are tracked until contained.',
  },
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
  actions: { share: 'Paylaş', copied: 'Kopyalandı!', screenshot: 'PNG kaydet' },
  theme: { toggle: 'Temayı değiştir' },
  layerInfo: {
    quake: {
      desc: 'Son 24 saatte dünya genelinde algılanan canlı deprem etkinliği.',
      source: 'USGS Deprem Tehlikeleri Programı',
      updates: '60 saniyede bir',
      coverage: 'Küresel',
    },
    iss: {
      desc: 'Uluslararası Uzay İstasyonu’nun gerçek zamanlı konumu ve yörüngesi.',
      source: 'wheretheiss.at',
      updates: '5 saniyede bir',
      coverage: 'Yörünge, dünya geneli',
    },
    weather: {
      desc: 'Dünyadaki büyük şehirlerden alınan anlık hava koşulları.',
      source: 'Open-Meteo',
      updates: '5 dakikada bir',
      coverage: 'Büyük şehirler',
    },
    flight: {
      desc: 'Canlı ticari uçak konumları.',
      source: 'OpenSky Network',
      updates: '15 saniyede bir',
      coverage: 'Avrupa (örnek)',
    },
    volcano: {
      desc: 'Son dönemde aktif ve izlenen volkan konumları.',
      source: 'NASA EONET',
      updates: '10 dakikada bir',
      coverage: 'Küresel',
    },
    fire: {
      desc: 'Uydu izlemesiyle tespit edilen aktif yangın olayları.',
      source: 'NASA EONET',
      updates: '10 dakikada bir',
      coverage: 'Küresel',
    },
  },
  infoLabels: {
    source: 'Kaynak',
    updates: 'Güncelleme',
    coverage: 'Kapsam',
    status: 'Durum',
    learnMore: 'Daha fazla',
  },
  status: { live: 'Canlı', idle: 'Beklemede', unavailable: 'Kullanılamıyor' },
  panel: {
    nearestCity: 'En yakın şehir',
    tsunami: 'Tsunami riski',
    alert: 'Uyarı düzeyi',
    latitude: 'Enlem',
    longitude: 'Boylam',
    localTime: 'Yerel saat',
    period: 'Yörünge süresi',
    inclination: 'Eğim',
    crewAboard: 'Mürettebat',
    temperature: 'Sıcaklık',
    feelsLike: 'Hissedilen',
    humidity: 'Nem',
    wind: 'Rüzgar',
    pressure: 'Basınç',
    sunrise: 'Gün doğumu',
    sunset: 'Gün batımı',
    population: 'Nüfus',
    elevation: 'Yükseklik',
    timezone: 'Saat dilimi',
    aboutLocation: 'Bu yer hakkında',
    coordinates: 'Koordinatlar',
    detected: 'Tespit',
    yes: 'Evet',
    no: 'Hayır',
    magBands: {
      minor: { label: 'Hafif', blurb: 'Nadiren hissedilir; cihazlarla kaydedilir.' },
      light: { label: 'Düşük', blurb: 'Sıkça hissedilir ama nadiren hasar verir.' },
      moderate: { label: 'Orta', blurb: 'Merkez yakınındaki zayıf yapılara hasar verebilir.' },
      strong: { label: 'Şiddetli', blurb: 'Yerleşim alanlarında hasara yol açabilir.' },
      major: { label: 'Büyük', blurb: 'Geniş bir alanda ciddi hasar verebilir.' },
    },
    issAbout:
      'Uluslararası Uzay İstasyonu, yüzeyden ~400 km yükseklikte, saatte yaklaşık 28.000 km hızla Dünya çevresini kabaca 90 dakikada bir dolaşır.',
    fireAbout:
      'Uydu termal izlemesiyle tespit edilir. Açık olaylar kontrol altına alınana dek izlenir.',
  },
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
