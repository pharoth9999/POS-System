/** A column for <BaseTable>. */
export interface TableColumn<Row> {
  /** Property shown by default, and the name of the `cell-<key>` slot. */
  key: keyof Row & string
  /** Already-translated header text. */
  label: string
  /** Use 'right' for money and quantities. */
  align?: 'left' | 'right' | 'center'
  class?: string
}
