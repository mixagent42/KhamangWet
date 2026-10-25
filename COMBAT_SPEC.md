# Combat Specification — Hybrid Target + Directional

## 1. Goals
- Target lock supports readable MMO ability usage.
- Directional and area abilities reward positioning.
- Combat feels responsive while server remains authoritative.
- All attacks provide readable telegraphs and clear feedback.
- Combat rules are data-driven and testable without rendering.

## 2. Target Modes
- `target`: requires valid target entity.
- `direction`: direction/aim vector from player.
- `area`: world position or target-centered area, depending on skill definition.
- `self`: player-centered or self-only effect.
- `interact`: not an attack; handled by interaction rules.

## 3. Skill Lifecycle
`Idle -> Requested -> Validating -> Windup -> Resolve -> Recovery -> Idle`
Possible exits: `Rejected`, `Interrupted`, `Cancelled`, `Dead`, `ZoneChanged`.

Define whether cooldown starts on accepted cast, cast completion, or resolution per skill. Pick one default and allow explicit overrides only when needed.

## 4. Server Validation Checklist
For each request validate:
1. Authenticated session and correct room.
2. Player alive and not in a prohibited state.
3. Skill exists and is unlocked/equipped.
4. Cooldown ready.
5. Resource available.
6. Cast restrictions and control effects.
7. Target exists, is valid, alive and targetable.
8. Range and line-of-sight if required.
9. Direction/area input is finite, bounded and within allowed rules.
10. Request is not duplicated or rate-limited.
11. Server resolves hit based on authoritative positions at a defined simulation moment.
12. Resource/cooldown changes and effects commit consistently.

## 5. Damage Formula
Start with a transparent formula; tune with simulation:
`raw = skillPower * coefficient + attackerStat * scaling`
`mitigated = raw * mitigationMultiplier`
`final = clamp(round(mitigated * modifiers), minDamage, maxDamage)`
Define crit, resistance, PvP scaling, shields and damage-over-time explicitly before adding them. Avoid uncontrolled multiplicative stacking.

## 6. Movement and Dodge
- Server validates maximum speed, acceleration and legal walkable areas.
- Dodge has defined duration, cooldown, distance, and invulnerability policy.
- If invulnerability frames are used, the server evaluates them; client animation alone cannot grant immunity.
- Movement prediction is presentation only and reconciles against server state.
- Define collision and knockback priority to prevent overlap exploits.

## 7. Telegraphs
Every dangerous attack has:
- Telegraph shape (line, cone, circle, targeted marker).
- Windup duration.
- Resolution time.
- Damage/status behavior.
- Counterplay.
- Visual/audio accessibility cues.
- Server event identifier so clients align VFX to the same event.

## 8. Status Effects
Use data definitions with:
- id, duration, stack policy, tick interval, source, dispel policy, tags.
- Explicit stacking rules: refresh, stack-to-cap, strongest-only, or independent.
- Server owns duration and effect application.
- Client receives remaining state for display; client timers do not determine actual expiration.

## 9. Combat Events
Suggested events:
- `SkillAccepted`
- `SkillRejected`
- `CastStarted`
- `CastInterrupted`
- `SkillResolved`
- `EntityDamaged`
- `EntityHealed`
- `StatusApplied`
- `StatusRemoved`
- `EntityDied`
- `LootGranted`

Events should contain IDs and minimal necessary data. Never accept client-submitted `damage`, `loot`, or `finalPosition` as truth.

## 10. Initial Skill Set
Prototype only:
- `yantra_bolt`: target projectile/instant test ability.
- `seal_burst`: ground area with telegraph.
- `ward_step`: short dodge/defensive step.
- `curse_mark`: target debuff.
- `spirit_bind`: control skill with resistance/immunity rules.
Each skill must define cost, cooldown, range, cast time, targeting, interruption, effect and tests.

## 11. Acceptance Tests
- Skill cannot be used when dead, silenced, on cooldown or resource-starved.
- Out-of-range and invalid targets are rejected.
- Client spoofing damage has no effect.
- Duplicate request does not apply twice.
- Area attack hits entities according to server-side geometry and timing.
- Dodge immunity, if any, is server-validated.
- Two clients observe consistent final health/status.
- Skill definitions missing required fields fail validation at startup/build.
