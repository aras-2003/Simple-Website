import type { APIRoute } from 'astro';
export const prerender = true;
export const GET: APIRoute = () => new Response(
  'Contact: https://pl.linkedin.com/in/arkadiusz-kamrowski\nPreferred-Languages: pl, en\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
