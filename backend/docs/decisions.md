# Decisions

Project-wide decisions, newest first. Each entry has the date, the decision and the reason.

## 2026-11-21: Authentication removed (to be rebuilt)
**Decision:** All login code was removed: the auth module (login, refresh, logout, `/auth/me`), JWT, the global
JWT and role guards, `@Public()` / `@Roles()` / `@CurrentUser()`, the login rate limit (`@nestjs/throttler`),
the `JWT_*` env vars, and the `refresh_tokens` table (migration `DropRefreshTokens`, which `migration:revert` can undo).
The users module stays as plain CRUD. Passwords are still hashed with bcrypt, and users keep their `role`.
**Reason:** The project owner asked for a clean slate to rebuild login later.
**Cost:** Every endpoint is open, including creating users and changing roles. Only run the API on a trusted
machine or network until auth is back. The two auth entries below are superseded and kept for history.

## 2026-11-21: Development runs only the DB in Docker
**Decision:** In development, `infra/docker-compose.yml` runs only Postgres 17, bound to `127.0.0.1:5433`
(overridable with `DB_PORT` in `backend/.env`). The backend (`npm run start:dev`) and frontend
(`npm run dev`) run directly on the host.
**Reason:** Fast hot reload: Nest's watch mode and Vite's HMR react to file changes instantly, with no bind
mounts or file-watching problems across the Docker VM on macOS. Easier debugging: breakpoints, `--inspect`
and stack traces work with no port forwarding or source-path mapping. The database is the part that
benefits from Docker (exact version, isolated data, one command to start).
**Cost:** Everyone needs Node 22+ installed locally, and dev doesn't run in the production container image.
Backend and frontend services can be added to compose later for a production-like check.
**Notes:** `db:down` never removes the volume. Destroying data needs an explicit `npm run db:reset` (typed
confirmation) or `docker volume rm`. `127.0.0.1` binding keeps the dev database off the shop LAN.

## 2026-11-21: Helmet for security headers
**Decision:** `app.use(helmet())` in `configureApp()` with default options.
**Reason:** It sets CSP, HSTS, `X-Content-Type-Options` and frame protection, and removes `X-Powered-By`, in one line. Swagger UI loads its scripts from files, so it works under the default CSP without exceptions.
**Note:** The default CSP includes `upgrade-insecure-requests`. If Swagger is ever opened over plain HTTP on a LAN IP (not `localhost`), the browser will try HTTPS for its assets. Serve it through nginx with TLS, or relax that directive.

## 2026-11-21: Money with decimal.js, rounded once at the end
**Decision:** Money columns are `decimal(12,2)` typed as `string`. All money math goes through `src/common/money/money.ts` (decimal.js) and is rounded half-up to 2 decimals only at the end.
**Reason:** JS numbers drift (`0.1 + 0.2`) and round wrong (`(2.675).toFixed(2) === '2.67'`). Rounding each line and then summing gives totals that differ from the receipt.

## 2026-11-21: Auth with @nestjs/jwt + bcrypt and rotating refresh tokens (superseded: auth removed)
**Decision:** 15-minute JWT access tokens. Refresh tokens are random, stored as SHA-256 hashes, and rotated on every use. Reusing a revoked token revokes all of that user's sessions. The user is reloaded from the DB on every request.
**Reason:** This is the stack the project asked for. Reloading the user makes deactivation and role changes take effect immediately.

## 2026-11-21: Login rate limit per IP + username, in memory (superseded: auth removed)
**Decision:** `@nestjs/throttler`: 5 login attempts per minute per IP + username, with in-memory storage.
**Reason:** All cashiers in a shop share one public IP, so a per-IP limit would let one person lock out the whole shop. The API runs as a single instance, so Redis isn't needed. If it ever runs more than one instance, the counters must move to Redis.

## 2026-11-21: CORS from an explicit origin list
**Decision:** `CORS_ORIGIN` is required and holds comma-separated exact origins. `*` and paths are rejected at startup.
**Reason:** A wildcard would let any website call the API from a logged-in browser.

## 2026-11-21: Postgres on port 5433 locally
**Decision:** `infra/docker-compose.yml` publishes Postgres on 5433.
**Reason:** Another local Postgres container already uses 5432.
