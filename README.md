# 3ap prototype template

GitHub template repository for the Non-Dev Prototyping Path (epic CAAS-1360, story CAAS-1361,
sub-task CAAS-1374). IT creates each prototype repo from it with "Use this template".

**Status: skeleton (step a).** Directories and stub files only; every stub says what fills it
in step (b), the walking skeleton. Nothing builds yet.

| Read | For |
|---|---|
| `CLAUDE.md` | What every agent session in a prototype repo is told (T rules, codebase map) |
| `docs/platform-contract.md` | What the platform and the template rely on from each other |
| `docs/open-points.md` | What is still undecided |

Seam with CAAS-1375 (plugin skills) and CAAS-1377 (protection suite): the paths in the
`CLAUDE.md` codebase map, the component names `platform/login` and `platform/passcode`,
`api/openapi.yaml`, `frontend/src/api/generated/` and the `make` targets.
