import { readFileSync } from 'fs';
import { join } from 'path';

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

export async function fetchLandingPageBySlug(slug: string, preview = false) {
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
      'populate[blocks][on][blocks.faq-accordion][populate][items][populate]': '*',
      'populate[blocks][on][blocks.rich-text][populate]': '*',
      'populate[blocks][on][blocks.testimonial][populate]': '*',
      'populate[blocks][on][blocks.stats][populate]': '*',
      'populate[blocks][on][blocks.image][populate]': '*',
      'populate[blocks][on][blocks.feature-grid][populate][features][populate]': '*',
    };
    if (preview) {
      params['publicationState'] = 'preview';
    }
    const { data } = await fetchStrapi<any[]>('landing-pages', params, !preview);
    const page = data?.[0];
    if (!page) return null;
    return page;
  } catch (e) {
    console.error(`[strapi] Failed to load landing page "${slug}":`, e);
    return null;
  }
}

export async function fetchGlobal() {
  try {
    const { data } = await fetchStrapi<any>('global', {
      'populate': '*',
    });
    return data || null;
  } catch {
    return null;
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

export async function fetchFaqCategories(): Promise<import('./types').FaqCategory[]> {
  try {
    const { data } = await fetchStrapi<any[]>('faq-categories', {
      'sort': 'sortOrder:asc',
      'populate[faq_items][sort]': 'sortOrder:asc',
      'populate[faq_items][populate]': '*',
    });
    return data || [];
  } catch (e) {
    console.error('[strapi] Failed to load FAQ categories:', e);
    return [];
  }
}

export async function fetchSupportConfig(): Promise<import('./types').SupportConfig | null> {
  try {
    const { data } = await fetchStrapi<any>('support-config', {
      'populate': '*',
    });
    return data || null;
  } catch {
    return null;
  }
}

import type { BlogPost, BlogAuthor, BlogCategory } from './types';

function mapBlogPost(raw: any): BlogPost {
  const author = raw.author
    ? {
        id: raw.author.id,
        name: raw.author.name,
        slug: raw.author.slug,
        bio: raw.author.bio || undefined,
        avatar: raw.author.avatar?.url
          ? strapiImage(raw.author.avatar.url)
          : undefined,
        role: raw.author.role || undefined,
        socialLinks: raw.author.socialLinks || undefined,
      } as BlogAuthor
    : undefined;

  const category = raw.category
    ? {
        id: raw.category.id,
        name: raw.category.name,
        slug: raw.category.slug,
        description: raw.category.description || undefined,
      } as BlogCategory
    : undefined;

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt || '',
    content: raw.content || '',
    coverImage: raw.coverImage?.url
      ? strapiImage(raw.coverImage.url)
      : undefined,
    author,
    category,
    publishedAt: raw.publishedAt,
    readingTime: raw.readingTime || Math.ceil((raw.content || '').split(/\s+/).length / 200),
    seoTitle: raw.seoTitle || undefined,
    seoDescription: raw.seoDescription || undefined,
  };
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await fetchStrapi<any[]>('blog-posts', {
      'sort': 'publishedAt:desc',
      'pagination[pageSize]': '100',
      'populate[author][populate]': '*',
      'populate[category][populate]': '*',
      'populate[coverImage][populate]': '*',
    });
    return (data || []).map(mapBlogPost);
  } catch (e) {
    console.error('[strapi] Failed to load blog posts:', e);
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data } = await fetchStrapi<any[]>('blog-posts', {
      'filters[slug][$eq]': slug,
      'populate[author][populate]': '*',
      'populate[category][populate]': '*',
      'populate[coverImage][populate]': '*',
    });
    const raw = data?.[0];
    if (!raw) return null;
    return mapBlogPost(raw);
  } catch (e) {
    console.error(`[strapi] Failed to load blog post "${slug}":`, e);
    return null;
  }
}

export function clearCache(): void {
  cache.clear();
}

export async function getLaunchPhase(): Promise<1 | 2 | 3 | 4> {
  // Check env var first (for CI/CD overrides)
  const envPhase = process.env.LAUNCH_PHASE;
  if (envPhase && ['1', '2', '3', '4'].includes(envPhase)) {
    return parseInt(envPhase, 10) as 1 | 2 | 3 | 4;
  }

  // Fall back to JSON config file
  try {
    const configPath = join(process.cwd(), 'src/config/phase.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    const phase = config.phase as 1 | 2 | 3 | 4;
    if ([1, 2, 3, 4].includes(phase)) return phase;
  } catch {
  }

  return 1;
}

export function invalidateLaunchPhaseCache() {}

export { STRAPI_URL };
