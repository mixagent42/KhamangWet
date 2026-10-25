# Prompt 04 — Security and Economy Abuse Review

Act as a defensive game security engineer. Inspect actual server code and protocol contracts.

Check:
- client-supplied damage, stats, cooldown, position, loot, currency and inventory
- replayed/duplicated requests
- inventory race conditions and item duplication
- unauthorized character/entity access
- authentication/session handling
- rate limiting, payload size and expensive requests
- production debug/admin routes
- secrets and sensitive logs
- database transaction boundaries
- disconnect/reconnect and zone transition races

Do not exploit a live third-party service. Use local tests or safe test fixtures only.
Return severity, evidence, abuse scenario, fix, regression test, and residual risk. Do not claim a system is secure based on a quick scan.
