import axios, { AxiosError, type AxiosInstance } from 'axios'

import type { ApiErrorBody } from '@/types'

/**
 * The one axios instance every service uses. There is no auth right now
 * (removed 2026-11-21, see docs/decisions.md): requests carry no token.
 * When login comes back, its token handling goes here, and only here.
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/** A normalized error for the UI. Use it in catch blocks instead of reading axios internals. */
export interface ApiError {
  /** HTTP status, or null when the server couldn't be reached. */
  status: number | null
  /** All messages from the backend (validation errors send one per field). */
  messages: string[]
  /** Seconds from a Retry-After header, else null. */
  retryAfterSeconds: number | null
  isNetworkError: boolean
}

export function toApiError(error: unknown): ApiError {
  if (!(error instanceof AxiosError)) {
    return { status: null, messages: [], retryAfterSeconds: null, isNetworkError: false }
  }
  const response = error.response
  if (!response) {
    return { status: null, messages: [], retryAfterSeconds: null, isNetworkError: true }
  }
  const body = response.data as Partial<ApiErrorBody> | undefined
  const message = body?.message
  const retryAfter = Number.parseInt(String(response.headers['retry-after'] ?? ''), 10)
  return {
    status: response.status,
    messages: Array.isArray(message) ? message : message ? [message] : [],
    retryAfterSeconds: Number.isFinite(retryAfter) ? retryAfter : null,
    isNetworkError: false,
  }
}
