# AGENTS.md: POS frontend

Vue 3 + Vite + TypeScript (strict) SPA for the 3-location POS (Warehouse A → Warehouse B → Shop C).
It talks to the NestJS API in `../backend` (business rules: `../backend/AGENTS.md`).
Roles: ADMIN (back office) and CASHIER (sells at Shop C). Default language Khmer, English fallback.

## Before you start
1. These packages may be newer than what you know. Check their docs before relying on memory:
   Vue 3.5, Vite 8, Vue Router 5, Pinia 4, vue-i18n 11, Tailwind CSS 4 (CSS-first, no `tailwind.config.js`),
   ESLint 10 + Oxlint, Vitest 4, TypeScript 6.
2. Search for existing code before writing new code (see "Reuse first").
3. When a task says how to test, follow it. When it says nothing, add focused tests for what you changed.

## Commands
- `npm run dev`: http://localhost:5173 (must match `CORS_ORIGIN` in `backend/.env`; the backend must be running)
- `npm run lint`: Oxlint + ESLint (auto-fixes). `npm run format`: Prettier.
- `npm run type-check`, `npm test` (single run), `npm run test:unit` (watch)
- `npm run build`: type-check + production build into `dist/`
- Before every commit: `npm run lint && npm run type-check && npm test && npm run build`
- CI (`.github/workflows/ci.yml`, on push/PR to `main` and `develop`) runs `check:lint` (Oxlint + ESLint without
  auto-fix, any warning fails), `type-check`, `test` and `build-only`. Run `npm run check:lint` to see what CI sees.

## Structure
- `src/main.ts`: creates the app and installs Pinia, i18n and the router.
- `src/router/index.ts`: routes with `meta.title` (typed in `router/meta.ts`). Layouts are parent routes. No guard.
- `src/layouts/`: `AdminLayout` (sidebar back office), `CashierLayout` (full-screen POS).
- `src/views/`: one page per route (`XxxView.vue`). Unbuilt pages use `<PagePlaceholder>`.
- `src/components/`: `base/` for generic UI, one folder per feature for the rest (`receipt/`, ...).
- `src/composables/`, `src/utils/`: shared logic (see "Reuse first").
- `src/services/`: `api.ts` (the single axios instance) and one `<x>Service.ts` per backend module.
- `src/stores/`: Pinia setup stores: `cartStore` (POS cart), `settingsStore` (language, shop settings).
- `src/types/`: interfaces mirroring the backend DTOs. Each one names its backend file in a comment.
- `src/locales/`: `en.json` (source of truth), `km.json`, `index.ts` (i18n instance).
- `src/assets/`: `main.css` (Tailwind + theme), `print.css` (receipts), `fonts/` (Kantumruy Pro, self-hosted).
- Tests: `__tests__/` next to the code, as `*.spec.ts`.
- `frontend/docs/`: `decisions.md` and `features/<module>.md`. Never put these in the repo-root `docs/` (only `PLAN.md`).

## Reuse first (required)
Before writing a component, composable, util, type or service function, search `src/`. Use what exists.
If it almost fits, extend it with a prop or option instead of making a near-copy.
- UI: `BaseButton`, `BaseInput`, `BaseModal`, `BaseTable`, `PagePlaceholder`, `ReceiptPrint`.
  Don't style a raw `<button>` or `<table>` when a Base component exists.
- Logic: `useMoney`, `usePagination`, `useToast`; `money`, `formatMoney`, `formatDate`, `validators`, `print`.
- API: add a function to the existing `xxxService.ts`. Types: reuse `src/types/`, never redeclare a DTO in a component.
- A pattern used in 2+ places becomes a component, composable or util.
- When you add something reusable, list it above so the next agent finds it.
- In your final summary, say what you reused and what you added.

## Code rules
**Vue and TypeScript**
- `<script setup lang="ts">` + Composition API only. No Options API, no `defineComponent({...})`.
- Import with the `@/` alias (`@/stores/cartStore`), never long `../../` paths.

**API**
- Components never call axios. Views and stores call a `xxxService`, and services call `api`.
- Never create another axios instance or add interceptors elsewhere.
- Catch errors with `toApiError(error)` and show a translated message. Never show raw backend text.
- Types in `src/types/` must match the backend DTOs. When a DTO changes, update the type in the same change.

**i18n**
- Every user-visible string goes through `t('...')`. No hard-coded English or Khmer in templates.
- Add each key to BOTH `en.json` and `km.json`. A test fails if their keys or `{placeholders}` differ.

**Styling**
- Tailwind utility classes. Theme tokens (`--color-brand-*`, font) live in `@theme` in `assets/main.css`.
- Touch targets are at least 44px (`min-h-11`): POS screens are touchscreens.
- Khmer needs room: `line-height` 1.5 or more, and never fixed heights on text containers.
- Dates: always `formatDate()`, which shows Asia/Phnom_Penh time on any device.

**Security**
- **No login right now** (removed 2026-11-21, see `docs/decisions.md`). Requests carry no token and every page is open.
  Don't add role checks or route guards piecemeal. When login returns, it comes back as a whole and its token logic goes in `api.ts` only.
- Only `.env.example` is committed. Only `VITE_*` variables reach the browser, so never put secrets in them.

## Money (no exceptions)
- Money comes from the API as strings ("12.50") and stays `MoneyString` in types and stores.
- All money math goes through `src/utils/money.ts` (decimal.js, mirrors `backend/src/common/money/money.ts`):
  `sumMoney`, `lineTotal`, `percentDiscount`, `applyPercentDiscount`, `money(x).plus/minus/times`.
- Never use `+ - * /`, `Number()`, `parseFloat()`, `toFixed()` or `Math.*` on money.
- **No money math in components.** Totals come from `cartStore` or the API. Components only format with `useMoney().format()`.
- Keep intermediate values unrounded. Round half-up to 2 decimals only at the end with `toMoneyString()`.
- The backend recomputes every total at checkout. Receipts print the backend's numbers, not the cart's.

## Receipts
- `<ReceiptPrint :receipt format="80mm|a4">` renders the receipt. It's hidden on screen and is the only thing printed.
- `printReceipt('80mm' | 'a4')` from `utils/print.ts` sets the `@page` size and calls `window.print()`.
- Print rules live in `assets/print.css` (`@media print`). Test both formats in the browser's print preview.

## Feature docs (required)
When you finish a feature, write or update `frontend/docs/features/<module>.md` in the same commit,
using the `feature-docs` skill. Project-wide frontend decisions go in `frontend/docs/decisions.md`.
