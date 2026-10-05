# Open points

Raised while agreeing the skeleton for CAAS-1374 (2026-09-30). Each needs an owner and a decision.

| # | Open point | Why it matters | Blocks |
|---|---|---|---|
| 1 | **Login mode: who creates the demo users?** The pipeline only inserts the short-lived CI user (T18). Nothing creates accounts for real people. Candidate: a `create-user` job like the passcode job (E17) | A login-mode prototype deploys with nobody able to log in. Until this is resolved the template defaults to `protection: passcode` | Login mode in real use |
| 2 | **CAAS-1373 contradicts itself.** The state block in `docs/backlog.md` is "written only by the method skill", but "a PR that changes the state block fails the build". The method skill's own writes also go through a PR plus auto-merge (SKL-2) | The path check can't be built as written | CAAS-1373, SKL-2 gates |
| 3 | **Real design-token export.** `design-tokens/tokens.json` is a placeholder. The source (Figma library? code package?) and the export method are unknown | "Tokens come from an export" can't be met with a placeholder | CAAS-1374 acceptance |
| 4 | **UI styling approach**. Waiting for the designer's work | Everything behind `@/ui` | Step (b) of `ui/` |
| 5 | **Platform repo name.** Workflows call `3AP-AG/<platform-repo>` | Callers can't run until it exists | `.github/workflows/*` |
| 6 | **Base package `ch.aaap.prototype` may be renamed.** Written in one place (`CLAUDE.md` map); every other path is relative | A rename after prototypes exist is a MAJOR template bump | — |
| 7 | **Test strategy doc §5 is missing** (what to keep from the `vitest-react` and `writing-junit-tests` forks) | The exemplar tests should match what the forked skills expect | SKL-6 alignment |
| 8 | **Failure summary: file name and publish location** (see `platform-contract.md` §4) | The gates job and the platform must write the same file | INF-2, gates job |
| 9 | **pnpm in Claude Code on the web.** Confirm it bootstraps cleanly in a cloud session; fall back to npm if not | Local checks before pushing (rule 43) depend on it | Step (b) |