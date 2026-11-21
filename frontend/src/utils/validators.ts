import { Decimal } from 'decimal.js'

/**
 * Form validators. Each returns an i18n key for the error, or null when the
 * value is valid, so messages follow the current language:
 *
 *   const error = required(form.username) ?? minLength(3)(form.username)
 *   <BaseInput :error="error && t(error)" />
 *
 * They mirror the backend DTO rules for fast feedback. The backend still
 * validates everything.
 */
export type Validator = (value: unknown) => string | null

const isBlank = (value: unknown) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '')

export const required: Validator = (value) => (isBlank(value) ? 'validation.required' : null)

export const minLength =
  (min: number): Validator =>
  (value) =>
    typeof value === 'string' && value.length > 0 && value.length < min
      ? 'validation.minLength'
      : null

export const maxLength =
  (max: number): Validator =>
  (value) =>
    typeof value === 'string' && value.length > max ? 'validation.maxLength' : null

/** Same rule as the backend: letters, numbers, ".", "_" and "-". */
export const username: Validator = (value) =>
  typeof value === 'string' && value !== '' && !/^[a-zA-Z0-9._-]+$/.test(value)
    ? 'validation.username'
    : null

/** Non-negative decimal(12,2) as a string: "0", "12", "12.5", "12.50". */
export const MONEY_PATTERN = /^\d{1,10}(\.\d{1,2})?$/
export const moneyString: Validator = (value) =>
  typeof value === 'string' && value !== '' && !MONEY_PATTERN.test(value)
    ? 'validation.money'
    : null

/** 0-100 with up to 2 decimals, e.g. "10" or "12.5". */
export const percent: Validator = (value) => {
  if (typeof value !== 'string' || value === '') return null
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(value)) return 'validation.percent'
  return new Decimal(value).gt(100) ? 'validation.percent' : null
}

/** Runs validators in order and returns the first error key. */
export const validate = (value: unknown, ...validators: Validator[]): string | null => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}
