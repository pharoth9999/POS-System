import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Role } from '../../../common/enums/role.enum.js';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  /** Never selected by default, never serialized, hidden from Swagger. */
  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'varchar', length: 100, select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role, enumName: 'user_role', default: Role.CASHIER })
  role: Role;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
