import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.options.js';

/**
 * DataSource used by the TypeORM CLI (migration:generate / migration:run)
 * and by the seed script. The Nest app does not import this file.
 */
try {
  process.loadEnvFile('.env');
} catch {
  // No .env file: rely on variables already present in the environment.
}

export const AppDataSource = new DataSource(
  buildTypeOrmOptions({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'pos',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'pos',
  }),
);
// Note: the TypeORM CLI requires exactly one exported DataSource, so there is
// deliberately no `export default` here.
