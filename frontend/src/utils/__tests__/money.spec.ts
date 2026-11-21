import { describe, expect, it } from 'vitest'

import {
  applyPercentDiscount,
  lineTotal,
  percentDiscount,
  roundMoney,
  sumMoney,
  toMoneyString,
  toWholeMoneyString,
} from '../money'

describe('money', () => {
  it('adds without float drift', () => {
    expect(0.1 + 0.2).not.toBe(0.3) // why this module exists
    expect(toMoneyString(sumMoney(['0.10', '0.20']))).toBe('0.30')
  })

  it('rounds half-up, unlike Number#toFixed', () => {
    expect((2.675).toFixed(2)).toBe('2.67')
    expect(toMoneyString('2.675')).toBe('2.68')
    expect(toWholeMoneyString('50000.5')).toBe('50001')
  })

  it('computes line totals and % discounts exactly', () => {
    expect(toMoneyString(lineTotal('19.99', 3))).toBe('59.97')
    expect(toMoneyString(lineTotal('4.25', '1.5'))).toBe('6.38')
    expect(toMoneyString(percentDiscount('10.05', 10))).toBe('1.01')
    expect(toMoneyString(applyPercentDiscount('100.00', '12.5'))).toBe('87.50')
  })

  it('rounds once at the end, not per line', () => {
    const discounts = ['10.05', '10.05', '10.05'].map((p) => percentDiscount(p, 10))
    expect(toMoneyString(sumMoney(discounts))).toBe('3.02')
    expect(toMoneyString(sumMoney(discounts.map(roundMoney)))).toBe('3.03')
  })

  it('rejects discounts outside 0-100%', () => {
    expect(() => percentDiscount('10.00', -1)).toThrow(RangeError)
    expect(() => percentDiscount('10.00', '100.01')).toThrow(RangeError)
  })
})
