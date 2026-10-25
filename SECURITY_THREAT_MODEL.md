# Security Threat Model

## 1. Assets to Protect
Accounts, sessions, character progression, items, currency, quest rewards, server availability, unreleased assets and source code secrets.

## 2. Threats and Mitigations
### Client tampering
Threat: modified JavaScript sends impossible actions.
Mitigation: server-side validation of movement, skills, stats, inventory and progression.

### Replay / duplicate requests
Threat: repeated reward, purchase or trade messages.
Mitigation: request IDs, idempotency, transactions, unique constraints.

### Item duplication / race conditions
Threat: two concurrent actions move or spend the same item.
Mitigation: transactional updates, row/version checks, single authoritative owner and concurrency tests.

### Account/session compromise
Threat: stolen credentials or long-lived tokens.
Mitigation: established auth libraries, secure cookie/session settings, rate limits, token rotation/revocation and no secrets in logs. Do not invent custom cryptography.

### Injection / malformed payloads
Threat: malformed input crashes server or bypasses rules.
Mitigation: schema validation, parameterized DB access, payload limits and safe error handling.

### DoS / spam
Threat: excessive messages, room joins or expensive actions.
Mitigation: rate limits, per-session quotas, message-size limits, timeouts and monitoring.

### Admin abuse
Threat: debug/admin commands reachable in production.
Mitigation: development-only gates, role checks, audit logs and no hidden client-side-only admin password.

### Asset/code extraction
Threat: browser-delivered assets and code can be inspected.
Mitigation: never place secrets or authoritative logic in client bundle; obfuscation is only a speed bump. Protect server-side logic and licensed source assets. Assume public client assets can be downloaded.

## 3. Security Acceptance Criteria
- Client cannot grant currency or items.
- Client cannot submit authoritative damage.
- Duplicate purchase/reward requests do not duplicate effects.
- Unauthorized character IDs cannot be accessed.
- Rate-limited messages are rejected without crashing room.
- Production logs contain no credentials/tokens.
- Admin endpoints are inaccessible to ordinary players.
