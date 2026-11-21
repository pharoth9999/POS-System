import type { IsoDateString } from '@/types'

export type DateStyle = 'date' | 'datetime' | 'time'

const OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  date: { year: 'numeric', month: '2-digit', day: '2-digit' },
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  time: { hour: '2-digit', minute: '2-digit' },
}

/**
 * Formats an API timestamp in the shop's time zone. The backend stores UTC
 * (timestamptz). Display is always Asia/Phnom_Penh, whatever the device's
 * clock is set to.
 */
export function formatDate(
  value: IsoDateString | Date,
  style: DateStyle = 'datetime',
  locale = 'km-KH',
  timeZone = 'Asia/Phnom_Penh',
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { ...OPTIONS[style], timeZone }).format(date)
}
