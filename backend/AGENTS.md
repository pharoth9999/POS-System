# AGENTS.md: POS backend

NestJS + TypeORM + PostgreSQL API for a 3-location POS (Warehouse A → Warehouse B → Shop C).
Roles: ADMIN and CASHIER. Modular architecture: one folder per feature in `src/modules/`.

## NestJS version
This app's NestJS is likely newer than what you know. Check https://docs.nestjs.com/llms.txt
before relying on memory. Agent skills are in `.claude/skills/` (update: `npx @nestjs/skills add --agent all`).
- ESM only: relative imports end in `.js`, use `import.meta.dirname` (no `__dirname`), never `import type` for an injected class.
- Tests use Vitest: `vi.fn()`, not `jest.fn()`.
- Check Nest's first-party packages before adding a library: `@nestjs/throttler`, `@nestjs/schedule`,
  `@nestjs/event-emitter`, `@nestjs/terminus`, `@nestjs/cache-manager`.

## Commands
Only the database runs in Docker in development. The backend and frontend run locally. See `infra/README.md`.
- `npm run db:up`: start Postgres (127.0.0.1:5433) and wait until it's healthy
- `npm run db:down`: stop the container. The data volume is kept. Never use `down -v` or delete `pos-system_pos_pgdata` unless asked.
- `npm run db:logs`: follow the Postgres logs
- `npm run db:reset`: DESTRUCTIVE. Drops and recreates the schema, then runs migrations + seed. It asks for confirmation,
  so never run it unless the user asks. Local databases only.
- `npm run start:dev`: http://localhost:3000/api, Swagger at /api/docs
- `npm run migration:generate -- src/database/migrations/<Name>`, `npm run migration:run`, `npm run seed`
- `npm run lint && npm test && npm run test:e2e`: run before every commit

## Structure
- `src/main.ts`: starts the app. `src/app.setup.ts`: `configureApp()` holds ALL global HTTP setup
  (prefix, CORS, pipes, filters, interceptors). main.ts and e2e tests both call it, so add global setup there.
- `src/config/`: env config, validated at startup. New env vars go in `.env.example` and the validation.
- `src/database/`: data source, migrations, seeds. The CLI and seed run from compiled `dist/`, so those scripts build first.
- `src/common/`: guards, decorators, filters, base entity, money helpers, pagination.
- `src/modules/<name>/`: `<name>.module.ts`, `.controller.ts`, `.service.ts`, `entities/`, `dto/`.
- Unit tests sit beside the code as `*.spec.ts`. E2e tests are in `test/`.
- `backend/docs/`: backend documentation. `decisions.md` holds project-wide decisions, and `features/<module>.md` has one doc per feature.
  Never put these in the repo-root `docs/`, which only holds `PLAN.md`.

## Code rules
- Controllers handle HTTP only. Business logic goes in services.
- A module uses another module's exported service, never its repository.
- Entities extend `BaseEntity` (uuid `id`, `createdAt`, `updatedAt`). DB columns are snake_case (`SnakeNamingStrategy`).
  Wrap relation types in `Relation<T>`.
- Register every entity in its module's `TypeOrmModule.forFeature([...])`. `autoLoadEntities` ignores unregistered ones.
- `synchronize` is off. Every schema change needs a migration, and you must review the generated SQL.
- Wrap every stock, sale, transfer and debt change in one DB transaction.
- Quantities are `decimal(12,3)`.
- Optional DTO fields use `@Optional()` from `common/decorators`, never `@IsOptional()` or `PartialType()` (they let `null` through).
- **No auth right now** (removed 2026-11-21, to be rebuilt as a whole). Every endpoint is open. Don't add ad-hoc
  guards or role checks to single routes: the **Roles** business rule below is the plan for when auth comes back.
- List endpoints take `PaginationQueryDto` and return `paginate(await repo.findAndCount(...), query)`.
- Never commit `.env`.
- When a task says how to test, follow it. When it says nothing, add focused tests for what you changed.

## Money (no exceptions)
- All money math goes through `src/common/money/money.ts` (decimal.js): `sumMoney`, `lineTotal`,
  `percentDiscount`, `applyPercentDiscount`, `money(x).plus/minus/times`.
- Never use plain JS math, `Number()`, `parseFloat()` or `toFixed()` on money.
- Money columns use `@MoneyColumn()` (`decimal(12,2)`) and are typed `string`. DTOs accept money as strings.
- Keep intermediate values unrounded. Round half-up to 2 decimals only at the end with `toMoneyString()`.
  Never round each line and then sum.

## Business rules
- **Stock:** tracked per product per location. Every change is written to stock history.
- **Transfers:** A → B → C. PENDING until the receiver confirms. Save `sentQty` and `receivedQty`, and move stock only on confirm.
- **Prices:** each product has a buy and a sell price. A sale saves both at that moment, so old reports don't change.
- **Roles:** only ADMIN changes prices, stock, products, users and settings. CASHIER sells at Shop C,
  applies % discounts, adds members, records debt payments, and can view stock at all locations.
- **Members:** no discount. After each sale, update `visitCount` and `totalSpend`, then set the level
  (SILVER / GOLD / DIAMOND) from the thresholds in settings.
- **Debt:** a credit sale adds to the member's debt. Payments can be partial and are kept in a history. No credit limit.
- **Low stock:** one global threshold in settings, checked per location after each stock change.
- **Telegram:** send every receipt and every low-stock alert. If sending fails, the sale still succeeds.

## Feature docs (required)
When you finish a feature, write or update `backend/docs/features/<module>.md` in the same commit:
1. **What it does:** what the user can do now, in 2-4 sentences.
2. **How it works:** main files, entities, endpoints, and the flow step by step.
3. **Behind the scenes:** follow one real request through middleware → guards → pipes → controller → service → DB.
   Include the SQL that runs, why each transaction or lock is there, what the framework or library does for us that our code doesn't show,
   what happens on errors, and a Mermaid sequence diagram.
4. **Why this way:** the key decisions and the reason for each.
5. **Trade-offs:** the alternatives considered and what this choice costs us.
6. **Limits:** edge cases not handled, TODOs.
7. **How to test:** commands, Swagger steps, which tests cover it.

Write for a teammate who knows TypeScript but has never seen this code. Explain the why, not only the what.
If you're unsure how a library works inside, check its docs instead of guessing.
Add project-wide decisions (money, auth, ports) to `backend/docs/decisions.md` with the date, the decision and the reason.