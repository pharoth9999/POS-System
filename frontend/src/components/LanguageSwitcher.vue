<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { SUPPORTED_LOCALES } from '@/locales'
import { useSettingsStore } from '@/stores/settingsStore'

const settings = useSettingsStore()
const { locale } = storeToRefs(settings)
const { t } = useI18n()
</script>

<template>
  <div
    role="group"
    :aria-label="t('language.label')"
    class="inline-flex rounded-lg bg-slate-100 p-0.5 text-sm"
  >
    <button
      v-for="code in SUPPORTED_LOCALES"
      :key="code"
      type="button"
      :lang="code"
      :aria-pressed="locale === code"
      class="min-h-8 rounded-md px-3 transition-colors"
      :class="
        locale === code ? 'bg-white font-medium shadow-sm' : 'text-slate-600 hover:text-slate-900'
      "
      @click="settings.setLocale(code)"
    >
      {{ t(`language.${code}`) }}
    </button>
  </div>
</template>
