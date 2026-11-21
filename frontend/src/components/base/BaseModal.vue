<script setup lang="ts">
import { nextTick, onBeforeUnmount, useId, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    title: string
    size?: 'sm' | 'md' | 'lg'
    /** Close when clicking the backdrop. Turn off for forms with unsaved input. */
    closeOnBackdrop?: boolean
  }>(),
  { size: 'md', closeOnBackdrop: true },
)

const { t } = useI18n()
const titleId = useId()
const panel = useTemplateRef<HTMLDivElement>('panel')
let previouslyFocused: HTMLElement | null = null

const WIDTHS = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-3xl' }

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(open, async (isOpen) => {
  if (isOpen) {
    previouslyFocused = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
    await nextTick()
    panel.value?.focus()
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
    previouslyFocused?.focus()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-slate-900/50"
        aria-hidden="true"
        @click="props.closeOnBackdrop && close()"
      />
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        class="relative flex max-h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl outline-none"
        :class="WIDTHS[size]"
      >
        <header class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 :id="titleId" class="text-lg font-semibold">{{ title }}</h2>
          <button
            type="button"
            class="grid size-9 place-items-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
            :aria-label="t('common.close')"
            @click="close"
          >
            ×
          </button>
        </header>
        <div class="overflow-y-auto px-5 py-4">
          <slot />
        </div>
        <footer
          v-if="$slots.footer"
          class="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3"
        >
          <slot name="footer" :close="close" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
