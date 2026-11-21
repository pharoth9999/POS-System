import { describe, expect, it } from 'vitest'

import { formatMoney } from '../formatMoney'

describe('formatMoney', () => {
  it('formats USD with 2 decimals and grouping', () => {
    expect(formatMoney('1234.5', { locale: 'en-US' })).toBe('$1,234.50')
    expect(formatMoney('0', { locale: 'en-US' })).toBe('$0.00')
  })

  it('rounds half-up with decimal.js before formatting', () => {
    expect(formatMoney('2.675', { locale: 'en-US' })).toBe('$2.68')
    expect(formatMoney('1.005', { locale: 'en-US' })).toBe('$1.01')
  })

  it('keeps every digit of large amounts (no float conversion)', () => {
    expect(formatMoney('9999999999.99', { locale: 'en-US' })).toBe('$9,999,999,999.99')
  })

  it('formats KHR in whole riel', () => {
    expect(formatMoney('50000.5', { locale: 'en-US', currency: 'KHR' })).toBe('៛50,001')
  })

  it('formats in Khmer locale by default', () => {
    expect(formatMoney('12.5')).toContain('12.50')
  })
})
