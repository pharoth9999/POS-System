import { describe, expect, it } from 'vitest'

import { maxLength, moneyString, percent, required, username, validate } from '../validators'

describe('validators', () => {
  it('required rejects empty and blank values', () => {
    expect(required('')).toBe('validation.required')
    expect(required('   ')).toBe('validation.required')
    expect(required(null)).toBe('validation.required')
    expect(required('a')).toBeNull()
  })

  it('moneyString accepts decimal(12,2) strings only', () => {
    for (const ok of ['0', '12', '12.5', '12.50', '9999999999.99'])
      expect(moneyString(ok)).toBeNull()
    for (const bad of ['-1', '1.234', '1,50', 'abc', '12345678901']) {
      expect(moneyString(bad)).toBe('validation.money')
    }
  })

  it('percent allows 0-100 with up to 2 decimals', () => {
    for (const ok of ['0', '10', '12.5', '100', '100.00']) expect(percent(ok)).toBeNull()
    for (const bad of ['100.01', '101', '-5', '1.234'])
      expect(percent(bad)).toBe('validation.percent')
  })

  it('validate returns the first failing rule', () => {
    expect(validate('', required, maxLength(3))).toBe('validation.required')
    expect(validate('abcd', required, maxLength(3))).toBe('validation.maxLength')
    expect(validate('bad name!', required, username)).toBe('validation.username')
  })
})
