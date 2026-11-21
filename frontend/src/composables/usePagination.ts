import { computed, ref } from 'vue'

import type { PaginationMeta, PaginationQuery } from '@/types'

/**
 * Page state for list views, matching the backend's PaginationQueryDto and
 * Paginated<T>.meta:
 *
 *   const pager = usePagination()
 *   const res = await userService.list(pager.query.value)
 *   pager.setMeta(res.meta)
 */
export function usePagination(initial: { limit?: number } = {}) {
  const page = ref(1)
  const limit = ref(initial.limit ?? 20)
  const search = ref('')
  const meta = ref<PaginationMeta | null>(null)

  const total = computed(() => meta.value?.total ?? 0)
  const totalPages = computed(() => Math.max(meta.value?.totalPages ?? 1, 1))
  const hasPrev = computed(() => page.value > 1)
  const hasNext = computed(() => page.value < totalPages.value)

  const query = computed<PaginationQuery>(() => ({
    page: page.value,
    limit: limit.value,
    ...(search.value.trim() ? { search: search.value.trim() } : {}),
  }))

  function setMeta(next: PaginationMeta) {
    meta.value = next
    page.value = next.page
  }

  function goTo(target: number) {
    page.value = Math.min(Math.max(1, Math.trunc(target)), totalPages.value)
  }

  const next = () => goTo(page.value + 1)
  const prev = () => goTo(page.value - 1)

  /** Call when the search text changes. */
  function resetToFirstPage() {
    page.value = 1
  }

  return {
    page,
    limit,
    search,
    meta,
    total,
    totalPages,
    hasPrev,
    hasNext,
    query,
    setMeta,
    goTo,
    next,
    prev,
    resetToFirstPage,
  }
}
