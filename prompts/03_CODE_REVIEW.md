# Prompt 03 — Senior Code Review (Read-only first)

Review the current diff for Khamang Wet. Do not edit files in the first pass.

Review dimensions:
- correctness and edge cases
- architecture boundaries
- client/server trust boundary
- exploitability and malformed inputs
- race conditions, duplicate requests and persistence
- performance and resource leaks
- TypeScript correctness
- test coverage and missing regression tests
- consistency with project docs

Return findings ordered by severity:
[Critical/High/Medium/Low] file:line — issue, impact, reproducible scenario, recommended fix, required test.

Do not report stylistic preferences as bugs. Verify findings against actual code. After the read-only report, ask before applying fixes.
