# KHAMANG WET — Full Development System
Thai Occult & Sorcery MMORPG | Web PC | 2.5D: 2D HD characters on 3D isometric world | Hybrid Combat

เอกสารชุดนี้เป็น baseline สำหรับ Solo Developer ที่ใช้ Claude Code และ AI tools ช่วยพัฒนา
**อย่าถือว่าเอกสารนี้หมายถึงมีระบบเหล่านี้อยู่ในโค้ดแล้ว** ทุก feature ต้องผ่าน implementation และ tests ก่อนนับว่าเสร็จ

## วิธีใช้
1. แตก ZIP ลงใน root ของ repository เกม หรือคัดลอกเอกสารที่ต้องการเข้าโปรเจกต์
2. เปิด repository ด้วย Claude Code
3. ส่ง `prompts/00_BOOTSTRAP_AND_AUDIT.md` ก่อน ให้ Claude ตรวจ repository และสร้างแผนโดยยังไม่เขียนระบบใหญ่
4. ให้ Claude สร้าง/อัปเดต `CLAUDE.md` จาก `CLAUDE_TEMPLATE.md` โดยย่อให้เหลือกฎถาวรที่จำเป็น
5. ทำตาม `ROADMAP.md` ทีละ milestone อย่าสั่งสร้างทั้งเกมในครั้งเดียว
6. ใช้ prompt เฉพาะงานใน `prompts/` และตรวจผล `TEST_STRATEGY.md` ทุกครั้ง

## Tech baseline (proposed; validate before locking)
- Client: Babylon.js + TypeScript + Vite
- UI: React + TypeScript (overlay UI, not game-world rendering)
- Server: Node.js + TypeScript + Colyseus authoritative rooms
- Database: PostgreSQL + Prisma
- Validation: Zod
- Tests: Vitest + Playwright; load-test tooling chosen after basic server exists
- Repo: pnpm workspace monorepo
- Art: Blender for 3D environment; 2D HD character pipeline with a selected skeletal/sprite runtime
- Deploy: containerized services; hosting choice only after local vertical slice

These are recommendations, not facts about an existing repository. Confirm current versions, runtime compatibility, licensing, and deployment costs before implementation.

## Contents
- `GAME_VISION_GDD.md`: vision, pillars, player loop, world, progression and content scope
- `TECHNICAL_ARCHITECTURE.md`: client/server boundaries and architecture
- `COMBAT_SPEC.md`: hybrid combat rules and authoritative pipeline
- `ART_ANIMATION_PIPELINE.md`: 2D-on-3D rendering, animation and VFX
- `NETWORK_PROTOCOL.md`: message contracts and server authority
- `DATABASE_AND_ECONOMY.md`: persistence, item ownership, transactions and economy
- `SECURITY_THREAT_MODEL.md`: threat model and mitigation checklist
- `TEST_STRATEGY.md`: quality gates and definition of done
- `ROADMAP.md`: milestone-based development roadmap
- `AI_WORKFLOW.md`: Claude Code workflow, role separation and task templates
- `CLAUDE_TEMPLATE.md`: starter project instructions
- `prompts/`: master prompt and task-specific prompts
