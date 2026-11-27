# Project plan: POS System

Nham Teuk · Final Year Project Team · IT Project Management (I5, 2026-2027 Semester 1)

Keep this file at the root of the repository (or in `docs/`) and update it every week: the weekly progress check compares it with the code. Tick a task when it is done (`- [x]`), and change the dates, the owners and the tasks when the plan changes; write why under "Changes to the plan".

## Team

| Member | Role |
|---|---|
| THY PHAROTH | Project manager |
| OUN RITHI | Developer |
| PENG SEYHA | Developer |
| ROM TOLA | Developer |
| SAM NANGALEX | Developer |

## Milestones

| Milestone | Date |
|---|---|
| Proposal approved | 2026-11-27 |
| Design reviewed | 2026-12-04 |
| Sprint 1 review | 2026-12-18 |
| Midterm demo | 2027-01-04 |
| Sprint 3 review | 2027-01-15 |
| Release | 2027-01-29 |
| Final presentation | 2027-02-05 |

## 1. Start (week 1, 2026-11-26 to 2026-11-27)

- [x] Kick-off: roles, repository, task board · 2026-11-26 · THY PHAROTH, OUN RITHI, PENG SEYHA, ROM TOLA, SAM NANGALEX
- [ ] Requirements and user stories for admin, cashier, stock transfers, members and credit · 2026-11-26 to 2026-11-27 · THY PHAROTH
- [x] Visit the stall: current sales and stock flow between Warehouse A, B and Shop C, sample receipts · 2026-11-26 · PENG SEYHA
- [ ] Collect the client's product list, 30+ categories and 10 units · 2026-11-26 to 2026-11-27 · PENG SEYHA
- [ ] Choose the tech stack and set up the backend and database · 2026-11-26 to 2026-11-27 · THY PHAROTH
- [ ] Set up the frontend project: layout, routing, shared components · 2026-11-26 to 2026-11-27 · THY PHAROTH
- [ ] Create the Telegram bot and test sending a message to the client's chat · 2026-11-26 to 2026-11-27 · ROM TOLA
- [ ] **Milestone: Proposal approved** · 2026-11-27

## 2. Design (week 2, 2026-11-30 to 2026-12-04)

- [ ] Architecture and data model: products, categories, units, prices, locations, stock movements, transfers, sales, members, debts · 2026-11-30 to 2026-12-04 · PENG SEYHA
- [ ] Mock-ups for the cashier: sale screen, discount, member search, 80mm and A4 receipts · 2026-11-30 to 2026-12-04 · OUN RITHI
- [ ] Mock-ups for the admin: products, stock in/out, transfers, users, settings, dashboard · 2026-11-30 to 2026-12-04 · SAM NANGALEX
- [ ] Test plan: sales, stock transfers, member levels, credit, Telegram messages · 2026-11-30 to 2026-12-02 · ROM TOLA
- [ ] Design review with the client: screens, transfer flow, member levels · 2026-12-03 to 2026-12-04 · PENG SEYHA
- [ ] **Milestone: Design reviewed** · 2026-12-04

## 3. Sprint 1 (weeks 3–4, 2026-12-07 to 2026-12-18)

- [ ] Sprint 1 planning and backlog · 2026-12-07 · THY PHAROTH
- [ ] Sign-in, admin and cashier roles, user management · 2026-12-08 to 2026-12-18 · SAM NANGALEX
- [ ] Products, categories and units (backend): create, list, edit, delete, with buy and sell prices · 2026-12-08 to 2026-12-18 · PENG SEYHA
- [ ] Products, categories and units (frontend): list, form and delete screens · 2026-12-08 to 2026-12-18 · OUN RITHI
- [ ] Stock locations (Warehouse A, B, Shop C) and stock in/out at Warehouse A · 2026-12-08 to 2026-12-18 · ROM TOLA
- [ ] **Milestone: Sprint 1 review** · 2026-12-18

## 4. Sprint 2 (weeks 5–7, 2026-12-21 to 2027-01-04)

- [ ] Sprint 2 planning and backlog · 2026-12-21 · THY PHAROTH
- [ ] Sale screen: cart, % discount only (no price edits), payment, stock taken from Shop C (frontend) · 2026-12-21 to 2026-12-31 · OUN RITHI
- [ ] Receipt printing on 80mm and A4 · 2026-12-21 to 2026-12-25 · SAM NANGALEX
- [ ] Stock transfers A → B → C: pending until the receiver confirms, received quantity can be adjusted, both amounts kept · 2026-12-21 to 2026-12-31 · THY PHAROTH
- [ ] Members: cashier adds members, visit count and total spend updated on each sale · 2026-12-21 to 2026-12-31 · SAM NANGALEX
- [ ] Telegram bot sends every receipt · 2026-12-28 to 2026-12-31 · ROM TOLA
- [ ] Unit and integration tests for sales, stock and transfers · 2026-12-21 to 2026-12-31 · ROM TOLA
- [ ] **Milestone: Midterm demo** · 2027-01-04

## 5. Sprint 3 (weeks 7–8, 2027-01-04 to 2027-01-15)

- [ ] Sprint 3 planning and backlog · 2027-01-04 · THY PHAROTH
- [ ] Member levels Silver, Gold, Diamond: thresholds set by the admin, level updated automatically · 2027-01-04 to 2027-01-15 · SAM NANGALEX
- [ ] Credit sales for members (no limit), debt payments and payment history · 2027-01-04 to 2027-01-15 · THY PHAROTH
- [ ] Low-stock alerts to Telegram: one global threshold, checked per location · 2027-01-04 to 2027-01-15 · ROM TOLA
- [ ] Dashboard and reports: sales, profit, stock per location, debts, members · 2027-01-04 to 2027-01-15 · SAM NANGALEX
- [ ] Frontend: product search, cashier view of stock in all 3 locations, settings screens, UI polish · 2027-01-04 to 2027-01-15 · OUN RITHI
- [ ] **Milestone: Sprint 3 review** · 2027-01-15

## 6. Testing and release (weeks 9–10, 2027-01-18 to 2027-01-29)

- [ ] Acceptance tests with the client · 2027-01-18 to 2027-01-29 · PENG SEYHA
- [ ] Frontend bug fixes from the acceptance tests · 2027-01-18 to 2027-01-29 · OUN RITHI
- [ ] Deployment of the demo · 2027-01-18 to 2027-01-22 · THY PHAROTH
- [ ] User guide for the admin and the cashier · 2027-01-18 to 2027-01-22 · ROM TOLA
- [ ] Data backup and restore check · 2027-01-25 to 2027-01-27 · SAM NANGALEX
- [ ] Training for the client and the cashiers at the stall · 2027-01-25 to 2027-01-29 · PENG SEYHA
- [ ] **Milestone: Release** · 2027-01-29

## 7. Closing (week 11, 2027-02-01 to 2027-02-05)

- [ ] Final report · 2027-02-01 to 2027-02-05 · THY PHAROTH
- [ ] Slides and rehearsal · 2027-02-01 to 2027-02-05 · THY PHAROTH
- [ ] Demo script and demo data: sale, transfer, member level, credit, Telegram alert · 2027-02-01 to 2027-02-03 · PENG SEYHA
- [ ] Frontend code clean-up and release tag · 2027-02-01 to 2027-02-03 · OUN RITHI
- [ ] Handover to the client: accounts, Telegram bot, backup steps · 2027-02-03 to 2027-02-05 · PENG SEYHA
- [ ] **Milestone: Final presentation** · 2027-02-05

## Risks

| Risk | Chance | Impact | What we do |
|---|---|---|---|
| A member is ill or leaves the team | Medium | High | Two members know each part; the code is pushed every day |
| The features take longer than planned | High | Medium | Core use cases first (sales, stock, transfers); the rest moves to Sprint 3 |
| The demo server or a service we use is down | Low | High | A local demo is ready too |
| The frontend and the backend do not match | Medium | Medium | Agree the API in Design week; OUN RITHI (frontend) and PENG SEYHA (backend) check it together each sprint |
| Stock is wrong after transfers or adjusted quantities | Medium | High | Every stock change is saved as a movement; both sent and received amounts are kept; transfers are tested first |
| Receipts print badly on the client's 80mm or A4 printer | Medium | Medium | Test on the client's own printer in Sprint 2 |
| Khmer product names do not show or print correctly | Medium | Medium | Test Khmer fonts on screen and on receipts in Sprint 1 |
| Internet at the stall is down, so Telegram messages fail | Medium | Low | A sale never waits for Telegram; failed messages are retried later |
| Member debts grow with no credit limit | Medium | Medium | Debts and payment history are shown on the dashboard for the admin |

## Changes to the plan

| Date | Change | Why |
|---|---|---|
| 2026-11-23 | First plan | |
