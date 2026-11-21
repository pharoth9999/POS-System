import { Decimal } from 'decimal.js'

import type { MoneyString } from '@/types'

/**
 * The ONLY place money math happens in the frontend. It mirrors
 * backend/src/common/money/money.ts, so the cart shows the same totals the
 * server will save.
 *
 * - Money comes from the API as strings ("12.50"). Never Number() it.
 * - Never use + - * / or toFixed() on money. Use these helpers.
 * - Keep intermediate results as Decimals. Round half-up to 2 decimals only
 *   at the end with toMoneyString().
 * - Components never do money math. Stores and composables call this.
 */
const MoneyDecimal = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

export type Money = Decimal
export type MoneyInput = MoneyString | Decimal

export const MONEY_SCALE = 2

export function money(value: MoneyInput): Money {
  return new MoneyDecimal(value)
}

export const ZERO: Money = money('0')

export function sumMoney(values: Iterable<MoneyInput>): Money {
  let total = ZERO
  for (const value of values) total = total.plus(value)
  return total
}

/** unitPrice x quantity, unrounded. Quantity may be fractional (1.5 kg). */
export function lineTotal(unitPrice: MoneyInput, quantity: number | string | Decimal): Money {
  return money(unitPrice).times(quantity)
}

function assertPercent(percent: number | string | Decimal): Decimal {
  const p = new MoneyDecimal(percent)
  if (p.isNaN() || p.lt(0) || p.gt(100)) {
    throw new RangeError(`Discount percent must be between 0 and 100, got ${String(percent)}`)
  }
  return p
}

/** The discount amount for `percent`% of `amount`, unrounded. */
export function percentDiscount(amount: MoneyInput, percent: number | string | Decimal): Money {
  return money(amount).times(assertPercent(percent)).dividedBy(100)
}

/** `amount` minus `percent`%, unrounded. */
export function applyPercentDiscount(
  amount: MoneyInput,
  percent: number | string | Decimal,
): Money {
  return money(amount).minus(percentDiscount(amount, percent))
}

/** Half-up to 2 decimals, still a Decimal. */
export function roundMoney(value: MoneyInput): Money {
  return money(value).toDecimalPlaces(MONEY_SCALE, Decimal.ROUND_HALF_UP)
}

/** Final step: half-up to 2 decimals as a string, e.g. "12.50". Send and display this. */
export function toMoneyString(value: MoneyInput): MoneyString {
  return money(value).toFixed(MONEY_SCALE, Decimal.ROUND_HALF_UP)
}

/** Half-up to whole units as a string, for currencies without cents (KHR). */
export function toWholeMoneyString(value: MoneyInput): string {
  return money(value).toFixed(0, Decimal.ROUND_HALF_UP)
}
