# Prototype · built from the 3ap prototype template (version: see `.template-version`)

This file is locked (CODEOWNERS + path check, SKL-2). It holds the facts and limits of
this template version: the rules placed "T" in Appendix B. How to do the work lives in
the 3ap App Dev plugin. `[n]` = rule number in Appendix B.

## Never

- Edit any path in `config/gates/locked-paths.txt` (`CLAUDE.md`, `Makefile`, `.github/**`, `config/gates/**`, `e2e/exemplars/**`, …) — CI rejects it [1]
- Weaken a gate another way: `eslint-disable`, `@ts-ignore`, `.skip`/`.only`, `@Disabled` — the gates reject these too [1]
- Change or delete `e2e/backlog/<ID>.spec.ts` of any backlog item other than the one in flight [2]
- Use real data, real integrations or real credentials; synthetic data only [3]
- Put client-identifying strings in service, database or image names, labels or token labels [4]
- Run migrations at app startup; Flyway runs as its own pipeline step [6]
- Add an endpoint or a page outside the security chain in `platform/security` [8]
- Hand-write API calls or edit `frontend/src/api/generated/`; run `make generate` [11]
- Transcribe colours, spacing or type values; they come from `design-tokens/` [12]
- Build UI outside `@/ui`, or build your own login or passcode screen [13, 14]
- Pool size and `max-instances` are set by the platform on deploy, not in this repo; the database caps connections anyway. Traffic shift is the platform's. Don't try to change either [5, 7]

## Stack [9]

- Backend: Java 25 · Spring Boot 4 · Spring MVC on virtual threads (no WebFlux) · Postgres · Flyway · Maven wrapper
- Frontend: React 19 · Vite · TypeScript strict · TanStack Query · React Router 7 · React Hook Form + Zod · pnpm
- One deployable: Spring Boot serves the built frontend; `/api/**` on the same origin

## Codebase map [10, 37]

Backend base package: `ch.aaap.prototype` (under `backend/src/main/java/`). Paths below are relative to it
or to `frontend/src/`.

| Path | What it is | Extend it when |
|---|---|---|
| `features/cases/` (backend) | Exemplar slice: controller → service → repository, DTOs, mapper | You add any entity with list/detail/form |
| `features/cases/` (frontend) | Exemplar list, detail and form pages on the generated client | You add any screen |
| `features/cases/CaseListPage.tsx` | List exemplar: pagination, empty/loading/error states | You add a list |
| `features/cases/CaseDetailPage.tsx` | Detail exemplar | You add a detail view |
| `features/cases/CaseFormPage.tsx` | Form exemplar: create/edit, server field errors | You add a form |
| `platform/login/` | Login component (both sides) | Never; use it |
| `platform/passcode/` | Passcode gate component (both sides) | Never; use it |
| `platform/security/` | Security chain, `PROTECTION_MODE` | Never; every route is already covered |
| `platform/error/` | ProblemDetail errors, `NotFoundException`, `ConflictException` | Never; throw these |
| `platform/web/PageResponse` | The one list/pagination shape | Never; return it |
| `ui/` (`@/ui`) | The only UI components slices may use | Never from a slice |
| `api/generated/` | Typed client, Zod schemas, MSW mocks from `api/openapi.yaml` | Never by hand |
| `backend/src/main/resources/db/migration/` | Flyway; next free `V<n>__<feature>.sql` | You add or change a table |
| `api/openapi.yaml` (repo root) | The FE/BE contract, generated from the backend | Never by hand |
| `e2e/exemplars/cases/` | Exemplar acceptance tests | Never; copy the shape |
| `e2e/backlog/<ID>.spec.ts` | One file per backlog item, tagged `@<ID>` | Only for the item in flight |

To add a feature, copy the shape of `features/cases` on both sides, then `make generate`.

## Conventions the template already enforces

Errors: `platform/error` · API shape: `CaseController` · lists: `PageResponse` · forms: `useApiForm` in
`frontend/src/platform/forms`. Read the exemplar; don't invent a variant.

## Commands [43]

`make generate` · `make lint` · `make typecheck` · `make test` · `make check` · `make e2e` · `make dev`

Output is quiet: failures only. Add `VERBOSE=1` for full output. `make check` is what CI's gates run.
Run gates only through `make`: they use the locked configs in `config/gates/`, not `package.json` scripts.

## Tests [28]

- Backend unit and slice tests: `backend/src/test/java/…/features/<slice>/`
- Postgres for tests: one shared Testcontainers container per run, already configured in `support/`; never start your own
- Frontend: colocated `*.test.tsx`, API mocked with the generated MSW handlers
- Acceptance: `e2e/`, Chromium only, logs in once per run via `auth.setup.ts`

## This repo

- Template version: `.template-version` [15]
- Per-prototype facts (protection mode, slug, tier, expiry): `prototype.yaml`
- Backlog: `docs/backlog.md` [16]