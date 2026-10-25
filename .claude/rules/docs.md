---
paths:
  - "docs/**/*"
---
# Documentation Rules
- Docs describe plans and evidence; they are not proof that something is implemented. Record status claims in `docs/IMPLEMENTATION_STATUS.md` with the command run, its result and the date.
- Make minimal edits; do not rewrite a whole doc. Mark superseded content explicitly instead of deleting it.
- Original design docs (`GAME_VISION_GDD`, `TECHNICAL_ARCHITECTURE`, `COMBAT_SPEC`, `NETWORK_PROTOCOL`, `DATABASE_AND_ECONOMY`, `SECURITY_THREAT_MODEL`, `TEST_STRATEGY`, `ROADMAP`, `AI_WORKFLOW`, `ART_ANIMATION_PIPELINE`): show the diff to the developer before committing. Prefer in-place edits, because other docs cite their line numbers.
- `docs/DECISIONS.md`: never set an entry to Accepted without the developer's approval or explicit delegation in chat. Never delete an entry; mark it Superseded with the replacing ID and the date.
- When a decision changes, update every doc that depends on it in the same task, and bump the version and change log of docs that have them.
- In planning docs, label facts and recommendations ([F], [R], [?]). Cite a source for each fact (file plus section or line, or URL plus the date checked).
- Keep each doc in its existing language. Never put secrets, tokens or credentials in docs.
