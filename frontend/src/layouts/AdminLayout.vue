<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()

const NAV = [
  'dashboard',
  'products',
  'stock',
  'transfers',
  'members',
  'debts',
  'reports',
  'users',
  'settings',
] as const

// No auth right now, so every page is listed. Filter by role here when login comes back.
const navItems = computed(() => NAV.map((name) => ({ name, label: t(`nav.${name}`) })))

const sidebarOpen = ref(false)
watch(
  () => route.fullPath,
  () => (sidebarOpen.value = false),
)
</script>

<template>
  <div class="min-h-dvh lg:flex">
    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-100 transition-transform lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="px-5 py-5 text-lg font-semibold">{{ t('app.name') }}</div>
      <nav class="flex-1 space-y-1 overflow-y-auto px-3" :aria-label="t('nav.menu')">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="flex min-h-11 items-center rounded-lg px-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          active-class="!bg-brand-600 !text-white"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="border-t border-slate-800 p-3">
        <RouterLink
          :to="{ name: 'pos' }"
          class="flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 font-medium text-white hover:bg-emerald-700"
        >
          {{ t('nav.openPos') }}
        </RouterLink>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur"
      >
        <button
          type="button"
          class="grid size-11 place-items-center rounded-lg text-2xl hover:bg-slate-100 lg:hidden"
          :aria-label="t('nav.menu')"
          :aria-expanded="sidebarOpen"
          @click="sidebarOpen = !sidebarOpen"
        >
          ☰
        </button>
        <div class="flex-1" />
        <LanguageSwitcher />
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
