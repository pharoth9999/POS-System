import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { BCRYPT_ROUNDS } from '../../common/constants.js';
import { type Paginated, paginate, PaginationQueryDto } from '../../common/dto/pagination.dto.js';
import { Role } from '../../common/enums/role.enum.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    if (await this.usersRepo.existsBy({ username: dto.username })) {
      throw new ConflictException(`Username "${dto.username}" is already taken`);
    }
    const user = this.usersRepo.create({
      username: dto.username,
      fullName: dto.fullName,
      role: dto.role ?? Role.CASHIER,
      passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
    });
    const saved = await this.usersRepo.save(user);
    return this.findById(saved.id);
  }

  async findAll(query: PaginationQueryDto): Promise<Paginated<User>> {
    const where = query.search
      ? [{ username: ILike(`%${query.search}%`) }, { fullName: ILike(`%${query.search}%`) }]
      : {};
    const result = await this.usersRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: query.skip,
      take: query.limit,
    });
    return paginate(result, query);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id); // 404 if it doesn't exist

    const changes: Partial<User> = {};
    if (dto.fullName !== undefined) changes.fullName = dto.fullName;
    if (dto.role !== undefined) changes.role = dto.role;
    if (dto.isActive !== undefined) changes.isActive = dto.isActive;
    if (dto.password !== undefined) {
      changes.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }

    await this.usersRepo.update(id, changes);
    return this.findById(id);
  }
}
