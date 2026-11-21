import { storeToRefs } from 'pinia'

import { useSettingsStore } from '@/stores/settingsStore'
import { type Currency, formatMoney } from '@/utils/formatMoney'
import type { MoneyInput } from '@/utils/money'

/**
 * Money display for components, in the current language. Components only
 * *format* money. They never add or multiply it: totals come from cartStore
 * or the API. For math, stores use utils/money directly.
 */
export function useMoney() {
  const { intlLocale } = storeToRefs(useSettingsStore())

  function format(value: MoneyInput, currency: Currency = 'USD'): string {
    return formatMoney(value, { locale: intlLocale.value, currency })
  }

  return { format }
}
