import { Decimal } from 'decimal.js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { MoneyString } from '@/types'
import { lineTotal, percentDiscount, sumMoney, toMoneyString, type Money } from '@/utils/money'

export interface CartLine {
  productId: string
  name: string
  /** Sell price from the API, e.g. "2.50". */
  unitPrice: MoneyString
  /** decimal(12,3) as a string, e.g. "1" or "1.5". */
  quantity: string
}

/**
 * The POS cart. All money math lives here (through utils/money), never in
 * components. Totals are exact until the final toMoneyString().
 *
 * These totals are a preview: the backend recomputes and saves the real
 * numbers at checkout, and the receipt prints the backend's values.
 */
export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartLine[]>([])
  /** "0"-"100", up to 2 decimals. */
  const discountPercent = ref('0')
  const memberId = ref<string | null>(null)
  const isCredit = ref(false)

  const subtotalExact = computed<Money>(() =>
    sumMoney(lines.value.map((line) => lineTotal(line.unitPrice, line.quantity))),
  )
  const discountExact = computed<Money>(() =>
    percentDiscount(subtotalExact.value, discountPercent.value),
  )

  /** Display strings, rounded once at the end. */
  const subtotal = computed(() => toMoneyString(subtotalExact.value))
  const discountAmount = computed(() => toMoneyString(discountExact.value))
  const total = computed(() => toMoneyString(subtotalExact.value.minus(discountExact.value)))
  const lineTotals = computed<Record<string, MoneyString>>(() =>
    Object.fromEntries(
      lines.value.map((line) => [
        line.productId,
        toMoneyString(lineTotal(line.unitPrice, line.quantity)),
      ]),
    ),
  )
  const itemCount = computed(() => lines.value.length)
  const isEmpty = computed(() => lines.value.length === 0)

  function addItem(item: Omit<CartLine, 'quantity'>, quantity = '1') {
    const existing = lines.value.find((line) => line.productId === item.productId)
    if (existing) {
      existing.quantity = new Decimal(existing.quantity).plus(quantity).toString()
    } else {
      lines.value.push({ ...item, quantity })
    }
  }

  /** A quantity of 0 or less removes the line. */
  function setQuantity(productId: string, quantity: string) {
    if (new Decimal(quantity).lte(0)) return removeItem(productId)
    const line = lines.value.find((l) => l.productId === productId)
    if (line) line.quantity = new Decimal(quantity).toString()
  }

  function removeItem(productId: string) {
    lines.value = lines.value.filter((line) => line.productId !== productId)
  }

  /** Throws RangeError outside 0-100 (checked by utils/money). */
  function setDiscountPercent(percent: string) {
    percentDiscount('0', percent)
    discountPercent.value = percent
  }

  function clear() {
    lines.value = []
    discountPercent.value = '0'
    memberId.value = null
    isCredit.value = false
  }

  return {
    lines,
    discountPercent,
    memberId,
    isCredit,
    subtotal,
    discountAmount,
    total,
    lineTotals,
    itemCount,
    isEmpty,
    addItem,
    setQuantity,
    removeItem,
    setDiscountPercent,
    clear,
  }
})
