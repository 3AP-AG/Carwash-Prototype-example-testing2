# api/

The FE/BE seam (rule 11). Owned by neither skill.

`backend` (springdoc) → `api/openapi.yaml` → orval → `frontend/src/api/generated/`

Both files are committed. CI regenerates both and fails on any diff.
