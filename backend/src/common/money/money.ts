import { Decimal } from 'decimal.js';

/**
 * The ONLY place money math happens. Never add, multiply or compare prices
 * as plain JS numbers: 0.1 + 0.2 === 0.30000000000000004, and
 * (2.675).toFixed(2) === '2.67'.
 *
 * Rules:
 * - Money enters as a string ("12.50", from the DB or a DTO) or a Decimal.
 * - Intermediate results stay unrounded Decimals.
 * - Round to 2 decimals (half-up) only at the end, with `toMoneyString()`,
 *   right before saving or returning the value.
 */
const MoneyDecimal = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export type Money = Decimal;
/** Strings and Decimals only. JS numbers are allowed for quantities, not prices. */
export type MoneyInput = string | Decimal;

export const MONEY_SCALE = 2;

export function money(value: MoneyInput): Money {
  return new MoneyDecimal(value);
}

export const ZERO: Money = money('0');

export function sumMoney(values: Iterable<MoneyInput>): Money {
  let total = ZERO;
  for (const value of values) total = total.plus(value);
  return total;
}

/** unitPrice x quantity, unrounded. Quantity may be a number (e.g. 3 or 1.5 kg). */
export function lineTotal(unitPrice: MoneyInput, quantity: number | MoneyInput): Money {
  return money(unitPrice).times(quantity);
}

function assertPercent(percent: number | MoneyInput): Money {
  const p = new MoneyDecimal(percent);
  if (p.isNaN() || p.lt(0) || p.gt(100)) {
    throw new RangeError(`Discount percent must be between 0 and 100, got ${String(percent)}`);
  }
  return p;
}

/** The discount amount for `percent`% of `amount`, unrounded. */
export function percentDiscount(amount: MoneyInput, percent: number | MoneyInput): Money {
  return money(amount).times(assertPercent(percent)).dividedBy(100);
}

/** `amount` minus `percent`%, unrounded. */
export function applyPercentDiscount(amount: MoneyInput, percent: number | MoneyInput): Money {
  return money(amount).minus(percentDiscount(amount, percent));
}

/** Rounds half-up to 2 decimals and stays a Decimal (for comparisons at the end). */
export function roundMoney(value: MoneyInput): Money {
  return money(value).toDecimalPlaces(MONEY_SCALE, Decimal.ROUND_HALF_UP);
}

/** Final step: half-up to 2 decimals as a string, e.g. "12.50". Save and return this. */
export function toMoneyString(value: MoneyInput): string {
  return money(value).toFixed(MONEY_SCALE, Decimal.ROUND_HALF_UP);
}
