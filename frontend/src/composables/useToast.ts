import { readonly, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

// One shared list for the whole app. <ToastContainer> in App.vue renders it.
const toasts = ref<Toast[]>([])
let nextId = 1

function dismiss(id: number) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function show(type: ToastType, message: string, durationMs = type === 'error' ? 6000 : 3500) {
  const id = nextId++
  toasts.value = [...toasts.value, { id, type, message }]
  if (durationMs > 0) setTimeout(() => dismiss(id), durationMs)
  return id
}

/** Short messages: `useToast().success(t('...'))`. Pass already-translated text. */
export function useToast() {
  return {
    toasts: readonly(toasts),
    success: (message: string, durationMs?: number) => show('success', message, durationMs),
    error: (message: string, durationMs?: number) => show('error', message, durationMs),
    info: (message: string, durationMs?: number) => show('info', message, durationMs),
    dismiss,
  }
}
