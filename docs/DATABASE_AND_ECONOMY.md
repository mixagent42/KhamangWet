# Database, Persistence and Economy

## 1. Initial Entities
- Account
- Session / refresh token record (if applicable)
- Character
- CharacterStats or versioned character state
- SkillDefinition (static data) and CharacterSkill
- ItemDefinition (static data) and ItemInstance
- InventorySlot / EquipmentSlot
- TattooLoadout / AmuletLoadout
- QuestDefinition (static data) and CharacterQuest
- CurrencyLedger / TradeRecord (later)
- AuditEvent for sensitive operations

Static definitions can live in version-controlled game data at first. Persist player-specific state in PostgreSQL.

## 2. Item Identity
Separate `itemDefinitionId` (what kind of item) from `itemInstanceId` (the specific owned item). Inventory must track owner, slot, quantity where stackable, bound/tradeable status, durability/rolls if needed, and version.

## 3. Transactions
Use database transactions for:
- buying/selling
- crafting with material consumption
- player trade
- reward grant + quest completion where atomicity matters
- moving unique items between owners
Use unique constraints and idempotency to prevent duplicate operations.

## 4. Currency Ledger
For player economy, keep an auditable record of currency changes:
- transaction id
- character/account
- delta
- reason
- related request/event id
- timestamp
Never accept final currency balance from client. Calculate on server and record atomically.

## 5. Save Strategy
Persist on important state transitions and periodically for durable state, not every movement frame. Define recovery behavior for crash/disconnect. Make save operations versioned and resilient to retries.

## 6. Migrations and Backups
- All schema changes via migrations.
- Test migrations on a disposable database before shared environments.
- Document backup and restore procedure.
- Never run destructive production migration without a verified backup and explicit approval.

## 7. Economy MVP
- NPC shop with fixed prices.
- Server-controlled enemy loot tables.
- Limited crafting recipes and predictable sinks.
- No player trading until item ownership and transaction integrity are tested.
- Avoid pay-to-win or uncontrolled randomized monetization during MVP.
