import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { api, toApiError } from '../api'

type Handler = (config: InternalAxiosRequestConfig) => {
  status: number
  data?: unknown
  headers?: Record<string, string>
}

/** A fake axios adapter: rejects like axios does for non-2xx responses. */
function adapter(handler: Handler) {
  return vi.fn<(config: InternalAxiosRequestConfig) => Promise<AxiosResponse>>(async (config) => {
    const { status, data = {}, headers = {} } = handler(config)
    const response: AxiosResponse = { status, statusText: String(status), data, headers, config }
    if (status >= 400) {
      throw new AxiosError(`HTTP ${status}`, 'ERR_BAD_REQUEST', config, null, response)
    }
    return response
  })
}

describe('api', () => {
  it('sends no Authorization header (no auth right now)', async () => {
    const http = adapter(() => ({ status: 200 }))
    api.defaults.adapter = http
    await api.get('/users')
    expect(http.mock.calls[0]![0].headers.Authorization).toBeUndefined()
  })
})

describe('toApiError', () => {
  it('reads status, messages and Retry-After', async () => {
    api.defaults.adapter = adapter(() => ({
      status: 429,
      data: { statusCode: 429, message: 'Too Many Requests' },
      headers: { 'retry-after': '42' },
    }))
    const error = await api.get('/users').catch((e: unknown) => e)
    expect(toApiError(error)).toEqual({
      status: 429,
      messages: ['Too Many Requests'],
      retryAfterSeconds: 42,
      isNetworkError: false,
    })
  })

  it('keeps every validation message', () => {
    const response = { status: 400, data: { message: ['a', 'b'] }, headers: {} } as AxiosResponse
    expect(toApiError(new AxiosError('x', 'ERR', undefined, null, response)).messages).toEqual([
      'a',
      'b',
    ])
  })

  it('flags network errors', () => {
    expect(toApiError(new AxiosError('Network Error', 'ERR_NETWORK')).isNetworkError).toBe(true)
  })
})
