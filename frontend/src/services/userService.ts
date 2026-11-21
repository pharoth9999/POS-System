import type {
  CreateUserRequest,
  Paginated,
  PaginationQuery,
  UpdateUserRequest,
  User,
} from '@/types'

import { api } from './api'

/** backend: modules/users/users.controller.ts (ADMIN only) */
export const userService = {
  async list(query: PaginationQuery = {}): Promise<Paginated<User>> {
    const { data } = await api.get<Paginated<User>>('/users', { params: query })
    return data
  },

  async get(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  async create(body: CreateUserRequest): Promise<User> {
    const { data } = await api.post<User>('/users', body)
    return data
  },

  async update(id: string, body: UpdateUserRequest): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, body)
    return data
  },
}
