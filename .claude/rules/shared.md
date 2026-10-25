---
paths:
  - "packages/**/*"
---
# Shared Package Rules
- Runtime packages (`shared-contracts`, `game-data`, `game-rules`) run in both the browser and Node. Do not import Babylon.js, React, Prisma or other database clients, DOM APIs, or Node-only modules such as `fs`, `net` and `child_process`. `packages/config` is Node-only tooling (lint, TypeScript and test settings) and is exempt.
- `packages/game-rules` contains pure, deterministic functions only: no I/O and no global state. Do not call `Math.random()`, `Date.now()` or `performance.now()`; take the RNG and the clock as parameters (DEC-013).
- The server and the client use the same game-rules functions. Do not copy or fork rule logic into the client for prediction; call the shared function.
- `packages/shared-contracts`: every network message has a Zod schema and a protocol version, and rejects unknown or oversized input. Never put server-only or secret fields in a shared contract.
- Changing a contract or a game-data definition is a breaking change: record it in `docs/DECISIONS.md`, update both client and server in the same task, and update the contract tests.
- `packages/game-data` holds definitions as data validated by schema at build time. A definition missing a required field must fail the build. Balance numbers and coefficients live here, not hardcoded in game-rules.
- Do not delete or rename a game-data definition id without asking first: persisted item instances may reference it.
- Every game-rules change needs unit tests that use a seeded RNG and an injected clock.
