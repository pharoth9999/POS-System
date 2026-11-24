---
name: feature-docs
description: Write or update frontend/docs/features/<module>.md after finishing a feature or significant change in the POS frontend (Vue 3), and record project-wide frontend decisions in frontend/docs/decisions.md. Use when a feature is done, before committing, or when asked to document or explain how a page or module works.
---

# Feature docs (frontend)

Write `frontend/docs/features/<module>.md` in the same commit as the feature.
Never put it in the repo-root `docs/` (that only holds PLAN.md).
Write for a teammate who knows TypeScript but has never seen this code. Explain the why, not only the what.
If you're unsure how Vue, Pinia, Router or axios works inside, check their docs instead of guessing.

## Template

```markdown
# <Feature name>
**Date:** YYYY-MM-DD · **Author:** <teammate> (with <agent>)

## What it does
What the user can do now, in 2-4 sentences.

## How it works
Main files (view, components, store, service, types), routes, and the flow step by step.

## Behind the scenes
- Follow one real user action: click → component → store → service → `api.ts` interceptors
  → backend endpoint → response → reactive update → re-render.
- The real HTTP request and response (method, URL, body, status).
- What Vue/Pinia/Router/axios do for us that our code doesn't show (reactivity, computed caching, interceptors).
- What happens on errors: 400 validation, 404, 409, network. Which `toApiError` message the user sees.
- A Mermaid sequence diagram of the flow.

## Why this way
The key decisions and the reason for each.

## Trade-offs
Alternatives considered, why not chosen, what this choice costs us.

## Limits
Edge cases not handled, TODOs.

## How to test
Commands, manual steps in the browser in both Khmer and English, which tests cover it.
```

## Steps
1. Read the view, components, store, service and types before writing.
2. Do the main action once in the browser and copy the real request and response from DevTools → Network.
3. Fill every section. Write "None" rather than deleting one.
4. If a decision affects the whole frontend (money, i18n, styling, auth when it returns), add an entry to
   `frontend/docs/decisions.md`: date, decision, reason.
5. Check the doc matches the code: routes, store names, i18n keys and endpoints.