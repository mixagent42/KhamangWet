---
paths:
  - "database/**/*"
  - "**/*schema.prisma"
---
# Database Rules
- Schema changes require migrations.
- Test migrations on disposable/local data first.
- Use transactions and constraints to preserve ownership and consistency.
- Never run destructive production migrations without explicit approval and a verified backup.
- Do not commit secrets or production data.
