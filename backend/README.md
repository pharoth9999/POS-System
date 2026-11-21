# POS backend

NestJS 12 (ESM, TypeScript strict) + TypeORM 1.x + PostgreSQL 17.

## Run it locally

Requires Node 22+ and Docker.

```bash
cd backend
cp .env.example .env          # then set SEED_ADMIN_PASSWORD and CORS_ORIGIN
npm install
npm run db:up                 # Postgres on 127.0.0.1:5433 (see ../infra/README.md)
npm run migration:run         # creates the tables
npm run seed                  # Warehouse A, Warehouse B, Shop C + admin user
npm run start:dev             # http://localhost:3000/api
```

Swagger UI: <http://localhost:3000/api/docs>.

## Scripts

| Script | What it does |
| --- | --- |
| `start:dev` | Run with hot reload |
| `migration:generate -- src/database/migrations/<Name>` | Diff entities against the DB and write a migration |
| `migration:run` / `migration:revert` / `migration:show` | Apply, undo the last, or list migrations |
| `seed` | Idempotent: inserts locations and the admin if missing |
| `db:up` / `db:down` | Start (and wait until healthy) or stop Postgres. `db:down` keeps the data |
| `db:logs` | Follow the container logs |
| `db:reset` | **Destructive:** drop and recreate the schema, then migrate + seed (asks for confirmation) |
| `test` / `test:e2e` | Unit tests / e2e tests (e2e needs the DB running) |

The TypeORM CLI and the seed run against compiled `dist/`, because this is an ESM project with decorator metadata. Those scripts run `nest build` first.

## Auth

**There is no authentication right now.** Login was removed on 2026-11-21 and will be rebuilt later
(see [docs/decisions.md](docs/decisions.md)). Every endpoint, including `/api/users`, is open to
anyone who can reach the API, so only run it on a trusted machine or network.

## CORS

`CORS_ORIGIN` is required and lists the exact frontend origins, comma-separated (for example `http://localhost:5173,https://pos.example.com`). `*` is rejected at startup.

## Money

Prices and amounts are `decimal(12,2)` columns, exposed as strings (`"12.50"`). All money math goes through `src/common/money/money.ts` (decimal.js) and is rounded half-up to 2 decimals only at the end. See the money rule in [AGENTS.md](AGENTS.md).

## Roles

- `ADMIN`: everything, including user management (`/api/users`), prices, stock and settings.
- `CASHIER`: sell, add members, view all stock, apply % discounts.

These are the planned permissions. With no auth, they aren't enforced yet. Users still store a `role`.

## Layout

```
src/
  main.ts                 global prefix /api, ValidationPipe, exception filter, Swagger
  app.module.ts
  config/                 typed config + Joi env validation
  database/               typeorm options, CLI data source, migrations/, seeds/
  common/                 base entity, decorators, filters, interceptors, pipes, money, pagination
  modules/
    users/                implemented (CRUD)
    products/ categories/ units/ locations/ stock/ transfers/
    sales/ members/ debts/ settings/ telegram/ reports/   skeletons
```
