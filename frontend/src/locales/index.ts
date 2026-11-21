import { createI18n } from 'vue-i18n'

import en from './en.json'
import km from './km.json'

/** en.json is the source of truth: km.json must have the same keys (a test checks this). */
export type MessageSchema = typeof en

export const SUPPORTED_LOCALES = ['km', 'en'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'km'
export const LOCALE_STORAGE_KEY = 'pos.locale'

/** BCP 47 tags for Intl (numbers, money, dates). */
export const INTL_LOCALE: Record<AppLocale, string> = {
  km: 'km-KH',
  en: 'en-US',
}

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

function savedLocale(): AppLocale {
  try {
    const value = localStorage.getItem(LOCALE_STORAGE_KEY)
    return isAppLocale(value) ? value : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export const i18n = createI18n<[MessageSchema], AppLocale, false>({
  legacy: false,
  locale: savedLocale(),
  fallbackLocale: 'en',
  messages: { en, km },
})
