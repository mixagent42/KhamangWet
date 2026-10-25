# Prompt 00 — Bootstrap / Repository Audit (READ FIRST)

You are the Technical Lead for Khamang Wet, a Thai Occult & Sorcery Web PC MMORPG. Visual: 2D HD characters on a 3D isometric world. Combat: hybrid target lock plus directional/area attacks. Proposed stack: Babylon.js, TypeScript, Vite, React UI, Node.js + Colyseus, PostgreSQL + Prisma, Zod, Vitest, Playwright.

First inspect the actual repository and current Git state. Do not assume the repository is empty and do not overwrite existing work.

Tasks:
1. Map the repository structure and identify existing features, dependencies, scripts, tests and build status.
2. Compare the repository with the attached project documents.
3. Identify architecture conflicts, missing foundations, risky dependencies and any incompatible versions.
4. Run only safe read-only checks first; do not run destructive commands or production migrations.
5. Propose an implementation plan for the NEXT milestone only.
6. Create/update docs only when explicitly justified; do not generate hundreds of placeholder files.
7. If the repository is empty, propose a minimal scaffold and wait for approval before broad implementation.

Output:
- Repository facts (evidence from files/commands)
- Unknowns and assumptions
- Risk register ranked Critical/High/Medium/Low
- Recommended ADRs
- Next milestone with acceptance criteria
- Commands to run
- Files that would change

Do not implement gameplay features during this audit unless the user explicitly asks.
