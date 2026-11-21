import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCartStore } from '../cartStore'

describe('cartStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  const coffee = { productId: 'p1', name: 'Coffee', unitPrice: '1.10' }
  const rice = { productId: 'p2', name: 'Rice (kg)', unitPrice: '2.01' }

  it('adds items and merges quantities exactly', () => {
    const cart = useCartStore()
    cart.addItem(coffee)
    cart.addItem(coffee, '0.1')
    expect(cart.lines).toEqual([{ ...coffee, quantity: '1.1' }])
    expect(cart.lineTotals.p1).toBe('1.21')
  })

  it('computes totals with decimal math, rounded once', () => {
    const cart = useCartStore()
    cart.addItem(coffee, '3') // 3.30 (float math would give 3.3000000000000003)
    cart.addItem(rice, '0.5') // 1.005
    expect(cart.subtotal).toBe('4.31') // 4.305 -> 4.31
    cart.setDiscountPercent('10')
    expect(cart.discountAmount).toBe('0.43') // 0.4305
    expect(cart.total).toBe('3.87') // 3.8745
  })

  it('removes a line when quantity drops to 0', () => {
    const cart = useCartStore()
    cart.addItem(coffee)
    cart.setQuantity('p1', '0')
    expect(cart.isEmpty).toBe(true)
  })

  it('rejects an invalid discount and keeps the old one', () => {
    const cart = useCartStore()
    cart.setDiscountPercent('5')
    expect(() => cart.setDiscountPercent('150')).toThrow(RangeError)
    expect(cart.discountPercent).toBe('5')
  })

  it('clear resets everything', () => {
    const cart = useCartStore()
    cart.addItem(coffee)
    cart.setDiscountPercent('5')
    cart.isCredit = true
    cart.clear()
    expect([cart.isEmpty, cart.discountPercent, cart.isCredit, cart.total]).toEqual([
      true,
      '0',
      false,
      '0.00',
    ])
  })
})
