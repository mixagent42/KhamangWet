# Khamang Wet — Project Instructions

## Project
Thai Occult & Sorcery MMORPG for Web PC. Art direction is locked to 2.5D HD-2D: 2D HD characters on a 3D isometric world (DEC-040). Combat is hybrid: target lock plus directional/area attacks. Solo developer with AI assistance. Planned architecture: TypeScript monorepo, modular monolith, authoritative server.

## Current state — verify, never assume
- There is no game code yet: docs, the pnpm workspace with lint, test, build and CI tooling, and one example rule (`clamp`). Check `docs/IMPLEMENTATION_STATUS.md` before claiming anything exists.
- M0 passed its gate (tag `m0-gate`, 2026-10-26). The current milestone is M1 (visual / movement prototype); the next task is in `docs/IMPLEMENTATION_BACKLOG.md`.
- The remote `origin` is https://github.com/mixagent42/KhamangWet.git (public, DEC-061). CI tier 1 (`.github/workflows/ci.yml`) runs `pnpm verify` on every push, and the `main-protection` ruleset blocks deleting or force-pushing `main`. Never push without explicit approval.

## Where things are
- Workspace packages (`@kw/*`): `apps/web` (Vite client), `apps/game-server` (Node server), `packages/shared-contracts`, `packages/game-rules` and `packages/game-data` (run in both browser and Node), `packages/config` (shared tsconfig). Exact shared versions are in the `catalog` of `pnpm-workspace.yaml`; packages reference them as `"catalog:"`.
- `docs/DECISIONS.md`: decision register. Accepted entries are binding; Open entries must not be decided silently.
- `docs/IMPLEMENTATION_BACKLOG.md`: milestone tasks with dependencies and acceptance criteria.
- `docs/IMPLEMENTATION_STATUS.md`: what actually exists, with evidence (commands and results).
- `docs/DEFINITION_OF_DONE.md`: done criteria, required tests, CI tiers, rollback, completion report.
- Design specs in `docs/`: `GAME_VISION_GDD.md`, `TECHNICAL_ARCHITECTURE.md`, `COMBAT_SPEC.md`, `NETWORK_PROTOCOL.md`, `DATABASE_AND_ECONOMY.md`, `SECURITY_THREAT_MODEL.md`, `TEST_STRATEGY.md`, `ROADMAP.md`, `AI_WORKFLOW.md`.
- Art: `docs/ART_BIBLE.md`, `docs/ASSET_PIPELINE.md`, `docs/VISUAL_PROTOTYPE_PLAN.md`.
- `prompts/`: task prompts (02 implement, 03 code review, 04 security, 05 art tech, 06 test plan, 07 release, 08 doc sync).
- `.claude/rules/`: path-scoped rules for client, server, database, shared-package and docs files.
- `.claude/settings.json`: permission rules and a PreToolUse hook (`.claude/hooks/guard-files.mjs`) that blocks edits to `.env*` and `pnpm-lock.yaml`. The read-only `reviewer` subagent is in `.claude/agents/`; the `/implement-task <task-id>` and `/verify` skills are in `.claude/skills/`.
- `CLAUDE_TEMPLATE.md` is the original template this file was derived from; this file takes precedence.

## Commands
- One-time setup per machine: `corepack enable pnpm --install-directory "%APPDATA%\npm"` (corepack ships with Node 24). The `pnpm` shim runs the version pinned in `packageManager`, and corepack downloads it on first use.
- `pnpm --version`: prints `12.15.0`.
- `pnpm install`: install workspace dependencies. On a fresh clone and in CI use `pnpm install --frozen-lockfile`, which fails if `pnpm-lock.yaml` is out of date.
- `pnpm verify`: typecheck → lint → test → build → format:check, stopping at the first failure. Run it before every commit; CI runs the same command.
- `pnpm typecheck`: `tsc --noEmit` in every workspace package, test files included.
- `pnpm lint`: type-aware ESLint on the whole repo, then the import-boundary fixture tests in `tests/lint/` (`node --test`).
- `pnpm test`: unit tests with Vitest, per package (`pnpm -r test`). Tests sit next to the source as `*.test.ts`; `tsconfig.build.json` keeps them out of `dist`.
- `pnpm build`: build every workspace package (runs `pnpm -r build`).
- `pnpm format` / `pnpm format:check`: Prettier for code and config only; Markdown, `docs/`, `prompts/` and `pnpm-lock.yaml` are never reformatted (`.prettierignore`).

Add a command here only after it has run successfully. Never claim a build, typecheck, lint or test passed unless it was actually run.

## Key decisions (summary; `docs/DECISIONS.md` wins on any conflict)
- Exact version pins and a committed lockfile. Never install from the `latest` tag: Prisma's `latest` CLI tag points to a release candidate (DEC-003).
- Pinned stack (exact versions and pnpm settings in `docs/adr/001-stack-and-versions.md`): Node 24 LTS, pnpm 12.15.0, TypeScript 6.0.3, ESLint 10 + typescript-eslint 8.72 (type-aware), Colyseus 0.18, Prisma 7.10.1 (DEC-004..008, DEC-010). Revisit TypeScript 7 when typescript-eslint supports it.
- Colyseus state uses `schema()` with `t.*`, not `@type()` decorators. Import Babylon.js per module, not `import * from "@babylonjs/core"` (ADR-001).
- Prisma 7.x stable, with the CLI and client on the same exact version; schema lives in `database/` (DEC-008).
- Art is 2.5D HD-2D only: no pixel art, chibi or full 3D realistic style without approval (DEC-040). Character appearance changes with equipment (paper-doll, DEC-045).
- The animation runtime is undecided: VP0-c compares Blender → glTF (A3-B) with layered frames (A1-L). Spine is deferred (DEC-014, DEC-058).
- The GitHub repo `mixagent42/KhamangWet` is public (DEC-061): never commit secrets, personal data or assets without redistribution rights. Commits use the GitHub noreply email. Push only `main` and named tags, never `--all` or `--mirror`.

## Engineering rules
1. Check `git status` and read the relevant files before editing. Never overwrite or delete user work without approval.
2. One backlog task per branch (`m<N>/t<NN>-<slug>`), squash-merged into `main` after approval (DEC-012). Do not commit directly to `main`.
3. Make the smallest coherent change that meets the acceptance criteria. Do not scaffold for future features.
4. Keep rendering, game rules, network and persistence separate. Game rules are pure functions with injected RNG and clock (DEC-013).
5. The client is untrusted. The server owns movement validation, combat, status, loot, inventory, currency and progression. Never accept client-sent damage, loot, currency or final position.
6. Validate every inbound network/API message at runtime and enforce size and rate limits.
7. Use transactions and idempotency for anything that grants, consumes or transfers value.
8. Add no dependency without a reason, a compatibility and license check, and approval.
9. Do not change shared contracts, the database schema or the architecture silently; record the change in `docs/DECISIONS.md`.
10. Change the schema only through migrations. Never run a destructive migration without explicit approval and a verified backup (`.claude/rules/database.md`).
11. Never commit secrets, tokens, credentials or production data.
12. Add tests for bug fixes and important logic. Keep game content data-driven.
13. Do not implement deferred features (`docs/GAME_VISION_GDD.md` §7) without explicit approval.
14. Thai occult content is fictional and respectful: invented glyphs and yantra, no real ritual instructions (`docs/ART_BIBLE.md` §3.4).

## Decisions, conflicts and approvals
- If docs conflict or a decision is Open: stop, record it in `docs/DECISIONS.md` with options, and ask. Do not pick silently.
- Ask the developer before installing software, creating remotes or pushing, deleting files, buying licenses, or changing an Accepted decision.
- Original design docs: show the diff before committing an edit. Many docs cite line numbers (for example `TECHNICAL_ARCHITECTURE.md` L117), so prefer in-place edits or update the citations.

## Workflow per task
1. Read the task in the backlog and the docs it references; check `git status`.
2. State a short plan and the acceptance criteria.
3. Create the task branch and implement in small steps.
4. Run the relevant checks (once they exist) and report the actual output.
5. Review the diff for unrelated changes, secrets and contract breaks.
6. Record evidence in `docs/IMPLEMENTATION_STATUS.md` and mark the task in the backlog.
7. Squash-merge into `main` after approval, then delete the task branch.

## Completion report
Use the template in `docs/DEFINITION_OF_DONE.md` §8: commands actually run and their results, files changed, risks, follow-ups.

## Communication
Talk with the developer in Thai. Keep code, identifiers, file names and commit messages in English.
