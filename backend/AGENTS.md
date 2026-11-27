# AGENTS.md: POS backend

NestJS + TypeORM + PostgreSQL API for a 3-location POS (Warehouse A → Warehouse B → Shop C).
Roles: ADMIN and CASHIER. Modular architecture: one folder per feature in `src/modules/`.

## Before you start
1. NestJS here is likely newer than what you know. Check https://docs.nestjs.com/llms.txt before relying on memory.
   Agent skills are in `.claude/skills/` (update: `npx @nestjs/skills add --agent all`).
2. Search for existing code before writing new code (see "Reuse first").
3. When a task says how to test, follow it. When it says nothing, add focused tests for what you changed.

## Commands
Only the database runs in Docker in development. The backend and frontend run locally. See `infra/README.md`.
- `npm run db:up`: start Postgres (127.0.0.1:5433) and wait until it's healthy
- `npm run db:down`: stop the container and keep the data. Never use `down -v` or delete `pos-system_pos_pgdata` unless asked.
- `npm run db:logs`: follow the Postgres logs
- `npm run db:reset`: **DESTRUCTIVE**. Drops the schema, then runs migrations + seed. Only when the user asks, local only.
- `npm run start:dev`: http://localhost:3000/api, Swagger at /api/docs
- `npm run migration:generate -- src/database/migrations/<Name>`, `npm run migration:run`, `npm run seed`
- Before every commit: `npm run lint && npm test && npm run test:e2e`
- CI (`.github/workflows/ci.yml`, on push/PR to `main` and `develop`) runs `check:lint` (Oxlint, warnings fail),
  `type-check`, `test`, `build`, `migration:run`, `migration:check` (fails if an entity changed without a migration),
  `seed` and `test:e2e`, against a fresh Postgres 17. Run `npm run migration:check` locally after changing entities.

## Structure
- `src/main.ts`: starts the app. `src/app.setup.ts`: `configureApp()` holds ALL global HTTP setup
  (prefix, CORS, pipes, filters, interceptors). main.ts and e2e tests both call it, so add global setup there.
- `src/config/`: env config, validated at startup. New env vars go in `.env.example` and the validation.
- `src/database/`: data source, migrations, seeds. The CLI and seed run from compiled `dist/`, so those scripts build first.
- `src/common/`: shared code (see "Reuse first").
- `src/modules/<name>/`: `<name>.module.ts`, `.controller.ts`, `.service.ts`, `entities/`, `dto/`.
- Tests: unit tests beside the code as `*.spec.ts`, e2e tests in `test/`.
- `backend/docs/`: `decisions.md` and `features/<module>.md`. Never put these in the repo-root `docs/` (only `PLAN.md`).

## Reuse first (required)
Before writing a helper, DTO, decorator, guard, column or service method, search `src/common/`,
the module's own folder and other modules' exported services. Use what exists. If it almost fits, extend it, don't copy it.
- Already in `src/common/`: `BaseEntity`, `@MoneyColumn()`, `@Optional()`, money helpers (`money/money.ts`),
  `PaginationQueryDto` + `paginate()`, filters.
- Logic used by 2+ modules goes in `src/common/` or in the owning module's exported service.
- When you add something reusable, list it above so the next agent finds it.
- In your final summary, say what you reused and what you added to `common/`.

## Code rules
**NestJS**
- ESM only: relative imports end in `.js`, use `import.meta.dirname` (no `__dirname`), never `import type` for an injected class.
- Controllers handle HTTP only. Business logic goes in services.
- A module uses another module's exported service, never its repository.
- Optional DTO fields use `@Optional()`, never `@IsOptional()` or `PartialType()` (they let `null` through).
- List endpoints take `PaginationQueryDto` and return `paginate(await repo.findAndCount(...), query)`.
- Check Nest's first-party packages before adding a library: `@nestjs/throttler`, `@nestjs/schedule`,
  `@nestjs/event-emitter`, `@nestjs/terminus`, `@nestjs/cache-manager`.
- Tests use Vitest: `vi.fn()`, not `jest.fn()`.

**Database**
- Entities extend `BaseEntity` (uuid `id`, `createdAt`, `updatedAt`). Columns are snake_case (`SnakeNamingStrategy`).
  Wrap relation types in `Relation<T>`.
- Register every entity in its module's `TypeOrmModule.forFeature([...])`. `autoLoadEntities` ignores unregistered ones.
- `synchronize` is off. Every schema change needs a migration, and you must review the generated SQL.
- Wrap every stock, sale, transfer and debt change in one DB transaction.
- Quantities are `decimal(12,3)`.

**Security**
- **No auth right now** (removed 2026-11-21, to be rebuilt as a whole). Every endpoint is open.
  Don't add guards or role checks to single routes. The Roles rule below is the plan for when auth returns.
- Never commit `.env`.

## Money (no exceptions)
- All money math goes through `src/common/money/money.ts` (decimal.js): `sumMoney`, `lineTotal`,
  `percentDiscount`, `applyPercentDiscount`, `money(x).plus/minus/times`.
- Never use `+ - * /`, `Number()`, `parseFloat()` or `toFixed()` on money.
- Money columns use `@MoneyColumn()` (`decimal(12,2)`) and are typed `string`. DTOs accept money as strings.
- Keep intermediate values unrounded. Round half-up to 2 decimals only at the end with `toMoneyString()`.
  Never round each line and then sum.

## Business rules
- **Stock:** tracked per product per location. Every change is written to stock history.
- **Transfers:** A → B → C. PENDING until the receiver confirms. Save `sentQty` and `receivedQty`; move stock only on confirm.
- **Prices:** each product has a buy and a sell price. A sale saves both at that moment, so old reports don't change.
- **Roles:** only ADMIN changes prices, stock, products, users and settings. CASHIER sells at Shop C,
  applies % discounts, adds members, records debt payments, and views stock at all locations.
- **Members:** no discount. After each sale, update `visitCount` and `totalSpend`, then set the level
  (SILVER / GOLD / DIAMOND) from the thresholds in settings.
- **Debt:** a credit sale adds to the member's debt. Payments can be partial and are kept in a history. No credit limit.
- **Low stock:** one global threshold in settings, checked per location after each stock change.
- **Telegram:** send every receipt and low-stock alert. If sending fails, the sale still succeeds.

## Feature docs (required)
When you finish a feature, write or update `backend/docs/features/<module>.md` in the same commit,
using the `feature-docs` skill. Project-wide decisions go in `backend/docs/decisions.md`.