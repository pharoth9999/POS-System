# AGENTS.md: POS frontend

Vue 3 + Vite + TypeScript (strict) SPA for the 3-location POS (Warehouse A → Warehouse B → Shop C).
It talks to the NestJS API in `../backend` (see `../backend/AGENTS.md` for the business rules).
Roles: ADMIN (back office) and CASHIER (sells at Shop C). **There is no login right now** (removed 2026-11-21): every page is open. Default language: Khmer, with English as fallback.

## Versions
These packages may be newer than what you know: Vue 3.5, Vite 8, Vue Router 5, Pinia 4, vue-i18n 11,
Tailwind CSS 4 (CSS-first config, no `tailwind.config.js`), ESLint 10 + Oxlint, Vitest 4, TypeScript 6.
Check their docs before relying on memory.

## Commands
- `npm run dev`: http://localhost:5173 (must match `CORS_ORIGIN` in `backend/.env`; the backend must be running)
- `npm run lint`: Oxlint + ESLint (auto-fixes). `npm run format`: Prettier.
- `npm run type-check`, `npm test` (Vitest, single run), `npm run test:unit` (watch)
- `npm run build`: type-check + production build into `dist/`
- `npm run lint && npm run type-check && npm test && npm run build`: run before every commit

## Structure
- `src/main.ts`: creates the app and installs Pinia, i18n and the router.
- `src/router/index.ts`: routes with `meta.title` (typed in `router/meta.ts`). Layouts are parent routes. No guard.
- `src/layouts/`: `AdminLayout` (sidebar back office), `CashierLayout` (full-screen POS).
- `src/views/`: one page per route (`XxxView.vue`). Pages that aren't built yet use `<PagePlaceholder>`.
- `src/components/base/`: `BaseButton`, `BaseInput`, `BaseModal`, `BaseTable`. Other folders hold feature components (`receipt/`, ...).
- `src/composables/`: `useMoney`, `usePagination`, `useToast`.
- `src/services/api.ts`: the single axios instance. `src/services/<x>Service.ts`: one per backend module.
- `src/stores/`: Pinia setup stores: `cartStore` (POS cart), `settingsStore` (language, shop settings).
- `src/types/`: TS interfaces mirroring the backend DTOs. Each one names its backend file in a comment.
- `src/utils/`: `money.ts`, `formatMoney.ts`, `formatDate.ts`, `validators.ts`, `print.ts`.
- `src/locales/`: `en.json` (source of truth), `km.json`, `index.ts` (i18n instance).
- `src/assets/`: `main.css` (Tailwind + theme), `print.css` (receipts), `fonts/` (Kantumruy Pro, self-hosted).
- Tests sit in `__tests__/` next to the code they test, as `*.spec.ts`.
- `frontend/docs/`: `decisions.md` and `features/<module>.md` (see below). Never put these in the repo-root `docs/`.

## Code rules
- `<script setup lang="ts">` + Composition API only. No Options API, no `defineComponent({...})`.
- Import with the `@/` alias (`@/stores/cartStore`), never long `../../` paths.
- Components never call axios directly: views/stores call a `xxxService`, and services call `api`.
- Never create another axios instance or add interceptors elsewhere. When login comes back, its token logic goes in `api.ts` only.
- Catch API errors with `toApiError(error)` and show a translated message. Never show raw backend text to users.
- Types in `src/types/` must match the backend DTOs. When a backend DTO changes, update the type in the same change.
- Every user-visible string goes through i18n (`t('...')`). Add the key to BOTH `en.json` and `km.json`
  (a test fails if their keys or `{placeholders}` differ). No hard-coded English or Khmer in templates.
- No auth right now: don't add role checks or route guards piecemeal. They come back with login, as a whole.
- Styling: Tailwind utility classes. Theme tokens (`--color-brand-*`, font) live in `@theme` in `assets/main.css`.
  Touch targets are at least 44px (`min-h-11`) because POS screens are touchscreens.
- Khmer text needs room: keep `line-height` at 1.5 or more, and never use fixed heights on text containers.
- Dates: `formatDate()`. It always shows Asia/Phnom_Penh time, whatever the device's time zone.
- Only `.env.example` is committed, never `.env`. Only `VITE_*` variables reach the browser, so never put secrets in them.
- When a task says how to test, follow it. When it says nothing, add focused tests for what you changed.

## Money (no exceptions)
- Money comes from the API as strings ("12.50") and stays a string (`MoneyString`) in types and stores.
- All money math goes through `src/utils/money.ts` (decimal.js): `sumMoney`, `lineTotal`, `percentDiscount`,
  `applyPercentDiscount`, `money(x).plus/minus/times`. It mirrors `backend/src/common/money/money.ts`.
- Never use `+ - * /`, `Number()`, `parseFloat()`, `toFixed()` or `Math.*` on money.
- **No money math in components.** Totals come from `cartStore` or from the API. Components only format,
  with `useMoney().format()` (which calls `formatMoney`).
- Keep intermediate values unrounded. Round half-up to 2 decimals only at the end with `toMoneyString()`.
- The backend recomputes every total at checkout. Receipts print the backend's numbers, not the cart's.

## Auth
- None right now. Login, tokens, the auth store and the role guard were removed on 2026-11-21 (see `docs/decisions.md`).
  Requests carry no token, and every page and endpoint is open.

## Receipts
- `<ReceiptPrint :receipt format="80mm|a4">` renders the receipt. It's hidden on screen and is the only thing printed.
- `printReceipt('80mm' | 'a4')` from `utils/print.ts` sets the `@page` size and calls `window.print()`.
- Print rules live in `assets/print.css` (`@media print`). Test both formats in the browser's print preview.

## Feature docs (required)
When you finish a feature, write or update `frontend/docs/features/<module>.md` in the same commit:
1. **What it does:** what the user can do now, in 2-4 sentences.
2. **How it works:** main files (view, components, store, service, types), routes, and the flow step by step.
3. **Behind the scenes:** follow one real user action: click → component → store → service → `api.ts`
   interceptors → backend endpoint → response → reactive update → re-render. Include the HTTP request and
   response, what Vue/Pinia/Router/axios do for us that our code doesn't show (reactivity, guards, interceptors),
   what happens on errors (400 validation, 404, 409, network), and a Mermaid sequence diagram.
4. **Why this way:** the key decisions and the reason for each.
5. **Trade-offs:** the alternatives considered and what this choice costs us.
6. **Limits:** edge cases not handled, TODOs.
7. **How to test:** commands, manual steps in the browser (both languages), and which tests cover it.

Write for a teammate who knows TypeScript but has never seen this code. Explain the why, not only the what.
If you're unsure how a library works inside, check its docs instead of guessing.
Add project-wide frontend decisions (money, i18n, styling, and auth when it returns) to `frontend/docs/decisions.md`
with the date, the decision and the reason.
