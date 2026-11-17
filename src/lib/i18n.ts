import type { Locale, Text } from '../data/types';
import { defaultLocale, localeMeta, ui, type UiStrings } from '../data/i18n';

/** Resolve a translatable value for a locale, falling back to English. */
export function tr(value: Text | undefined, locale: Locale): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value.en;
}

/** UI strings for a locale. */
export function useUi(locale: Locale): UiStrings {
  return ui[locale];
}

/** Read the active locale from Astro.currentLocale (falls back to default). */
export function getLocale(current: string | undefined): Locale {
  return current === 'ar' ? 'ar' : defaultLocale;
}

/** Home path for a locale ("/" or "/ar/"). */
export function homePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

export function dirOf(locale: Locale) {
  return localeMeta[locale].dir;
}
