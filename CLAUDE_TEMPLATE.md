# Khamang Wet — Project Instructions

## Project
Thai Occult & Sorcery MMORPG for Web PC. Visual: 2D HD characters on a 3D isometric world. Combat: hybrid target-based and directional/area combat. Solo developer with AI-assisted workflow.

## Source of Truth
Read `docs/GAME_VISION_GDD.md`, `docs/TECHNICAL_ARCHITECTURE.md`, and the feature-specific spec before implementing. Repository code and tests outrank assumptions from previous chat messages. If docs conflict, stop and propose a decision rather than silently choosing.

## Engineering Rules
- Inspect repository and git status before editing.
- Do not create the whole game in one task.
- Make the smallest coherent change that satisfies acceptance criteria.
- Keep rendering, game rules, network, and persistence separated.
- Client is untrusted; server owns combat outcomes, loot, inventory and progression.
- Validate every inbound network/API message at runtime.
- Do not introduce a dependency without explaining why and checking compatibility/licensing.
- Do not modify unrelated files or overwrite user work.
- Never claim tests/build passed unless actually run.
- Never commit secrets, credentials, tokens, or production data.
- Prefer deterministic pure functions for game rules.
- Add tests for bug fixes and important logic.
- Use migrations for database schema changes.
- Keep game content data-driven where practical.
- Do not implement deferred features without explicit approval.

## Required Workflow
1. Inspect relevant files and current state.
2. State a brief plan and acceptance criteria for non-trivial work.
3. Implement in small steps.
4. Run relevant tests, typecheck and build.
5. Review diff and report actual results.
6. Update docs when architecture or behavior changes.

## Completion Report
Include:
- What changed
- Files changed
- Commands actually run and results
- Manual test steps
- Known limitations and risks
- Recommended next task

## Current Priority
Follow `docs/ROADMAP.md`. Do not skip ahead to guild wars, auction house, seamless world or large-scale raids before the current milestone passes its gate.
