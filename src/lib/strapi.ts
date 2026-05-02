const STRAPI_URL = (typeof process !== 'undefined' && process.env?.STRAPI_URL) || import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = (typeof process !== 'undefined' && process.env?.STRAPI_TOKEN) || import.meta.env.STRAPI_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = parseInt((typeof process !== 'undefined' && process.env?.STRAPI_CACHE_TTL) || import.meta.env.STRAPI_CACHE_TTL || '60') * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: any): void {
  if (CACHE_TTL <= 0) return;
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

export async function fetchStrapi<T>(
  endpoint: string,
  params: Record<string, string> = {},
  useCache = true,
): Promise<StrapiResponse<T>> {
  const url = new URL(`/api/${endpoint}`, STRAPI_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const cacheKey = url.toString();
  if (useCache) {
    const cached = getCached<StrapiResponse<T>>(cacheKey);
    if (cached) return cached;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`Strapi error: ${res.status} ${res.statusText}`);
  }
  const result = await res.json();
  if (useCache) {
    setCache(cacheKey, result);
  }
  return result;
}

export function strapiImage(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

export interface StrapiBlock {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export async function fetchPageBySlug(slug: string, preview = false) {
  try {
    const params: Record<string, string> = {
      'filters[slug][$eq]': slug,
      'populate[blocks][on][blocks.hero-landing][populate]': '*',
      'populate[blocks][on][blocks.hero-simple][populate]': '*',
      'populate[blocks][on][blocks.trust-bar][populate]': '*',
      'populate[blocks][on][blocks.pillars-grid][populate][pillars][populate]': '*',
      'populate[blocks][on][blocks.comparison-table][populate]': '*',
      'populate[blocks][on][blocks.founder-quote][populate]': '*',
      'populate[blocks][on][blocks.cta-section][populate]': '*',
      'populate[blocks][on][blocks.pricing-grid][populate][plans][populate]': '*',
      'populate[blocks][on][blocks.security-flow][populate][steps][populate]': '*',
      'populate[blocks][on][blocks.primitives-grid][populate]': '*',
      'populate[blocks][on][blocks.threat-model][populate]': '*',
      'populate[blocks][on][blocks.audit-list][populate]': '*',
      'populate[blocks][on][blocks.about-story][populate]': '*',
      'populate[blocks][on][blocks.promises-list][populate]': '*',
      'populate[blocks][on][blocks.legal-text][populate]': '*',
      'populate[blocks][on][blocks.faq-accordion][populate][items][populate]': '*',
      'populate[blocks][on][blocks.rich-text][populate]': '*',
      'populate[blocks][on][blocks.changelog-list][populate]': '*',
      'populate[blocks][on][blocks.status-grid][populate]': '*',
      'populate[blocks][on][blocks.docs-grid][populate]': '*',
      'populate[blocks][on][blocks.careers-list][populate]': '*',
      'populate[blocks][on][blocks.bounty-table][populate]': '*',
    };
    if (preview) {
      params['publicationState'] = 'preview';
    }
    const { data } = await fetchStrapi<any[]>('pages', params, !preview);
    const page = data?.[0];
    if (!page) return null;
    return page;
  } catch (e) {
    console.error(`[strapi] Failed to load page "${slug}":`, e);
    return null;
  }
}

export async function fetchGlobal() {
  try {
    const { data } = await fetchStrapi<any>('global', {
      'populate': '*',
    });
    return data || null;
  } catch (e) {
    console.error('[strapi] Failed to load global:', e);
    return null;
  }
}

export async function listPageSlugs(): Promise<string[]> {
  try {
    const { data } = await fetchStrapi<any[]>('pages', {
      'fields[0]': 'slug',
      'pagination[pageSize]': '100',
    });
    return (data || [])
      .map((p: any) => p?.slug)
      .filter((s: unknown): s is string => typeof s === 'string' && s.length > 0);
  } catch (e) {
    console.warn('[strapi] listPageSlugs failed — building zero CMS pages:', (e as Error).message);
    return [];
  }
}

export async function fetchChangelogEntries() {
  try {
    const { data } = await fetchStrapi<any[]>('changelog-entries', {
      'sort': 'date:desc',
      'pagination[pageSize]': '100',
    });
    return data || [];
  } catch (e) {
    console.error('[strapi] Failed to load changelog entries:', e);
    return [];
  }
}

export function clearCache(): void {
  cache.clear();
}

export { STRAPI_URL };
