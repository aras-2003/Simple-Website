export type Locale = 'pl' | 'en';
export type RouteKey = 'home' | 'about' | 'oaf' | 'work' | 'writing' | 'contact' | 'privacy';

export const site = {
  name: 'Arkadiusz Kamrowski',
  linkedIn: 'https://pl.linkedin.com/in/arkadiusz-kamrowski',
} as const;

export const routeSlugs: Record<RouteKey, string> = {
  home: '',
  about: 'about',
  oaf: 'oaf',
  work: 'work',
  writing: 'writing',
  contact: 'contact',
  privacy: 'privacy',
};

export function route(locale: Locale, key: RouteKey): string {
  const slug = routeSlugs[key];
  if (locale === 'en') return slug ? `/en/${slug}` : '/en';
  return slug ? `/${slug}` : '/';
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'pl' ? 'en' : 'pl';
}

export function absoluteUrl(path: string, base: URL | undefined): string {
  return new URL(path, base ?? new URL('http://127.0.0.1:8080')).toString();
}
