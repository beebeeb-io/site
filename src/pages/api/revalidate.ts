import type { APIRoute } from 'astro';
import { clearCache } from '../../lib/strapi';

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

  clearCache();

  return new Response(JSON.stringify({ revalidated: true, timestamp: Date.now() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
