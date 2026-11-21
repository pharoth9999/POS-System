import { describe, expect, it } from 'vitest'

import { usePagination } from '../usePagination'

describe('usePagination', () => {
  it('builds the backend query and trims search', () => {
    const pager = usePagination({ limit: 10 })
    pager.search.value = '  rice '
    expect(pager.query.value).toEqual({ page: 1, limit: 10, search: 'rice' })
    pager.search.value = '   '
    expect(pager.query.value).toEqual({ page: 1, limit: 10 })
  })

  it('moves between pages within bounds', () => {
    const pager = usePagination()
    pager.setMeta({ page: 1, limit: 20, total: 45, totalPages: 3 })
    pager.next()
    pager.next()
    pager.next()
    expect(pager.page.value).toBe(3)
    expect(pager.hasNext.value).toBe(false)
    pager.goTo(-5)
    expect(pager.page.value).toBe(1)
    expect(pager.hasPrev.value).toBe(false)
  })

  it('treats an empty result as a single page', () => {
    const pager = usePagination()
    pager.setMeta({ page: 1, limit: 20, total: 0, totalPages: 0 })
    expect(pager.totalPages.value).toBe(1)
    expect(pager.hasNext.value).toBe(false)
  })
})
