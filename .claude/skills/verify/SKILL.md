---
name: verify
description: Run the Khamang Wet quality gate (pnpm verify = typecheck, lint, test, build, format:check) and report the real output. Use before every commit and whenever the developer asks whether the code passes.
---
Run the Khamang Wet quality gate and report what actually happened.

1. Run `pnpm verify` from the repository root. Do not run a subset instead, and do not skip it because an earlier run passed.
2. Report the exit code and one line for each step that ran (typecheck, lint, test, build, format:check): package and test counts, or the first error with its file and line.
3. `pnpm verify` stops at the first failure, so the later steps did not run. Say which step failed and never report the later steps as passing.
4. Do not fix failures, change tests or edit config unless the developer asks. Never disable or skip a check to make it pass (`docs/DEFINITION_OF_DONE.md` §6.2).
