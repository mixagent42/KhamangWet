# Technical Architecture

## 1. Architecture Decisions
Use a TypeScript monorepo and a modular monolith initially. Do not split microservices until measurements or team needs justify it.

### Proposed stack
- Web client: Vite + TypeScript + Babylon.js
- UI overlay: React + TypeScript
- Game server: Node.js + TypeScript + Colyseus
- Persistent data: PostgreSQL + Prisma
- Runtime validation: Zod at network/API boundaries
- Unit tests: Vitest
- Browser tests: Playwright
- Package manager: pnpm workspaces
- Build/deploy: reproducible scripts and containers when needed

Check compatibility, latest stable versions, and licensing before pinning dependencies. Commit lockfile.

## 2. High-Level Diagram
Browser Client
  ├─ UI Overlay (React)
  ├─ Babylon Renderer (3D world, camera, lighting)
  ├─ 2D Character Renderer (sprites/skeletal runtime)
  ├─ Input and local presentation
  └─ Network Client (WebSocket)
           ↕
Authoritative Game Server
  ├─ Session/Auth boundary
  ├─ Zone/Room manager
  ├─ Movement validation
  ├─ Combat and status effects
  ├─ NPC/monster AI
  ├─ Inventory/loot/economy
  └─ Persistence service
           ↕
PostgreSQL
Static assets served separately/CDN later

## 3. Trust Boundaries
Client is untrusted. Server owns:
- Position validation and movement limits.
- Skill availability and cooldown.
- Resource consumption.
- Target validation, range, line of sight and hit resolution.
- Damage, healing, status, death and respawn.
- Loot rolls and reward grants.
- Inventory ownership, currency and trades.
- Quest progress and persistent progression.

Client may predict presentation and play anticipation animations, but must reconcile to server state.

## 4. Module Boundaries
### Client
- `rendering`: Babylon scene, camera, lighting, render loop.
- `characters`: sprite/skeletal renderer and animation state.
- `world`: zone visuals, collision presentation, interactables.
- `input`: keyboard/mouse input mapping.
- `combat-ui`: target UI, skill bar, combat text and telegraphs.
- `network`: transport, schema decode, reconnect state.
- `ui`: inventory, quest, equipment and dialogue.
- `assets`: manifest, loading and disposal.

### Server
- `rooms`: lifecycle and player membership.
- `movement`: validation and authoritative movement.
- `combat`: skill validation, hit resolution and events.
- `entities`: player/NPC/monster state.
- `ai`: state machines, aggro and encounter scripts.
- `inventory`: item instances and slot operations.
- `quests`: progress and reward conditions.
- `economy`: currency and transactions.
- `persistence`: repositories and save/load.
- `security`: rate limits, validation, audit events.

### Shared packages
- `shared-contracts`: network DTOs, enums/unions, schemas.
- `game-data`: static definitions for skills/items/monsters/quests.
- `game-rules`: deterministic pure functions where appropriate.
- `config`: shared lint/type/test settings.

Do not import Babylon.js or React into server packages. Do not import database clients into rendering packages.

## 5. Proposed Repository
apps/
  web/
  game-server/
  admin/                 # later, internal only
packages/
  shared-contracts/
  game-data/
  game-rules/
  config/
database/
  migrations/
  seeds/
docs/
  GDD.md
  TECHNICAL_ARCHITECTURE.md
  COMBAT_SPEC.md
  NETWORK_PROTOCOL.md
  SECURITY_THREAT_MODEL.md
  TEST_STRATEGY.md
.claude/
  rules/
  skills/
  agents/
tests/
  integration/
  load/

Start smaller if appropriate; never create empty scaffolding for every future feature.

## 6. Rendering and Simulation
- Use an orthographic camera for isometric presentation.
- World movement/collision uses world-space coordinates on a defined walkable plane.
- Character sprites must share an agreed pivot/foot point and scale convention.
- Depth sorting must account for the character's ground anchor, occlusion volumes, and 3D geometry. Do not rely on head position.
- Separate render state from authoritative gameplay state.
- Effects should have budgets and pooled transient resources.
- Dispose meshes, textures, observers and listeners when zones unload.
- Test depth/occlusion early; this is a project risk.

## 7. Networking
- Use reliable messages for skill requests, inventory changes, interactions and transactions.
- Use state synchronization for frequently changing movement/state.
- Server tick rate and snapshot frequency are tuning parameters decided by profiling.
- Add interest management only after basic room sync works; start with a small room.
- Client interpolation is allowed; client-side authoritative combat is not.
- Every message needs schema validation, size/rate limits, and version compatibility strategy.

## 8. Persistence
- Save durable state only: character progression, inventory, equipment, quest progress, currency.
- Do not write every movement frame to PostgreSQL.
- Use transactions for multi-record operations.
- Add idempotency keys or deduplication for reward/transaction requests where retries could duplicate effects.
- Have migration and backup/restore procedures before public tests.

## 9. Operations
- Separate local, test/staging and production configuration.
- Never commit secrets or production credentials.
- Log structured server events with request/session/character identifiers that are safe and non-secret.
- Add health checks and graceful shutdown.
- Track errors, room population, tick duration, memory and database latency.
- Keep admin actions restricted and audited.

## 10. Architecture Decision Records
Create `docs/adr/NNN-title.md` for decisions with meaningful long-term consequences. Each ADR includes context, decision, alternatives, consequences, status and date. Do not silently change core stack or protocol.
