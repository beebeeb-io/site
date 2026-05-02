import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://beebeeb.io',
  integrations: [sitemap()],
  image: {
    domains: ['localhost'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '*.beebeeb.io', pathname: '/uploads/**' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['STRAPI_', 'REVALIDATE_'],
  },
});
