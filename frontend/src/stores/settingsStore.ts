import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { type AppLocale, i18n, INTL_LOCALE, LOCALE_STORAGE_KEY } from '@/locales'

/**
 * Device preferences (language) plus, later, the shop settings from the
 * backend settings module.
 *
 * TODO(settings): add levelThresholds (SILVER/GOLD/DIAMOND) and
 * lowStockThreshold, loaded with settingsService once that endpoint exists.
 */
export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<AppLocale>(i18n.global.locale.value)

  /** For Intl formatting: 'km-KH' / 'en-US'. */
  const intlLocale = computed(() => INTL_LOCALE[locale.value])

  function setLocale(next: AppLocale) {
    locale.value = next
  }

  watch(
    locale,
    (value) => {
      i18n.global.locale.value = value
      document.documentElement.lang = value
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, value)
      } catch {
        // Private mode or storage blocked: the choice lasts for this tab only.
      }
    },
    { immediate: true },
  )

  return { locale, intlLocale, setLocale }
})
