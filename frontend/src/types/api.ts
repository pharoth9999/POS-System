/**
 * Shapes shared by every endpoint. Mirrors backend/src/common.
 * Money is always a string ("12.50"): see utils/money.ts.
 */

/** A decimal(12,2) amount exactly as the API sends it, e.g. "12.50". */
export type MoneyString = string

/** ISO 8601 timestamp, e.g. "2026-11-21T11:58:31.681Z". */
export type IsoDateString = string

/** backend: common/dto/pagination.dto.ts (PaginationQueryDto) */
export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
}

/** backend: common/dto/pagination.dto.ts (PaginationMeta) */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** backend: common/dto/pagination.dto.ts (Paginated<T>) */
export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}

/** backend: common/filters/all-exceptions.filter.ts (ErrorBody) */
export interface ApiErrorBody {
  statusCode: number
  error: string
  /** One message, or one per failed field for validation errors. */
  message: string | string[]
  path: string
  timestamp: IsoDateString
}

/** backend: common/entities/base.entity.ts */
export interface BaseEntity {
  id: string
  createdAt: IsoDateString
  updatedAt: IsoDateString
}
