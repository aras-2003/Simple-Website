import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const canonical = new URL('/.well-known/security.txt', site ?? new URL('https://arkadiuszkamrowski.com')).toString();
  const body = [
    'Contact: https://pl.linkedin.com/in/arkadiusz-kamrowski',
    'Expires: 2027-09-05T00:00:00Z',
    `Canonical: ${canonical}`,
    'Preferred-Languages: pl, en',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
