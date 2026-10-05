// Gate: lint (frontend + e2e). Locked. Run by the Makefile with `--no-inline-config`.
// Encodes template rules as errors:
// - no fetch/axios outside frontend/src/api/                  (rule 11)
// - slices import UI only from '@/ui'                          (rule 13)
// - no deep imports into src/api/generated beyond its index files
// - @typescript-eslint/ban-ts-comment: no @ts-ignore / @ts-nocheck
// - no .skip / .only in tests
// TODO(b): write the config.
export default [];
