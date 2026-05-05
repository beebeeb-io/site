/**
 * Apple App Site Association file for beebeeb.io.
 *
 * Served at https://beebeeb.io/.well-known/apple-app-site-association
 * Must return Content-Type: application/json (no file extension in the URL).
 *
 * Team ID: R8352WDJJR  ·  Bundle ID: io.beebeeb.app
 * Paths: share links (/s/*), share pages (/share/*), invite links (/invite/*)
 */
import type { APIRoute } from 'astro'

const AASA = {
  applinks: {
    apps: [],
    details: [
      {
        appID: 'R8352WDJJR.io.beebeeb.app',
        paths: ['/s/*', '/share/*', '/invite/*'],
      },
    ],
  },
}

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(AASA), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
