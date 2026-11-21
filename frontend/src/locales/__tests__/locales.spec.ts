import { describe, expect, it } from 'vitest'

import en from '../en.json'
import km from '../km.json'

const keys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('locales', () => {
  it('km.json has exactly the same keys as en.json', () => {
    expect(keys(km).sort()).toEqual(keys(en).sort())
  })

  it('km.json keeps the same {placeholders}', () => {
    const lookup = (obj: object, path: string) =>
      path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], obj) as string
    const byKey = (messages: object) =>
      Object.fromEntries(keys(en).map((key) => [key, placeholders(lookup(messages, key))]))
    expect(byKey(km)).toEqual(byKey(en))
  })
})
