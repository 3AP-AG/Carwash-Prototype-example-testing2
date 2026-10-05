# Platform contract

What the platform (INF-1, INF-2, CAAS-1377) and this template rely on from each other.
Change it only together with the platform owners, and bump the MAJOR of `.template-version`
when a change breaks either side.

Status: **draft for agreement** (skeleton pass, CAAS-1374).

## 1. Protection mode

| Item | Contract |
|---|---|
| Source | `prototype.yaml` → `protection: login \| passcode` |
| Reader | The pipeline only (E15). It validates the value and fails the build on anything else (INF-2) |
| Hand-over | Env var `PROTECTION_MODE` on `gcloud run deploy` |
| App behaviour | Refuses to start if `PROTECTION_MODE` is missing or invalid. There is no unprotected mode |

## 2. Tables the pipeline writes into

Both are created by the template's Flyway migrations. The platform only inserts, updates
`revoked_at`, and deletes its own run-scoped rows.

### `app_user` (login mode)

```sql
create table app_user (
  id             uuid primary key,
  username       text not null unique,
  password_hash  text not null,
  display_name   text not null,
  expires_at     timestamptz,
  created_at     timestamptz not null default now()
);
```

- `password_hash` uses Spring's `DelegatingPasswordEncoder` format, e.g. `{bcrypt}$2a$10$…`
- Run-scoped CI user (T18): `expires_at = now() + interval '15 minutes'`, username `ci-run-<run-id>`.
  Deleted at the end of the run; unusable after expiry even if the run crashes

### `access_token` (passcode mode)

```sql
create table access_token (
  id          uuid primary key,
  token_hash  text not null unique,
  label       text not null,
  expires_at  timestamptz not null,
  revoked_at  timestamptz,
  created_at  timestamptz not null default now()
);
```

- Token: at least 128 bits from a CSPRNG, shown once, never logged unmasked
- `token_hash`: lowercase hex SHA-256 of the UTF-8 token
- `label`: neutral, e.g. `demo-1` or `ci-run-<run-id>`; never a client name (rule 4)
- `expires_at`: never later than `poc-expires` (INF-3); the token job enforces this
- Run-scoped CI token (T18): `expires_at = now() + interval '15 minutes'`, deleted at run end
- The app checks validity, expiry and `revoked_at` on every request

## 3. Reusable workflows

The template's `.github/workflows/*.yml` are thin callers of workflows in `3AP-AG/<platform-repo>`,
pinned to a major tag (`@v1`) so older templates keep working (E6).

| Workflow | Inputs | Outputs |
|---|---|---|
| `deploy.yml` | `protection-mode`, `image` | `candidate-url`, `failure-summary-path` |
| `passcode.yml` | `label`, `valid-days` | token (masked in the log) |

TODO(INF-2): fill in the exact input and output names once the platform workflows exist.

## 4. Failure summary

Every run, gates included, writes one summary in one format so the agent reads a single shape (EC4).
The template's gates job and `make check` write the gates part; the platform writes the deploy
and acceptance part.

```
RESULT: red
STEP: lint | typecheck | test | staleness | migrations | deploy | acceptance
FAILURES:
- <backlog ID or ->  <test or rule name>  <first error line>
FULL LOG: <url or path>
```

At most a few dozen lines (INF-2). TODO(INF-2): agree the file name and where it is published.

## 5. Platform-set runtime settings

INF-1: "Pool settings and max-instances cannot be changed from inside a prototype repo". So the
template does **not** set them; `application.yml` only documents them.

| Setting | Value | Set by |
|---|---|---|
| `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE` | `2` | Platform deploy workflow, env var |
| `SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE` | `0` | Platform deploy workflow, env var |
| `SPRING_DATASOURCE_HIKARI_IDLE_TIMEOUT` | `30s` | Platform deploy workflow, env var |
| Cloud Run `--max-instances` | `2` | Platform deploy workflow |
| Database role `CONNECTION LIMIT` | `6` | Provisioning script (INF-1) |

The env vars are the normal way these values arrive, but they are not the guard: an agent could still
build its own `DataSource` in code. **The guard is `CONNECTION LIMIT 6` on the role.** A prototype
that raises its pool gets connection refusals for itself only, and other prototypes stay up
(INF-1 acceptance). 2 instances × 2 connections = 4, leaving 2 for the migrations step and the
pipeline's credential inserts.

## 6. Time budget

A full run takes at most 10 minutes (T7). Jobs run in sequence, so their `timeout-minutes` add up
to at most 10: gates 4 (template) + deploy, migrations and acceptance 6 (platform). Starting split,
tuned on the first prototype (T14).