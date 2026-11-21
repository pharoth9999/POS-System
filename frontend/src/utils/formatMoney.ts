import { type MoneyInput, toMoneyString, toWholeMoneyString } from './money'

export type Currency = 'USD' | 'KHR'

export interface FormatMoneyOptions {
  /** BCP 47 locale for digit grouping, e.g. 'km-KH' or 'en-US'. */
  locale?: string
  currency?: Currency
}

/**
 * Formats a money value for display: "$1,234.50" or "៛50,000".
 *
 * decimal.js rounds the value half-up first. Intl.NumberFormat then gets a
 * *string*, which it formats as an exact decimal with no float conversion,
 * so it never rounds again. KHR has no minor unit and is shown without
 * decimals.
 */
export function formatMoney(
  value: MoneyInput,
  { locale = 'km-KH', currency = 'USD' }: FormatMoneyOptions = {},
): string {
  const isWhole = currency === 'KHR'
  const exact = isWhole ? toWholeMoneyString(value) : toMoneyString(value)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(exact as Intl.StringNumericLiteral)
}
