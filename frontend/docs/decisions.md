# Decisions (frontend)

Project-wide frontend decisions, newest first. Each entry has the date, the decision and the reason.

## 2026-11-21: Login removed (to be rebuilt)
**Decision:** Removed the login page, `AuthLayout`, `authStore`, `useAuth`, `authService`, the token and refresh
logic in `api.ts`, the role guard (`router/guard.ts`) and `meta.roles`. Every page is open, `/` goes to the
dashboard, and the sidebar lists every page. The backend removed auth at the same time.
**Reason:** The project owner asked for a clean slate to rebuild login later.
**Cost:** Anyone who can open the app can use every page. The three auth/role entries below are superseded
and kept for history. Browsers that signed in before may still have a stale `pos.auth` key in
localStorage. Nothing reads it, so it's harmless.

## 2026-11-21: Tokens in authStore, persisted to localStorage (superseded: login removed)
**Decision:** `authStore` holds the access token, refresh token and user, and saves them to localStorage (`pos.auth`).
**Reason:** A POS terminal must stay signed in across reloads and browser restarts. The backend only issues
bearer tokens (no httpOnly cookie), so the browser has to keep the refresh token somewhere it can read.
**Cost:** Any script injected through XSS could read the tokens. We limit that risk with Vue's escaping
(no `v-html` with user data), the backend's strict CSP (Helmet), 15-minute access tokens, and refresh-token
reuse detection. If this ever moves to an httpOnly refresh cookie, only authStore and api.ts change.

## 2026-11-21: Single-flight token refresh in api.ts (superseded: login removed)
**Decision:** All requests that get a 401 at the same time share one `/auth/refresh` call. Refresh is never called elsewhere.
**Reason:** The backend rotates refresh tokens and treats reuse as theft, revoking every session of the user.
Parallel refreshes with the same token would log the cashier out on every device.

## 2026-11-21: Money as strings + decimal.js, same helper as the backend
**Decision:** Money stays a string from the API to the screen. Math goes through `utils/money.ts` (decimal.js,
half-up, rounded once at the end), which mirrors the backend helper. Components only format.
**Reason:** JS numbers drift (`0.1 + 0.2`) and round wrong (`(2.675).toFixed(2)`). Using the same rules as the
backend means the cart preview matches the saved sale. `formatMoney` gives `Intl.NumberFormat` a string
(an exact decimal, ES2023 Intl), so formatting never goes through a float either.

## 2026-11-21: Khmer by default, English fallback, self-hosted Kantumruy Pro
**Decision:** vue-i18n (Composition API, `legacy: false`), default `km`, fallback `en`, choice saved per device.
Kantumruy Pro (OFL) is served from `src/assets/fonts/` with Khmer and Latin subsets.
**Reason:** Staff work in Khmer. Self-hosting means no Google Fonts request, so the POS works offline.
`unicode-range` keeps English-only pages from downloading the Khmer subset.

## 2026-11-21: Layouts as parent routes, roles in route meta (roles part superseded: login removed)
**Decision:** `AuthLayout`, `AdminLayout` and `CashierLayout` are parent route components. `meta.roles` on each
route is the single list of who may open it. The guard and the sidebar both read it.
**Reason:** One place to change access, and no layout switching logic in `App.vue`. The guard is UX only:
the backend enforces roles on every request.

## 2026-11-21: Tailwind CSS 4, CSS-first
**Decision:** Tailwind 4 through `@tailwindcss/vite`. Theme tokens live in `@theme` in `assets/main.css`, with no config file.
**Reason:** It's Tailwind 4's default setup. Tokens are plain CSS variables, which print styles and components can share.

## 2026-11-21: Receipts printed with @media print and an injected @page
**Decision:** `<ReceiptPrint>` + `printReceipt('80mm' | 'a4')`, which injects the `@page` size and calls `window.print()`.
**Reason:** It works with any printer the OS knows, with no print server or driver SDK. A CSS class can't switch
`@page` size, so it's injected per print.
