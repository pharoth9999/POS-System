import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  SHOP = 'SHOP',
}

@Entity('locations')
export class Location extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'enum', enum: LocationType, enumName: 'location_type' })
  type: LocationType;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
