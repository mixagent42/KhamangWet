# IMPLEMENTATION BACKLOG — Khamang Wet

- **สร้างเมื่อ:** 2026-10-26 · **สถานะ:** Draft ที่รออนุมัติ · **Task ทั้งหมดยังไม่เริ่ม**
- **ที่มา:** `ROADMAP.md` (M0–M8), `PROJECT_ONBOARDING_REPORT.md §9–10`, `DECISIONS.md`
- **เป้าหมายระยะใกล้:** จบ M4 แล้วได้ **VS0** ตามนิยามใน onboarding report §10 · M5–M8 แตกไว้แค่ระดับ epic และจะแตกเป็น task ก่อนเริ่ม milestone นั้น
- **ทั้งไฟล์นี้เป็นข้อเสนอ [R]** ยกเว้นส่วนที่ระบุว่าเป็น **[F]**

### Conventions
| Field | ความหมาย |
|---|---|
| ID | `M{n}-T{nn}` = task, `M{n}-E{nn}` = epic (ยังไม่แตก) |
| Type | `decision` · `infra` · `spike` (ทดลองแล้วทิ้งได้ ผลลัพธ์คือ ADR) · `code` · `test` · `doc` |
| Size | **S** = 1 เซสชัน AI · **M** = 2–3 เซสชัน · **L** = ต้องแตกย่อยก่อนเริ่ม |
| Depends | task ที่ต้อง Done ก่อน |
| Decisions | DEC ที่ต้อง Accepted ก่อนเริ่ม |
| Status | `Todo` · `Blocked` (รอ decision หรือผู้พัฒนา) · `In progress` · `Done` (ต้องมีหลักฐานตาม `DEFINITION_OF_DONE.md`) |
| Risks | รหัส R-xx จาก onboarding report §5 |

**กฎ:** ทำทีละ 1 task ต่อ 1 branch ห้ามเริ่ม task ที่สถานะเป็น Blocked และห้ามสร้าง scaffolding ล่วงหน้าเกินกว่าที่ task ต้องใช้ (TECH L111)

---

## Dependency Overview

```
M0  T01(decisions) ─► T02(git) ─► T03(dedupe docs)
                         │
                         ├─► T04(CLAUDE.md) ─► T05(rules) ─► T14(claude config)
                         ├─► T06(version spike) ─► T07(pnpm) ─► T08(workspace) ─► T09(lint) ─► T10(verify) ─► T11(CI)
                         │                                                              └─► T12(ADRs) ─► T15(M0 gate)
                         └─► T13(local Postgres, optional in M0)
M1  T01(scene/camera/units) ─► T04(char renderer) ─► T06(depth spike) ─► T09(benchmark) ─► gate
    T02(walkable data+rules) ─► T05(local movement) ──────────┘
    T03(placeholder art+manifest) ─► T04          T07(debug hook) ─► T08(dispose test)    T10(React shell)
M2  T08(contracts) ─► T01..T05(rules) ─► T07(enemy AI) ─► T09(local sim) ─► T10(UI) ─► gate
M3  T01(server) ─► T02(dev auth) ─► T03(room) ─► T04(validation) ─► T05(auth. movement) ─► T06(netcode)
                                                     └─► T07(combat in room) ─► T08(AI) ─► T09(reconnect) ─► T11(E2E) ─► T12(ADR-005) ─► gate
M4  T01(DB) ─► T02(auth) ─► T03(lease) ─► T04(loot txn) ─► T05(XP/checkpoint) ─► T06(load) ─► T07(crash) ─► T11(VS0 E2E) ─► gate = VS0
```

---

## M0 — Repository Foundation & Decision Lock
**Exit criteria (วัดได้):**
1. เป็น git repository ที่มี baseline commit และ md5 ของไฟล์ใน commit ตรงกับ `IMPLEMENTATION_STATUS.md §2.4`
2. `pnpm install --frozen-lockfile` บน clone ใหม่สำเร็จ
3. `pnpm verify` ผ่านทั้ง local และ CI
4. lint fixture ที่ import ผิดกฎทำให้ lint ล้ม
5. ADR-001 ถึง ADR-007 เป็น Accepted
6. ไม่มี decision ที่มีป้าย "ต้องปิดก่อน M0" ค้าง

#### M0-T01 — ประชุมตัดสินใจรอบแรก
- **Type:** decision · **Size:** S · **Depends:** — · **Status:** ✔ **Done (2026-10-26)** ผู้พัฒนามอบอำนาจให้ตัดสิน และผลอยู่ใน `DECISIONS.md §4.0` (DEC-009 และ 010 ยังไม่ตัดสินพร้อมเหตุผล)
- **Decisions ที่ต้องตอบ:** DEC-001, 002, 003, 004, 039 และยืนยันค่าเริ่มต้นของ DEC-012, 013, 033, 034
- **AC:** `DECISIONS.md` บันทึกสถานะ Accepted, Rejected หรือ Open ของแต่ละข้อ พร้อมวันที่และผู้อนุมัติ
- **Risks:** R-20

#### M0-T02 — Git init และ baseline commit
- **Type:** infra · **Size:** S · **Depends:** T01 ✔ · **Decisions:** DEC-001 ✔ · **Status:** ✔ **Done (2026-10-26)** · commit `2ab369f` (baseline) + `94b822b` (docs) + commit บันทึกหลักฐาน · AC ทั้ง 4 ข้อผ่านตาม `IMPLEMENTATION_STATUS.md §2.1` · **ข้อยกเว้นของ DEC-012:** task นี้ commit ตรงเข้า `main` เพราะเป็นการสร้าง branch แรกของ repo ส่วน task ถัดไปใช้ 1 branch ต่อ task
- **ขั้นตอน:** ตั้ง git identity (ผู้พัฒนาตั้งเอง หรือให้ค่ามาเพื่อตั้งแบบ local ใน repo) → `git init -b main` → `.gitattributes` (LF) + `.gitignore` → commit 1 = 34 ไฟล์ต้นฉบับโดยไม่แก้ไข → commit 2 = onboarding report + foundation docs + `.gitattributes` + `.gitignore`
- **AC:** (1) `git log --oneline` แสดง 2 commit (2) md5 ของทุกไฟล์ใน commit 1 ตรงกับ baseline (3) `git status` สะอาด (4) `git ls-files --eol` แสดงว่าทุกไฟล์ใน index เป็น LF
- **Risks:** `core.autocrlf=true` อาจแปลง line ending ซึ่งป้องกันได้ด้วย `.gitattributes`

#### M0-T03 — ลบเอกสารซ้ำและแก้ path อ้างอิง
- **Type:** doc · **Size:** S · **Depends:** T02 · **Decisions:** DEC-002 ✔ · **เพิ่ม:** ย้าย `PROJECT_ONBOARDING_REPORT.md` เข้า `docs/` ใน commit เดียวกัน และคง `README.md` กับ `CLAUDE_TEMPLATE.md` ไว้ที่ root · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t03-dedupe-docs` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติ diff ก่อน commit · AC ทั้ง 4 ข้อผ่านตาม `IMPLEMENTATION_STATUS.md §2.1 (M0-T03)`
- **AC:** (1) ตรวจ md5 ซ้ำก่อนลบ ถ้าคู่ใดต่างกันให้หยุดและรายงาน (2) เหลือสำเนาเดียวต่อเอกสาร (3) แสดง diff ของ README Contents และ TECH §5 ให้ผู้พัฒนาดูก่อน commit (4) path ทุกตัวในเอกสาร `docs/*.md` ชี้ไปยังไฟล์ที่มีจริง (ตรวจด้วย script หรือ grep)
- **Risks:** สูญเสียการแก้ไขถ้าสำเนาเริ่มต่างกันแล้ว ซึ่งป้องกันได้ด้วยการตรวจ md5

#### M0-T04 — สร้าง `CLAUDE.md`
- **Type:** doc · **Size:** S · **Depends:** T02 (แนะนำให้ทำหลัง T03) · **Decisions:** DEC-033 ✔ · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t04-claude-md` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติเนื้อหาก่อน commit · AC ทั้ง 4 ข้อผ่าน (66 บรรทัด, ไม่มีคำสั่งที่ยังรันไม่ได้, ไม่มี `@import`, ไม่ขัดกับ rules) ตาม `IMPLEMENTATION_STATUS.md §2.1 (M0-T04)`
- **AC:** (1) ไม่เกิน 200 บรรทัด (เป้า ~120) ตามคำแนะนำในเอกสาร Claude Code (2) ไม่มีคำสั่งที่ยังรันไม่ได้ (คำสั่งเพิ่มหลัง T10) (3) อ้าง path ด้วย backtick ไม่ใช้ `@import` เอกสารใหญ่ (4) ไม่ขัดกับ `.claude/rules/*`
- **Risks:** CLAUDE.md ยาวเกินไปจะทำให้ AI ทำตามน้อยลง

#### M0-T05 — ปรับ rules
- **Type:** doc · **Size:** S · **Depends:** T04 · **Decisions:** DEC-033 ✔, DEC-008 ✔ (ส่วน database glob) · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t05-rules` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติเนื้อหาก่อน commit · เพิ่ม `shared.md` และ `docs.md` · rule เดิม 3 ไฟล์ไม่ได้แก้ · **glob ของ `database.md` ไม่ต้องแก้** เพราะครอบคลุม `database/schema.prisma` อยู่แล้ว (`IMPLEMENTATION_STATUS.md §2.1 M0-T05`)
- **AC:** เพิ่ม `shared.md` (`packages/**/*`) และ `docs.md` (`docs/**/*`) ตาม DECISIONS ภาคผนวก A.2 ไม่แก้เนื้อหาของ 3 ไฟล์เดิม ยกเว้น glob ของ database หลัง DEC-008 (ต้องแสดง diff ก่อน)
- **Risks:** C-19

#### M0-T06 — Version compatibility spike
- **Type:** spike · **Size:** M · **Depends:** T02 · **Decisions:** DEC-003, DEC-004 (ผลลัพธ์ของ task นี้ใช้ปิด DEC-005 ถึง DEC-008) · **Status:** ✔ **Done (2026-10-26)** หลักฐานอยู่ใน tag `spike/m0-t06` (`ce3eed4` = spike `15a0b05` + log ดิบ · ไม่ merge · ลบ branch และโฟลเดอร์แล้ว) · ผลอยู่ใน `docs/adr/001-stack-and-versions.md` · ผู้พัฒนาเลือก TS 6.0.3 + ESLint · มีผลข้างเคียงนอกแผนจาก Prisma (DEC-059)
- **ขอบเขต:** branch ทิ้งได้ที่มี package น้อยที่สุดเพื่อพิสูจน์ว่า
  - TS major ที่เลือก + decorator ของ `@colyseus/schema` compile และ encode ได้
  - Vite + React plugin build ได้
  - Prisma CLI และ client เวอร์ชันเดียวกัน generate ได้ (ไม่ต้องต่อ DB)
  - Babylon.js import และ tree-shake ได้
  - Zod v4 + Vitest รันได้
  - พฤติกรรม build script ของ pnpm
- **AC:** ตารางเวอร์ชันแบบ exact พร้อมคำสั่งและ output ของแต่ละข้อ บันทึกใน ADR-001 · spike branch ไม่ถูก merge
- **Risks:** R-17, R-18

#### M0-T07 — ติดตั้งและ pin pnpm
- **Type:** infra · **Size:** S · **Depends:** T06 ✔ · **Decisions:** DEC-005 ✔ (pnpm 12.15.0) · ⚠ ต้องได้รับอนุมัติก่อนติดตั้งซอฟต์แวร์ · **ข้อมูลจาก spike:** `corepack pnpm@12.15.0` ใช้ได้โดยไม่ต้อง `corepack enable` จึงอาจไม่ต้องติดตั้ง pnpm แบบถาวรเลย (ให้ผู้พัฒนาเลือกวิธี) · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t07-pnpm` แล้ว squash merge เข้า `main` · ผู้พัฒนาเลือก corepack shim ใน `%APPDATA%\npm` · AC ผ่านทั้ง 2 ข้อ: `pnpm --version` = `12.15.0` = `packageManager` และวิธีติดตั้งอยู่ใน `CLAUDE.md` ส่วน Commands · ผลนอกแผน: pnpm สร้าง `pnpm-lock.yaml` (ส่วนของ pnpm เอง) ซึ่งผู้พัฒนาอนุมัติให้ commit (`IMPLEMENTATION_STATUS.md §2.1 M0-T07`)
- **AC:** `pnpm --version` ตรงกับ `packageManager` ใน root `package.json` และวิธีติดตั้งมีบันทึกใน README หรือ CLAUDE.md

#### M0-T08 — Monorepo skeleton
- **Type:** infra · **Size:** M · **Depends:** T07 ✔ · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t08-monorepo-skeleton` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติแผน (scope `@kw`, catalog, ติดตั้งแค่ TypeScript + `@types/node` + Vite, store ที่ `E:\.pnpm-store`) และ diff ก่อน commit · AC ผ่านทั้ง 3 ข้อ รวมการทดสอบกลับที่ `--frozen-lockfile` ต้อง fail (`IMPLEMENTATION_STATUS.md §2.1 M0-T08`) · convention 4–6 อยู่ใน ADR-001
- **ขอบเขต:** root `package.json`, `pnpm-workspace.yaml`, tsconfig base, `packages/{config,shared-contracts,game-rules,game-data}`, `apps/{web,game-server}` ที่มีแค่ entry point ว่างที่ build ได้ **ไม่มีโค้ดฟีเจอร์**
- **AC:** (1) `pnpm install --frozen-lockfile` บน clone ใหม่สำเร็จ (2) `pnpm -r build` ผ่าน (3) ไม่มี package หรือโฟลเดอร์ที่ M1 ยังไม่ได้ใช้ ยกเว้นที่ระบุไว้ข้างบน

#### M0-T09 — Lint, format และ import boundary
- **Type:** infra · **Size:** S · **Depends:** T08 ✔ · **Decisions:** DEC-010 ✔ (lint = ESLint 10.13.0 + typescript-eslint 8.72.0 · formatter = Prettier 3.9.10 · boundary = ESLint core rules) · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t09-lint-format-boundaries` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติแผน 5 ข้อและ diff ก่อน commit · AC ผ่าน: fixture 7 กรณีที่ต้อง fail (มากกว่า 3 กรณีของ AC เพราะรวมกฎ DEC-013) และ 2 กรณีที่ต้องผ่าน · mutation test จับได้ · import ผิดกฎจริงทำให้ `pnpm lint` exit 1 (`IMPLEMENTATION_STATUS.md §2.1 M0-T09`)
- **AC:** มี fixture test 3 กรณีที่ lint ต้อง fail ได้แก่ (a) `apps/game-server` import Babylon (b) `apps/web` import Prisma (c) `packages/game-rules` import `node:fs` หรือ DOM

#### M0-T10 — `pnpm verify` และ test ตัวอย่าง
- **Type:** infra · **Size:** S · **Depends:** T09 ✔ · **Decisions:** DEC-013 ✔ · **Status:** ✔ **Done (2026-10-26)** ทำบน branch `m0/t10-verify` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติแผน 5 ข้อ (รวมขั้น format:check เป็นขั้นที่ 5) และ diff ก่อน commit · AC ผ่านทั้ง 3 ข้อ: `pnpm verify` exit 0 · `clamp` + Vitest 5/5 · test ที่ fail ทำให้ verify exit 1 (`IMPLEMENTATION_STATUS.md §2.1 M0-T10`)
- **AC:** `pnpm verify` = typecheck + lint + test + build และ exit 0 · มี unit test ตัวอย่าง 1 ตัวใน `game-rules` (เช่น pure function `clamp`) ซึ่งไม่ใช่ฟีเจอร์ · ทดลองทำให้ test fail แล้ว `pnpm verify` ต้อง exit ≠ 0 (บันทึกผล)

#### M0-T11 — CI pipeline (tier 1)
- **Type:** infra · **Size:** S · **Depends:** T10 ✔ · **Decisions:** DEC-011, ~~DEC-039~~ DEC-061 · **Status:** ✔ **Done (2026-10-26)** · AC ผ่านครบ: (1) run `40260667719` บน `main` เขียว (2) branch `ci/red-check` ที่ test fail ได้ run `40261106928` แดง แล้วลบ branch ทิ้ง (3) ruleset `main-protection` (ห้ามลบ + ห้าม force push) ตรวจผ่าน API แล้ว · ไม่บังคับ status check ตามแผนที่ผู้พัฒนาอนุมัติ (`IMPLEMENTATION_STATUS.md §2.1 M0-T11`) · ~~**In progress** (workflow merge ในเครื่องแล้ว · รอ push ครั้งแรก, ผลรันบน GitHub, การทดสอบ branch ที่ต้องแดง และ ruleset)~~ · ⚠ การ push ไปยัง remote ต้องได้รับอนุมัติ · **อัปเดต DEC-061 (2026-10-26):** repo `mixagent42/KhamangWet` เป็น public จึงตั้ง branch ruleset บน `main` ได้บน GitHub Free · workflow ต้อง harden ตาม DEC-011 · push เฉพาะ `main` และ `refs/tags/spike/m0-t06` แบบระบุชื่อ
- **AC:** CI เขียวบน `main` · branch ทดสอบที่ตั้งใจให้ fail ต้องแดง · ตั้ง branch protection แล้ว (ถ้ามี remote)

#### M0-T12 — เขียน ADR-001 ถึง ADR-007
- **Type:** doc · **Size:** M · **Depends:** T06 และ DEC ที่เกี่ยวข้องเป็น Accepted
- **ADR:** 001 stack + versions (✔ เขียนแล้วใน M0-T06: `docs/adr/001-stack-and-versions.md`) · ~~002 animation runtime~~ → **เลื่อนไปหลัง VP0-c** (DEC-014 เปิดใหม่เพราะ DEC-040, อัปเดต 2026-10-26) · 003 walkable data (DEC-016) · 004 netcode model (DEC-017, 018) · 005 persistence strategy (DEC-019, ร่างได้ แต่ Accept ใน M3-T12) · 006 dev auth (DEC-020) · 007 MVP scope: PvE และ loot (DEC-021, 022)
- **AC:** ทุก ADR มี context, decision, alternatives, consequences, status และ date (TECH §10) และ DECISIONS.md ลิงก์ไปยัง ADR

#### M0-T13 — Local PostgreSQL (ทำใน M0 หรือเลื่อนไป M3 ก็ได้)
- **Type:** infra · **Size:** S · **Decisions:** DEC-009 · ⚠ ต้องได้รับอนุมัติก่อนติดตั้งซอฟต์แวร์
- **AC:** มี script ตรวจการเชื่อมต่อ (ไม่ใช่ migration) ที่ผ่าน และบันทึก version ของ PostgreSQL ใน ADR-001

#### M0-T14 — Claude Code config ขั้นต่ำ
- **Type:** infra · **Size:** S · **Depends:** T05 และ T10 (สำหรับ skill `verify`) · **Decisions:** DEC-033 ✔ · **Status:** ✔ **Done (2026-10-26)** · part 2 ทำบน branch `m0/t14-claude-config-part2`: hook บล็อก `.env` และ `pnpm-lock.yaml` ได้จริงในเซสชัน, เพิ่ม skill `verify` (เรียกจริงแล้ว) และ `allow` list 20 rule · AC ผ่านครบ (`IMPLEMENTATION_STATUS.md §2.1 M0-T14 part 2`) · ~~**In progress**~~ · **part 1 merged (2026-10-26)** ทำบน branch `m0/t14-claude-config` แล้ว squash merge เข้า `main` · ผู้พัฒนาอนุมัติเนื้อหาและจุดที่ต่างจาก A.5 ทั้ง 6 ข้อ (`DECISIONS.md` ภาคผนวก A.5) · เสร็จแล้ว: `settings.json`, guard hook (pipe-test 14/14), `reviewer`, `implement-task` · **เหลือ:** (1) ทดสอบ hook จริงในเซสชันใหม่ที่เปิดที่ root ของ repo (2) skill `verify` และ `allow` list หลัง T10 (`IMPLEMENTATION_STATUS.md §2.1 M0-T14`)
- **AC:**
  - `.claude/settings.json` มี permissions ตามภาคผนวก A.5
  - PreToolUse guard hook บล็อกการแก้ `.env*` และ `pnpm-lock.yaml` (ทดสอบด้วยการลองแก้แล้วต้องถูกบล็อกด้วย exit 2)
  - มี subagent `reviewer` แบบ read-only และ skills `implement-task` กับ `verify`
- **Risks:** deny rule ไม่ครอบคลุมทุกรูปแบบของคำสั่ง จึงต้องพึ่ง branch protection ด้วย

#### M0-T15 — M0 gate review
- **Type:** test/doc · **Size:** S · **Depends:** T01–T12, T14
- **AC:** ครบตาม `DEFINITION_OF_DONE.md §7` และ tag `m0-gate`

---

## M1 — Visual / Movement Prototype
**Exit criteria:**
1. ตัวละครเดินและ sort ถูกต้องกับ occluder 3 แบบ ผ่าน visual QA checklist พร้อมภาพหน้าจอ
2. walkable data ไฟล์เดียวกันใช้ได้ทั้ง browser และ Node test โดยไม่ import Babylon
3. unload zone 10 รอบแล้วจำนวน resource กลับสู่ baseline
4. บันทึก baseline ของ frame time (avg, p95) บนเครื่องอ้างอิงตาม DEC-029
5. ADR-008 (depth sorting) เป็น Accepted
6. **(เพิ่ม 2026-10-26)** ผ่าน exit criteria ของ **VP0** ตาม `VISUAL_PROTOTYPE_PLAN.md §4` ได้แก่ ADR-009 (กล้อง), ADR-010 (แสงและ post) และ ADR-002 (animation runtime) เป็น Accepted และผู้พัฒนาอนุมัติ ART_BIBLE v1.0 กับ ASSET_PIPELINE v1.0

> **VP0 (Visual Prototype) อยู่ใน M1:** VP0-a = T01–T04, T06, T07, T09, T11, T12 → VP0-b1 = T13 → VP0-c = T19 → VP0-b2 = T20, T14–T18 (T14, T16, T17 ทำคู่ขนานกับ T19 ได้) · ลำดับนี้ปรับหลัง DEC-045 (2026-10-26) · ทั้งหมดยังไม่ได้รับอนุมัติให้เริ่ม

#### M1-T01 — Scene, orthographic iso camera และ world-unit convention
- **Type:** code · **Size:** S · **Decisions:** DEC-027, DEC-036
- **AC:** เอกสารกำหนดหน่วย (1 unit = ? เมตร), แกน, มุมกล้อง และช่วงซูม · scene มีพื้น + occluder 3 แบบ (กำแพง ต้นไม้ ชายคา) · กล้องหมุนไม่ได้
- **Risks:** R-03

#### M1-T02 — Walkable data v0 และ geometry rules
- **Type:** code · **Size:** M · **Decisions:** DEC-016, DEC-030
- **AC:** JSON schema (Zod) + `formatVersion` ใน `game-data` · pure function `isWalkable` และ `stepMovement` (clamp ตาม `moveSpeed × dt`) ใน `game-rules` · unit test ครอบคลุมขอบ, มุม, ทางแคบ และค่า NaN หรือ Infinity ที่ต้องถูกปฏิเสธ · มีฟังก์ชันคำนวณ hash ของไฟล์
- **Risks:** R-02

#### M1-T03 — Placeholder sprite sheet และ asset manifest v0
- **Type:** code/asset · **Size:** S · **Decisions:** DEC-014 (placeholder เท่านั้น), DEC-028, DEC-035, DEC-051 · ตั้งชื่อและสร้าง manifest ตาม `ASSET_PIPELINE.md §3, §11`
- **AC:** 4 ทิศ × (idle, walk) อย่างน้อย และมาตรฐาน pivot ที่เท้าเป็นเอกสาร · manifest มีครบ 10 field ตาม ART §6 พร้อม license หรือ provenance · มี fallback asset
- **Risks:** R-04

#### M1-T04 — Character renderer และ animation state machine
- **Type:** code · **Size:** M · **Depends:** T01, T03
- **AC:** quad วางที่ foot pivot, หันตามทิศการเดิน, เปลี่ยน state idle/walk โดยขับเคลื่อนจาก state ไม่ใช่ animation · ถ้า state หาย ต้องใช้ fallback โดยไม่ crash

#### M1-T05 — Local WASD movement
- **Type:** code · **Size:** S · **Depends:** T02, T04 · **Decisions:** DEC-026
- **AC:** ใช้ `stepMovement` จาก `game-rules` (ตัวเดียวกับที่ server จะใช้) · เดินเข้าพื้นที่ห้ามเดินไม่ได้ · input ถูกแปลงเป็น intent แยกจาก renderer

#### M1-T06 — Depth sorting และ occlusion spike
- **Type:** spike · **Size:** M · **Depends:** T04
- **AC:** ทดลองอย่างน้อย 2 วิธีตาม DEC-015 · มี visual QA checklist (TEST §6) พร้อมภาพหน้าจอของทุก occluder ทั้งด้านหน้าและหลัง · ผลลัพธ์คือ ADR-008
- **Risks:** R-03 (ความเสี่ยงที่อาจต้องรื้อระบบ)

#### M1-T07 — Debug hook สำหรับ dev build
- **Type:** code · **Size:** S · **Decisions:** DEC-013
- **AC:** `window.__KW_DEBUG__` อ่าน state ของ entity และจำนวน mesh, texture และ observer ได้ · มี test ที่ยืนยันว่า**ไม่มี**ใน production bundle
- **Risks:** R-12, R-22

#### M1-T08 — Zone unload และ disposal test
- **Type:** test · **Size:** S · **Depends:** T07
- **AC:** load และ unload 10 รอบแล้วจำนวน resource กลับสู่ baseline (ตรวจผ่าน debug hook ใน Playwright)

#### M1-T09 — Benchmark scene และ perf capture
- **Type:** test · **Size:** S · **Depends:** T06 · **Decisions:** DEC-029
- **AC:** script เดียวที่บันทึกเงื่อนไขครบตาม TEST §7 และผลเป็น JSON ใน `docs/perf/` · รันบนเครื่องพัฒนาแล้ว และบนเครื่อง min-spec ถ้ามี

#### M1-T10 — React overlay shell และ client store
- **Type:** code · **Size:** S · **Decisions:** DEC-031, DEC-032
- **AC:** overlay แสดงค่าจาก store (เช่นตำแหน่งสำหรับ debug) · React ไม่แตะ Babylon scene ตรง ๆ (lint หรือ review) · แสดงข้อความภาษาไทยได้ถูกต้องใน DOM

---

#### M1-T11 — Camera pitch และ zoom comparison (VP0-a)
- **Type:** spike · **Size:** S · **Depends:** T01, T04 · **Decisions:** DEC-027
- **AC:** screenshot ชุดเดียวกันที่ pitch 30°, 35.26° และ 45° ทั้งที่ zoom ต่ำสุด, default และสูงสุด พร้อม placeholder sprite ที่วาดให้ตรงกับแต่ละมุม · ผู้พัฒนาเลือกแล้ว → **ADR-009** (ปิด DEC-041) **ก่อนเริ่ม T13**
- **Risks:** RA-02

#### M1-T12 — แสง เงา post-processing และ quality tiers (VP0-a)
- **Type:** spike · **Size:** M · **Depends:** T04, T06 · **Decisions:** DEC-047, DEC-048, DEC-050
- **AC:** ทดสอบ L1/L2/L4 (และ L3 กับตัวละคร 1 ตัว), S1/S2, hero light และ post-processing ตาม `VISUAL_PROTOTYPE_PLAN.md §2.2, §2.4` · กำหนด Low, Medium, High · วัด V7, V8, P1 → **ADR-010**
- **Risks:** RA-04, RA-07

#### M1-T13 — ชิ้นส่วนตัวละครจอมขมังเวทคุณภาพเป้าหมาย (VP0-b1)
- **Type:** asset · **Size:** M · **Depends:** T11 (ADR-009), T12 · **Decisions:** DEC-035, 041, 046, 047, 053, **056**, **057**
- **AC:** body template 1 แบบ + ชิ้นส่วนแยกชั้นของร่าง + item 2 ชิ้น (ชุดคลุมแบบที่ 2 และอาวุธหรือเครื่องราง) ในทิศ `se` และ `ne` · turnaround แบบภาพนิ่ง · แยกชั้นตาม visual slot (DEC-057) และกำหนดจุดยึดแล้ว · ใช้ได้ทั้งกับ A3 และ A1-L · ผ่าน V1, V2 (ภาพนิ่ง) และ V6 · provenance ครบ · **ยังไม่ผลิต animation ชุดเต็ม**
- **Risks:** RA-01, RA-11

#### M1-T14 — ศัตรูวิญญาณเร่ร่อน (VP0-b)
- **Type:** asset/code · **Size:** M · **Depends:** T11, T12
- **AC:** ท่า idle, move, attack, hit, banish + telegraph decal สีแดงชาด (scripted) · ผ่าน V1 และ C2

#### M1-T15 — VFX วงยันต์ระเบิด (VP0-b, scripted)
- **Type:** asset/code · **Size:** M · **Depends:** T20 (ท่า cast), T14 · **Decisions:** DEC-049
- **AC:** ครบ 4 phase (anticipation, telegraph, impact, dissipation) โดย timing มาจากไฟล์ข้อมูล (ไม่มี combat rules) · ผ่าน C1, C3, C4, C7 และ P4 · ใช้ pool
- **Risks:** RA-04

#### M1-T16 — Hero props และ dressing ของฉากลานศาลร้าง (VP0-b)
- **Type:** asset · **Size:** M · **Depends:** T12 · **Decisions:** DEC-050, DEC-054
- **AC:** ศาลร้าง, โคมหิน และต้นไม้ผูกผ้าในคุณภาพเป้าหมาย · texel density ตาม `ASSET_PIPELINE.md §4.3` · อยู่ในงบ P5

#### M1-T17 — HUD mock (VP0-b)
- **Type:** code · **Size:** S · **Depends:** T10 · **Decisions:** DEC-052
- **AC:** static DOM ตาม `ART_BIBLE.md §6` · text contrast ≥ 4.5:1 · ไม่บังพื้นที่กลางจอที่กำหนด

#### M1-T18 — Readability และ clarity test session (VP0-b)
- **Type:** test · **Size:** M · **Depends:** T13–T17, T20
- **AC:** วัด V1–V9, C1–C8 และ P1–P10 ตาม `VISUAL_PROTOTYPE_PLAN.md §5` แล้วบันทึกผลใน `docs/perf/` และรายงาน VP0 review

#### M1-T19 — Animation runtime: A3-B (Blender → glTF) เทียบกับ A1-L (VP0-c)
- **Type:** spike · **Size:** M–L (time-box ต่อตัวเลือกที่ผู้พัฒนากำหนด) · **Depends:** T04, T13 · **Decisions:** DEC-045 ✔ (paper-doll; ให้น้ำหนัก skeletal) · **DEC-058 ✔ (เทียบ A3-B กับ A1-L และพัก A3-S ไว้)** · DEC-054 (ติดตั้ง Blender)
- **ก่อนเริ่ม:** ติดตั้ง Blender (ต้องได้รับอนุมัติก่อนติดตั้งซอฟต์แวร์) · G1 ผ่านแล้วทั้งสองตัวเลือก (A3-B ไม่มีค่า license และ A1-L ไม่ใช้ runtime ของบุคคลที่สาม)
- **AC:**
  - **A3-B:** ใช้ชิ้นส่วนจาก T13 ทำท่า idle, walk, cast และสลับ item 2 ชิ้นด้วยปุ่ม debug · ทดลองวิธีจัดลำดับชั้นภายในตัวละคร (a)/(b)/(c) และการผูก mesh ของ item เข้ากับ skeleton เดิม (`VISUAL_PROTOTYPE_PLAN.md §2.3`, `ASSET_PIPELINE.md §6.5`)
  - **A1-L (ตัวอย่างขั้นต่ำ):** ท่า walk (และ idle ถ้าทันใน time-box), ทิศ `se` และ `ne`, ร่าง + item 1 ชิ้น
  - วัด V3, V5, V6, V7, V9, P1, P3, P8, P9, P10 และ P11 ของทั้งสองตัวเลือก
  - **กติกาตัดสิน:** A3-B ผ่าน G1–G5 → เลือก A3-B · ถ้า A3-B ไม่ผ่านและแก้ไม่ได้ภายใน time-box → รายงานผลแล้วให้ผู้พัฒนาเลือก A1-L หรือเปิด G1 ของ A3-S ใหม่ (ผู้ตรวจไม่เลือกแทน)
  - ผลลัพธ์ → **ADR-002** (ปิด DEC-014 และ DEC-043)
- **Risks:** RA-05, RA-11, RA-12 (RA-06 พักไว้)

#### M1-T20 — Animation ชุดเต็มของตัวละครใน runtime ที่เลือก (VP0-b2)
- **Type:** asset · **Size:** L (ต้องแตกย่อยตามท่า) · **Depends:** T19 (ADR-002) · **Decisions:** DEC-014, DEC-043, DEC-056
- **AC:** 4 ทิศ ท่า idle, walk, cast, hit (เสริม: run, dodge, death) ของร่าง + item 2 ชิ้น · ผ่าน V1–V7 และ V9 · provenance ครบ
- **Risks:** RA-01, RA-11

---

## M2 — Combat Rules Sandbox (local sim, ไม่มี network)
**Exit criteria:**
1. test ของ COMBAT §11 ในส่วนที่ไม่ใช้ network ผ่านทั้งหมด
2. definition ที่ไม่ครบทำให้ build ล้ม
3. `game-rules` ไม่มี IO, Date หรือ Math.random (บังคับด้วย lint)
4. ผู้ทดสอบ 1 คนอธิบายได้ว่าทำไมโดนหรือไม่โดน และทำไมสกิลถูกปฏิเสธ (GDD L99)
5. renderer รับแค่ event และ state ไม่มี combat logic

#### M2-T01 — Stat model v0 และ damage formula
- **Type:** code · **Size:** S · **Decisions:** DEC-023
- **AC:** สูตรตาม COMBAT §5 และค่าสัมประสิทธิ์อยู่ใน game-data · test ค่าขอบ (min/max clamp, defense สูงสุด) · ไม่มี crit

#### M2-T02 — Skill definition schema และ 3 skills
- **Type:** code · **Size:** S · **Decisions:** DEC-030
- **AC:** `yantra_bolt`, `seal_burst` และ `ward_step` มี field ครบตาม COMBAT L92 · ถ้าขาด field ต้อง fail ตอน build (มี test)

#### M2-T03 — Skill lifecycle state machine
- **Type:** code · **Size:** M · **Decisions:** DEC-025
- **AC:** ครบทุก state และทุก exit ตาม COMBAT §3 · cooldown เริ่มนับตาม DEC-025 · test การ transition ที่ผิดต้องถูกปฏิเสธ

#### M2-T04 — Validation pipeline พร้อม reason codes
- **Type:** code · **Size:** M
- **AC:** ข้อ 2–10 ของ COMBAT §4 เป็น pure function ที่คืน reason code · test 1 ตัวต่อ reason · input ที่ไม่ finite ต้องถูกปฏิเสธ

#### M2-T05 — Hit resolution และ dodge
- **Type:** code · **Size:** M · **Decisions:** DEC-018
- **AC:** target, area แบบวงกลม (เข้าหรือไม่เข้าตาม geometry และ tick) และ i-frame window + grace · test ด้วย clock ที่ inject

#### M2-T06 — (สงวนไว้) Status effects
- **Status:** ยังไม่อยู่ใน VS0 (`curse_mark` และ `spirit_bind` อยู่ใน M5) และใช้ ID นี้กันไว้ไม่ให้เลขซ้ำ

#### M2-T07 — Enemy definition และ AI FSM
- **Type:** code · **Size:** M · **Decisions:** DEC-024, DEC-022 (ส่วน contribution tracking)
- **AC:** FSM idle → aggro → telegraph → attack → recover พร้อม seeded RNG · ครบตาราง GDD §10 สำหรับ enemy ตัวนี้ · test ทำซ้ำได้ด้วย seed เดิม

#### M2-T08 — `shared-contracts` v0
- **Type:** code · **Size:** M · **Decisions:** DEC-017 · **ควรทำก่อน T01–T05 หรือคู่ขนานกัน**
- **AC:** มี `MoveInput{sequence,direction}` (ไม่มี duration), `SkillRequest`, `SkillAccepted/Rejected{reason}` และ `CombatEvent` union (แก้ C-13) พร้อม `protocolVersion` · contract test ทั้ง valid, invalid และ oversized
- **หมายเหตุ:** ต้องแก้ `NETWORK_PROTOCOL.md` L15 ให้ตรงกับ DEC-017 หลังอนุมัติ โดยแสดง diff ก่อน

#### M2-T09 — Local sim harness
- **Type:** code · **Size:** M · **Depends:** T01–T05, T07, T08
- **AC:** loop ใน browser ที่รับ message ตาม contract แล้วเรียก `game-rules` และส่ง event ให้ renderer · โค้ดนี้ย้ายไป server ได้โดยไม่ต้องแก้ rules (แก้ C-22) · telegraph VFX แบบง่ายแสดงก่อน resolve

#### M2-T10 — Combat UI ขั้นต่ำ
- **Type:** code · **Size:** S
- **AC:** skill bar 3 ช่อง + cooldown, HP และ resource, target indicator และข้อความเหตุผลเมื่อสกิลถูกปฏิเสธ (ภาษาไทย)

---

## M3 — Authoritative Multiplayer Slice
**Exit criteria:**
1. Playwright 2 client เห็นกันและกัน ตำแหน่งตรงกับ server ภายใน tolerance ของ ADR-004
2. การปลอม input (damage field, out-of-range, duplicate requestId, speed hack) ไม่มีผลต่อ state
3. fuzz message จำนวนมากแล้ว room ไม่ล่ม
4. 2 client เห็น HP สุดท้ายของ enemy ตรงกัน
5. บันทึก tick p50/p95 ที่ 2 และ 4 client
6. ADR-005 (DEC-019) เป็น Accepted

#### M3-T01 — Colyseus server bootstrap
- **Type:** code · **Size:** S · **Decisions:** DEC-007
- **AC:** มี health check และ graceful shutdown (TECH L142) · config แยกตาม env · ไม่มี secret ใน repo

#### M3-T02 — `AuthProvider` และ dev token
- **Type:** code · **Size:** S · **Decisions:** DEC-020
- **AC:** ถ้าไม่มี token หรือ token ผิดต้องเข้า room ไม่ได้ · provider ถูกปฏิเสธเมื่อ `NODE_ENV≠development` (มี test) · ไม่ log token

#### M3-T03 — Zone room และ state schema
- **Type:** code · **Size:** M · **Decisions:** DEC-017
- **AC:** join, leave และ disconnect ผิดปกติ · แยก state สาธารณะกับส่วนตัว (R-11) และตรวจว่า client B ไม่ได้รับข้อมูลส่วนตัวของ A

#### M3-T04 — Inbound validation middleware
- **Type:** code · **Size:** M
- **AC:** Zod + payload size limit + token bucket ต่อ client ต่อประเภท message · reject แล้วนับ metric · fuzz test (R-13)

#### M3-T05 — Authoritative movement
- **Type:** code · **Size:** M · **Depends:** M1-T02
- **AC:** tick loop และ input queue ตาม sequence · ใช้ `stepMovement` ตัวเดียวกับ client · test speed hack, input เก่าหรือซ้ำ และพื้นที่ห้ามเดิน · ตรวจ hash ของ walkable data ตอน join

#### M3-T06 — Client prediction, reconciliation และ interpolation
- **Type:** code · **Size:** M · **Decisions:** DEC-017
- **AC:** ตัวละครของตัวเอง reconcile เมื่อ server แก้ตำแหน่ง (มี test จำลองการแก้) · ผู้เล่นอื่น interpolate · กำหนด tolerance ใน ADR-004
- **Risks:** R-06

#### M3-T07 — ย้าย combat เข้า room
- **Type:** code · **Size:** M · **Depends:** M2-T09, T04
- **AC:** ใช้ `game-rules` เดิมโดยไม่แก้ · cache `requestId` (idempotency) · test COMBAT §11 ในส่วนที่ใช้ network ผ่าน

#### M3-T08 — Enemy AI และ respawn ใน room
- **Type:** code · **Size:** S · **Decisions:** DEC-024
- **AC:** respawn ตาม timer และ aggro reset · test ด้วย clock ที่ inject

#### M3-T09 — Reconnect
- **Type:** code · **Size:** M · **Depends:** T02, T03
- **AC:** reconnect ภายในเวลาที่กำหนดแล้วได้ snapshot และทิ้ง prediction เก่า · client ส่ง inventory หรือตำแหน่งมาเองไม่ได้ (NETWORK §4) · disconnect ระหว่าง cast ต้องไม่มีรางวัลซ้ำ

#### M3-T10 — Observability
- **Type:** code · **Size:** S · **Decisions:** DEC-037
- **AC:** structured log + metric ตาม NETWORK §7 · มี test ที่ยืนยันว่า log ไม่มี token

#### M3-T11 — E2E 2 client
- **Type:** test · **Size:** M
- **AC:** exit criteria ข้อ 1 และ 4 เป็น Playwright test ที่รันใน CI tier 2

#### M3-T12 — ADR-005 persistence strategy
- **Type:** decision/doc · **Size:** S · **Decisions:** DEC-019
- **AC:** ผู้พัฒนา Accept ก่อนเริ่ม M4

---

## M4 — Persistence (จบแล้ว = VS0)
**Exit criteria:** acceptance criteria 12 ข้อของ VS0 ใน onboarding report §10.3 ผ่านทั้งหมดพร้อมหลักฐาน (ดูตาราง traceability ด้านล่าง) และ tag `vs0`

#### M4-T01 — PostgreSQL + Prisma setup และ migration แรก
- **Type:** infra/code · **Size:** M · **Depends:** M0-T13 · **Decisions:** DEC-008, DEC-009
- **AC:** schema อยู่ใน path ตาม ADR และ rule ครอบคลุม (C-18) · migration จาก DB ว่างทำซ้ำได้ · seed test account เฉพาะ dev โดยไม่มี credential จริง

#### M4-T02 — Auth สำหรับ test environment
- **Type:** code · **Size:** M · **Decisions:** DEC-020 (ส่วน M4)
- **AC:** ใช้ library ตาม ADR ผ่าน `AuthProvider` เดิม · test ครบตาม SECURITY §3 ส่วน auth · มี rate limit ของ login

#### M4-T03 — Character และ lease
- **Type:** code · **Size:** M · **Decisions:** DEC-019
- **AC:** ตัวละคร 1 ตัวต่อบัญชี · login ซ้อนจาก 2 client สำเร็จได้ไม่เกิน 1 (concurrency test) · lease หมดอายุถูกต้องเมื่อ server ตาย

#### M4-T04 — ItemInstance, InventorySlot และ loot grant transaction
- **Type:** code · **Size:** M · **Decisions:** DEC-019, DEC-022, DEC-030
- **AC:** commit DB ก่อนแล้วจึงแก้ room state · unique `(characterId, sourceEventId)` · มี `AuditEvent` คู่กัน · test reward ซ้ำ, ย้าย item พร้อมกัน และ transaction ล้มเหลวแล้ว state ไม่เปลี่ยน (TEST §5)

#### M4-T05 — XP, level และ checkpoint
- **Type:** code · **Size:** S
- **AC:** XP บันทึกแบบ DB-first (ข้อมูลที่มีมูลค่า) · ตำแหน่งและ HP บันทึกเป็น checkpoint ตาม ADR-005

#### M4-T06 — Load-on-join
- **Type:** code · **Size:** S
- **AC:** state ตอนเข้า room มาจาก DB เท่านั้น ไม่รับจาก client

#### M4-T07 — Crash safety test
- **Type:** test · **Size:** M
- **AC:** script integration test ที่ kill server process ระหว่างต่อสู้แล้ว restart โดยไม่มี dupe (ตรวจด้วย query) และข้อมูลหายไม่เกินช่วง checkpoint ตามที่ ADR เขียน

#### M4-T08 — Content `dataVersion`
- **Type:** code · **Size:** S · **Decisions:** DEC-030
- **AC:** item instance เก็บ `dataVersion` · test กรณี definition ถูก deprecate

#### M4-T09 — Backup และ restore drill
- **Type:** doc/test · **Size:** S
- **AC:** มีเอกสารขั้นตอน และซ้อม restore ใน local 1 ครั้งพร้อมบันทึกผล (R-15)

#### M4-T10 — Idempotency retention policy
- **Type:** decision/code · **Size:** S
- **AC:** นโยบายอยู่ใน ADR · reward และ purchase ใช้ unique constraint ถาวร (R-16)

#### M4-T11 — VS0 E2E scenario
- **Type:** test · **Size:** M
- **AC:** Playwright ครอบคลุม AC ข้อ 1–9 ของ VS0 · ข้อ 10 (visual) และ 11 (metrics) มีหลักฐานแนบ · ข้อ 12 (quality gates) CI เขียว

### VS0 Traceability (onboarding report §10.3 → tasks)
| VS0 AC | เรื่อง | Tasks |
|---|---|---|
| 1 | เข้าโลก | M3-T02, M3-T03, M4-T02, M4-T03 |
| 2 | เคลื่อนที่ | M1-T02, M1-T05, M3-T05 |
| 3 | เห็นผู้เล่นอื่น | M3-T03, M3-T06, M3-T11 |
| 4 | ต่อสู้ | M2-T01…T05, M2-T09, M3-T07 |
| 5 | กันโกง | M2-T04, M2-T08, M3-T04, M3-T07 |
| 6 | บันทึกอย่างตรวจสอบได้ | M4-T04 |
| 7 | Relog | M4-T05, M4-T06 |
| 8 | Crash safety | M4-T07 |
| 9 | Concurrency | M4-T03 |
| 10 | Visual | M1-T06, M1-T08 |
| 11 | Metrics | M1-T09, M3-T10 |
| 12 | Quality gates | M0-T10, M0-T11 |

---

## M5–M8 — Epics (แตกเป็น task ก่อนเริ่ม milestone นั้น)

| Epic | เนื้อหา | Prerequisite | Ref |
|---|---|---|---|
| M5-E00 | เขียน `QUEST_AND_INTERACTION_SPEC.md` (investigation, dialogue, ritual/appease) | ผ่าน VS0 | C-09 |
| M5-E01 | Class model และตาราง skill → path (รวม `curse_mark`, `spirit_bind` และ status effects) | DEC-038 | C-07, C-08 |
| M5-E02 | Spirit Medium summon (อาจเลื่อนไปอีก) | spec ของ entity ที่ผู้เล่นเป็นเจ้าของ | C-08 |
| M5-E03 | Enemy 3 ประเภท + boss 1 ตัวตามตาราง GDD §10 | VS0 | — |
| M5-E04 | Tattoo และ amulet loadout | stat model v1 | GDD §8, §11 |
| M5-E05 | CurrencyLedger + NPC shop + craft 1 สูตร | M4 transactions | C-11 |
| M5-E06 | Investigation quest + hunt quest | M5-E00 | GDD §6 |
| M5-E07 | Equipment + **paper-doll visuals** (DEC-045): ส่ง appearance ผ่าน public room state, โหลด asset ของ item แบบ lazy และรายการ item ที่แสดงผลของ MVP | ADR-002, DEC-057, M4 inventory | DEC-045, R-11 |
| M6-E01 | Village hub + haunted forest zone + art pipeline จริง (ADR ของ animation runtime หลัง VS0) | DEC-014 รีวิว, DEC-035 | R-19 |
| M6-E02 | Tutorial quest + onboarding | M5-E06 | C-12 |
| M6-E03 | Cultural review และการตรวจชื่อเกม | — | R-24 |
| M7-E01 | Closed test: threat model เพิ่มเรื่อง botting, PDPA, load และ reconnect tests | M6 | R-09, R-24 |
| M8 | ตาม ROADMAP M8 | M7 | — |

---

## Changes vs `PROJECT_ONBOARDING_REPORT.md` (บันทึกเพื่อความโปร่งใส)
| เรื่อง | ในรายงาน | ใน backlog นี้ | เหตุผล |
|---|---|---|---|
| CurrencyLedger | M4 (§9) | M5-E05 | VS0 ไม่มี currency และ TECH L111 ห้ามสร้าง scaffolding ที่ยังไม่ใช้ |
| ADR-005 | Accepted ก่อนเริ่ม M4 | ร่างใน M0-T12 แต่ Accept ใน M3-T12 | ให้ใช้ข้อมูลจริงจาก M3 ประกอบการตัดสิน |
| Local PostgreSQL | ไม่ได้ระบุ milestone | M0-T13 (ทำใน M0 หรือ M3) | ลดความเสี่ยงที่ M4 ถูกบล็อก |
| ADR-002 animation runtime | M0-T12 (เสนอ sprite-sheet) | หลัง VP0-c (M1-T19) | DEC-040 Art Lock (อัปเดต 2026-10-26) |
| M1 ขยายเป็น VP0 | M1 = T01–T10 | เพิ่ม T11–T19 | DEC-040 กำหนดให้ทำ Visual Prototype ก่อนผลิต asset จำนวนมาก |
| ลำดับ VP0 และ task ของตัวละคร | T13 = ตัวละครคุณภาพเต็ม และ T19 เทียบ A1/A2 กับ A3 | T13 = ชิ้นส่วน, T19 = A3 เทียบ A1-L ตาม gate, เพิ่ม T20 = animation ชุดเต็มหลัง ADR-002 | DEC-045 (paper-doll, ให้น้ำหนัก A3) 2026-10-26 |
| Equipment visuals | ไม่มี | M5-E07 | DEC-045 |
| ตัวเลือกของ VP0-c | A3 (Spine) เทียบกับ A1-L | A3-S (Spine), A3-B (Blender → glTF) และ A1-L | คำสั่งผู้พัฒนา 2026-10-26 |
| ตัวเลือกของ VP0-c (รอบนี้) | A3-S, A3-B และ A1-L | **A3-B กับ A1-L** (A3-S พักไว้) และ A1-L ทำตัวอย่างขั้นต่ำจริง | DEC-058 (2026-10-26) |
