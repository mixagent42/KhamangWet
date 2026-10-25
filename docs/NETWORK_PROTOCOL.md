# Network Protocol and Multiplayer Rules

## 1. Principles
- Client requests actions; server validates and emits outcomes.
- All inbound messages are schema-validated.
- Separate reliable commands from frequent movement/state synchronization.
- Include protocol versioning and stable entity identifiers.
- Limit payload sizes and message rates.
- Do not expose secrets or internal server-only fields.

## 2. Example Message Contracts
These are conceptual examples; align to the chosen Colyseus version and actual schema implementation.

### Client -> Server
- `MoveInput`: sequence, normalized direction, input duration or movement intent.
- `SkillRequest`: requestId, skillId, optional targetEntityId, optional aimDirection/groundPoint.
- `InteractRequest`: requestId, entityId, interactionType.
- `InventoryActionRequest`: requestId, action, sourceSlot, destinationSlot, itemInstanceId.
- `QuestActionRequest`: requestId, questId, action.

### Server -> Client
- `MoveState`: entityId, authoritative position/velocity, sequence or tick.
- `SkillAccepted` / `SkillRejected`: requestId, reason code, server tick.
- `CombatEvent`: eventId, type, source/target IDs, resolved values and server time/tick.
- `InventoryStateDelta`: version, changed slots/items.
- `QuestProgressDelta`: questId, objective progress.
- `ZoneTransition`: destination room/zone and transition token.

## 3. Idempotency
Any request that can create a reward, spend currency, move items, or complete a quest needs duplicate-request handling. A repeated requestId must not repeat the effect. Define retention and persistence requirements based on action risk.

## 4. Reconnect
- Authenticate again or refresh a short-lived session securely.
- Rejoin the correct zone after validating character ownership.
- Send a server snapshot of authoritative state.
- Client discards stale predicted state and reconciles.
- Do not trust a client-provided inventory or position snapshot.

## 5. Interest Management
Start by syncing all entities in a small test room. Add spatial filtering only after baseline correctness is proven. Ensure entities entering/leaving interest range are created/destroyed cleanly on clients.

## 6. Room/Zone Lifecycle
- Validate zone access and player count.
- Handle join/leave and abnormal disconnects.
- Define persistence behavior for disconnect during combat.
- Define safe zone-transition behavior and prevent duplicated characters in two rooms.
- Never allow simultaneous authoritative ownership of the same character in multiple rooms.

## 7. Observability
Record server tick duration, active room count, room population, message rates, rejected requests, reconnects and persistence latency. Avoid logging passwords, tokens or other secrets.
