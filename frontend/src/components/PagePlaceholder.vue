<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/** Title + "coming soon" for views that aren't built yet. */
defineProps<{ titleKey: string }>()

const { t } = useI18n()
</script>

<template>
  <section>
    <h1 class="text-2xl font-semibold text-slate-900">{{ t(titleKey) }}</h1>
    <p class="mt-2 text-slate-500">{{ t('app.comingSoon') }}</p>
  </section>
</template>
