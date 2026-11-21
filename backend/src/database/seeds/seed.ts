import bcrypt from 'bcrypt';
import { BCRYPT_ROUNDS } from '../../common/constants.js';
import { Role } from '../../common/enums/role.enum.js';
import { Location, LocationType } from '../../modules/locations/entities/location.entity.js';
import { User } from '../../modules/users/entities/user.entity.js';
import { AppDataSource } from '../data-source.js';

/**
 * Idempotent seed: safe to run repeatedly. It creates missing rows and
 * never overwrites existing ones (including the admin's password).
 */
const LOCATIONS: Array<Pick<Location, 'name' | 'type'>> = [
  { name: 'Warehouse A', type: LocationType.WAREHOUSE },
  { name: 'Warehouse B', type: LocationType.WAREHOUSE },
  { name: 'Shop C', type: LocationType.SHOP },
];

async function seed(): Promise<void> {
  const adminUsername = (process.env.SEED_ADMIN_USERNAME ?? 'admin').trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error('Set SEED_ADMIN_PASSWORD (min 8 chars) in .env before seeding');
  }

  await AppDataSource.initialize();
  try {
    await AppDataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(Location)
        .values(LOCATIONS)
        .orIgnore() // ON CONFLICT DO NOTHING (name is unique)
        .execute();

      const users = manager.getRepository(User);
      if (await users.existsBy({ username: adminUsername })) {
        console.log(`Admin "${adminUsername}" already exists, skipped`);
      } else {
        await users.insert({
          username: adminUsername,
          fullName: 'Administrator',
          role: Role.ADMIN,
          passwordHash: await bcrypt.hash(adminPassword, BCRYPT_ROUNDS),
        });
        console.log(`Admin "${adminUsername}" created`);
      }
    });

    const locations = await AppDataSource.getRepository(Location).find({ order: { name: 'ASC' } });
    console.log(`Locations: ${locations.map((l) => l.name).join(', ')}`);
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
