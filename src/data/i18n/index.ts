import type { Locale } from '../types';
import { ar } from './ar';
import { en, type UiStrings } from './en';

export const locales = ['en', 'ar'] as const satisfies readonly Locale[];
export const defaultLocale: Locale = 'en';

export const ui: Record<Locale, UiStrings> = { en, ar };

export const localeMeta: Record<Locale, { dir: 'ltr' | 'rtl'; htmlLang: string; ogLocale: string; label: string }> = {
  en: { dir: 'ltr', htmlLang: 'en', ogLocale: 'en_US', label: 'EN' },
  ar: { dir: 'rtl', htmlLang: 'ar', ogLocale: 'ar_JO', label: 'ع' },
};

export type { UiStrings };
