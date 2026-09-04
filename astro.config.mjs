import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_BASE_URL || 'http://127.0.0.1:8080';
const legacyPaths = [
  '/about', '/work', '/writing', '/contact', '/privacy',
  '/en/work', '/en/writing',
];

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap({
    filter: (page) => {
      const path = new URL(page).pathname.replace(/\/$/, '') || '/';
      return !legacyPaths.some((legacy) => path === legacy || path.startsWith(`${legacy}/`));
    },
  })],
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    routing: { prefixDefaultLocale: false },
  },
  build: { format: 'directory' },
  vite: {
    server: {
      proxy: {
        '/api/contact': { target: 'http://127.0.0.1:8787', changeOrigin: false },
      },
    },
  },
});
