<script setup lang="ts" generic="T extends object">
import { useI18n } from 'vue-i18n'

import type { TableColumn } from '@/types'

withDefaults(
  defineProps<{
    columns: TableColumn<T>[]
    rows: T[]
    /** Property used as the v-for key. */
    rowKey: keyof T & string
    loading?: boolean
    emptyText?: string
  }>(),
  { loading: false, emptyText: '' },
)

defineSlots<
  {
    [K in `cell-${keyof T & string}`]?: (props: { row: T; value: unknown }) => unknown
  } & {
    empty?: () => unknown
  }
>()

const { t } = useI18n()

const ALIGN = { left: 'text-left', right: 'text-right tabular', center: 'text-center' }
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table class="w-full text-sm" :aria-busy="loading">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-4 py-3 font-medium"
            :class="[ALIGN[column.align ?? 'left'], column.class]"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-slate-500">
            {{ t('common.loading') }}
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-slate-500">
            <slot name="empty">{{ emptyText || t('common.noData') }}</slot>
          </td>
        </tr>
        <template v-else>
          <tr v-for="row in rows" :key="String(row[rowKey])" class="hover:bg-slate-50">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3"
              :class="[ALIGN[column.align ?? 'left'], column.class]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
