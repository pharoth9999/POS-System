import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';

const errorsFor = async (cls: new () => object, body: object) =>
  (await validate(plainToInstance(cls, body))).map((e) => e.property);

describe('UpdateUserDto', () => {
  it('accepts an empty body and partial updates', async () => {
    expect(await errorsFor(UpdateUserDto, {})).toEqual([]);
    expect(await errorsFor(UpdateUserDto, { fullName: 'New Name', isActive: false })).toEqual([]);
  });

  it.each(['fullName', 'password', 'role', 'isActive'])('rejects %s: null', async (field) => {
    expect(await errorsFor(UpdateUserDto, { [field]: null })).toEqual([field]);
  });

  it('still validates provided values', async () => {
    expect(await errorsFor(UpdateUserDto, { password: 'short', role: 'OWNER' })).toEqual([
      'password',
      'role',
    ]);
  });
});

describe('CreateUserDto', () => {
  const valid = { username: 'cashier2', fullName: 'Cashier', password: 'Cashier123!' };

  it('defaults role when left out but rejects role: null', async () => {
    expect(await errorsFor(CreateUserDto, valid)).toEqual([]);
    expect(await errorsFor(CreateUserDto, { ...valid, role: null })).toEqual(['role']);
  });
});
