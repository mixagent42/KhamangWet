---
paths:
  - "apps/game-server/**/*"
---
# Server Rules
- Validate all client payloads at runtime.
- Server owns movement validation, combat resolution, rewards, inventory and progression.
- Apply rate/payload limits to inbound messages.
- Use idempotency and transactions for operations that grant, consume or transfer value.
- Do not trust client timestamps or client-calculated final values.
- Test reconnect, duplicate requests and invalid state transitions.
