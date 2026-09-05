const raw = process.env.SITE_BASE_URL;

if (!raw) {
  console.error('SITE_BASE_URL is required for every production/static build. Example: https://arkadiuszkamrowski.com');
  process.exit(1);
}

let url;
try {
  url = new URL(raw);
} catch {
  console.error(`SITE_BASE_URL must be an absolute URL, received: ${raw}`);
  process.exit(1);
}

const localHosts = new Set(['127.0.0.1', 'localhost']);
const localAllowed = process.env.ALLOW_LOCAL_SITE_BASE === '1' && localHosts.has(url.hostname);
if (url.protocol !== 'https:' && !localAllowed) {
  console.error('SITE_BASE_URL must use https://. Local HTTP builds require ALLOW_LOCAL_SITE_BASE=1.');
  process.exit(1);
}

if (url.username || url.password || url.search || url.hash) {
  console.error('SITE_BASE_URL must be a clean origin without credentials, query parameters or fragments.');
  process.exit(1);
}

if (url.pathname !== '/' && url.pathname !== '') {
  console.error('SITE_BASE_URL must be an origin, not a sub-path.');
  process.exit(1);
}

console.log(`SITE_BASE_URL validated: ${url.origin}`);
