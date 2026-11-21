import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import type { AppConfig } from '../config/configuration.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

/**
 * Single source of truth for TypeORM options, shared by the Nest app
 * (DatabaseModule) and the TypeORM CLI (data-source.ts).
 *
 * Entities and migrations are loaded from compiled JS in dist/, so the CLI
 * always runs against `npm run build` output (see package.json scripts).
 */
export function buildTypeOrmOptions(db: AppConfig['db']): DataSourceOptions {
  return {
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    // Use the built-in gen_random_uuid() (PG 13+) instead of the uuid-ossp extension.
    uuidExtension: 'pgcrypto',
    entities: [join(import.meta.dirname, '..', '**', '*.entity.js')],
    migrations: [join(import.meta.dirname, 'migrations', '*.js')],
    migrationsTableName: 'migrations',
    namingStrategy: new SnakeNamingStrategy(),
    // Schema changes go through migrations only.
    synchronize: false,
    migrationsRun: false,
    logging: ['error', 'warn', 'migration'],
  };
}
