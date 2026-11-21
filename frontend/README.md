# POS frontend

Vue 3 + Vite 8 + TypeScript (strict), Tailwind CSS 4, Pinia, Vue Router, Axios, vue-i18n (Khmer by default, English).

## Run it locally

Requires Node 22.18+ (or 24.12+) and the backend running on port 3000.

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev              # http://localhost:5173
```

Port 5173 must match `CORS_ORIGIN` in `backend/.env`.

## Scripts

| Script | What it does |
| --- | --- |
| `dev` | Dev server with hot reload |
| `build` | Type-check + production build into `dist/` |
| `preview` | Serve the built `dist/` |
| `type-check` | `vue-tsc` over app, tests and config |
| `lint` | Oxlint + ESLint, auto-fixing |
| `format` | Prettier on `src/` |
| `test` / `test:unit` | Vitest once / in watch mode |

## Where things are

See [AGENTS.md](AGENTS.md) for the structure and the rules (money, i18n, receipts), and
[docs/decisions.md](docs/decisions.md) for why things are built this way.

## Status

Scaffold only, with **no login** (removed 2026-11-21): layouts, router, axios, stores, base components,
the receipt print layout, and empty pages for every feature.
