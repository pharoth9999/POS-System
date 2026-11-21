import { Column, type ColumnOptions, type ValueTransformer } from 'typeorm';
import { type MoneyInput, toMoneyString } from './money.js';

/**
 * Reads keep Postgres's exact string ("12.50"). Never convert to a JS number.
 * Writes accept a string or Decimal and are rounded to 2 decimals here, the
 * last step before the DB.
 */
export const moneyTransformer: ValueTransformer = {
  to: (value?: MoneyInput | null) =>
    value === null || value === undefined ? value : toMoneyString(value),
  from: (value?: string | null) => value,
};

/**
 * A decimal(12,2) money column whose property type is `string`:
 *
 *   @MoneyColumn() sellPrice: string;
 *   @MoneyColumn({ default: '0.00' }) balance: string;
 */
export function MoneyColumn(options: Omit<ColumnOptions, 'type' | 'precision' | 'scale'> = {}) {
  return Column({
    ...options,
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: moneyTransformer,
  });
}
