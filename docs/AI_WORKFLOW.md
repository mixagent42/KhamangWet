# AI-Assisted Development Workflow

## 1. Core Rule
Claude is a coding assistant, not the source of truth. Repository code, tests, approved docs and measured runtime behavior are the source of truth.

## 2. Before Each Task
Give Claude:
- one concrete objective
- relevant document(s)
- allowed scope/files
- acceptance criteria
- required tests
- explicit instruction not to expand scope

## 3. Standard Task Template
**Objective:** [one feature]
**Context:** [links to docs/files]
**Allowed scope:** [directories/files]
**Acceptance criteria:** [observable results]
**Required tests:** [test names/types]
**Out of scope:** [things not to do]
**Finish report:** files changed, commands run, results, risks, manual verification.

## 4. Session Workflow
1. Start with `git status` and inspect relevant files.
2. Ask for a short plan before complex edits.
3. Implement one vertical slice.
4. Run typecheck/tests/build.
5. Review diff for unrelated changes, dependencies, secrets and API breaks.
6. Update docs only where decisions or behavior changed.
7. Commit a coherent checkpoint.
8. Next task starts from repository state, not assumptions from chat history.

## 5. Use Claude Code Features
- Root `CLAUDE.md`: durable project rules and commands; keep concise.
- Path-scoped rules: coding rules for client/server/database.
- Skills: repeatable procedures such as `/implement-feature`, `/review-diff`, `/release-check`.
- Subagents: read-only architecture audit, test design, security review, art pipeline review.
- Hooks: deterministic checks such as formatting/typecheck on completion, only after commands are verified.
Use current official Claude Code documentation to confirm configuration formats before adding agents/hooks. Do not blindly paste outdated configuration examples.

## 6. Parallel Work
Parallelize independent read-only tasks first (e.g. architecture review and threat-model review). Avoid multiple agents editing the same files simultaneously. Main agent integrates findings and owns final tests.

## 7. AI Failure Recovery
If AI causes a regression:
- stop adding features
- inspect `git diff` and test output
- revert or isolate the smallest faulty change
- add a regression test
- update a relevant rule or skill
- rerun the affected tests

## 8. Feature Implementation Report
- Summary
- Files created/changed
- Architecture decisions
- Tests executed with actual outcomes
- Manual verification steps
- Known limitations
- Follow-up tasks
- Commit recommendation
