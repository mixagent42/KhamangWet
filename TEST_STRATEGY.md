# Test Strategy and Definition of Done

## 1. Test Layers
- Unit: pure game rules, skill formulas, inventory slot rules, status stacking.
- Integration: server room + combat + persistence, reward grant, inventory transaction.
- Browser E2E: login, enter zone, move, combat, loot, relog.
- Multiplayer E2E: two clients see consistent entities and combat outcomes.
- Load tests: room population, message rate, server tick duration and reconnect behavior.
- Manual visual QA: depth sorting, occlusion, animation timing, VFX readability, camera.

## 2. Mandatory Quality Gates
Before calling a feature complete:
1. Acceptance criteria written.
2. Relevant tests added/updated.
3. Typecheck passes.
4. Unit/integration tests pass or failure is documented.
5. Production build succeeds.
6. No unrelated files changed.
7. No secrets or generated files committed accidentally.
8. Manual reproduction steps included.
9. Risks and known limitations documented.
10. Git diff reviewed.

## 3. Definition of Done
A feature is not done merely because it compiles or looks plausible. It is done when behavior matches acceptance criteria, error cases are handled, tests pass, and the result is reproducible.

## 4. Test Cases — Combat
- Dead player cannot cast.
- Cooldown blocks repeated cast.
- Insufficient resource blocks cast.
- Invalid or out-of-range target is rejected.
- Client-supplied damage is ignored.
- Duplicate request does not apply twice.
- Status effects obey stack/refresh/cap policy.
- Two clients receive consistent final state.
- Disconnect during cast does not create duplicate rewards.

## 5. Test Cases — Inventory
- Item cannot be moved if not owned.
- Unique item cannot occupy two slots.
- Failed transaction leaves state unchanged.
- Crafting consumes exactly required materials once.
- Retried purchase is idempotent.
- Invalid quantity/slot IDs are rejected.

## 6. Test Cases — Visual
- Character foot pivot aligns to ground.
- Character sorts correctly behind/around approved occluders.
- Walkable and blocked geometry match.
- VFX does not hide hostile telegraphs.
- Zone unload disposes resources.
- Missing asset uses fallback and does not crash.

## 7. Performance
Define a repeatable benchmark scene and record:
- browser/version, hardware, resolution, camera zoom
- number of visible characters/entities
- active effects
- average and percentile frame time
- memory and load time
- server room population, tick duration and message throughput
Set target thresholds after baseline measurement; do not invent capacity claims before testing.
