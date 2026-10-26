# PROJECT ONBOARDING REPORT — ขมังเวท (Khamang Wet)

- **วันที่ตรวจ:** 2026-10-25
- **บทบาทผู้ตรวจ:** Project Onboarding & Architecture Auditor (Claude Code)
- **ขอบเขต:** อ่านเอกสารทุกไฟล์ใน workspace, ตรวจสถานะ repository, ตรวจ toolchain ในเครื่อง และเวอร์ชัน dependency จาก npm registry (อ่านอย่างเดียว)
- **สิ่งที่ไม่ได้ทำ:** ไม่ได้เขียนฟีเจอร์ ไม่ได้แก้ ลบ หรือย้ายไฟล์เดิม ไม่ได้ติดตั้ง package ไม่ได้รัน `git init` ไฟล์นี้เป็นไฟล์เดียวที่สร้างขึ้นใหม่

### สัญลักษณ์ที่ใช้ในรายงาน
| ป้าย | ความหมาย |
|---|---|
| **[F]** | ข้อเท็จจริง (Fact) ตรวจสอบได้จากไฟล์หรือผลคำสั่งที่ระบุไว้ |
| **[R]** | ข้อเสนอแนะ (Recommendation) ของผู้ตรวจ ยังไม่ได้รับอนุมัติ |
| **[?]** | ยังไม่ทราบหรือต้องตรวจสอบเพิ่ม (Unknown / To verify) |
| `FILE §n (Lx–y)` | อ้างอิงหัวข้อและบรรทัด เลขบรรทัดใช้ได้กับทั้งสำเนาที่ root และใน `docs/` เพราะเนื้อหาเหมือนกันทุกไบต์ |

ระดับความรุนแรงใช้ Critical / High / Medium / Low ตามที่ `prompts/00_BOOTSTRAP_AND_AUDIT.md` (L19) กำหนด

---

## สรุปสำหรับผู้บริหาร (Executive Summary)

1. **[F]** workspace มีแต่เอกสาร 34 ไฟล์ (เนื้อหาไม่ซ้ำ 24 ไฟล์) **ยังไม่มีโค้ด ไม่มี `package.json` ไม่มี git repository** ระบบที่เอกสารบรรยายไว้จึงเป็น "Missing" ทั้งหมด
2. **[F]** เอกสารหลัก 10 ไฟล์มี 2 สำเนาที่เหมือนกันทุกไบต์ คือที่ root และใน `docs/` ถ้าแก้ฝั่งเดียว เอกสารจะเริ่มเบี่ยงกันทันที
3. **[F]** เอกสารชุดนี้มีคุณภาพดีในเชิงหลักการ (server-authoritative, idempotency, transaction, test gates) แต่**ยังไม่มีการตัดสินใจระดับรายละเอียด** ที่ต้องมีก่อนเขียนโค้ด เช่น stat model, รูปแบบข้อมูล collision ที่ client กับ server ใช้ร่วมกัน, นโยบาย lag compensation, กลยุทธ์บันทึกข้อมูลที่มีมูลค่า และ PvE/PvP
4. **[F]** dependency หลายตัวเปลี่ยน major แล้วเมื่อเทียบกับตัวอย่างที่ AI มักรู้จัก: tag `latest` ของ `prisma` CLI ชี้ไปที่ **`8.0.0-rc.27` (release candidate)** แต่ `@prisma/client` อยู่ที่ `7.10.1`, `typescript` latest คือ `7.0.2`, Colyseus อยู่ที่ `0.18.x` และ client SDK เปลี่ยนชื่อเป็น `@colyseus/sdk` **ต้อง pin เวอร์ชันเองทุกตัว ห้ามติดตั้งตาม tag `latest`**
5. **[F]** ใน npm ไม่พบ Spine runtime ทางการสำหรับ Babylon.js (มีสำหรับ three.js, pixi, phaser, webgl, canvas) และ license ของ Spine runtime เป็นแบบเฉพาะ (`LicenseRef-LICENSE`) เรื่องนี้เป็นความเสี่ยงต่อการเลือก animation runtime
6. **[R]** Blocker ที่ต้องปิดก่อนเริ่ม M1 มี 7 ข้อ: (1) ตำแหน่ง repo root และ `git init` (2) ตำแหน่งเอกสารต้นฉบับ (3) นโยบาย pin เวอร์ชัน (4) รูปแบบข้อมูล collision/walkable ที่ใช้ร่วมกัน (5) animation runtime สำหรับ prototype (6) กลยุทธ์บันทึกข้อมูลที่มีมูลค่า (7) ขอบเขต PvE/PvP และกติกา loot ในห้องที่มีผู้เล่นหลายคน
7. **[R]** ให้คงลำดับ Milestone เดิมใน `ROADMAP.md` แต่ทำแต่ละ milestone ให้ "บาง" จนเมื่อจบ M4 ได้ **Vertical Slice 0 (VS0)** ที่เข้าโลก เดิน เห็นผู้เล่นอื่น สู้ และบันทึกได้ ก่อนเริ่มเนื้อหา occult ใน M5 (รายละเอียดในหัวข้อ 10)

---

## 1. File Audit

### 1.1 ไฟล์ที่ตรวจอ่านแล้ว
**[F]** ใช้ `find`, `wc`, `md5sum`, `cmp` และเปิดอ่านเนื้อหาด้วย Read ไฟล์ทั้งหมดเป็น UTF-8 หรือ ASCII อ่านได้ครบทุกไฟล์

| # | Path (relative to `KhamangWet_FullSystem/`) | บรรทัด | สถานะ | หมายเหตุ |
|---|---|---|---|---|
| 1 | `README.md` | 40 | อ่านครบ | มีที่ root เท่านั้น เป็นไฟล์เดียวที่มีภาษาไทยเป็นเนื้อหาหลัก |
| 2 | `GAME_VISION_GDD.md` | 104 | อ่านครบ | ซ้ำกับ `docs/` |
| 3 | `TECHNICAL_ARCHITECTURE.md` | 147 | อ่านครบ | ซ้ำกับ `docs/` |
| 4 | `COMBAT_SPEC.md` | 102 | อ่านครบ | ซ้ำกับ `docs/` |
| 5 | `ART_ANIMATION_PIPELINE.md` | 62 | อ่านครบ | ซ้ำกับ `docs/` |
| 6 | `NETWORK_PROTOCOL.md` | 50 | อ่านครบ | ซ้ำกับ `docs/` |
| 7 | `DATABASE_AND_ECONOMY.md` | 54 | อ่านครบ | ซ้ำกับ `docs/` |
| 8 | `SECURITY_THREAT_MODEL.md` | 46 | อ่านครบ | ซ้ำกับ `docs/` |
| 9 | `TEST_STRATEGY.md` | 62 | อ่านครบ | ซ้ำกับ `docs/` |
| 10 | `ROADMAP.md` | 75 | อ่านครบ | ซ้ำกับ `docs/` |
| 11 | `AI_WORKFLOW.md` | 62 | อ่านครบ | ซ้ำกับ `docs/` |
| 12 | `CLAUDE_TEMPLATE.md` | 44 | อ่านครบ | มีที่ root เท่านั้น เป็น template ยังไม่มี `CLAUDE.md` จริง |
| 13–22 | `docs/*.md` (10 ไฟล์) | ตรงกับไฟล์ที่ root | ยืนยันแล้วว่าเหมือนกัน | `md5sum` และ `cmp` ยืนยันว่าเหมือนสำเนาที่ root ทุกไบต์ จึงอ่านเนื้อหาจากสำเนาที่ root |
| 23 | `prompts/00_BOOTSTRAP_AND_AUDIT.md` | 25 | อ่านครบ | |
| 24 | `prompts/01_MASTER_SYSTEM_PROMPT.md` | 87 | อ่านครบ | |
| 25 | `prompts/02_IMPLEMENT_FEATURE.md` | 31 | อ่านครบ | |
| 26 | `prompts/03_CODE_REVIEW.md` | 19 | อ่านครบ | |
| 27 | `prompts/04_SECURITY_REVIEW.md` | 18 | อ่านครบ | |
| 28 | `prompts/05_ART_TECH_REVIEW.md` | 16 | อ่านครบ | |
| 29 | `prompts/06_TEST_PLAN.md` | 13 | อ่านครบ | |
| 30 | `prompts/07_RELEASE_CHECK.md` | 17 | อ่านครบ | |
| 31 | `prompts/08_DOC_SYNC.md` | 12 | อ่านครบ | |
| 32 | `.claude/rules/client.md` | 10 | อ่านครบ | `paths: apps/web/**/*` |
| 33 | `.claude/rules/database.md` | 11 | อ่านครบ | `paths: database/**/*`, `**/*schema.prisma` |
| 34 | `.claude/rules/server.md` | 11 | อ่านครบ | `paths: apps/game-server/**/*` |

### 1.2 ไฟล์ที่อ่านไม่สำเร็จ
**[F]** ไม่มี อ่านได้ครบทั้ง 34 ไฟล์

### 1.3 ไฟล์ที่ซ้ำกัน
**[F]** 10 คู่ เหมือนกันทุกไบต์ (md5 ตรงกัน):

| ไฟล์ | md5 |
|---|---|
| `AI_WORKFLOW.md` ↔ `docs/AI_WORKFLOW.md` | `9d92eb48…` |
| `ART_ANIMATION_PIPELINE.md` ↔ `docs/…` | `e796f182…` |
| `COMBAT_SPEC.md` ↔ `docs/…` | `7650f42d…` |
| `DATABASE_AND_ECONOMY.md` ↔ `docs/…` | `6e7c03b9…` |
| `GAME_VISION_GDD.md` ↔ `docs/…` | `c7ae2ab0…` |
| `NETWORK_PROTOCOL.md` ↔ `docs/…` | `c29f1f39…` |
| `ROADMAP.md` ↔ `docs/…` | `2452aefe…` |
| `SECURITY_THREAT_MODEL.md` ↔ `docs/…` | `981ca3de…` |
| `TECHNICAL_ARCHITECTURE.md` ↔ `docs/…` | `204c705e…` |
| `TEST_STRATEGY.md` ↔ `docs/…` | `6759b892…` |

**[F] ความซ้ำเชิงเนื้อหา (ไม่ใช่ไฟล์ซ้ำ):**
- รายการ tech stack ปรากฏ 4 ที่ ได้แก่ `README.md` (L15–24), `TECHNICAL_ARCHITECTURE.md §1` (L6–15), `prompts/00` (L3) และ `prompts/01` (L18–25) ตอนนี้ทั้งสี่ที่สอดคล้องกัน (`prompts/00` ไม่ได้ระบุ pnpm) แต่ถ้าเปลี่ยน stack ต้องแก้ 4 ที่
- กฎ engineering ใน `CLAUDE_TEMPLATE.md` (L9–24) และ `prompts/01` (L28–43) ซ้อนทับกันเกือบทั้งหมด
- ขั้นตอน workflow ใน `AI_WORKFLOW.md §4` (L24–32), `CLAUDE_TEMPLATE.md` (L26–32), `prompts/01` (L53–63) และ `prompts/02` (L21–29) เป็นเรื่องเดียวกัน

### 1.4 ไฟล์ที่ถูกอ้างถึงแต่ไม่มีอยู่จริง
| ถูกอ้างใน | ไฟล์หรือโฟลเดอร์ที่อ้าง | สถานะ |
|---|---|---|
| `README.md` L11, `prompts/01` L87, `prompts/02` L6 | `CLAUDE.md` | **[F]** ไม่มี |
| `TECHNICAL_ARCHITECTURE.md §5` L97 | `docs/GDD.md` | **[F]** ไม่มี (ไฟล์จริงชื่อ `GAME_VISION_GDD.md`) |
| `TECHNICAL_ARCHITECTURE.md §10` L147, `ROADMAP.md` M0 L9 | `docs/adr/NNN-title.md` | **[F]** ไม่มี |
| `TECHNICAL_ARCHITECTURE.md §5` L105–106, `AI_WORKFLOW.md §5` L37–38 | `.claude/skills/`, `.claude/agents/` และ skills `/implement-feature`, `/review-diff`, `/release-check` | **[F]** ไม่มี |
| `README.md` L8 | ZIP ของเอกสารชุดนี้ | **[?]** ไม่มีใน workspace ดูเหมือนถูกแตกไฟล์ไว้แล้วในชื่อ `KhamangWet_FullSystem/` |

---

## 2. Game Vision

### 2.1 สรุปเกม
**[F]** ตาม `GAME_VISION_GDD.md`:
- **High concept (§1):** MMORPG แนว dark fantasy ไสยเวทไทย ผู้เล่นเรียนวิชาอาคม สักยันต์ ทำเครื่องราง สืบสวนเรื่องผีหลอก แล้วร่วมมือหรือแข่งขันกันในโลกเหนือธรรมชาติที่ได้แรงบันดาลใจจากคติชนไทย
- **Constraints (§2):** Web PC เน้นคีย์บอร์ดและเมาส์, กล้อง orthographic isometric ซูมได้จำกัด (หมุนกล้องเลื่อนไปก่อน), โลก 3D กับตัวละคร 2D HD, combat แบบ hybrid, โลกแบ่งเป็น zone/room, เริ่มจาก modular monolith, โทนเคารพวัฒนธรรมและไม่สอนพิธีกรรมจริง
- **Pillars (§3):** (1) การเตรียมตัวทางไสยศาสตร์มีผล (2) อ่านเกมได้ชัดกว่าความอลังการของภาพ (3) ตัวตนผู้เล่นมาจาก build (4) encounter ที่ต้องร่วมมือกัน (5) กติกาออนไลน์ที่เชื่อถือได้ (server ตัดสิน) (6) วินัยเรื่องขอบเขตงาน

### 2.2 กลุ่มระบบหลัก
| กลุ่มระบบ | เอกสารหลัก | สถานะในเอกสาร |
|---|---|---|
| Core loop: รับคดี → สืบเบาะแส → เตรียมตัว → เข้า zone → ต่อสู้หรือทำพิธี → รับรางวัล → เรียน/คราฟต์/อัปเกรด | GDD §4–5 | นิยามระดับแนวคิด |
| Combat แบบ hybrid (target / direction / area / self) | COMBAT_SPEC | นิยามดีที่สุดในชุด |
| Progression: level, learned arts, tattoo slots, amulets, knowledge/reputation, crafting | GDD §8 | ระดับแนวคิด ยังไม่มีตัวเลข |
| Archetype หรือ build path: Yantra Adept (ranged/control), Spirit Medium (debuff/summon) | GDD §9 | ระดับแนวคิด |
| Quest: tutorial, investigation, hunt | GDD §6 | ยังไม่มี spec |
| Inventory, equipment, loot, NPC shop, craft 1 สูตร | GDD §6, §12; DATABASE §7 | หลักการเท่านั้น |
| Multiplayer room, account/session | GDD §6; NETWORK_PROTOCOL | หลักการเท่านั้น |
| UI ขั้นต่ำ: status, skill bar, target, HP/resource, inventory, quest tracker | GDD §6 L39 | รายการเท่านั้น |

### 2.3 ประสบการณ์ที่ต้องการให้ผู้เล่นได้รับ
**[F]** GDD §4 และ §13: ผู้เล่นมาถึงหมู่บ้าน รับคดีผีหลอก เก็บเบาะแสและวัตถุดิบ จัด build เข้าพื้นที่อันตราย แล้วปราบหรือ "ทำให้วิญญาณสงบ" กลับมาพร้อมความรู้และวัตถุดิบเพื่อพัฒนาตัวละครและชื่อเสียง เกณฑ์ความสำเร็จคือผู้เล่นใหม่จบ tutorial และ hunt แรกได้เอง, **เข้าใจว่าทำไมโดนหรือไม่โดน และทำไมใช้สกิลไม่ได้**, ผลการต่อสู้ตรงกันทุก client, ข้อมูลไม่หายเมื่อ relog, ไม่มีบั๊ก dupe และ loop แรกต้องสนุกก่อนขยายเนื้อหา

**[R] ข้อสังเกต:** pillar "ความชัดเจนในการอ่านเกม" (§3.2, §13 L99) เป็นตัวชี้ขาดทางเทคนิค เพราะต้องมี telegraph, reason code ของ `SkillRejected` และนโยบาย lag compensation ที่ผู้เล่นรู้สึกว่ายุติธรรม เกณฑ์ข้อนี้จึงควรเป็น acceptance criteria ตั้งแต่ M2

---

## 3. Architecture Map

> **[F]** แผนภาพนี้สังเคราะห์จาก `TECHNICAL_ARCHITECTURE.md §2–4, §7–8`, `NETWORK_PROTOCOL.md`, `COMBAT_SPEC.md` และ `ART_ANIMATION_PIPELINE.md` **ยังไม่มีโค้ดใดที่ตรงกับแผนภาพนี้** ช่องว่างที่เอกสารยังไม่ได้กำหนดมีป้าย ⚠ และอ้างถึงรหัสในหัวข้อ 6

### 3.1 ภาพรวม
```
┌──────────────────────────── Browser Client (apps/web) ────────────────────────────┐
│  React UI overlay  (ui, combat-ui)   ◄── view-model store ⚠D-25 (React↔Babylon sync) │
│  Babylon renderer  (rendering, world, assets)  orthographic iso camera              │
│  2D character renderer (characters)  sprite/skeletal ⚠D-23  foot-pivot, depth sort  │
│  input  ──► intents (move/skill/interact)                                           │
│  network ──► Colyseus client SDK + Zod encode/decode, reconnect, interpolation      │
└───────────────────────────────┬───────────────────────────────────────────────────┘
   imports allowed: shared-contracts, game-data, game-rules (prediction/preview only)
                                │  WebSocket (reliable messages + state sync)
┌───────────────────────────────▼──── Authoritative Game Server (apps/game-server) ──┐
│  security: auth ⚠D-22 · schema validation · rate/size limits · audit events        │
│  rooms (zone lifecycle, membership, character lease ⚠D-21)                          │
│  movement (speed clamp, walkable check ⚠D-17) · combat (validate→resolve→events)   │
│  entities · ai (FSM, aggro, encounter scripts) · inventory · quests · economy       │
│  persistence (repositories, save strategy ⚠D-21, idempotency keys)                  │
└───────────────────────────────┬───────────────────────────────────────────────────┘
                                │  Prisma (transactions, unique constraints)
                        ┌───────▼────────┐        Static assets: served separately / CDN later
                        │  PostgreSQL    │        Static game data: packages/game-data (git)
                        └────────────────┘
Shared packages: shared-contracts (DTO, schemas) · game-data (definitions) ·
                 game-rules (pure deterministic functions) · config (lint/ts/test)
```

### 3.2 กฎการ import ระหว่าง module
**[F]** กฎจาก `TECHNICAL_ARCHITECTURE.md §4` (L81) กับคอลัมน์ "หมายเหตุ" ที่เป็นข้อเสนอ **[R]**

| จาก \ ไป | Babylon / React | shared-contracts | game-data | game-rules | Prisma / DB |
|---|---|---|---|---|---|
| `apps/web` | ✅ | ✅ | ✅ | ✅ (ใช้แสดงผลหรือทำนายผลเท่านั้น) | ❌ (L81) |
| `apps/game-server` | ❌ (L81) | ✅ | ✅ | ✅ (เป็นผู้ตัดสินผล) | ✅ ผ่าน `persistence` เท่านั้น |
| `packages/game-rules` | ❌ | ✅ | ✅ | — | ❌ **[R]** ต้องเป็น pure function |
| `packages/shared-contracts` | ❌ | — | ❌ | ❌ | ❌ |

**[R]** ควรบังคับกฎนี้ด้วยเครื่องมือ (เช่น lint rule เรื่อง import boundary หรือ TypeScript project references) ตั้งแต่ M0 ไม่ใช่พึ่งการรีวิวด้วยตาอย่างเดียว

### 3.3 Data flow หลัก (อ้างอิงเอกสาร)
**A. Movement**: `input` → `MoveInput{sequence, direction…}` (NETWORK §2 L15) → server ตรวจความเร็ว ความเร่ง และพื้นที่เดินได้ (COMBAT §6 L46) → อัปเดต authoritative position ใน room state → sync ไปยัง client (TECH §7 L125) → client เจ้าของตัวละคร reconcile ส่วน client อื่น interpolate (TECH §7 L128)
- ⚠ ยังไม่ได้กำหนดรูปแบบ walkable data ที่ทั้ง client และ server ใช้ร่วมกันได้ โดยที่ server ห้าม import Babylon (D-17)
- ⚠ `MoveInput` มีตัวเลือก "input duration" ที่เสี่ยงต่อ speed hack (C-15)

**B. Skill cast**: `SkillRequest{requestId, skillId, target/aim}` (NETWORK §2 L16) → ตรวจ 12 ข้อ (COMBAT §4 L23–36) → `SkillAccepted` หรือ `SkillRejected{reason}` → lifecycle `Windup → Resolve → Recovery` (COMBAT §3 L18) → `CombatEvent{eventId, tick}` → client เล่น animation และ VFX ให้ตรงกับ eventId ของ server (COMBAT §7 L60; ART §2.6 L12)
- ⚠ ยังไม่ได้กำหนดว่า "defined simulation moment" (L35) หมายถึงอะไร และนโยบาย lag compensation (D-19)

**C. Reward / Loot**: monster ตาย → server สุ่ม loot (TECH §3 L46) → ทำ transaction พร้อม idempotency (DATABASE §3, NETWORK §3) → `InventoryStateDelta{version}` (NETWORK §2 L25)
- ⚠ ยังไม่ได้กำหนดลำดับระหว่าง "commit ลง DB" กับ "แก้ state ในหน่วยความจำของ room" (C-23, D-21)
- ⚠ ยังไม่มีกติกาแบ่ง loot เมื่อผู้เล่นหลายคนตีตัวเดียวกัน (C-05)

**D. Join / Reconnect / Zone transition**: auth → ตรวจความเป็นเจ้าของตัวละคร → เข้า room → ส่ง snapshot (NETWORK §4 L32–37) → ห้ามตัวละครเดียวกันอยู่ 2 room พร้อมกัน (NETWORK §6 L47)
- ⚠ ยังไม่ได้เลือก auth (D-22) และยังไม่มีกลไก lease ตัวละคร (D-21)

**E. Animation ↔ Combat**: server timing เป็นผู้ตัดสิน animation event ใช้กระตุ้นภาพหรือเอฟเฟกต์เท่านั้น (ART §2.6 L12) และ i-frame ตัดสินที่ server (COMBAT §6 L48) state machine ของ animation จึงต้องขับเคลื่อนด้วย server state หรือ event ไม่ใช่ animation เป็นตัวขับ gameplay

**F. UI**: React overlay ใช้แสดงผลเท่านั้น (README L17) ไม่ใช่ตัว render โลกเกม ⚠ ยังไม่ได้กำหนดว่า React กับ Babylon แชร์ state กันอย่างไร และ UI ในโลกเกม (ป้ายชื่อ ตัวเลข damage) จะทำด้วย DOM หรือ Babylon GUI (D-25)

---

## 4. Consistency Audit

> ตามกฎข้อ 4 ผู้ตรวจ**ไม่ได้เลือกข้อใดข้อหนึ่งแทนผู้ใช้** ทุกข้อแสดงตำแหน่งและทางเลือก ส่วน "แนะนำ" เป็นเพียง **[R]**

| ID | ระดับ | ข้อขัดแย้ง / ความไม่สอดคล้อง **[F]** | ไฟล์และตำแหน่ง | แนวทางแก้ **[R]** |
|---|---|---|---|---|
| C-01 | High | เอกสารหลัก 10 ไฟล์ซ้ำกันระหว่าง root กับ `docs/` โดย README อ้างชื่อไฟล์แบบไม่มี path ส่วน CLAUDE_TEMPLATE อ้าง `docs/...` | `README.md` L28–40; `CLAUDE_TEMPLATE.md` L7, L44; `TECHNICAL_ARCHITECTURE.md §5` L96–102 | **A (แนะนำ):** ใช้ `docs/` เป็นต้นฉบับเดียว เพราะตรงกับ CLAUDE_TEMPLATE และ TECH §5 แล้วลบสำเนาที่ root (ต้องขออนุมัติก่อน) **B:** ใช้ root เป็นต้นฉบับแล้วแก้ CLAUDE_TEMPLATE |
| C-02 | Low | TECH §5 ระบุไฟล์ `docs/GDD.md` แต่ไฟล์จริงชื่อ `GAME_VISION_GDD.md` และ §5 ระบุเอกสารใน `docs/` ไว้แค่ 6 จาก 10 ไฟล์ (ขาด ART, DATABASE, ROADMAP, AI_WORKFLOW) | `TECHNICAL_ARCHITECTURE.md` L96–102 | แก้ TECH §5 ให้ตรงกับชื่อไฟล์จริงหลังปิด C-01 |
| C-03 | High | README บอกให้แตก ZIP ลงที่ root ของ repo เกม แต่ปัจจุบันเอกสารอยู่ซ้อนใน `E:\KhamangWet\KhamangWet_FullSystem\` และไม่มี git ถ้าเลือก `E:\KhamangWet` เป็น repo root โฟลเดอร์ `.claude/rules/` จะไม่อยู่ที่ root จึงไม่ถูกโหลด | `README.md` L8; ผล `git rev-parse` | **A (แนะนำ):** ใช้ `KhamangWet_FullSystem/` เป็น repo root โดยไม่ต้องย้ายไฟล์ (เปลี่ยนชื่อโฟลเดอร์ได้ภายหลัง) **B:** ย้ายเนื้อหาขึ้นไปที่ `E:\KhamangWet` |
| C-04 | High | COMBAT §4 ข้อ 1 กำหนดให้มี "authenticated session" และ NETWORK §4 กำหนดให้ reconnect ต้อง re-auth แต่ ROADMAP ทำ reconnect ใน M3 ขณะที่ account/session อยู่ใน M4 | `COMBAT_SPEC.md` L25; `NETWORK_PROTOCOL.md` L33; `ROADMAP.md` L32 กับ L37 | **A (แนะนำ):** M3 ใช้ dev-only auth ที่ server ออก token ผ่าน interface `AuthProvider` เปิดได้เฉพาะ env development แล้วเปลี่ยนเป็นระบบจริงใน M4 **B:** ย้าย auth ขั้นต่ำขึ้นมาไว้ใน M3 |
| C-05 | High | Pillar 4 (co-op boss) และ §10 (multiplayer scaling) ต้องการการร่วมมือ แต่ ROADMAP เลื่อน party system ไปไว้ใน M8 จึงไม่มีกติกาว่าใครได้ loot หรือ credit เมื่อหลายคนตีตัวเดียวกันใน MVP | `GAME_VISION_GDD.md` L19, L82; `ROADMAP.md` L69 | **A (แนะนำ):** MVP ใช้ personal loot ให้ทุกคนที่มีส่วนร่วมเกินเกณฑ์ (open tagging) ไม่มีการแย่ง ส่วน party ไว้ M8 **B:** ทำ party แบบเบาใน M5 |
| C-06 | High | GDD §1 เขียนว่า "cooperate or compete" และ COMBAT §5 พูดถึง "PvP scaling" แต่ MVP scope (§6) ไม่มี PvP และรายการ deferred (§7) มีแค่ guild war ขนาดใหญ่ สถานะของ PvP ใน MVP จึงไม่ชัด | `GAME_VISION_GDD.md` L4, L29–50; `COMBAT_SPEC.md` L43 | **แนะนำ:** ระบุชัดว่า MVP เป็น PvE เท่านั้น และเพิ่ม PvP ใน §7 เพราะ PvP เพิ่มภาระด้าน anti-cheat และ balance มาก |
| C-07 | Medium | GDD §6 เขียน "1 archetype with two build paths" แต่ §9 ใช้หัวข้อ "Starting Archetypes" และแยกเป็น 2 ตัว ส่วน ROADMAP M5 เรียก "prototype paths" ซึ่งมีผลต่อ data model (มี field class หรือเป็น skill tree เดียว) | `GAME_VISION_GDD.md` L32, L62–73; `ROADMAP.md` L45 | เลือกคำและ data model: **A:** ตัวละครเดียวเลือก path ผ่าน learned arts **B:** 2 class |
| C-08 | Medium | GDD ระบุ 6–8 skills แต่ COMBAT §10 มี 5 skills ที่ไม่ได้ระบุว่าเป็นของ path ไหน และ Spirit Medium มี "summon/companion" (GDD §9) แต่ไม่มี skill หรือ spec สำหรับ summon เลย | `GAME_VISION_GDD.md` L33, L69; `COMBAT_SPEC.md` L85–92 | ทำตาราง skill → path → target mode และเลื่อน summon ออกไปหลัง VS0 เพราะเป็นระบบ entity กับ AI ใหม่ทั้งชุด |
| C-09 | Medium | GDD มี "appeases a spirit", "combat/ritual encounter" และ "ritual puzzle" แต่ไม่มีเอกสาร spec สำหรับ ritual, investigation หรือ dialogue ใน protocol มีแค่ `InteractRequest` และ `QuestActionRequest` ระดับแนวคิด | `GAME_VISION_GDD.md` L24, L27, L89; `NETWORK_PROTOCOL.md` L17, L19 | เขียน `QUEST_AND_INTERACTION_SPEC.md` ก่อน M5 โดย VS0 ไม่ต้องรวมเรื่องนี้ |
| C-10 | Low | Karma: §7 เลื่อน "complex karma" ออกไป แต่ §11 มีหลักการ karma และ §8 มี knowledge/reputation ที่ไม่อยู่ใน MVP scope (§6) จึงไม่ชัดว่า karma หรือ reputation แบบง่ายอยู่ใน MVP หรือไม่ | `GAME_VISION_GDD.md` L48, L58, L88 | ระบุ in/out ให้ชัดใน §6 |
| C-11 | Medium | GDD §6 และ DATABASE §7 ต้องการ NPC shop, craft 1 สูตร, currency sink และ currency ledger แต่ไม่มี milestone ใดใน ROADMAP รับงานเหล่านี้ (M4 = inventory/equipment/quest, M5 = paths/enemies/loadout/quests) | `GAME_VISION_GDD.md` L36, L94; `DATABASE_AND_ECONOMY.md` L30–38, L49–54; `ROADMAP.md` L35–49 | ใส่ currency ledger ใน M4 และ shop กับ craft ใน M5 |
| C-12 | Low | GDD มี tutorial quest แต่ ROADMAP M5 มีแค่ investigation และ hunt ส่วน tutorial อยู่ใน M6 "onboarding" แบบโดยนัย | `GAME_VISION_GDD.md` L35; `ROADMAP.md` L48, L55 | ระบุให้ชัดว่า tutorial quest อยู่ใน M6 |
| C-13 | Medium | ชื่อและโครงสร้าง event ไม่ตรงกัน: COMBAT §9 มี 11 event แยกกัน (รวม `LootGranted`, `CastStarted`) แต่ NETWORK §2 รวมเป็น `CombatEvent{type}` และส่ง loot ผ่าน `InventoryStateDelta` ส่วน lifecycle ใน COMBAT §3 ใช้ `Windup` ไม่ใช่ `CastStarted` | `COMBAT_SPEC.md` L18, L69–83; `NETWORK_PROTOCOL.md` L23–25 | กำหนดสัญญาเดียวใน `shared-contracts` (discriminated union) แล้วให้เอกสารทั้งสองอ้างถึงไฟล์นั้น |
| C-14 | Medium | NETWORK §2 ระบุ `MoveState` เป็น message จาก server แต่ TECH §7 และ NETWORK §1 บอกให้ใช้ state sync สำหรับ movement ใน Colyseus ตำแหน่งตามปกติจะอยู่ใน Schema state | `NETWORK_PROTOCOL.md` L6, L22; `TECHNICAL_ARCHITECTURE.md` L125 | ระบุว่าตำแหน่งอยู่ใน room state ส่วน `MoveState` เป็น ack หรือ reconciliation ของ client เจ้าของตัวละคร (ถ้าจำเป็น) |
| C-15 | High | `MoveInput` อนุญาตให้ส่ง "input duration" ซึ่งขัดกับ `.claude/rules/server.md` ("Do not trust client timestamps") และ threat model เรื่อง client tampering | `NETWORK_PROTOCOL.md` L15; `.claude/rules/server.md` L10; `SECURITY_THREAT_MODEL.md` L7–9 | ตัด duration ออก ให้ server คำนวณระยะจาก tick ของตัวเองแล้ว clamp ความเร็ว ส่วน client ส่งแค่ทิศและ sequence |
| C-16 | Medium | ART เริ่มด้วย sprite 4 ทิศ แต่ combat มี aim vector อิสระ 360° ทิศที่ตัวละครหันจึงไม่ตรงกับทิศที่เล็ง และ GDD ยังเปิดทางให้หมุนกล้องภายหลัง ซึ่งจะทำให้ทิศของ sprite ต้องอิงกล้อง | `ART_ANIMATION_PIPELINE.md` L11; `COMBAT_SPEC.md` L12; `GAME_VISION_GDD.md` L8 | ล็อกให้กล้องหมุนไม่ได้ตลอด MVP (ทำ ADR) และกำหนด snapping ของทิศหันกับ aim indicator ที่แยกจาก sprite |
| C-17 | Low | DATABASE §1 ระบุ `SkillDefinition` และ `ItemDefinition` ในรายการ entity แต่ L16 บอกว่าเก็บใน git ได้ อาจทำให้มีคนสร้างตารางใน DB ซ้ำ | `DATABASE_AND_ECONOMY.md` L8–12, L16 | ระบุว่า definition อยู่ใน `packages/game-data` และ DB เก็บเฉพาะ id กับ `dataVersion` |
| C-18 | Medium | TECH §5 วาง `database/migrations` และ `database/seeds` โดย rule ใช้ glob `database/**/*` และ `**/*schema.prisma` แต่ไม่ได้กำหนดว่า Prisma config จะชี้ไปที่ `database/` หรือไม่ ถ้าใช้ค่าเริ่มต้น `prisma/` rule จะไม่ครอบคลุม migrations | `TECHNICAL_ARCHITECTURE.md` L93–95; `.claude/rules/database.md` L2–4 | ADR กำหนด path ของ schema และ migrations แล้วปรับ glob ให้ตรง |
| C-19 | Medium | `.claude/rules` ครอบคลุมแค่ `apps/web`, `apps/game-server` และ `database` แต่ logic สำคัญที่สุด (combat rules, contracts) อยู่ใน `packages/game-rules` และ `packages/shared-contracts` ซึ่งไม่มี rule | `.claude/rules/*.md`; `TECHNICAL_ARCHITECTURE.md` L75–79 | เพิ่ม `rules/shared.md` (pure function, ห้าม import IO, ต้องมี Zod schema, contract ต้องมี version) |
| C-20 | Low | ขั้นตอนเดียวกันมีกลไก 2 แบบ คือ skills ที่ยังไม่มีอยู่ (`/implement-feature`, `/review-diff`, `/release-check`) กับ `prompts/02, 03, 07` ที่มีอยู่แล้ว ซึ่งเสี่ยงจะเบี่ยงกัน | `AI_WORKFLOW.md` L37; `TECHNICAL_ARCHITECTURE.md` L105–106; `prompts/` | ใช้ `prompts/` เป็นต้นฉบับก่อน แล้วค่อยแปลงเป็น skill หลังตรวจรูปแบบกับเอกสารทางการของ Claude Code |
| C-21 | Low | `prompts/01` และ `prompts/02` สั่งให้อ่าน `CLAUDE.md` ก่อน แต่ไฟล์นั้นจะถูกสร้างในขั้นที่ 4 ของ README | `prompts/01` L87; `prompts/02` L6; `README.md` L11 | สร้าง `CLAUDE.md` เป็นงานแรกของ M0 |
| C-22 | High | ROADMAP M2 "Offline Combat Sandbox" ขัดกับหลัก server-authoritative ถ้า AI เขียน combat ไว้ฝั่ง client จะต้องรื้อใหม่ใน M3 | `ROADMAP.md` L21–26; `TECHNICAL_ARCHITECTURE.md §3` L39–50 | ให้ M2 เขียน rules ใน `packages/game-rules` แล้วรันใน "local sim" ที่ใช้ message contract เดียวกับ server โดย renderer ใช้แค่ event |
| C-23 | Critical | DATABASE §5 กับ TECH §8 บอกให้ "persist on important transitions and periodically" ขณะที่ DATABASE §3 บอกให้ใช้ transaction กับรางวัลและการซื้อขาย แต่ไม่ได้กำหนดว่าข้อมูลที่มีมูลค่ามีต้นฉบับอยู่ที่หน่วยความจำของ room หรือที่ DB ถ้าทั้งสองที่เป็นต้นฉบับ จะเกิด dupe หรือ rollback ได้เมื่อ server crash | `DATABASE_AND_ECONOMY.md` L21–28, L40–41; `TECHNICAL_ARCHITECTURE.md` L131–136 | ตัดสินใน ADR ดู D-21 |
| C-24 | Medium | Quality gate "Git diff reviewed" และ workflow "Start with git status" ใช้ไม่ได้ เพราะยังไม่มี git repository | `TEST_STRATEGY.md` L22; `AI_WORKFLOW.md` L25; ผลคำสั่ง git | `git init` เป็นงานแรกของ M0 (ต้องขออนุมัติ) |

**[F] จุดที่สอดคล้องกันดี:** stack ที่เสนอตรงกันทุกเอกสาร, หลัก client untrusted มีครบทุกเอกสาร, ความเสี่ยงเรื่อง depth/occlusion ถูกระบุตรงกันทั้ง TECH §6 (L121) และ ART §3, scope ที่เลื่อนออกไปใน GDD §7 ตรงกับ CLAUDE_TEMPLATE (L44) และ ROADMAP M8, จำนวน enemy/boss ใน GDD §6 ตรงกับ ROADMAP M2/M5

---

## 5. Technical Risks

| ID | ประเภท | ระดับ | ความเสี่ยง | หลักฐาน / ที่มา | Mitigation **[R]** | ปิดใน |
|---|---|---|---|---|---|---|
| R-01 | Data integrity | **Critical** | Item หรือ currency dupe จากต้นฉบับของข้อมูลที่ไม่ชัด (memory กับ DB) และ race ระหว่าง disconnect กับ save | C-23 | Value-bearing operation ต้อง commit ลง DB ก่อน แล้วจึงแก้ room state, ใช้ unique constraint บน `(characterId, sourceEventId)` และ optimistic version, ทำ concurrency test | M4 |
| R-02 | Multiplayer | **Critical** | Collision หรือ walkable data ของ client กับ server ไม่ตรงกัน (server import Babylon ไม่ได้) ทำให้เกิด rubber-banding และ server ปฏิเสธการเดินที่ถูกต้อง | TECH L81; ART L26–27; COMBAT L46 | รูปแบบเดียวที่ engine-agnostic (เช่น polygon หรือ grid บน XZ plane เป็น JSON) export จาก collision mesh ใน Blender เก็บใน `game-data` และมี test ยืนยัน hash ตรงกันทั้ง 2 ฝั่ง | M1 |
| R-03 | Performance / Art | High | Depth sorting และ occlusion ของ sprite 2D บนโลก 3D เป็นความเสี่ยงที่อาจต้องรื้อ renderer | TECH L117, L121; ART L15–22 | ทำ spike ใน M1 ด้วย occluder 3 แบบ (กำแพง ต้นไม้ ขอบหลังคา) พร้อม fade/cutaway และบันทึก test scene ไว้ใช้ซ้ำ | M1 |
| R-04 | Performance | High | Texture memory ของ sprite HD (ทิศ × state × frame × จำนวนผู้เล่น) บน browser ยิ่งหนักถ้ามี paper-doll | GDD L9; ART L10–11 | กำหนดงบ texture ต่อตัวละคร วัดใน benchmark scene, ตรวจ texture compression ที่ Babylon รองรับ **[?]**, ตัดสิน D-07 ก่อนผลิต art | M1 |
| R-05 | Multiplayer / Fairness | High | ไม่มีนโยบาย lag compensation ผู้เล่นจะรู้สึกว่า "หลบแล้วยังโดน" ซึ่งขัดกับเกณฑ์ §13 "เข้าใจว่าทำไมโดน" | COMBAT L35, L48; GDD L99 | VS0 ไม่ rewind แต่ให้ windup ของ telegraph ยาวพอรองรับ latency, มี grace window ของ i-frame ที่ server และทำ ADR | M2–M3 |
| R-06 | Multiplayer | High | ความซับซ้อนของ client prediction กับ reconciliation **[?]** ต้องตรวจว่า Colyseus 0.18 มีอะไรให้ใช้แล้วบ้าง | TECH L128; NETWORK L36 | ทำนายเฉพาะการเดินของตัวเอง แล้ว interpolate ผู้เล่นอื่น | M3 |
| R-07 | Multiplayer / Integrity | High | ตัวละครเดียวกันเข้า 2 room พร้อมกันระหว่าง reconnect หรือเปลี่ยน zone | NETWORK L46–47 | Lease ใน DB (`activeSessionId`, `leaseExpiresAt`) ที่อัปเดตใน transaction ตอน join | M4 |
| R-08 | Cheating | High | Speed hack ผ่าน `MoveInput.duration` | C-15 | ให้ server คำนวณจาก tick แล้ว clamp | M3 |
| R-09 | Cheating | High | Bot, macro และ multi-account farming ยังไม่อยู่ใน threat model ทั้งที่ client browser ถูกอ่านหรือแก้ได้หมด | SECURITY §2 (ไม่มีหัวข้อนี้) | เพิ่ม threat, กำหนด rate ของรางวัลต่อชั่วโมง, server-side anomaly log และจำกัด account ต่อ IP ในช่วง test | M7 |
| R-10 | Security | High | ยังไม่เลือก auth และการส่ง token ผ่าน WebSocket ถ้าทำเองจะเสี่ยง | SECURITY L19–21 | ADR เลือก library ที่ใช้แพร่หลาย, ใช้ token อายุสั้น, ห้ามเขียน crypto เอง | M4 |
| R-11 | Security / Cheating | Medium | ข้อมูลที่ควรซ่อนรั่วผ่าน state sync (Colyseus sync schema ให้ทุก client) เช่น inventory ของคนอื่น หรือ HP/การกระทำถัดไปของบอส | TECH L125 | แยก state สาธารณะกับส่วนตัว และตรวจกลไก filter หรือ view ของ Colyseus 0.18 **[?]** | M3 |
| R-12 | Security | Medium | คำสั่ง debug หรือ admin หลุดไปใน production bundle | GDD L40; SECURITY L31–33 | ใช้ build-time flag ที่ถูก tree-shake และ server ปฏิเสธคำสั่งตาม env + role พร้อม test ยืนยัน | M3 |
| R-13 | Security / DoS | Medium | Rate limit และขนาด payload ต่อ message ต้องเขียนเองหรือตั้งค่าเอง **[?]** | NETWORK L8; server.md L8 | ทำ token bucket ต่อ client ต่อประเภท message และ fuzz test | M3 |
| R-14 | Data integrity | High | Static game-data เปลี่ยน (เช่นลบ item) ทำให้ item instance ใน DB กลายเป็นกำพร้า เพราะไม่มี versioning ของ content | DATABASE L16, L19 | มี `dataVersion` และ content migration script, ห้ามลบ id ให้ใช้ deprecate แทน | M4 |
| R-15 | Data integrity | High | ยังไม่มี backup/restore ที่ทดสอบจริง | TECH L136; DATABASE L43–47 | ซ้อม restore ใน local อย่างน้อย 1 ครั้งก่อนจบ M4 และทำซ้ำใน M7 | M4, M7 |
| R-16 | Data integrity | Medium | ยังไม่ได้กำหนดว่าจะเก็บ idempotency key นานเท่าไร | NETWORK L30 | เก็บถาวรสำหรับ reward/purchase (unique constraint) และ TTL สำหรับ request ความเสี่ยงต่ำ | M4 |
| R-17 | Dependency | **High** | Prisma CLI tag `latest` = `8.0.0-rc.27` แต่ `@prisma/client` latest = `7.10.1` ถ้าติดตั้งแบบไม่ระบุเวอร์ชันจะได้ major ต่างกัน | ผล `npm view` (หัวข้อ 8) | pin CLI และ client ให้เป็นเวอร์ชันเดียวกันแบบระบุตรง ๆ | M0 |
| R-18 | Dependency / AI | High | AI มักเขียนโค้ดตาม API เก่า (`colyseus.js`, Zod v3, Prisma รุ่นก่อน, TS รุ่นก่อน 7) | ผล `npm view`: `@colyseus/sdk` 0.18.6, `colyseus.js` หยุดที่ 0.16.22 | ADR บันทึกเวอร์ชันและลิงก์ migration guide, ใส่เวอร์ชันลงใน `CLAUDE.md`, ทำ smoke test ของแต่ละ lib ใน M0 | M0 |
| R-19 | Dependency / Legal | High | Spine runtime ไม่มีตัวทางการสำหรับ Babylon และ license เป็นแบบเฉพาะ | ผล `npm search` และ `npm view license` | VS0 ใช้ sprite-sheet ก่อน แล้วประเมิน Spine ด้วย ADR หลังอ่าน license จริง | M0 (ADR), หลัง VS0 |
| R-20 | Maintainability | High | Solo dev + AI: scope creep, เอกสารเบี่ยง (เริ่มมีแล้วจาก C-01) และ regression ที่มองไม่เห็นเพราะไม่มี git หรือ CI | C-01, C-24 | git + CI gate (typecheck, lint, test, build), PR เล็ก, ADR และ prompts/08 doc-sync ทุก milestone | M0 |
| R-21 | Performance | Medium | Server tick ทำงานบน Node thread เดียว ถ้า AI, combat, collision และการรอ DB ปนกันใน tick จะเกิด spike | TECH L126, L143 | DB I/O ต้อง async นอก tick พร้อม pending lock บน entity และวัด tick p95 ตั้งแต่ M3 | M3 |
| R-22 | Testing | Medium | Playwright กับ WebGL ใน headless อาจช้าหรือไม่เสถียร และ visual test ตรวจอัตโนมัติยาก | TEST L6–9 | เปิด debug state API ใน dev build ให้ E2E ตรวจ state แทน pixel แล้วใช้ visual QA แบบ manual ตาม checklist | M1–M3 |
| R-23 | Ops | Medium | เครื่องนี้ไม่มี Docker และ `psql` จึงยังไม่มีทางรัน PostgreSQL ใน local | ผลตรวจ toolchain | เลือกระหว่างติดตั้ง Docker Desktop หรือ PostgreSQL แบบ native (D-28) | M0 |
| R-24 | Legal / Cultural | Medium | เนื้อหาไสยเวทไทย (ยันต์ รอยสัก ลวดลายทางศาสนา) อ่อนไหวทางวัฒนธรรม, ชื่อเกมยังเป็น working title ที่ยังไม่ได้ตรวจเครื่องหมายการค้า และข้อมูลบัญชีผู้เล่นไทยต้องคำนึงถึง PDPA | GDD L1, L13; ROADMAP L61 | ทำ cultural review checklist, ตรวจชื่อ และเก็บข้อมูลส่วนบุคคลเท่าที่จำเป็น | M6–M7 |

**สถานะหลัง M0 gate (2026-10-26) [F]** (`IMPLEMENTATION_STATUS.md §2.6`):
- **ลดลงแล้ว:** R-17 (pin แบบ exact + catalog + ADR-001 และ `CLAUDE.md` เตือนเรื่อง tag `latest` · ยังไม่ได้ติดตั้ง Prisma) · R-18 (ADR-001 บันทึกเวอร์ชันและผลของ spike) · R-20 (1 task = 1 branch, `pnpm verify` + CI tier 1, ruleset และ doc sync ทุก gate) · R-19 ส่วนของ M0 (Spine เลื่อนไว้ใน DEC-058 และ ADR-002 ทำหลัง VP0-c)
- **เลื่อนไป:** R-23 → M3 (DEC-009: ลอง PGlite ก่อน)
- **ตัดสินแนวทางแล้วแต่ยังต้อง implement:** R-02 (ADR-003) · R-05 และ R-08 (ADR-004) · R-01 และ R-07 (ADR-005 Draft) · R-10 (ADR-006)
- **ใหม่จาก gate review:** ไฟล์ชื่อแบบ `*.env` ยังไม่ได้ป้องกันใน repo ที่เป็น public (Medium, follow-up ใน BACKLOG M1)

---

## 6. Missing Decisions

> คอลัมน์ "ค่าเริ่มต้นที่แนะนำ" เป็น **[R]** ที่ย้อนกลับได้ ต้องได้รับอนุมัติก่อนใช้ ส่วนคอลัมน์ "ต้องปิดก่อน" บอก milestone ที่ถูกบล็อก

### 6.1 Product / Game Design
| ID | การตัดสินใจที่ขาด | ทำไมสำคัญ | ต้องปิดก่อน | ค่าเริ่มต้นที่แนะนำ **[R]** |
|---|---|---|---|---|
| D-01 | MVP เป็น PvE เท่านั้นหรือไม่ | ขนาดงาน anti-cheat และ balance (C-06) | M2 | PvE เท่านั้น |
| D-02 | Class model: 1 archetype กับ 2 paths หรือ 2 classes | data model และ UI (C-07) | M2 | ตัวละครเดียว เลือก path ผ่าน learned arts |
| D-03 | Stat model: ชื่อและจำนวน stat, ชื่อ resource (เช่น "พลังเวท"), level cap ของ MVP, XP curve, สูตร `mitigationMultiplier` | สูตรใน COMBAT §5 อ้างตัวแปรที่ยังไม่มีนิยาม | M2 | stat ชุดเล็ก (HP, resource, power, defense) แบบ additive ตาม GDD L60 |
| D-04 | กติกาการตายและ respawn (จุดเกิด, บทลงโทษ) | COMBAT lifecycle มี `Dead` แต่ไม่มีกติกา | M2 | เกิดที่จุด safe ของ zone โดยไม่ลงโทษใน VS0 |
| D-05 | กติกา loot และ credit ในห้องที่มีหลายคน | C-05 | M3 | personal loot ตามการมีส่วนร่วม |
| D-06 | การ spawn และ respawn ของ monster | AI, room และ balance | M2 | timer คงที่ต่อ spawn point |
| D-07 | อุปกรณ์เปลี่ยนรูปลักษณ์ตัวละครหรือไม่ (paper-doll) | งาน art และ texture memory เพิ่มเป็นเท่าตัว (R-04) | M1 | **ไม่** เปลี่ยนใน MVP แสดงเป็นไอคอนหรือ VFX แทน |
| D-08 | จำนวนตัวละครต่อบัญชี, การสร้างตัวละคร, กติกาชื่อ | schema และ UI | M4 | 1 ตัวต่อบัญชีใน VS0 |
| D-09 | ขอบเขตของกลไก "appease/ritual" และ investigation | C-09 | M5 | ไม่อยู่ใน VS0 |
| D-10 | ภาษา: ไทยก่อนหรือไทยกับอังกฤษ, font ภาษาไทยที่ license อนุญาต, การแสดงสระและวรรณยุกต์ไทยใน in-world text | การแสดงผลภาษาไทยใน Babylon GUI กับ DOM ต่างกัน **[?]** | M1 (ส่วน in-world text) | UI ภาษาไทยผ่าน DOM ก่อน และใช้ตัวเลขหรือไอคอนในโลกเกม |
| D-11 | ผู้ตรวจด้านวัฒนธรรม, การตรวจชื่อหรือเครื่องหมายการค้า | R-24 | M6 | — |
| D-12 | Business model ระยะยาว (แม้จะเลื่อนไปก่อน) | มีผลต่อการออกแบบเศรษฐกิจและกฎหมาย (GDD L49; DATABASE L54) | M7 | ระบุว่า "ไม่มีการเก็บเงินจนถึง M8" |

### 6.2 Technical
| ID | การตัดสินใจที่ขาด | ต้องปิดก่อน | ค่าเริ่มต้นที่แนะนำ **[R]** |
|---|---|---|---|
| D-13 | Repo root และ `git init` (C-03) | M0 | `KhamangWet_FullSystem/` เป็น root |
| D-14 | นโยบาย pin เวอร์ชันและเวอร์ชันจริงทุกตัว (หัวข้อ 8) | M0 | Node 24 LTS, pin แบบ exact และ commit lockfile |
| D-15 | วิธีควบคุมการเดิน: WASD, click-to-move หรือทั้งสองแบบ (click-to-move ต้องมี pathfinding ฝั่ง server) | M1 | WASD + mouse aim ใน VS0 เพราะเข้ากับ combat แบบ directional |
| D-16 | Netcode ของ movement: มี prediction + reconciliation หรือ server-only + interpolation | M3 | ทำนายเฉพาะตัวเอง |
| D-17 | รูปแบบและ pipeline ของ collision/walkable data ที่ใช้ร่วมกัน (R-02) | **M1** | polygon หรือ grid เป็น JSON export จาก Blender เก็บใน `game-data` |
| D-18 | Tick rate และ patch rate เริ่มต้น | M3 | ค่าเดียวที่ปรับผ่าน config ได้ แล้ววัดผล ไม่ล็อกจนกว่าจะ profile |
| D-19 | Lag compensation และนโยบาย i-frame (R-05) | M2 | ไม่ rewind ใน VS0 |
| D-20 | Cooldown เริ่มนับเมื่อไร (COMBAT §3 L21 ขอให้เลือก default) | M2 | นับเมื่อ cast ถูก accept |
| D-21 | ต้นฉบับของข้อมูลที่มีมูลค่า (DB-first) + character lease + checkpoint ของข้อมูลที่ไม่มีมูลค่า (C-23, R-01, R-07) | **M3** (ออกแบบ), M4 (ทำ) | DB commit ก่อนแล้วจึงแก้ memory ส่วนตำแหน่งและ HP บันทึกเป็น checkpoint เมื่อ logout, เปลี่ยน zone หรือตามรอบเวลา |
| D-22 | Auth: library, รูปแบบ token สำหรับ WebSocket, dev auth ระหว่าง M3 (C-04) | M3 (dev), M4 (จริง) | `AuthProvider` interface + dev token |
| D-23 | Animation runtime ของ prototype (R-19) | **M1** | sprite-sheet (frame-based) 4 ทิศ |
| D-24 | ที่มาของ art ตัวละคร (วาดเอง, render จาก 3D, AI-generated) และนโยบาย license/provenance ของ asset ที่ AI สร้าง | M1 (placeholder), M6 (จริง) | placeholder ที่รู้ license ชัดเจน และบันทึก provenance ใน asset manifest (ART §6) |
| D-25 | React ↔ Babylon state bridge และ in-world UI (DOM หรือ Babylon GUI) | M1 | store กลางฝั่ง client ที่รับข้อมูลจาก network layer เพียงทางเดียว |
| D-26 | Game-data format (TS module หรือ JSON/YAML + Zod) และ content versioning (R-14) | M2 | TS หรือ JSON ที่ validate ด้วย Zod ตอน build |
| D-27 | CI provider, linter/formatter, เครื่องมือบังคับ import boundary | M0 | — (ต้องตรวจตัวเลือกปัจจุบัน) |
| D-28 | วิธีรัน PostgreSQL ใน local และเวอร์ชัน PostgreSQL (R-23) | M4 (ถ้าเริ่ม DB ใน M3 ต้องปิดก่อน M3) | — |
| D-29 | Debug/test hook สำหรับ E2E (R-22) | M1 | `window.__KW_DEBUG__` เฉพาะ dev build |
| D-30 | Logging, metrics และรูปแบบ structured log | M3 | JSON log + metrics ใน TECH §9 L143 |
| D-31 | รายการ browser ที่รองรับ, ฮาร์ดแวร์ขั้นต่ำ, WebGL2 หรือ WebGPU | M1 | Chromium ล่าสุด + WebGL2 เป็น baseline **[?]** |
| D-32 | ตำแหน่งเอกสารต้นฉบับ (C-01) | M0 | `docs/` |
| D-33 | Hosting (WebSocket, sticky session, ต้นทุน) | M6 | ยังไม่ต้องตัดสินตอนนี้ (README L24) |

---

## 7. Repository Audit

### 7.1 หลักฐานที่ใช้ **[F]**
- `find E:\KhamangWet -type f`: พบเฉพาะไฟล์ `.md` 34 ไฟล์ ไม่มี `package.json`, `*.ts`, `*.tsx`, `*.js`, `*.prisma`, lockfile, `tsconfig*`, `.env*`, `Dockerfile`, `CLAUDE.md` หรือ `.gitignore`
- `git rev-parse --is-inside-work-tree` ทั้งที่ `E:\KhamangWet` และ `KhamangWet_FullSystem`: `fatal: not a git repository`
- ไม่มีคำสั่ง build, test หรือ typecheck ให้รัน จึง**ไม่ได้รัน**ส่วนนี้ (ไม่ใช่ว่ารันแล้วผ่าน)

### 7.2 สถานะรายระบบ
| ระบบ / ส่วนประกอบ | สถานะ | หลักฐาน / หมายเหตุ |
|---|---|---|
| เอกสาร design และ architecture | **Implemented** (เป็นเอกสาร) | 24 ไฟล์ที่เนื้อหาไม่ซ้ำ ดูหัวข้อ 1 |
| Prompt library | **Implemented** (เป็นเอกสาร) | `prompts/00–08` |
| `.claude/rules` (client/server/database) | **Partial** | มี 3 ไฟล์ แต่ path ที่ระบุยังไม่มีอยู่จริง, ไม่ครอบคลุม `packages/*` (C-19) และ **[?]** รูปแบบ frontmatter `paths:` ต้องตรวจกับเอกสาร Claude Code ปัจจุบัน (AI_WORKFLOW L40 กำหนดไว้เอง) |
| `CLAUDE.md` | **Missing** | มีแค่ `CLAUDE_TEMPLATE.md` |
| `.claude/skills`, `.claude/agents` | **Missing** | — |
| Git repository, `.gitignore` | **Missing** | — |
| Monorepo (`package.json`, `pnpm-workspace.yaml`, lockfile) | **Missing** | — |
| `apps/web` (Babylon client, React UI) | **Missing** | — |
| `apps/game-server` (Colyseus rooms) | **Missing** | — |
| `packages/shared-contracts`, `game-data`, `game-rules`, `config` | **Missing** | — |
| `database/` (schema, migrations, seeds) | **Missing** | — |
| Tests (unit, integration, E2E, load) | **Missing** | — |
| CI/CD, containers | **Missing** | — |
| `docs/adr/` | **Missing** | — |
| Assets (art, Blender source, audio) | **Missing** ใน workspace | **[?]** ไม่ทราบว่าผู้ใช้มี asset อยู่ที่อื่นหรือไม่ |
| Repository เกมอื่น (README L8 พูดถึงการแตก ZIP ลง repo เกม) | **Unknown** | **[?]** ต้องถามผู้ใช้ว่ามีโค้ดเกมอยู่ที่อื่นหรือไม่ |

### 7.3 Toolchain ในเครื่อง **[F]**
| Tool | ผลตรวจ | หมายเหตุ |
|---|---|---|
| git | `2.55.0.windows.5` | พร้อมใช้ |
| node | `v24.19.0` | อยู่ในสาย LTS "Krypton" แต่ patch ล่าสุดคือ `24.22.1` (2026-10-20) |
| npm | `11.17.0` | |
| corepack | `0.35.0` | ใช้เปิด pnpm ได้ **[?]** ต้องยืนยันวิธีที่ pnpm 12 แนะนำ |
| pnpm | **ไม่พบ** | stack เสนอให้ใช้ pnpm workspace |
| docker | **ไม่พบ** | README L24 พูดถึง container |
| psql | **ไม่พบ** | ยังไม่มีทางรัน PostgreSQL |
| blender | **ไม่พบใน PATH** | **[?]** อาจติดตั้งไว้แต่ไม่อยู่ใน PATH |

---

## 8. Dependency Audit

> **[F]** ข้อมูลมาจาก `npm view <pkg> version time.modified engines.node`, `dist-tags` และ `license` เมื่อ **2026-10-25** และสถานะ LTS จาก `https://nodejs.org/dist/index.json`
> **ตารางนี้คือสิ่งที่ registry รายงาน ไม่ใช่เวอร์ชันที่แนะนำให้ pin** ต้องอ่าน release notes และ migration guide แล้วบันทึกลง ADR ก่อน lock

| Package | บทบาท | `latest` ณ วันตรวจ | `engines.node` | License | ข้อสังเกตและสิ่งที่ต้องตรวจ |
|---|---|---|---|---|---|
| `@babylonjs/core` | 3D renderer | 9.32.0 | — | Apache-2.0 | ตรวจ orthographic camera, sprite/billboard API, texture compression และ WebGPU **[?]** |
| `vite` | bundler | 8.3.5 | `^20.19.0 \|\| >=22.12.0` | — | ตรวจ plugin React ที่เข้ากับ Vite 8 **[?]** |
| `typescript` | ภาษา | **7.0.2** (มี tag `beta` 7.1.0) | `>=16.20.0` | — | **TS 7 เป็น major ใหม่** ต้องตรวจว่า decorator ของ `@colyseus/schema`, linter และ tooling ที่ใช้ TS API ยังทำงานได้ ถ้าไม่ได้ต้องพิจารณา major ก่อนหน้า **[?]** |
| `react`, `react-dom` | UI overlay | 19.3.1 | — | — | |
| `colyseus` / `@colyseus/core` | game server | 0.18.10 / 0.18.23 | `>= 22.x` | MIT | **ยังเป็น 0.x** และมี tag `legacy-0.17` อยู่ จึงอาจมี breaking change ระหว่าง minor ต้องอ่าน migration guide |
| `@colyseus/schema` | state sync | 5.0.42 (มี `legacy-4` = 4.0.31) | — | — | ตัวอย่างโค้ดเก่าน่าจะใช้ schema v2–v4 **[?]** |
| `@colyseus/sdk` | client SDK | 0.18.6 | `>= 12.x` | — | **ดูเหมือนแทนที่ `colyseus.js`** ซึ่งหยุดที่ 0.16.22 (อัปเดตล่าสุด 2025-10-22, npm ไม่ได้ mark deprecated) ต้องยืนยันกับเอกสารทางการ **[?]** |
| `@colyseus/testing` | server tests | 0.18.6 | `>= 22.x` | — | ใช้ทำ integration test ของ room ได้ **[?]** |
| `@colyseus/loadtest` | load tests | 0.18.4 | `>= 22.x` | — | ตัวเลือกหนึ่งของ load test (README L21 ให้เลือกภายหลัง) |
| `prisma` (CLI) | migrations, codegen | **`8.0.0-rc.27`** (tag `latest` ชี้ไปที่ RC, tag `prev` = 7.10.1) | `^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` | Apache-2.0 | ⚠ **ห้าม `add prisma` โดยไม่ระบุเวอร์ชัน** (R-17) |
| `@prisma/client` | ORM runtime | **7.10.1** | `^20.19 \|\| ^22.12 \|\| >=24.0` | — | ต้องเป็น major เดียวกับ CLI และต้องตรวจ config, generator และ driver adapter ของ major ที่เลือก **[?]** |
| `zod` | runtime validation | 4.6.7 | — | MIT | **v4 มี API ต่างจาก v3** ซึ่งเป็นรูปแบบที่ตัวอย่างและ AI มักใช้ |
| `vitest` | unit tests | 5.0.5 (มี tag `V4`, `V3`) | `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0` | — | |
| `@playwright/test` | E2E | 1.64.1 | `>=20` | — | ตรวจ WebGL ใน headless (R-22) |
| `pnpm` | package manager | 12.15.0 (มี tag `latest-10`, `latest-11`) | `>=18` | — | **ยังไม่ได้ติดตั้ง** pnpm ตั้งแต่ v10 ไม่รัน lifecycle script ของ dependency โดยค่าเริ่มต้น (ต้อง allowlist package ที่ต้อง build เช่น Prisma หรือ esbuild) ต้องยืนยันพฤติกรรมนี้ใน v12 **[?]** |
| `@esotericsoftware/spine-*` | skeletal animation (ตัวเลือก) | 4.3.13 | — | **`LicenseRef-LICENSE`** (proprietary) | runtime ทางการที่พบใน npm: canvas, canvaskit, phaser, pixi, threejs, webgl, webcomponents, player **ไม่พบตัวสำหรับ Babylon** ต้องอ่าน Spine Runtimes License ว่าต้องมี Editor license หรือไม่ **[?]** |
| Node.js | runtime | 24 LTS "Krypton" `24.22.1`; 22 LTS "Jod" `22.23.4`; 26 `26.12.1` (ยังไม่ LTS ตาม index) | — | — | **[F]** engines ของทุก package ข้างบนรองรับ Node 24 (Prisma CLI RC ต้องการ `^24.11.0` ซึ่ง 24.19 ผ่าน) |

**[F] ความเข้ากันได้ที่ต้องตรวจเป็นคู่ (cross-compat):**
1. `colyseus` 0.18 ↔ `@colyseus/schema` 5 ↔ `@colyseus/sdk` 0.18 ↔ TypeScript 7 (เรื่อง decorator)
2. `prisma` CLI ↔ `@prisma/client` (ต้องเป็น major เดียวกัน) ↔ PostgreSQL server version ↔ pnpm build-script policy
3. `vite` 8 ↔ React plugin ↔ TypeScript 7 ↔ `vitest` 5 (ใช้ Vite ภายใน)
4. Babylon.js 9 ↔ animation runtime ที่เลือก (Spine ไม่มีตัวทางการสำหรับ Babylon)
5. Zod 4 ↔ วิธีที่ `shared-contracts` สร้าง type ให้ทั้ง Colyseus messages และ HTTP API

**[F] dependency ที่ยังไม่ได้เลือก:** auth library, logger, linter/formatter, import-boundary checker, CI, PostgreSQL version, texture compression toolchain, Blender exporter (glTF หรืออื่น), เครื่องมือ load test, Redis (ใช้เมื่อ Colyseus ต้องขยายเป็นหลาย process ในภายหลัง **[?]**)

---

## 9. Implementation Plan

> **[R]** ทั้งหมด คงลำดับ M0–M8 ของ `ROADMAP.md` ไว้ ไม่ได้เขียนแทนของเดิม แต่**เพิ่มเกณฑ์ผ่านที่วัดได้** และทำ M1–M4 ให้ "บาง" จนจบ M4 = VS0 (หัวข้อ 10) ส่วนที่ต่างจาก ROADMAP เดิมมีป้าย 🔸
> ไม่ระบุเวลาเป็นปฏิทิน เพราะ ROADMAP L3 กำหนดให้ gate ด้วยหลักฐาน

### M0 — Repository Foundation & Decision Lock
- **Deliverables:** `git init` + `.gitignore`; ตำแหน่งเอกสารต้นฉบับ (C-01); `CLAUDE.md` จาก template (ย่อ ใส่เวอร์ชันจริงและคำสั่งที่รันได้); pnpm workspace ที่มี `apps/web`, `apps/game-server`, `packages/shared-contracts`, `packages/game-rules`, `packages/game-data` แบบโครงเปล่าเท่าที่จำเป็น (TECH L111 ห้าม scaffold เกินจำเป็น); CI; ADR ชุดแรก
- **ADR ขั้นต่ำ:** 001 stack และเวอร์ชันที่ pin, 002 animation runtime ของ prototype (D-23), 003 collision/walkable format (D-17), 004 netcode model (D-16, D-18, D-19), 005 persistence write strategy (D-21), 006 auth ในช่วง dev (D-22), 007 scope MVP: PvE และ loot (D-01, D-05)
- 🔸 เพิ่ม `.claude/rules/shared.md` (C-19) และ risk register (ROADMAP L10) ใช้หัวข้อ 5 ของรายงานนี้เป็นฉบับตั้งต้น
- **Exit criteria:** (1) `pnpm install` บนเครื่องที่ clone ใหม่สำเร็จด้วย lockfile (2) `pnpm typecheck`, `lint`, `test` และ `build` ผ่านทั้งใน local และ CI (มี unit test ตัวอย่างอย่างน้อย 1 ตัวใน `game-rules`) (3) import boundary ถูกบังคับด้วยเครื่องมือ และมี test ที่ยืนยันว่า import ผิดแล้วล้ม (4) ADR 001–007 มีสถานะ Accepted (5) ไม่มีการตัดสินใจ Critical ค้างในหัวข้อ 6

### M1 — Visual / Movement Prototype (ตาม ROADMAP M1)
- **Deliverables:** Babylon scene + orthographic camera + พื้น + occluder 3 แบบ; sprite placeholder 4 ทิศ (idle/walk) บน foot pivot; WASD movement ใน local; 🔸 โหลด walkable data จากไฟล์ใน `game-data` ไฟล์เดียวกับที่ server จะใช้; benchmark scene ที่บันทึกเงื่อนไขไว้ตาม TEST §7; debug hook (D-29)
- **Exit criteria:** (1) ตัวละครเดินอ้อมหรือลอดหลัง occluder ทั้ง 3 แบบแล้ว sort ถูกต้อง ตามเช็กลิสต์ visual QA ที่มีภาพหน้าจอแนบ (2) unit test ฝั่ง Node ใช้ walkable data ไฟล์เดียวกันตรวจจุดเดินได้หรือไม่ได้ โดยไม่ import Babylon (3) zone unload แล้วไม่มี mesh/texture/observer ค้าง (ตรวจจำนวนผ่าน debug hook) (4) บันทึก frame time (avg, p95) ของ benchmark scene บน browser เป้าหมาย 1 ตัว เพื่อเป็น baseline ไม่ใช่เป้าหมาย

### M2 — Combat Rules Sandbox (ROADMAP M2 แบบปรับ 🔸)
- **Deliverables:** combat rules ใน `packages/game-rules` (pure); skill definitions 3 ตัว (`yantra_bolt`, `seal_burst`, `ward_step`) และ enemy 1 ตัวใน `game-data` ที่ validate ด้วย Zod; 🔸 "local sim" ที่รับ message ตาม `shared-contracts` แล้วส่ง event ให้ renderer (C-22); telegraph VFX แบบง่าย
- **Exit criteria:** (1) unit test ครอบคลุม COMBAT §11 ข้อที่ไม่ต้องใช้ network ได้แก่ ตายแล้ว cast ไม่ได้, cooldown, resource ไม่พอ, เกินระยะ, area hit ตาม geometry และ dodge window ทั้งหมดผ่าน (2) definition ที่ขาด field ทำให้ build ล้ม (COMBAT L102) (3) `game-rules` ไม่มี import ไปยัง Babylon, React หรือ IO (บังคับด้วยเครื่องมือ) (4) ผู้ทดสอบ 1 คนเล่น sandbox แล้วอธิบายได้ว่าทำไมโดนหรือไม่โดน (GDD L99)

### M3 — Authoritative Multiplayer Slice (ตาม ROADMAP M3)
- **Deliverables:** Colyseus room 1 zone; dev auth ผ่าน `AuthProvider` (C-04); movement ที่ server ตัดสินพร้อม speed clamp และ walkable check; ย้าย local sim ไปรันใน room โดยใช้ `game-rules` ตัวเดิม; rate limit และขนาด payload; reconnect; structured log + tick metrics
- **Exit criteria:** (1) Playwright เปิด 2 client แล้วเห็นกันและกัน ตำแหน่งที่แสดงตรงกับ server ภายใน tolerance ที่กำหนดใน ADR 004 (2) test การปลอม input: damage field ถูก Zod ปฏิเสธ, out-of-range, duplicate `requestId`, ความเร็วเกินกำหนด ทั้งหมดไม่มีผลต่อ state (3) fuzz message แบบสุ่มหรือขนาดใหญ่เป็นจำนวนมากแล้ว room ไม่ล่ม (4) client 2 ตัวเห็น HP สุดท้ายของ enemy ตรงกัน (5) บันทึก tick duration p50/p95 ที่ 2 และ 8 client (เป็น baseline) (6) ⚠ ADR 005 (D-21) ต้อง Accepted ก่อนเริ่ม M4

### M4 — Persistence (ROADMAP M4 + 🔸 currency ledger)
- **Deliverables:** PostgreSQL + Prisma (เวอร์ชันตาม ADR 001); Account, Character (มี lease), CharacterStats, ItemInstance, InventorySlot, CurrencyLedger, AuditEvent; save หรือ load ตาม ADR 005; auth ระดับ test ตาม ADR (ใช้ library ที่ใช้แพร่หลาย); migration + seed; เอกสาร backup/restore
- **Exit criteria:** (1) relog แล้ว level, XP, inventory และ currency ตรงเดิม ตำแหน่งกลับไปที่ checkpoint ล่าสุด (2) integration test ส่ง reward request ซ้ำแล้วเกิดผลครั้งเดียว และย้าย item พร้อมกัน 2 คำสั่งแล้วสำเร็จได้ไม่เกิน 1 (3) kill process ของ server ระหว่างเล่นแล้วไม่มี dupe (ตรวจด้วย query) (4) ใช้ตัวละครเดียวกันเข้า 2 client พร้อมกันไม่ได้ (5) migration จาก DB ว่างทำซ้ำได้ และซ้อม restore ใน local 1 ครั้งพร้อมบันทึกผล → **จบ M4 = VS0 ผ่าน (หัวข้อ 10)**

### M5 — Occult Gameplay Slice (ตาม ROADMAP M5 + 🔸 shop/craft)
- **ก่อนเริ่ม:** ปิด D-02, D-03, D-09; เขียน `QUEST_AND_INTERACTION_SPEC.md` (C-09); ตาราง skill → path (C-08)
- **Deliverables:** Yantra Adept / Spirit Medium paths (summon อาจยังเลื่อนไป), enemy 3 ประเภท + boss 1 ตัว, tattoo/amulet loadout, investigation quest + hunt quest, 🔸 NPC shop + craft 1 สูตร (C-11)
- **Exit criteria:** เล่นครบ loop ตั้งแต่รับเควสต์ถึงอัปเกรดตัวละครได้ด้วย 2 path, test ของ shop และ craft ตาม TEST §5 ผ่าน, ทุก encounter มีตาราง GDD §10 ครบ

### M6 — Vertical Slice Polish (ตาม ROADMAP M6)
- **Exit criteria เพิ่ม:** ผู้ทดสอบใหม่ 3 คน (ไม่ใช่ผู้พัฒนา) จบ tutorial และ hunt แรกได้โดยไม่ต้องช่วย, ผ่าน cultural review checklist (R-24), asset ทุกชิ้นมี provenance ใน manifest (ART §6)

### M7 — Closed Test (ตาม ROADMAP M7 + 🔸 threat เรื่อง botting R-09 และ PDPA)
- **Exit criteria:** `prompts/07_RELEASE_CHECK.md` ให้ผล Go พร้อมหลักฐาน, ไม่มีบั๊ก Critical ด้าน security หรือ data-loss ค้าง, ซ้อม restore ใน staging แล้ว

### M8 — Expand Carefully (ตาม ROADMAP M8 เดิม)

### การดูแลรักษาตลอดทุก milestone
- จบแต่ละ milestone ให้รัน `prompts/08_DOC_SYNC.md` และ `prompts/03_CODE_REVIEW.md`, อัปเดต risk register และ commit checkpoint
- 1 งาน = 1 objective ตาม template ใน `AI_WORKFLOW.md §3` และห้ามเปิดระบบใหญ่หลายระบบพร้อมกัน (ROADMAP L75)

---

## 10. Recommended First Vertical Slice — "VS0: ศาลร้างชายป่า"

> **[R]** ทั้งหมด เป็นเกมตัวอย่างที่เล็กที่สุดที่ยังทดสอบได้ครบ 5 ข้อที่ผู้ใช้กำหนด คือ **เข้าโลก, เคลื่อนที่, เห็นผู้เล่นอื่น, ต่อสู้ด้วยระบบหลัก และบันทึกความคืบหน้าได้อย่างตรวจสอบได้** โดยกระจายงานเป็นเนื้อหาของ M1–M4

### 10.1 ขอบเขต (In scope)
| ด้าน | VS0 | เหตุผล |
|---|---|---|
| โลก | 1 zone ขนาดเล็ก ("ลานศาลร้าง") มีพื้นเดินได้, ขอบเขตห้ามเดิน และ occluder 3 แบบ (กำแพงศาล, ต้นไม้, ชายคา) | ทดสอบ R-02 และ R-03 ซึ่งเป็นความเสี่ยงที่อาจต้องรื้อระบบ |
| เข้าโลก | หน้า login → ตัวละคร 1 ตัวต่อบัญชี (สร้างอัตโนมัติ) → เข้า room | ขั้นต่ำของ account/session |
| ผู้เล่น | 2–4 คนใน room เดียว | GDD L37 ให้กำหนด capacity ด้วยการ profile |
| ตัวละคร | 1 แบบ (Yantra Adept อย่างง่าย) sprite placeholder 4 ทิศ: idle, walk, cast, hit, death | D-23, D-07 |
| การเคลื่อนที่ | WASD + เมาส์เล็ง, server ตัดสินตำแหน่ง, ทำนายเฉพาะตัวเอง | D-15, D-16 |
| Combat | 3 skills ครอบคลุม target mode หลัก: `yantra_bolt` (target), `seal_burst` (area + telegraph), `ward_step` (dodge + i-frame ที่ server) | ครอบคลุม hybrid combat ตาม COMBAT §2 ด้วยจำนวนน้อยที่สุด |
| Enemy | 1 ชนิด ("วิญญาณเร่ร่อน" placeholder) มีท่าโจมตี 1 ท่าแบบ telegraph วงกลม, AI FSM แบบ idle → aggro → attack, respawn ตาม timer | GDD §10 และ COMBAT §7 |
| รางวัล | ฆ่าแล้วได้ XP + item วัตถุดิบ 1 ชนิดแบบ personal loot ตามการมีส่วนร่วม | D-05 |
| การบันทึก | level, XP, inventory และ checkpoint ตำแหน่งลง PostgreSQL ตาม ADR 005 | D-21 |
| UI | HP/resource, skill bar 3 ช่อง + cooldown, target indicator, inventory แบบรายการ, ข้อความเหตุผลเมื่อสกิลถูกปฏิเสธ | GDD L39 และ L99 |
| Observability | structured log, tick p50/p95, จำนวน request ที่ถูกปฏิเสธ, audit event ของ loot | TECH §9 และ NETWORK §7 |

### 10.2 นอกขอบเขต (Out of scope) ของ VS0
Spirit Medium, summon, tattoo/amulet, quest, NPC shop, crafting, currency, การเปลี่ยน zone, party, chat, PvP, sprite 8 ทิศ, Spine, เสียง, mobile, admin panel และ auth ระดับ production

### 10.3 Acceptance Criteria (วัดได้และทำเป็นอัตโนมัติได้ ยกเว้นที่ระบุว่า manual)
1. **เข้าโลก:** Playwright 2 browser context ใช้ test account 2 บัญชี (จาก seed) login แล้วเข้า room เดียวกันได้สำเร็จ ส่วนบัญชีที่ token ไม่ถูกต้องเข้า room ไม่ได้
2. **เคลื่อนที่:** ส่ง input ทิศทางเป็นเวลา N tick แล้วระยะที่ server บันทึกไม่เกิน `maxSpeed × เวลาของ server`, การเดินเข้าพื้นที่ห้ามเดินถูกปฏิเสธ และ hash ของ walkable data ฝั่ง client ตรงกับฝั่ง server
3. **เห็นผู้เล่นอื่น:** client B เห็นตัวละคร A และตำแหน่งหลังหยุดเดินตรงกับ server ภายใน tolerance ของ ADR 004 เมื่อ A ออก ตัวละครของ A หายจาก B อย่างถูกต้อง
4. **ต่อสู้:** A ใช้ `yantra_bolt` กับ enemy แล้ว HP สุดท้ายของ enemy ที่ client A, client B และ server ตรงกัน, `seal_burst` แสดง telegraph ก่อน resolve ครบ windup และผลโดนคำนวณที่ server, `ward_step` ใน i-frame window ไม่โดน damage ตาม test ฝั่ง server
5. **กันโกง:** การส่ง field `damage`, skill ที่ยังติด cooldown, เป้าหมายเกินระยะ และ `requestId` ซ้ำ ไม่เปลี่ยน state และได้ `SkillRejected{reason}` ที่ถูกต้อง, การส่ง message ผิดรูปแบบหรือใหญ่เกินไม่ทำให้ room ล่ม
6. **บันทึกอย่างตรวจสอบได้:** หลังฆ่า enemy มี row ของ `ItemInstance` 1 row ต่อผู้มีสิทธิ์ ผูกกับ `sourceEventId` ที่เป็น unique และมี `AuditEvent` คู่กัน ซึ่ง query ใน DB ตรวจได้
7. **Relog:** ปิด browser แล้วเปิดใหม่และ login ได้ XP, level และ inventory ตรงเดิม ตำแหน่งอยู่ที่ checkpoint ล่าสุด
8. **Crash safety:** kill process ของ server ระหว่างต่อสู้แล้ว restart ไม่มี item ซ้ำ ส่วนข้อมูลที่ไม่มีมูลค่าหายได้ไม่เกินช่วง checkpoint ตามที่ ADR 005 เขียนไว้
9. **Concurrency:** ตัวละครเดียวกัน login จาก 2 client พร้อมกันแล้วสำเร็จได้ไม่เกิน 1 session
10. **Visual (manual):** เช็กลิสต์ TEST §6 ได้แก่ foot pivot, sort หลัง occluder 3 แบบ, VFX ไม่บัง telegraph และ asset ที่หายแสดง fallback โดยไม่ crash พร้อมภาพหน้าจอแนบ
11. **Metrics:** บันทึก tick p50/p95 ที่ 2 และ 4 client และ frame time ของ benchmark scene พร้อมเงื่อนไขตาม TEST §7 เพื่อใช้เป็น baseline
12. **Quality gates:** `typecheck`, `lint`, `test`, `build` และ `e2e` ผ่านใน CI และครบ 10 ข้อของ TEST §2

### 10.4 สคริปต์ demo สำหรับยืนยันด้วยตนเอง
1. `pnpm db:reset && pnpm db:seed` → 2. `pnpm dev` → 3. เปิด browser 2 หน้าต่าง login ด้วย test account → 4. เดินอ้อมศาลเพื่อตรวจ occlusion → 5. ทั้งสองคนตี enemy ตัวเดียวกัน → 6. ตรวจว่าทั้งสองคนได้ item และ `SELECT` ใน DB ตรงกัน → 7. ปิดและเปิดใหม่ → ข้อมูลยังอยู่ → 8. kill server ระหว่างต่อสู้ → restart → ตรวจว่าไม่มี dupe
(ชื่อคำสั่งเป็นตัวอย่างที่เสนอ ยังไม่มี script จริงใน repository)

### 10.5 เหตุผลที่ VS0 เล็กพอสำหรับ solo developer
- ทดสอบความเสี่ยงที่อาจต้องรื้อระบบได้ครบ (R-01, R-02, R-03, R-05, R-07) ก่อนลงทุนกับ art และ content
- ระบบ occult ทั้งหมดต่อยอดได้โดยไม่ต้องแก้โครง เพราะ skill, item และ enemy เป็น data ใน `game-data` และ rules อยู่ใน `game-rules`
- แต่ละข้อของ acceptance criteria แยกเป็นงานให้ AI ได้ทีละ 1 task ตาม template ใน `AI_WORKFLOW.md §3`

---

## ภาคผนวก A — งานที่ต้องได้รับคำสั่งหรืออนุมัติจากผู้ใช้ก่อนเริ่ม M0
1. เลือก repo root (C-03 / D-13) และอนุญาตให้ `git init`
2. เลือกตำแหน่งเอกสารต้นฉบับ (C-01 / D-32) และอนุญาตให้ลบสำเนาที่ซ้ำ
3. ตอบว่ามีโค้ดเกมหรือ asset อยู่ที่อื่นหรือไม่ (หัวข้อ 7.2 Unknown)
4. ตัดสิน D-01 (PvE) และ D-05 (loot) หรือยอมรับค่าเริ่มต้นที่แนะนำ
5. อนุญาตให้ติดตั้ง pnpm และเลือกวิธีรัน PostgreSQL (D-28)

## ภาคผนวก B — คำสั่งตรวจสอบที่รันในการ audit นี้ (อ่านอย่างเดียวทั้งหมด)
- `find`, `wc -l -c`, `md5sum`, `cmp`, `ls -la`, `file` ใน `KhamangWet_FullSystem/`
- `git rev-parse --is-inside-work-tree` (ล้มเหลว: ไม่ใช่ git repo)
- `git|node|npm|pnpm|corepack|docker|psql|blender --version`
- `npm view <pkg> version time.modified engines.node dist-tags license` และ `npm search` (ข้อมูลสาธารณะจาก npm registry)
- `curl https://nodejs.org/dist/index.json` (สถานะ LTS)
- **ไม่ได้รัน:** การติดตั้ง package, build, test, migration และคำสั่งที่แก้ไขไฟล์ (นอกจากการสร้างรายงานนี้)
