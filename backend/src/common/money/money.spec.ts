import { moneyTransformer } from './money-column.decorator.js';
import {
  applyPercentDiscount,
  lineTotal,
  money,
  percentDiscount,
  roundMoney,
  sumMoney,
  toMoneyString,
} from './money.js';

describe('money', () => {
  it('adds without float drift', () => {
    expect(toMoneyString(sumMoney(['0.10', '0.20']))).toBe('0.30');
  });

  it('rounds half-up, unlike Number#toFixed', () => {
    expect((2.675).toFixed(2)).toBe('2.67'); // the bug this helper exists for
    expect(toMoneyString('2.675')).toBe('2.68');
    expect(toMoneyString('2.665')).toBe('2.67');
    expect(roundMoney('1.005').toString()).toBe('1.01');
  });

  it('computes line totals with fractional quantities', () => {
    expect(toMoneyString(lineTotal('19.99', 3))).toBe('59.97');
    expect(toMoneyString(lineTotal('4.25', 1.5))).toBe('6.38'); // 6.375 -> 6.38
  });

  it('applies % discounts and keeps precision until the end', () => {
    expect(toMoneyString(percentDiscount('10.05', 10))).toBe('1.01'); // 1.005
    expect(toMoneyString(applyPercentDiscount('10.05', 10))).toBe('9.05'); // 9.045
    expect(toMoneyString(applyPercentDiscount('100.00', '12.5'))).toBe('87.50');
  });

  it('rounds only at the end, not per line', () => {
    // Three lines with a 1.005 discount each: rounding per line gives 3.03,
    // the correct total is 3.015 -> 3.02.
    const discounts = ['10.05', '10.05', '10.05'].map((p) => percentDiscount(p, 10));
    expect(toMoneyString(sumMoney(discounts))).toBe('3.02');
    expect(toMoneyString(sumMoney(discounts.map(roundMoney)))).toBe('3.03');
  });

  it('tracks debt balances exactly', () => {
    const balance = money('150.00').minus('49.99').minus('0.01');
    expect(toMoneyString(balance)).toBe('100.00');
    expect(balance.isZero()).toBe(false);
  });

  it('rejects discounts outside 0-100%', () => {
    expect(() => percentDiscount('10.00', -1)).toThrow(RangeError);
    expect(() => percentDiscount('10.00', 100.01)).toThrow(RangeError);
    expect(toMoneyString(applyPercentDiscount('10.00', 100))).toBe('0.00');
  });

  it('column transformer writes 2-decimal strings and reads strings untouched', () => {
    expect(moneyTransformer.to(money('3').dividedBy(3).times('7.335'))).toBe('7.34');
    expect(moneyTransformer.to(null)).toBeNull();
    expect(moneyTransformer.from('12.50')).toBe('12.50');
  });
});
