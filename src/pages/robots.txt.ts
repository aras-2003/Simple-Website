import type { APIRoute } from 'astro';
export const prerender = true;
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('http://127.0.0.1:8080');
  const local = ['localhost', '127.0.0.1'].includes(base.hostname);
  const sitemap = new URL('/sitemap-index.xml', base).toString();
  const body = `User-agent: *\nAllow: /\n${local ? '' : `Sitemap: ${sitemap}\n`}`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
