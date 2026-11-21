<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
const { t } = useI18n()

const STYLES = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-white',
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end"
    aria-live="polite"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :role="toast.type === 'error' ? 'alert' : 'status'"
      class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 shadow-lg"
      :class="STYLES[toast.type]"
    >
      <p class="flex-1 text-sm">{{ toast.message }}</p>
      <button
        type="button"
        class="-m-1 rounded p-1 leading-none opacity-80 hover:opacity-100"
        :aria-label="t('common.close')"
        @click="dismiss(toast.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>
