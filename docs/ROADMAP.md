# Roadmap and Milestones

Estimates are planning ranges for a solo developer and can vary substantially. Milestones are gated by evidence, not calendar dates.

## M0 — Repository Audit and Decision Lock
Deliverables:
- repo map and build/test commands
- stack/version compatibility check
- ADRs for rendering, animation runtime, networking and database (M0 gate: networking ADR-004 accepted, database ADR-005 draft until M3; rendering and animation runtime ADRs moved to M1/VP0 by DEC-014 and DEC-040)
- risk register
Gate: no unknown critical constraint before prototype.

## M1 — Visual/Movement Prototype
Deliverables:
- Babylon.js scene, orthographic camera, terrain and one test structure
- 2D character on 3D plane
- movement, facing, idle/walk
- depth sorting/occlusion experiment
Gate: character walks and sorts correctly in a representative scene.

## M2 — Offline Combat Sandbox
Deliverables:
- target lock, directional attack, area telegraph, dodge
- one enemy and one test boss pattern
- data-driven skill definitions and unit tests
Gate: combat loop is understandable and rules are independent from renderer.

## M3 — Authoritative Multiplayer Slice
Deliverables:
- Colyseus room, two clients, movement synchronization
- server-side skill validation and combat resolution
- reconnect and invalid-message handling
Gate: two clients observe consistent outcomes; client tampering does not decide results.

## M4 — Persistence
Deliverables:
- account/session approach
- character save/load
- inventory, equipment, quest state
- migrations and backup instructions
Gate: relog preserves correct state; duplicate requests cannot duplicate items/rewards.

## M5 — Occult Gameplay Slice
Deliverables:
- Yantra Adept and Spirit Medium prototype paths
- 3 enemy types and 1 boss
- tattoo/amulet loadout
- one investigation quest and one hunt quest
Gate: full loop from quest to reward and character improvement is playable.

## M6 — Vertical Slice Polish
Deliverables:
- village hub + haunted forest zone
- UI, sound, VFX, animation and environmental art
- onboarding and feedback
- browser performance baseline
Gate: new tester can complete the loop without developer guidance.

## M7 — Closed Test
Deliverables:
- test cohort, bug triage, server metrics, backups, privacy/security review
- load and reconnect tests
- economy and progression review
Gate: no unresolved critical security/data-loss bugs.

## M8 — Expand Carefully
Only after M7:
- more zones, arts, monsters, quests
- party and guild systems
- player trading after transaction protections
- content tools and internal admin panel
- additional server instances when profiling requires them

## Weekly Workflow
Plan one small milestone; implement; test; playtest; review diff; document decisions; commit. Avoid starting several large systems in parallel.
