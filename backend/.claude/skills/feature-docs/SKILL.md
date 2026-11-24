---
name: feature-docs
description: Write or update backend/docs/features/<module>.md after finishing a feature or significant change in the POS backend, and record project-wide decisions in backend/docs/decisions.md. Use when a feature is done, before committing, or when asked to document or explain how a module works.
---

# Feature docs

Write `backend/docs/features/<module>.md` in the same commit as the feature.
Never put it in the repo-root `docs/` (that only holds PLAN.md).
Write for a teammate who knows TypeScript but has never seen this code. Explain the why, not only the what.
If you're unsure how a library works inside, check its docs instead of guessing.

## Template

```markdown
# <Feature name>
**Date:** YYYY-MM-DD · **Author:** <teammate> (with <agent>)

## What it does
What the user can do now, in 2-4 sentences.

## How it works
Main files, entities, endpoints, and the flow step by step
(e.g. sale → stock deduct → member update → Telegram).

## Behind the scenes
- Follow one real request: middleware → guards → pipes → controller → service → DB.
- The SQL that runs (copy it from the TypeORM log), and why each transaction or lock is there.
- What NestJS/TypeORM/the library does for us that our code doesn't show.
- What happens on errors: which error, where it's caught, what the client sees.
- A Mermaid sequence diagram of the flow.

## Why this way
The key decisions and the reason for each.

## Trade-offs
Alternatives considered, why not chosen, what this choice costs us.

## Limits
Edge cases not handled, TODOs.

## How to test
Commands, Swagger steps, which tests cover it.
```

## Steps
1. Read the module's code, entities, DTOs and tests before writing.
2. Run the main request once with TypeORM logging on and copy the real SQL.
3. Fill every section. Write "None" rather than deleting one.
4. If a decision affects the whole project (money, auth, ports), add an entry to
   `backend/docs/decisions.md`: date, decision, reason.
5. Check the doc matches the code: endpoints, field names and rules.