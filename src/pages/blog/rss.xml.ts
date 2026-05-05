/**
 * RSS 2.0 feed for the Beebeeb blog.
 * Served at https://beebeeb.io/blog/rss.xml
 */
export const prerender = true

import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'

const SITE = 'https://beebeeb.io'
const FEED_TITLE = 'Beebeeb Blog'
const FEED_DESCRIPTION =
  'Writing from the Beebeeb team on privacy, encryption, European infrastructure, and building software that respects your data.'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function rfcDate(iso: string): string {
  return new Date(iso).toUTCString()
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  )

  const items = posts
    .map(
      (post) => `
  <item>
    <title>${esc(post.data.title)}</title>
    <link>${SITE}/blog/${post.id}</link>
    <guid isPermaLink="true">${SITE}/blog/${post.id}</guid>
    <description>${esc(post.data.excerpt)}</description>
    <pubDate>${rfcDate(post.data.date)}</pubDate>
    <author>hello@beebeeb.io (${esc(post.data.author)})</author>
  </item>`
    )
    .join('\n')

  const lastBuildDate = posts[0]
    ? rfcDate(posts[0].data.date)
    : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${SITE}/blog</link>
    <description>${esc(FEED_DESCRIPTION)}</description>
    <language>en-gb</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
