export interface WikiResult {
  extract: string;
  thumb?: string;
  url?: string;
}

const cache = new Map<string, WikiResult | null>();

/** Fetch a Wikipedia summary (extract + thumbnail) for a title. Keyless, CORS,
 *  cached per (lang, title). Returns null on miss/disambiguation/error. */
export async function wikiSummary(
  title: string,
  lang: 'en' | 'tr',
): Promise<WikiResult | null> {
  const key = `${lang}:${title}`;
  if (cache.has(key)) return cache.get(key) ?? null;
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    );
    if (!res.ok) {
      cache.set(key, null);
      return null;
    }
    const d = await res.json();
    if (d.type === 'disambiguation' || !d.extract) {
      cache.set(key, null);
      return null;
    }
    const result: WikiResult = {
      extract: d.extract,
      thumb: d.thumbnail?.source,
      url: d.content_urls?.desktop?.page,
    };
    cache.set(key, result);
    return result;
  } catch {
    cache.set(key, null);
    return null;
  }
}
