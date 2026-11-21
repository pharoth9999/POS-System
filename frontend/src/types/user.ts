import type { BaseEntity } from './api'

/** backend: common/enums/role.enum.ts */
export const Role = {
  ADMIN: 'ADMIN',
  CASHIER: 'CASHIER',
} as const
export type Role = (typeof Role)[keyof typeof Role]

/** backend: modules/users/entities/user.entity.ts (passwordHash is never sent) */
export interface User extends BaseEntity {
  username: string
  fullName: string
  role: Role
  isActive: boolean
}

/** backend: modules/users/dto/create-user.dto.ts */
export interface CreateUserRequest {
  username: string
  fullName: string
  password: string
  role?: Role
}

/** backend: modules/users/dto/update-user.dto.ts (fields may be left out, never null) */
export interface UpdateUserRequest {
  fullName?: string
  password?: string
  role?: Role
  isActive?: boolean
}
