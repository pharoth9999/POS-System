#!/usr/bin/env node
/**
 * npm run db:reset: wipes the DEVELOPMENT database and rebuilds it.
 *
 *   1. Asks you to type the database name to confirm.
 *   2. DROP SCHEMA public CASCADE + CREATE SCHEMA public, in one transaction
 *      (every table, enum type and the migrations history are removed).
 *   3. npm run migration:run, then npm run seed.
 *
 * Guardrails: it only runs against localhost, never with NODE_ENV=production,
 * and only in an interactive terminal. The Docker volume is NOT deleted.
 */
import { spawnSync } from 'node:child_process';
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import pg from 'pg';

try {
  process.loadEnvFile('.env');
} catch {
  // No .env: use variables already in the environment.
}

const {
  NODE_ENV,
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER,
  DB_PASS,
  DB_NAME,
} = process.env;

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function fail(message) {
  console.error(`\n✖ db:reset refused: ${message}\n  Nothing was changed.\n`);
  process.exit(1);
}

if (NODE_ENV === 'production') fail('NODE_ENV is "production".');
if (!LOCAL_HOSTS.has(DB_HOST)) fail(`DB_HOST is "${DB_HOST}". Reset only works on a local database.`);
if (!DB_USER || !DB_NAME) fail('DB_USER and DB_NAME must be set (see .env.example).');
if (!stdin.isTTY) fail('it needs an interactive terminal to ask for confirmation.');

const target = `"${DB_NAME}" on ${DB_HOST}:${DB_PORT}`;
console.log(`
⚠  This DELETES ALL DATA in database ${target}:
   every table, the migrations history, users and sessions (everyone must log in again).
   Then it runs the migrations and the seed (3 locations + the admin from .env).
`);

const rl = createInterface({ input: stdin, output: stdout });
let answer = '';
try {
  answer = await rl.question(`Type the database name (${DB_NAME}) to confirm: `);
} catch {
  // Ctrl+C / Ctrl+D at the prompt: treat as "no".
} finally {
  rl.close();
}
if (answer.trim() !== DB_NAME) {
  console.log('\nAborted. Nothing was changed.\n');
  process.exit(1);
}

const client = new pg.Client({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

try {
  await client.connect();
} catch (error) {
  fail(`can't connect to ${target} (${error.message}). Is it running? Try: npm run db:up`);
}

try {
  // Postgres DDL is transactional: either the whole reset happens or nothing does.
  await client.query('BEGIN');
  await client.query('DROP SCHEMA IF EXISTS public CASCADE');
  await client.query('CREATE SCHEMA public AUTHORIZATION CURRENT_USER');
  // Same default privilege a fresh Postgres 15+ database gives the public schema.
  await client.query('GRANT USAGE ON SCHEMA public TO PUBLIC');
  await client.query('COMMIT');
  console.log(`\n✔ Schema "public" dropped and recreated in ${target}.\n`);
} catch (error) {
  await client.query('ROLLBACK').catch(() => undefined);
  console.error(`\n✖ Reset failed, rolled back: ${error.message}\n`);
  process.exit(1);
} finally {
  await client.end();
}

for (const script of ['migration:run', 'seed']) {
  console.log(`→ npm run ${script}`);
  const result = spawnSync('npm', ['run', script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.error(`\n✖ npm run ${script} failed. The schema is empty: fix the error, then run it again.\n`);
    process.exit(result.status ?? 1);
  }
}

console.log('\n✔ Database reset complete.\n');
