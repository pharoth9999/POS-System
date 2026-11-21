import type { BaseEntity } from './api'

/** backend: modules/locations/entities/location.entity.ts */
export const LocationType = {
  WAREHOUSE: 'WAREHOUSE',
  SHOP: 'SHOP',
} as const
export type LocationType = (typeof LocationType)[keyof typeof LocationType]

export interface Location extends BaseEntity {
  name: string
  type: LocationType
  isActive: boolean
}
