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
