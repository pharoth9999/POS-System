<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

/**
 * Full-screen sale screen: a slim top bar and the POS taking the rest of the
 * viewport. The page doesn't scroll. Views inside manage their own scrolling
 * areas (product grid, cart).
 */
const { t } = useI18n()
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-slate-100">
    <header class="flex items-center gap-3 bg-slate-900 px-4 py-2 text-white">
      <p class="font-semibold">{{ t('app.name') }}</p>
      <div class="flex-1" />
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="flex min-h-9 items-center rounded-lg px-3 text-sm text-slate-200 hover:bg-slate-800"
      >
        {{ t('nav.backOffice') }}
      </RouterLink>
      <LanguageSwitcher />
    </header>
    <main class="min-h-0 flex-1">
      <RouterView />
    </main>
  </div>
</template>
