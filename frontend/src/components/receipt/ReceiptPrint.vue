<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useMoney } from '@/composables/useMoney'
import { useSettingsStore } from '@/stores/settingsStore'
import type { PaperFormat, Receipt } from '@/types'
import { formatDate } from '@/utils/formatDate'

/**
 * The printable receipt. Hidden on screen and the only thing visible when
 * printing (assets/print.css). Usage:
 *
 *   <ReceiptPrint :receipt="receipt" format="80mm" />
 *   printReceipt('80mm')   // from utils/print
 *
 * Every number is already computed by the backend: this only formats.
 */
const props = defineProps<{ receipt: Receipt; format: PaperFormat }>()

const { t } = useI18n()
const { format: money } = useMoney()
const { intlLocale } = storeToRefs(useSettingsStore())
</script>

<template>
  <div class="print-area" :data-format="props.format" aria-hidden="true">
    <header class="text-center">
      <p class="text-[1.3em] font-bold">{{ receipt.shopName }}</p>
      <p>{{ t('receipt.title') }}</p>
    </header>

    <dl class="mt-[1em] grid grid-cols-[auto_1fr] gap-x-[1em]">
      <dt>{{ t('receipt.number') }}</dt>
      <dd class="text-right">{{ receipt.number }}</dd>
      <dt>{{ t('receipt.date') }}</dt>
      <dd class="text-right">{{ formatDate(receipt.issuedAt, 'datetime', intlLocale) }}</dd>
      <dt>{{ t('receipt.cashier') }}</dt>
      <dd class="text-right">{{ receipt.cashierName }}</dd>
      <template v-if="receipt.memberName">
        <dt>{{ t('receipt.member') }}</dt>
        <dd class="text-right">{{ receipt.memberName }}</dd>
      </template>
    </dl>

    <table class="mt-[1em] w-full border-y border-dashed border-black">
      <thead>
        <tr>
          <th class="text-left">{{ t('receipt.item') }}</th>
          <th class="text-right">{{ t('receipt.qty') }}</th>
          <th v-if="format === 'a4'" class="text-right">{{ t('receipt.price') }}</th>
          <th class="text-right">{{ t('receipt.amount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(line, index) in receipt.lines" :key="index" class="receipt-line align-top">
          <td>
            {{ line.name }}
            <span v-if="format === '80mm'" class="block">@ {{ money(line.unitPrice) }}</span>
          </td>
          <td class="tabular text-right">{{ line.quantity }}</td>
          <td v-if="format === 'a4'" class="tabular text-right">{{ money(line.unitPrice) }}</td>
          <td class="tabular text-right">{{ money(line.lineTotal) }}</td>
        </tr>
      </tbody>
    </table>

    <dl class="tabular mt-[0.5em] grid grid-cols-[1fr_auto] gap-x-[1em]">
      <dt>{{ t('receipt.subtotal') }}</dt>
      <dd class="text-right">{{ money(receipt.subtotal) }}</dd>
      <template v-if="receipt.discountPercent !== '0'">
        <dt>{{ t('receipt.discount', { percent: receipt.discountPercent }) }}</dt>
        <dd class="text-right">−{{ money(receipt.discountAmount) }}</dd>
      </template>
      <dt class="text-[1.2em] font-bold">{{ t('receipt.total') }}</dt>
      <dd class="text-right text-[1.2em] font-bold">{{ money(receipt.total) }}</dd>
    </dl>

    <p v-if="receipt.isCredit" class="mt-[0.5em] text-center font-bold">
      {{ t('receipt.credit') }}
    </p>
    <p class="mt-[1em] text-center">{{ t('receipt.thanks') }}</p>
  </div>
</template>
