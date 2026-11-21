import type { IsoDateString, MoneyString } from './api'

/**
 * What <ReceiptPrint> renders. Every amount is computed by the backend
 * (or by cartStore before checkout) and arrives here as a string. The
 * receipt only formats values and never calculates them.
 *
 * TODO(sales): align with the sale DTO once backend/src/modules/sales exists.
 */
export interface ReceiptLine {
  name: string
  quantity: string
  unitPrice: MoneyString
  lineTotal: MoneyString
}

export interface Receipt {
  number: string
  issuedAt: IsoDateString
  shopName: string
  cashierName: string
  memberName?: string
  lines: ReceiptLine[]
  subtotal: MoneyString
  discountPercent: string
  discountAmount: MoneyString
  total: MoneyString
  isCredit: boolean
}

export type PaperFormat = '80mm' | 'a4'
