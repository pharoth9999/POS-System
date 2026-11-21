import type { PaperFormat } from '@/types'

const PAGE_STYLE_ID = 'print-page-size'

const PAGE_SIZE: Record<PaperFormat, string> = {
  // Thermal roll: fixed width, the height grows with the receipt.
  '80mm': '@page { size: 80mm auto; margin: 0; }',
  a4: '@page { size: A4 portrait; margin: 12mm; }',
}

/**
 * Prints the <ReceiptPrint> on the page in the given paper format.
 *
 * @page can't be switched by a CSS class, so this injects the right @page
 * rule, sets <html data-print> for the width and type size rules in
 * assets/print.css, prints, then cleans up.
 */
export function printReceipt(format: PaperFormat): void {
  const html = document.documentElement
  let style = document.getElementById(PAGE_STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = PAGE_STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = PAGE_SIZE[format]
  html.dataset.print = format

  const cleanup = () => {
    delete html.dataset.print
    style.textContent = ''
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)
  window.print()
}
