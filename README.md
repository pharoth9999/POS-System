# POS System

- `frontend/`: Vue 3 SPA ([frontend/README.md](frontend/README.md))
- `backend/`: NestJS API ([backend/README.md](backend/README.md))
- `infra/`: docker-compose, nginx, deploy scripts
- `docs/PLAN.md`: project plan

## Quick start

```bash
# 1. Backend: API on http://localhost:3000/api, docs at /api/docs
cd backend
cp .env.example .env      # set SEED_ADMIN_PASSWORD and CORS_ORIGIN
npm install
npm run db:up && npm run migration:run && npm run seed
npm run start:dev

# 2. Frontend, in a second terminal: http://localhost:5173
cd frontend
cp .env.example .env
npm install
npm run dev
```

## CI

GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on every push and pull request to `main` and `develop`:

- **Frontend:** lint (no auto-fix, warnings fail), type-check, unit tests, build.
- **Backend:** lint, type-check, unit tests, build, then against a fresh Postgres 17: migrations, a check that no entity
  changed without a migration, seed, and e2e tests.
