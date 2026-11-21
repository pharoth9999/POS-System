import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Optional } from '../../../common/decorators/optional.decorator.js';
import { Role } from '../../../common/enums/role.enum.js';

export class CreateUserDto {
  @ApiProperty({ example: 'cashier1' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9._-]+$/, {
    message: 'username may only contain letters, numbers, ".", "_" and "-"',
  })
  username: string;

  @ApiProperty({ example: 'Sok Dara' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ minLength: 8, example: 'Cashier123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt ignores bytes beyond 72
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.CASHIER })
  @Optional()
  @IsEnum(Role)
  role?: Role;
}
