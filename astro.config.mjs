import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const fallbackSite = 'http://127.0.0.1:8080';
const productionHost = process.env.SITE_PRODUCTION_HOST || 'arkadiuszkamrowski.com';
const configuredSite = process.env.SITE_BASE_URL?.trim();
const strictSite = process.env.REQUIRE_PRODUCTION_SITE === '1' || process.env.CI === 'true';

if (strictSite) {
  if (!configuredSite) {
    throw new Error('SITE_BASE_URL is required for CI and production builds');
  }
  let parsed;
  try {
    parsed = new URL(configuredSite);
  } catch {
    throw new Error('SITE_BASE_URL must be a valid absolute URL');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('SITE_BASE_URL must use HTTPS for CI and production builds');
  }
  if (parsed.hostname !== productionHost || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error(`SITE_BASE_URL must be the canonical origin https://${productionHost}`);
  }
}

const site = configuredSite || fallbackSite;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
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
