# config/gates/: the gate definitions (SKL-2, rule 1)

Locked: listed in `locked-paths.txt`, `.github/CODEOWNERS` and the path check. The `Makefile` calls
these files **directly**, never `package.json` scripts or configs the agent can edit, so no edit
elsewhere in the repo can weaken a gate.

| File | Gate | Closes |
|---|---|---|
| `eslint.config.js` | lint (frontend, e2e) | run with `--no-inline-config`: no `eslint-disable` comments; `ban-ts-comment` blocks `@ts-ignore`; no skipped/focused tests |
| `prettier.config.js` | lint (format) | — |
| `tsconfig.gate.json` | typecheck | self-contained strict settings; does not extend the editable `frontend/tsconfig.json` |
| `vitest.gate.config.ts` | test (frontend) | fixes include/exclude, reporter and `passWithNoTests: false` over whatever `frontend/vite.config.ts` says |
| `checkstyle.xml` | lint (backend) | run by explicit plugin coordinates, so the pom can't change it; bans `@Disabled` |
| `reporters/` | all | failures-only output (EC4) where no built-in reporter does that |
| `locked-paths.txt` | path check | the one list of locked paths; `CODEOWNERS` mirrors it |

Residual risk, for the SKL-2 path check to cover: `backend/pom.xml` can still set surefire
excludes. The `Makefile` passes `-DskipTests=false -Dmaven.test.skip=false`, and the path check
should reject pom changes to surefire and failsafe sections.
