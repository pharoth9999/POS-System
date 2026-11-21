import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Optional } from '../../../common/decorators/optional.decorator.js';
import { Role } from '../../../common/enums/role.enum.js';

/**
 * Every field may be left out, none may be null. Written out rather than
 * PartialType(CreateUserDto), because PartialType adds @IsOptional(), which
 * lets null through. Username is immutable.
 */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Sok Dara' })
  @Optional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @Optional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;

  @ApiPropertyOptional({ enum: Role })
  @Optional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional()
  @Optional()
  @IsBoolean()
  isActive?: boolean;
}
