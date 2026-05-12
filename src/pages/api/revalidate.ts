import type { APIRoute } from 'astro';
import { clearCache, invalidateLaunchPhaseCache } from '../../lib/strapi';

export const POST: APIRoute = async ({ request }) => {
  const secret = (typeof process !== 'undefined' && process.env?.REVALIDATE_SECRET) || import.meta.env.REVALIDATE_SECRET;

  if (secret) {
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Parse Strapi webhook payload for debugging
  let model: string | undefined;
  let slug: string | undefined;
  try {
    const body = await request.json();
    model = body?.model;
    slug = body?.entry?.slug;
  } catch {
    // Non-JSON or empty body — that is fine, clear cache unconditionally
  }

  const timestamp = Date.now();
  if (model || slug) {
    console.log(`[revalidate] content update: model=${model || 'unknown'} slug=${slug || 'none'} at=${new Date(timestamp).toISOString()}`);
  }

  clearCache();
  invalidateLaunchPhaseCache();

  return new Response(JSON.stringify({ revalidated: true, timestamp, model, slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
