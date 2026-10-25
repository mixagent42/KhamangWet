# Prompt 07 — Release Readiness Check

Assess the current build for a closed test. Do not deploy or modify production resources.

Check:
- build reproducibility and dependency lockfile
- migrations and backup/restore procedure
- auth/session settings and secrets
- server validation and rate limits
- logs/metrics/health checks
- error handling and reconnect behavior
- item/reward idempotency and transaction safety
- browser compatibility and performance baseline
- known bugs and rollback plan
- privacy notices and data minimization appropriate to the test

Return Go / No-Go with evidence. Any unresolved critical security or data-loss issue means No-Go. Do not claim production readiness without actual test evidence.
