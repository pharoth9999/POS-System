<script setup lang="ts">
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label?: string
    type?: string
    /** Already-translated error text. When set, the input is marked invalid. */
    error?: string | null
    hint?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { label: '', type: 'text', error: null, hint: '', required: false, disabled: false },
)

const id = useId()
const messageId = `${id}-message`
const message = computed(() => props.error || props.hint)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">
      {{ label }}<span v-if="required" class="text-red-600" aria-hidden="true"> *</span>
    </label>
    <input
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :type="type"
      :required="required"
      :disabled="disabled"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="message ? messageId : undefined"
      class="min-h-11 rounded-lg border bg-white px-3 text-base text-slate-900 shadow-xs outline-none transition-colors placeholder:text-slate-400 focus:ring-2 disabled:bg-slate-100"
      :class="
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
      "
    />
    <p
      v-if="message"
      :id="messageId"
      class="text-sm"
      :class="error ? 'text-red-600' : 'text-slate-500'"
    >
      {{ message }}
    </p>
  </div>
</template>
