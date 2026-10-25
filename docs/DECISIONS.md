# DECISIONS — Khamang Wet Decision Log

- **สร้างเมื่อ:** 2026-10-26 · **สถานะเอกสาร:** Draft · **การตัดสินใจที่ผู้พัฒนาอนุมัติแล้ว:** DEC-040 (Art Direction 2.5D HD-2D, 2026-10-26) · DEC-045 (paper-doll ตาม equipment, 2026-10-26) · DEC-058 (VP0-c เทียบ A3-B กับ A1-L และยังไม่ซื้อ Spine, 2026-10-26) · **มอบอำนาจให้ผู้ตรวจตัดสิน (2026-10-26):** DEC-001 ถึง 008, 011, 012, 013, 033, 034, 039 (ดู §4.0)
- **ที่มา:** `PROJECT_ONBOARDING_REPORT.md` (รหัส C-xx = ข้อขัดแย้ง, D-xx = การตัดสินใจที่ขาด, R-xx = ความเสี่ยง) และเอกสารต้นฉบับ
- **ความสัมพันธ์กับ ADR:** `TECHNICAL_ARCHITECTURE.md §10` (L146–147) กำหนดให้ใช้ `docs/adr/NNN-title.md` ไฟล์นี้จึงทำหน้าที่เป็น**ทะเบียนกลาง (register)** ของทุกการตัดสินใจ เมื่อ entry ใดได้สถานะ **Accepted** และมีผลระยะยาว ให้เขียน ADR เต็มแล้วลิงก์กลับมาที่นี่ โดยเก็บไว้ที่นี่แค่บทสรุป เพื่อไม่ให้เนื้อหาซ้ำกัน

### สถานะ (Status)
| สถานะ | ความหมาย |
|---|---|
| **Locked** | กำหนดไว้แล้วในเอกสารต้นฉบับ เปลี่ยนได้ด้วย ADR ใหม่เท่านั้น |
| **Accepted** | ผู้พัฒนาอนุมัติแล้ว (ระบุวันที่และผู้อนุมัติ) |
| **Accepted (delegated)** | ผู้พัฒนามอบให้ผู้ตรวจตัดสิน ("ตัดสินใจได้เลย") โดยบันทึกเหตุผลและผลกระทบไว้ และผู้พัฒนากลับคำตัดสินได้ทุกเมื่อ |
| **Accepted (conditional)** | ตัดสินกติกาแล้ว แต่ตัวเลขหรือเวอร์ชันสุดท้ายรอผล spike ที่ระบุ |
| **Proposed** | มีข้อเสนอแนะ **[R]** และรออนุมัติ |
| **Open** | ต้องการข้อมูลหรือความเห็นจากผู้พัฒนา หรือต้องทำ spike ก่อน ยังไม่มีค่าเริ่มต้นที่มั่นใจ |
| **Superseded** | ถูกแทนที่ (ระบุ ID ที่มาแทน) |

ป้ายในเนื้อหา: **[F]** = ข้อเท็จจริงที่ตรวจแล้ว · **[R]** = ข้อเสนอแนะ · **[?]** = ต้องตรวจสอบ

> **กฎของไฟล์นี้:** ห้ามเปลี่ยนสถานะเป็น Accepted โดยไม่มีคำยืนยันจากผู้พัฒนา ห้ามลบ entry ให้เปลี่ยนเป็น Superseded แทน และถ้าเอกสารขัดแย้งกัน ให้บันทึกที่นี่ก่อนแก้เอกสารใด ๆ

---

## 1. สรุปสถานะทั้งหมด

| ID | เรื่อง | สถานะ | ต้องปิดก่อน | อ้างอิงรายงาน |
|---|---|---|---|---|
| DEC-L1…L7 | Product direction ที่ล็อกแล้ว | Locked | — | prompts/01 L9–16 |
| DEC-001 | Repo root และการเริ่ม Git | **Accepted (delegated)** · ✔ ทำแล้วใน M0-T02 (`ce6117d`, `c8cbe36`) | M0 | C-03, C-24, D-13 |
| DEC-002 | ตำแหน่งเอกสารต้นฉบับ (ลบไฟล์ซ้ำ) | **Accepted (delegated)** · ✔ ทำแล้วใน M0-T03 | M0 | C-01, C-02, D-32 |
| DEC-003 | นโยบาย pin เวอร์ชัน dependency | **Accepted (delegated)** | M0 | D-14, R-17, R-18 |
| DEC-004 | Node.js runtime line | **Accepted (delegated)** | M0 | หัวข้อ 8 ของรายงาน |
| DEC-005 | pnpm major และนโยบาย build script | **Accepted (delegated, conditional: M0-T06)** | M0 | หัวข้อ 8 |
| DEC-006 | TypeScript major (7.x หรือก่อนหน้า) | **Accepted (delegated, conditional: M0-T06)** | M0 | R-18 |
| DEC-007 | Colyseus 0.18 / schema 5 / sdk | **Accepted (delegated, conditional: M0-T06)** | M0 | R-18 |
| DEC-008 | Prisma major และ path ของ schema/migrations | **Accepted (delegated)** | M0 | R-17, C-18 |
| DEC-009 | PostgreSQL ใน local (เครื่องมือและเวอร์ชัน) | Open | M3 | D-28, R-23 |
| DEC-010 | Lint, format และ import boundary | Open | M0 | D-27 |
| DEC-011 | CI provider และ pipeline | **Accepted (delegated)** — GitHub Actions | M0 | D-27 |
| DEC-012 | Branching, rollback และ recovery | **Accepted (delegated)** | M0 | R-20 |
| DEC-013 | Automated test stack และ determinism | **Accepted (delegated)** | M0 | R-22 |
| DEC-014 | Animation runtime: A3-B (Blender → glTF) · A1-L (สำรอง) · ~~A3-S (Spine)~~ พักไว้ตาม DEC-058 | **Open** (เปิดใหม่เพราะ DEC-040 และตัดสินจาก VP0-c · **ให้น้ำหนัก runtime skeletal** ตาม DEC-045) | ก่อนผลิต animation ชุดเต็ม (M1-T20) | D-23, R-19, ภาคผนวก C |
| DEC-015 | วิธีทำ depth sorting และ occlusion | Open (ตัดสินจาก spike) | M1 gate | R-03 |
| DEC-016 | รูปแบบ collision/walkable data ที่ใช้ร่วมกัน | Proposed | M1 | D-17, R-02 |
| DEC-017 | Multiplayer authority และ netcode model | Proposed | M2 (contracts), M3 | D-16, D-18, C-14, C-15 |
| DEC-018 | Lag compensation และ i-frames | Proposed | M2 | D-19, R-05 |
| DEC-019 | Persistence write strategy และ character lease | Proposed | M3 (ออกแบบ) | D-21, C-23, R-01, R-07 |
| DEC-020 | Auth ใน M3 (dev) และ M4 (test) | Proposed / Open | M3 | C-04, D-22 |
| DEC-021 | MVP เป็น PvE เท่านั้น | Proposed | M2 | D-01, C-06 |
| DEC-022 | กติกา loot และ credit | Proposed | M3 | D-05, C-05 |
| DEC-023 | Stat model ขั้นต่ำสำหรับ VS0 | Proposed (ชื่อยัง Open) | M2 | D-03 |
| DEC-024 | Death และ respawn ใน VS0 | Proposed | M2 | D-04 |
| DEC-025 | จุดเริ่มนับ cooldown | Proposed | M2 | D-20 |
| DEC-026 | Control scheme การเดิน | Proposed | M1 | D-15 |
| DEC-027 | ล็อกกล้องไม่ให้หมุนตลอด MVP | Proposed | M1 | C-16 |
| DEC-028 | ~~ไม่มี paper-doll ใน MVP~~ | **Superseded by DEC-045** (ผู้พัฒนา, 2026-10-26) | — | D-07, R-04 |
| DEC-029 | เป้าหมาย performance และวิธีวัด | Proposed (ตัวเลขเป็นสมมติฐาน) | M1 | TEST §7 |
| DEC-030 | รูปแบบ game-data และ content versioning | Proposed | M2 | D-26, R-14 |
| DEC-031 | React ↔ Babylon state bridge และ in-world UI | Proposed | M1 | D-25 |
| DEC-032 | การแสดงผลภาษาไทยและ font | Open | M1 | D-10 |
| DEC-033 | การตั้งค่า Claude Code สำหรับ M0–M1 | **Accepted (delegated)** · A.1 `CLAUDE.md` ทำแล้วใน M0-T04 · A.2 rules ทำแล้วใน M0-T05 · A.3 ถึง A.5 รอ M0-T14 | M0 | C-19, C-20, C-21 |
| DEC-034 | ลำดับชั้นเอกสาร Definition of Done | **Accepted (delegated)** | M0 | ภาคผนวก B |
| DEC-035 | Asset provenance รวมถึง asset ที่ AI สร้าง | Open | M1 (placeholder), M6 | D-24 |
| DEC-036 | Browser support matrix | Proposed | M1 | D-31 |
| DEC-037 | Observability ขั้นต่ำ | Proposed | M3 | D-30 |
| DEC-038 | Class model (archetype หรือ build path) | Open (ไม่บล็อก VS0) | M5 | D-02, C-07 |
| DEC-039 | Remote repository และ backup นอกเครื่อง | **Accepted (delegated)** — GitHub private repo (สร้าง repo และ push ครั้งแรกต้องให้ผู้พัฒนาทำหรืออนุมัติ) | M0 | — |
| **DEC-040** | **Art Direction: 2.5D HD-2D** | **Accepted (ผู้พัฒนา, 2026-10-26)** | — | ART_BIBLE §0 |
| DEC-041 | Pitch ของกล้องและช่วงซูม | Open (VP0-a) | ก่อน M1-T13 | VP0 §6 |
| DEC-042 | 4 หรือ 8 ทิศ + นโยบาย mirror | Open (VP0-b) | ก่อนผลิตจำนวนมาก | VP0 §6 |
| DEC-043 | วิธีผลิตตัวละครและเครื่องมือ (Blender สำหรับ rig ตาม DEC-058 และ texture packer) | Open (VP0-c) | ก่อน M1-T20 | VP0 §2.3, ภาคผนวก C |
| DEC-044 | เครื่องมือช่วยความอ่านง่าย (rim, hero light, ring, lighting floor) | Open (VP0-a/b) | ก่อนผลิตจำนวนมาก | ART_BIBLE §3.3 |
| **DEC-045** | **การเปลี่ยนชุด: paper-doll ตาม equipment ระหว่างเล่น** | **Accepted (ผู้พัฒนา, 2026-10-26)** | — | ART_BIBLE §4.3 |
| DEC-046 | ความละเอียดของ sprite และ texel density | Open (VP0-a/b) | ก่อนผลิตจำนวนมาก | ASSET_PIPELINE §4 |
| DEC-047 | โมเดลแสงและเงาของ sprite | Open (VP0-a) | ก่อน M1-T13 | VP0 §2.2 |
| DEC-048 | Post-processing, quality tiers และเครื่อง min-spec | Open (VP0-a + ผู้พัฒนา) | ก่อน VP0 review | VP0 §2.4 |
| DEC-049 | วิธีสร้าง VFX และ intensity tiers | Open (VP0-b) | ก่อนผลิต VFX จำนวนมาก | ASSET_PIPELINE §8 |
| DEC-050 | แสงในฉากแบบ baked หรือ dynamic | Open (VP0-a) | ก่อนผลิตฉากจำนวนมาก | ASSET_PIPELINE §7 |
| DEC-051 | ที่เก็บไฟล์ต้นฉบับ (Git LFS หรือนอก git) | **Open (ผู้พัฒนา)** | ก่อน M1-T03 | ASSET_PIPELINE §14 |
| DEC-052 | Font ไทยและโลโก้ | **Open (ผู้พัฒนา)** | ก่อน M1-T17 | ART_BIBLE §6 |
| DEC-053 | แนวทางด้านวัฒนธรรมและผู้ตรวจ | **Open (ผู้พัฒนา)** | ก่อน M1-T13 | ART_BIBLE §3.4 |
| DEC-054 | เครื่องมือของ Blender pipeline (ติดตั้ง Blender, glTF compression, lightmap bake และ export ของ A3-B) | Open | ก่อน M1-T16 หรือ M1-T19 (อันไหนมาก่อน) | ASSET_PIPELINE §7, §6.5 |
| DEC-055 | Roster ของ MVP เทียบกับภาพอ้างอิง และ UI ที่อยู่นอกขอบเขต | **Open (ผู้พัฒนา)** | ก่อนผลิตจำนวนมาก | ART_BIBLE §2 |
| DEC-056 | กำลังการผลิต art และงบ | **Open (ผู้พัฒนา)** | **ก่อน VP0-b** | VP0 §6, RA-01 |
| DEC-057 | Visual equipment slots, ลำดับชั้น (draw order) และการแสดงรอยสัก | Open (ผู้พัฒนาร่วมกับ VP0-c) | ก่อน M1-T13 | ART_BIBLE §4.3 |
| **DEC-058** | **VP0-c เทียบ A3-B กับ A1-L ก่อน และยังไม่ยอมรับค่า Spine (G1 ของ A3-S)** | **Accepted (ผู้พัฒนา, 2026-10-26)** · ทบทวนได้ | — | ภาคผนวก C.1 |

**การตัดสินใจที่เลื่อนออกไปโดยตั้งใจ (Deferred, ไม่บล็อก VS0):** D-06 การ spawn (VS0 ใช้ timer), D-08 จำนวนตัวละครต่อบัญชี (VS0 = 1), D-09 ritual/investigation (M5), D-11 cultural review และชื่อเกม (M6), D-12 business model (M7), D-33 hosting (M6)

---

## 2. Locked Product Direction (จากเอกสารต้นฉบับ)

**[F]** ที่มา: `prompts/01_MASTER_SYSTEM_PROMPT.md` §Locked Product Direction (L9–16) และสอดคล้องกับ `GAME_VISION_GDD.md §2` (L6–13)

| ID | Decision | ที่มา |
|---|---|---|
| DEC-L1 | Platform: Web PC first, keyboard/mouse | prompts/01 L10; GDD L7 |
| DEC-L2 | Rendering: 3D isometric world + 2D HD characters | prompts/01 L11; GDD L9 |
| DEC-L3 | Combat: hybrid target-based + directional/area | prompts/01 L12; GDD L10 |
| DEC-L4 | World: zone-based rooms (ไม่ใช่ seamless) | prompts/01 L13; GDD L11 |
| DEC-L5 | Online model: authoritative server | prompts/01 L14; TECH §3 |
| DEC-L6 | Development: solo developer + AI | prompts/01 L15; GDD L12 |
| DEC-L7 | Architecture: TypeScript monorepo + modular monolith | prompts/01 L16; TECH §1 L4 |

**[F]** Tech stack **ยังไม่ Locked** เพราะ README L15 เขียนว่า "proposed; validate before locking" และ prompts/01 L18 เขียนว่า "Proposed Stack — Verify Against Repository" จึงอยู่ใน DEC-003 ถึง DEC-008

---

## 3. Pre-VS0 Confirmation Gate

> สิ่งที่**ต้องยืนยัน**ก่อนเริ่มสร้าง Vertical Slice แรก (เริ่ม M1) แยกตาม 5 หมวดที่ผู้พัฒนากำหนด แต่ละข้อมีป้ายว่าบล็อก milestone ไหน ข้อที่ยืนยันแล้วให้ติ๊ก ☑ พร้อมวันที่

### 3.1 Stack
- ☑ **DEC-003** นโยบาย pin เวอร์ชัน (exact pins, commit lockfile, ห้ามติดตั้งจาก tag `latest`) — Accepted (delegated) 2026-10-26
- ☑ **DEC-004** Node 24 LTS — Accepted (delegated) 2026-10-26
- ◐ **DEC-005** pnpm major — ตัดสินกติกาแล้ว และเวอร์ชันจริงรอ M0-T06
- ◐ **DEC-006** TypeScript major — ตัดสินกติกาแล้ว (7.x ถ้าผ่าน) และรอ M0-T06
- ◐ **DEC-007** Colyseus 0.18 line — ตัดสินแล้ว และรอผล spike ใน M0-T06
- ☐ **DEC-010** linter/formatter + import boundary — บล็อก M0
- ☐ เวอร์ชันของ Babylon.js, Vite, React, Zod, Vitest และ Playwright ที่จะ pin (บันทึกใน ADR-001) — บล็อก M0

### 3.2 Animation Runtime
- ☐ **DEC-014** animation runtime — **Open** (VP0-a ใช้ sprite-sheet placeholder ส่วนการตัดสินจริงมาจาก VP0-c ตามที่ DEC-040 กำหนด)
- ☐ มาตรฐาน pivot ที่เท้า, world unit ต่อพิกเซล, ขนาด frame และ frame rate (ART §2 ข้อ 1) — บล็อก M1-T03
- ☐ **DEC-028** ไม่มี paper-doll — บล็อก M1
- ☐ **DEC-035** แหล่งที่มาและ license ของ placeholder art — บล็อก M1-T03
- ☐ **DEC-015** วิธี depth sorting (ตัดสินหลัง spike M1-T06 ไม่ใช่ก่อน)
- ☑ **DEC-040** Art Direction 2.5D HD-2D — Accepted 2026-10-26
- ☐ **DEC-041** pitch ของกล้อง **ต้องล็อกก่อนวาดตัวละครคุณภาพจริง** (VP0-a)
- ☑ **DEC-045** paper-doll ตาม equipment — Accepted 2026-10-26
- ☐ **DEC-056** กำลังการผลิต art (ผู้พัฒนา) · ☐ **DEC-057** visual slots และ draw order
- ☐ รายการตัดสินใจทั้งหมดก่อนผลิต asset จำนวนมาก: `VISUAL_PROTOTYPE_PLAN.md §6`

### 3.3 Multiplayer Authority
- ☐ **DEC-017** server เป็นผู้ตัดสินผลทั้งหมด, client ทำนายเฉพาะการเดินของตัวเอง, `MoveInput` ไม่มี duration — บล็อก M2 (contracts)
- ☐ **DEC-018** ไม่มี rewind ใน VS0 และกำหนด grace window ของ i-frame — บล็อก M2
- ☐ **DEC-016** walkable data ไฟล์เดียวที่ client และ server ใช้ร่วมกัน — บล็อก M1
- ☐ **DEC-020** dev auth ผ่าน `AuthProvider` ใน M3 — บล็อก M3
- ☐ **DEC-021** PvE เท่านั้น และ **DEC-022** personal loot — บล็อก M2 และ M3

### 3.4 Database
- ☑ **DEC-008** Prisma 7.x stable (CLI และ client เวอร์ชันเดียวกัน) + schema อยู่ที่ `database/` — Accepted (delegated) 2026-10-26
- ☐ **DEC-009** วิธีรัน PostgreSQL ใน local และ major version — บล็อก M3/M4
- ☐ **DEC-019** DB-first สำหรับข้อมูลที่มีมูลค่า + character lease + checkpoint — บล็อก M3 gate
- ☐ นโยบายเก็บ idempotency key (R-16) — บล็อก M4

### 3.5 Performance Targets
- ☐ **DEC-029** วิธีวัด (benchmark scene, เงื่อนไข, ตัวชี้วัด) — บล็อก M1
- ☐ ฮาร์ดแวร์อ้างอิง 2 ระดับ (ระดับเครื่องพัฒนาและระดับ min-spec) — บล็อก M1
- ☐ **DEC-036** browser เป้าหมาย — บล็อก M1
- ☐ ยอมรับว่าตัวเลขเป้าหมายเป็น**สมมติฐาน**ที่จะยืนยันหลังวัด baseline (TEST §7 L62) — บล็อก M1

---

## 4. Decision Entries (รายละเอียด)

### 4.0 ผลการตัดสินรอบ M0-T01 (2026-10-26) — ผู้พัฒนามอบอำนาจ
**ที่มา:** ผู้พัฒนาตอบในแชตว่า "ตัดสินใจได้เลย" ต่อรายการ M0-T01 · ผู้ตรวจจึงตัดสินตามข้อเสนอ **[R]** ในแต่ละ entry และบันทึกเหตุผลกับผลกระทบไว้ด้านล่าง · **ผู้พัฒนากลับคำตัดสินข้อใดก็ได้** (ให้เปลี่ยน entry เป็น Superseded พร้อมเหตุผล)

| DEC | ผลการตัดสิน | เหตุผล | ผลกระทบ | สิ่งที่ยังต้องให้ผู้พัฒนาทำหรืออนุมัติ |
|---|---|---|---|---|
| **001** | Repo root = `E:\KhamangWet\KhamangWet_FullSystem` · branch `main` (ใช้ `git init -b main` เพราะ default ของเครื่องคือ `master`) · `.gitattributes` (`* text=auto eol=lf`) + `.gitignore` · **commit 1** = ไฟล์ต้นฉบับ 34 ไฟล์โดยไม่แก้ไข · **commit 2** = รายงานและเอกสาร foundation และ art | ไม่ต้องย้ายไฟล์, `.claude/` อยู่ที่ root อยู่แล้ว, ย้อนกลับได้ และ baseline ตรวจด้วย md5 ได้ | `E:\KhamangWet` เป็นแค่โฟลเดอร์ที่ครอบอยู่ · ไฟล์ทั้งหมดเป็น LF และไม่ถูกแปลงแม้ `core.autocrlf=true` | **git identity:** `user.name` และ `user.email` ยังไม่ได้ตั้ง ผู้พัฒนาต้องตั้งเองหรือบอกค่าให้ตั้งแบบ local ใน repo · **คำสั่งเริ่ม M0-T02** |
| **002** | `docs/` เป็นต้นฉบับ · ลบสำเนา 10 ไฟล์ที่ root **ใน commit แยก** หลังตรวจ md5 ซ้ำ · ย้าย `PROJECT_ONBOARDING_REPORT.md` เข้า `docs/` ใน commit เดียวกัน · คง `README.md` และ `CLAUDE_TEMPLATE.md` ไว้ที่ root · แก้ path ใน README Contents และ TECH §5 โดยแสดง diff ก่อน commit | ตรงกับ CLAUDE_TEMPLATE L7 และ TECH §5 และเอกสารใหม่ทั้งหมดอยู่ใน `docs/` แล้ว | link ที่อ้างถึงไฟล์ที่ root จะเปลี่ยน (ต้องตรวจ link ทั้งหมดใน M0-T03) · ถ้า md5 ของคู่ใดต่างกันให้หยุดและรายงาน | ไม่มี (ทำใน M0-T03 พร้อมแสดง diff) |
| **003** | ตามข้อเสนอเดิม: exact pin, commit lockfile, `--frozen-lockfile` ใน CI, `packageManager` + `engines`, **ห้ามติดตั้งจาก tag `latest`**, อัปเดตเฉพาะตอนจบ milestone ใน branch แยก | ป้องกัน Prisma CLI 8 RC ที่ถูก tag เป็น `latest` (R-17) และ API คนละรุ่น (R-18) | ได้แพตช์ช้าลง และต้องมีรอบอัปเดตตามกำหนด | ไม่มี |
| **004** | Node **24 LTS** · `engines.node = ^24.19.0` · มี `.node-version` · ควรอัปเดตเครื่องเป็น patch ล่าสุดของ 24.x (24.22.1 ณ วันตรวจ) ก่อน M0-T06 | เป็น LTS, เครื่องมี 24.19.0 อยู่แล้ว และ engines ของทุก package ที่เสนอรองรับ | Node 26 จะทบทวนตอนจบ M4 | การอัปเดต Node ในเครื่องต้องให้ผู้พัฒนาทำหรืออนุมัติ (ไม่บังคับ เพราะ 24.19 ผ่าน engines) |
| **005** | pnpm major ล่าสุดที่ stable ณ วันทำ M0-T06 (12.x ณ วันตรวจ) pin แบบ exact ใน `packageManager` และติดตั้งผ่าน corepack (มี 0.35.0) · กำหนด allowlist ของ build script (เช่น Prisma, esbuild) **ถ้า spike พบปัญหาให้ใช้ major ก่อนหน้าที่ผ่าน** | ใช้รุ่นปัจจุบันโดยมีทางถอย | conditional: เวอร์ชันจริงบันทึกใน ADR-001 | การติดตั้ง pnpm ต้องได้รับอนุมัติ (M0-T07) |
| **006** | TypeScript **7.x** ถ้าผ่าน 5 ข้อของ M0-T06 (decorator ของ `@colyseus/schema`, linter, React plugin ของ Vite, type ของ Prisma client, Vitest) **ถ้าไม่ผ่านให้ใช้ major ล่าสุดที่ผ่าน** | ไม่ควรเริ่มโปรเจกต์ใหม่บน major เก่าถ้าเครื่องมือรองรับแล้ว | conditional | ไม่มี |
| **007** | Colyseus **0.18** line + `@colyseus/schema` 5 + `@colyseus/sdk` 0.18 ถ้า spike "1 room + 1 client + state sync + validation" ผ่าน | เป็นรุ่นปัจจุบันและตรงกับชื่อ client SDK ใหม่ | conditional · ต้องอ่าน migration guide | ไม่มี |
| **008** | Prisma **7.x stable** โดย CLI และ client ใช้เวอร์ชันเดียวกันแบบ exact (**ไม่ใช้ 8.0 RC**) · schema อยู่ที่ `database/schema.prisma` และ migration อยู่ใน `database/migrations` · generated client อยู่ใน `.gitignore` | stable และ rule ใน `.claude/rules/database.md` ครอบคลุมตามเดิม (C-18) | ทบทวน Prisma 8 เมื่อ GA และจบ M4 แล้ว | ไม่มี |
| **011** | **GitHub Actions** แบ่ง 3 tier ตาม DoD §6 | ตามมาจาก DEC-039 | CI ใช้ได้หลังมี remote | ตาม DEC-039 |
| **012** | ตามข้อเสนอเดิม: trunk-based, 1 task = 1 branch = 1 squash commit, tag `mN-gate` และ `vs0`, revert ก่อนแก้, migration เดินหน้าอย่างเดียว | revert ง่ายที่สุดสำหรับ solo dev | ประวัติย่อยของ branch หาย | ไม่มี |
| **013** | ตามข้อเสนอเดิม: Vitest, contract test, room test, DB test แบบ disposable, Playwright + debug hook, **RNG และ clock ต้อง inject** | test ทำซ้ำได้ | property-based testing library ยังต้องขออนุมัติแยก | ไม่มี |
| **033** | ตามภาคผนวก A: CLAUDE.md ไม่เกิน ~120 บรรทัด, เพิ่ม rule `shared.md` และ `docs.md`, subagent `reviewer` (read-only), skill `implement-task` และ `verify`, guard hook (Node) + permissions | ใช้รูปแบบที่ตรวจกับเอกสาร Claude Code แล้ว | สร้างใน M0-T04, T05 และ T14 ตามลำดับ (hook และ skill `verify` ทำหลังมีคำสั่งจริง) | ไม่มี |
| **034** | `docs/DEFINITION_OF_DONE.md` เป็นต้นฉบับของเกณฑ์ done | รวมทุกแหล่งไว้ที่เดียว | การแก้เอกสารเดิมให้ชี้มาที่ไฟล์นี้ทำภายหลังพร้อมแสดง diff | ไม่มี |
| **039** | **GitHub private repository** เป็น remote และ backup นอกเครื่อง | ใช้กับ CI ใน DEC-011 ได้ทันที และเป็น private เพราะยังไม่มีแผนเปิด source | ระหว่างที่ยังไม่มี remote มีแค่สำเนาในเครื่องนี้ (ควร backup เอง) | **ผู้พัฒนาต้องสร้าง repo** (ไม่พบ `gh` CLI ในเครื่อง) และ**อนุมัติการ push ครั้งแรก** |

**ยังไม่ตัดสินในรอบนี้ (พร้อมเหตุผล):**
- **DEC-009** (วิธีรัน PostgreSQL ใน local): ยังไม่ต้องใช้จนถึง M3/M4 และต้องติดตั้งซอฟต์แวร์บนเครื่องของผู้พัฒนา
- **DEC-010** (lint และ import boundary): ต้องรู้ TypeScript major จาก M0-T06 ก่อน แต่เกณฑ์ตัดสินกำหนดไว้แล้วใน entry
- **การตัดสินใจด้าน art** (DEC-041 ถึง 057): อยู่นอกขอบเขตของ M0-T01

### DEC-001 — Repo root และการเริ่ม Git
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **ต้องปิดก่อน:** M0 · **Ref:** C-03, C-24, D-13
- **Context [F]:**
  - `E:\KhamangWet` และ `E:\KhamangWet\KhamangWet_FullSystem` ไม่ใช่ git repository (`git status` → `fatal: not a git repository`)
  - เอกสารชุดนี้อยู่ใน `KhamangWet_FullSystem/` ซึ่งมี `.claude/` อยู่ที่ root ของโฟลเดอร์นี้
  - git config บนเครื่องนี้: `core.autocrlf=true`, `init.defaultBranch=master`, ยังไม่ได้ตั้ง `user.name` และ `user.email` (commit จะล้มเหลวจนกว่าผู้พัฒนาจะตั้งค่า)
  - ไฟล์ทั้งหมดใช้ line ending แบบ LF (มี CR 0 ไบต์)
  - ยังไม่พบ `gh` CLI
- **Options:**
  - **A.** ใช้ `KhamangWet_FullSystem/` เป็น repo root (ไม่ต้องย้ายไฟล์ และ `.claude/rules` ทำงานทันที)
  - **B.** ย้ายเนื้อหาขึ้นไปที่ `E:\KhamangWet` (ต้องย้าย 35 ไฟล์ขึ้นไปข้างบน)
  - **C.** สร้างโฟลเดอร์ repo ใหม่แล้วคัดลอกเอกสารเข้าไป (ต้นฉบับยังอยู่ แต่จะมีสำเนาเพิ่มอีกชุด)
- **Trade-offs:** A ปลอดภัยที่สุดและย้อนกลับง่าย แต่ชื่อโฟลเดอร์ยาว · B ได้ root ที่สะอาด แต่ต้องย้ายไฟล์ · C ไม่แตะของเดิมเลย แต่เพิ่มปัญหาไฟล์ซ้ำ (C-01)
- **Recommendation [R]:** **A** ตามแผนด้านล่าง (ยังไม่ได้รัน และต้องได้รับอนุมัติก่อน)
  1. ผู้พัฒนาตั้ง `git config user.name` และ `user.email` เอง (เป็นข้อมูลตัวตนของผู้พัฒนา)
  2. `git init -b main` (หรือ `master` ตามที่ผู้พัฒนาเลือก)
  3. เพิ่ม `.gitattributes` (`* text=auto eol=lf`) เพื่อให้ไฟล์เป็น LF ตลอด เพราะ `core.autocrlf=true` จะแปลงเป็น CRLF ตอน checkout ซึ่งอาจทำให้ shell script และ CI บน Linux มีปัญหา และเพิ่ม `.gitignore` (node_modules, dist, coverage, `.env*`, playwright-report, test-results, log และ path ของ generated client ตาม DEC-008)
  4. **Commit 1 — baseline:** เพิ่ม**เฉพาะ 34 ไฟล์ต้นฉบับโดยไม่แก้ไขอะไร** (รวมไฟล์ที่ซ้ำกัน) แล้วตรวจ md5 ให้ตรงกับรายการ baseline ที่บันทึกไว้ใน `IMPLEMENTATION_STATUS.md §2`
  5. **Commit 2 — foundation docs:** `PROJECT_ONBOARDING_REPORT.md` + 4 ไฟล์ใหม่ใน `docs/` + `.gitattributes` + `.gitignore`
  6. การลบไฟล์ซ้ำ (DEC-002) ทำเป็น commit แยก ให้ย้อนกลับได้ด้วย `git revert` ครั้งเดียว
- **Impact ถ้าล่าช้า:** ไม่มีจุดย้อนกลับ, quality gate ใน TEST §2 ข้อ 10 ("Git diff reviewed") ใช้ไม่ได้ และ regression จากงานของ AI จะตรวจไม่เจอ

### DEC-002 — ตำแหน่งเอกสารต้นฉบับ
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **ต้องปิดก่อน:** M0 · **Ref:** C-01, C-02, D-32
- **Context [F]:** 10 ไฟล์ที่ root เหมือนกับไฟล์ใน `docs/` ทุกไบต์ ณ 2026-10-26 (md5 ตรงกัน) · `README.md` L28–40 อ้างชื่อไฟล์โดยไม่มี path · `CLAUDE_TEMPLATE.md` L7, L44 อ้าง `docs/...` · `TECHNICAL_ARCHITECTURE.md §5` L96–102 อ้าง `docs/GDD.md` (ไม่มีไฟล์ชื่อนี้)
- **Options:** **A.** ใช้ `docs/` เป็นต้นฉบับแล้วลบสำเนาที่ root · **B.** ใช้ root เป็นต้นฉบับแล้วลบ `docs/` และแก้ CLAUDE_TEMPLATE
- **Recommendation [R]:** **A** เพราะตรงกับ CLAUDE_TEMPLATE และ TECH §5 และไฟล์ foundation ใหม่ทั้ง 4 อยู่ใน `docs/` ตามคำสั่งของผู้พัฒนาแล้ว
  - **ขั้นตอนที่ปลอดภัย:** (1) ตรวจ md5 ซ้ำก่อนลบ ถ้าคู่ใดต่างกัน ให้หยุดและรายงาน diff (2) ลบใน commit เดียว (3) แก้ README Contents และ TECH §5 เป็น path จริงพร้อมแสดง diff ให้ผู้พัฒนาดูก่อน commit
- **หมายเหตุ:** การสร้างไฟล์ใหม่ใน `docs/` **ไม่ถือว่า**ปิด DEC-002 แล้ว ตอนนี้สำเนาที่ root ยังไม่ถูกแตะ → **อัปเดต 2026-10-26:** ลบแล้วใน M0-T03

### DEC-003 — นโยบาย pin เวอร์ชัน dependency
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **ต้องปิดก่อน:** M0
- **Context [F]:** tag `latest` ของ `prisma` CLI = `8.0.0-rc.27` ขณะที่ `@prisma/client` = `7.10.1` · `typescript` latest = `7.0.2` · `colyseus` 0.18.x และ client SDK อยู่ที่ `@colyseus/sdk` (`colyseus.js` หยุดที่ 0.16.22) — ตรวจจาก npm เมื่อ 2026-10-25
- **Recommendation [R]:**
  - ใช้ exact version (ไม่ใช้ `^` หรือ `~`) สำหรับ dependency หลักของ runtime และ framework
  - commit lockfile และใช้ `--frozen-lockfile` ใน CI
  - ระบุ `packageManager` และ `engines.node` ใน root `package.json` และใส่ `.node-version` (หรือไฟล์ที่ทีมเลือก)
  - **ห้ามติดตั้งจาก tag `latest`** ต้องระบุเวอร์ชันเสมอ
  - อัปเดต dependency เฉพาะตอนจบ milestone ใน branch แยก พร้อมรัน `pnpm verify`
  - ADR-001 ต้องบันทึกเวอร์ชันพร้อมลิงก์ release notes
- **Trade-off:** ได้แพตช์ความปลอดภัยช้าลง แลกกับ build ที่ทำซ้ำได้และ AI ไม่สับสนระหว่าง API คนละรุ่น

### DEC-004 — Node.js runtime line
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **Context [F]:** เครื่องนี้มี `v24.19.0` · จาก nodejs.org index: 24.x = LTS "Krypton" (ล่าสุด 24.22.1), 22.x = LTS "Jod" (22.23.4), 26.x = 26.12.1 (`lts=false` ณ วันตรวจ) · `engines` ของ colyseus ต้องการ `>= 22.x` ส่วน prisma 8 RC ต้องการ `^24.11.0` และ vitest 5 ต้องการ `^24.0.0`
- **Recommendation [R]:** Node 24 LTS โดยอัปเดตเป็น patch ล่าสุดก่อนเริ่ม M0-T06 · **Open:** จะย้ายไป 26 เมื่อเข้า LTS หรือไม่ (ให้ทบทวนตอนจบ M4)

### DEC-005 — pnpm major และนโยบาย build script
- **Status:** **Accepted (delegated, conditional: M0-T06, 2026-10-26)** → ดู §4.0 · ~~Open~~ · **Context [F]:** ยังไม่ได้ติดตั้ง pnpm แต่มี `corepack 0.35.0` · registry มี `latest` = 12.15.0 และสาย 10.x, 11.x
- **[?] ต้องตรวจ:** พฤติกรรมของ pnpm 12 ต่อ lifecycle script ของ dependency (ตั้งแต่ v10 ไม่รันโดยค่าเริ่มต้น) ซึ่งมีผลต่อ Prisma และ esbuild · วิธีติดตั้งที่ pnpm แนะนำ (corepack หรือ standalone)
- **Recommendation [R]:** เลือก major ที่ผ่าน M0-T06 แล้วกำหนด allowlist ของ package ที่ต้อง build ให้ชัด · ต้องได้รับอนุมัติก่อนติดตั้ง

### DEC-006 — TypeScript major
- **Status:** **Accepted (delegated, conditional: M0-T06, 2026-10-26)** → ดู §4.0 · ~~Open (ต้องทำ spike)~~ · **Context [F]:** `latest` = 7.0.2 (มี `beta` 7.1.0) · TECH §1 L17 ให้ตรวจ compatibility ก่อน pin
- **[?] ต้องตรวจใน M0-T06:** decorator ของ `@colyseus/schema` 5, linter ที่เลือก, React plugin ของ Vite 8, type ของ Prisma generated client และ Vitest 5
- **Options:** **A.** TS 7.x ถ้าผ่านทุกข้อ · **B.** major ก่อนหน้า ถ้ามีเครื่องมือหลักที่ยังไม่รองรับ (ต้องยืนยันชื่อเวอร์ชันจาก registry)
- **Impact:** ถ้าเลือกผิดจะต้องย้ายทั้ง monorepo ภายหลัง ควรตัดสินก่อนมีโค้ดจริง

### DEC-007 — Colyseus line
- **Status:** **Accepted (delegated, conditional: M0-T06, 2026-10-26)** → ดู §4.0 · ~~Proposed (ต้องทำ spike)~~ · **Context [F]:** `colyseus` 0.18.10, `@colyseus/core` 0.18.23, `@colyseus/schema` 5.0.42, `@colyseus/sdk` 0.18.6, `@colyseus/testing` 0.18.6, `@colyseus/loadtest` 0.18.4 (license ของ colyseus เป็น MIT) · ยังเป็น 0.x และมี tag `legacy-0.17`
- **Recommendation [R]:** ใช้ 0.18 line เพราะตรงกับ client SDK ปัจจุบัน แต่ต้องอ่าน migration guide และ docs ทางการก่อน แล้วทำ spike "1 room + 1 client + state sync + message validation" ใน M0-T06
- **[?]:** กลไก filter หรือ view สำหรับแยก state สาธารณะกับส่วนตัว (R-11), การตั้งค่า payload limit (R-13) และสิ่งที่มีให้สำหรับ prediction (R-06)

### DEC-008 — Prisma major และ path ของ schema/migrations
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **Context [F]:** CLI `latest` = 8.0.0-rc.27 (prerelease), `prev` = 7.10.1 · client `latest` = 7.10.1 · license Apache-2.0 · `.claude/rules/database.md` ใช้ glob `database/**/*` และ `**/*schema.prisma` · TECH §5 วางไว้ที่ `database/migrations` และ `database/seeds`
- **Options:** **A.** 7.x stable โดย CLI และ client เป็นเวอร์ชันเดียวกัน · **B.** รอ 8.0 GA แล้วค่อยเริ่ม M4
- **Recommendation [R]:** **A** (ไม่ใช้ RC ใน foundation) และตรวจ config และ generator ของ major ที่เลือก **[?]** · วาง schema ไว้ใต้ `database/` แล้วตั้งค่า Prisma ให้ชี้ไปที่นั่น เพื่อให้ rule ที่มีอยู่ครอบคลุม (C-18)
- **Impact:** ถ้า CLI กับ client ต่าง major กัน generate หรือ migrate อาจล้มเหลวหรือได้ type ที่ไม่ตรงกัน

### DEC-009 — PostgreSQL ใน local
- **Status:** Open · **Context [F]:** ไม่พบ `docker` และ `psql` ใน PATH
- **Options:** **A.** Docker Desktop + compose (ใกล้เคียง CI และ production) · **B.** ติดตั้ง PostgreSQL บน Windows (เบากว่า แต่ต่างจาก CI) · **C.** Postgres บน cloud สำหรับ dev (ต้องใช้เน็ตและอาจมีค่าใช้จ่าย)
- **Recommendation [R]:** A ถ้าเครื่องรองรับ เพราะ CI ก็ใช้ container แต่ต้องให้ผู้พัฒนาเลือก · major version ของ PostgreSQL ต้องตรงกับ support matrix ของ Prisma ที่เลือก **[?]**

### DEC-010 — Lint, format และ import boundary
- **Status:** Open · **Context [F]:** ยังไม่มีเครื่องมือ · TECH L81 กำหนดกฎ import แต่ไม่มีอะไรบังคับ
- **ต้องตรวจ [?]:** เครื่องมือที่เลือกรองรับ TypeScript major ตาม DEC-006 หรือไม่ (ทั้งตัว lint, formatter และตัวตรวจ dependency graph ระหว่าง package)
- **เกณฑ์ที่ต้องผ่าน [R]:** มี fixture test ที่ import ผิดกฎ (เช่น server → Babylon) แล้วทำให้ `pnpm lint` ล้มเหลว

### DEC-011 — CI provider และ pipeline
- **Status:** **Accepted (delegated, 2026-10-26): GitHub Actions** → ดู §4.0 · ~~Open (ขึ้นกับ DEC-039)~~ · **Recommendation [R]:**
  - ถ้าใช้ GitHub ให้ใช้ GitHub Actions workflow เดียว แบ่ง 3 ระดับ (รายละเอียดใน `DEFINITION_OF_DONE.md §6`): ทุก push รัน `pnpm verify`, ก่อน merge เพิ่ม integration + E2E smoke, รอบ nightly หรือสั่งเอง รัน E2E เต็ม + load + dependency audit
  - **หลักสำคัญสำหรับ solo dev:** CI และ local เรียกคำสั่งเดียวกัน (`pnpm verify`) จึงมีที่มาของ gate เพียงที่เดียว
- **Impact:** ไม่มี CI = gate ขึ้นกับวินัยของคนอย่างเดียว ซึ่ง AI ข้ามได้ง่าย

### DEC-012 — Branching, rollback และ recovery
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **Recommendation [R]:**
  - **Branching:** trunk-based แตก branch สั้นต่อ 1 task (`m1/t02-walkable-data`) แล้ว squash merge เข้า `main` เมื่อ CI ผ่าน ทำให้ 1 task = 1 commit ใน main และ revert ได้ทีละ task
  - **Milestone tags:** `m0-gate`, `m1-gate`, … และ `vs0` เป็นจุดย้อนกลับที่ผ่าน gate แล้ว
  - **Revert-first:** ถ้า regression ให้ `git revert` commit ที่เป็นสาเหตุก่อน แล้วค่อยแก้ใน branch ใหม่พร้อม regression test (สอดคล้อง AI_WORKFLOW §7 L45–52)
  - **Database:** migration เดินหน้าอย่างเดียว ห้ามแก้ migration ที่ apply แล้ว ให้สร้างใหม่ · backup ก่อน migrate ใน environment ที่ใช้ร่วมกัน · มี restore drill (DATABASE §6)
  - **Content:** เก็บ `dataVersion` ไว้ใน item instance และห้ามลบ id ใน game-data ให้ใช้ deprecate (R-14)
  - **Feature toggles:** ใช้ config flag เฉพาะฟีเจอร์ที่เสี่ยงหรือยังไม่เสร็จ และห้ามใช้แทน branch
  - **เครื่องมือ Claude Code:** checkpoint หรือ rewind ใช้ได้เฉพาะในเซสชัน ไม่ใช้แทน git
- **Trade-off:** squash merge ทำให้ประวัติย่อยหายไป แต่ revert ง่ายกว่ามาก ซึ่งคุ้มกว่าสำหรับ solo dev

### DEC-013 — Automated test stack และ determinism
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **Recommendation [R]:**
  - **Unit:** Vitest สำหรับ `game-rules`, `shared-contracts` และ util
  - **Contract tests:** Zod schema round-trip ทั้ง valid และ invalid ต่อ message
  - **Room integration:** `@colyseus/testing` (ต้องตรวจ API ของ 0.18 ก่อน **[?]**)
  - **DB integration:** PostgreSQL แบบ disposable (container ทั้ง local และ CI) migrate ใหม่ต่อ test suite
  - **E2E:** Playwright 2 browser context ตรวจ state ผ่าน debug hook ที่มีเฉพาะ dev build (R-22) ไม่ตรวจที่ pixel
  - **Determinism (สำคัญ):** `game-rules` ต้องรับ RNG ที่ seed ได้และ clock ผ่าน parameter ห้ามเรียก `Math.random()` หรือ `Date.now()` ตรง ๆ เพื่อให้ test ของ loot, AI และ cooldown ทำซ้ำได้
  - **Fuzz:** สร้าง message สุ่มจาก schema แล้วยิงเข้า room ใน M3
  - **Load:** ใช้ `@colyseus/loadtest` หรือเครื่องมืออื่นหลัง M3 (README L21)
- **Dependency ใหม่ที่ต้องขออนุมัติแยก:** property-based testing library (ไม่บังคับ)

### DEC-014 — Animation runtime
- **Status:** ~~Proposed~~ → **Open** (เปลี่ยนเมื่อ 2026-10-26 เพราะ DEC-040) · **ต้องปิดก่อน:** ผลิต asset จำนวนมาก (VP0-c) · **Ref:** D-23, R-19
- **Context [F]:**
  - ART §2 ข้อ 3 (L9) ให้ประเมิน Spine หรือ runtime อื่น
  - ใน npm ไม่พบ Spine runtime ทางการสำหรับ Babylon.js (มีสำหรับ canvas, canvaskit, phaser, pixi, threejs, webgl, webcomponents, player)
  - license ของ `@esotericsoftware/spine-*` เป็น `LicenseRef-LICENSE` (proprietary)
- **Options:**
  - **A.** Sprite-sheet frame animation บน textured quad ใน Babylon
  - **B.** Spine ผ่าน integration ที่เขียนเอง หรือ community runtime **[?]**
  - **C.** skeletal runtime อื่น (ยังไม่ได้ประเมิน)
- **Trade-offs:** A เรียบง่าย ไม่มี license ผูกมัด และดีบัก depth sorting ได้ง่าย แต่ใช้ texture memory มากและเปลี่ยนชุดหรือท่าทางได้ยาก · B ประหยัด memory และ animate ได้ยืดหยุ่น แต่ต้องเขียน integration กับ Babylon เอง ต้องซื้อ license และเสี่ยงต่อ VS0
- **Recommendation [R]:** **A สำหรับ VS0** แบบ 4 ทิศ ท่า idle, walk, cast, hit, death ใช้ placeholder art แล้วเขียน ADR ประเมิน B หรือ C หลัง VS0 ผ่าน โดยใช้ตัวเลข texture memory จริงจาก benchmark (DEC-029)
- **ต้องกำหนดร่วม:** รูปแบบ atlas และ metadata, foot pivot, world-unit scale, ทิศที่หันตาม aim (C-16)
- **อัปเดต 2026-10-26 (ผลจาก DEC-040):** Art Lock กำหนด "เคลื่อนไหวลื่นไหล แสดงน้ำหนัก" และ "เปลี่ยนชุดโดยสัดส่วนไม่เปลี่ยน" ส่วนภาพอ้างอิงหมายเลข 2 ระบุว่า "ยังไม่ล็อก…ระบบแอนิเมชันจนกว่าจะทดสอบต้นแบบจริง" ข้อเสนอเดิม (A สำหรับ VS0) จึง**เหลือแค่ placeholder ใน VP0-a** ส่วนการตัดสินจริงให้มาจากการเทียบ A1/A2 กับ A3 (runtime skeletal) ใน VP0-c (`VISUAL_PROTOTYPE_PLAN.md §2.3`) และขึ้นกับ DEC-045
- **อัปเดต 2026-10-26 (ผลจาก DEC-045):** ผู้พัฒนาสั่งให้ VP0-c **ให้น้ำหนักกับ runtime skeletal (A3)** ทำให้ A3 เป็นตัวเลือกตั้งต้น ถ้าผ่าน hard gate ทั้งหมดใน `VISUAL_PROTOTYPE_PLAN.md §2.3` ส่วนทางสำรองคือ A1-L (frame-based แยกชั้นต่อ slot) ซึ่ง A1 และ A2 แบบ bake ทั้งตัว**ใช้กับ paper-doll ไม่ได้**อีกต่อไป
- **อัปเดต 2026-10-26 (คำสั่งผู้พัฒนา):** เพิ่ม **A3-B (Blender cutout → glTF → Babylon skinned mesh)** เข้าเทียบกับ **A3-S (Spine)** และ **A1-L** ใน VP0-c · ทั้ง A3-S และ A3-B นับเป็น "runtime skeletal" ที่ได้น้ำหนักตาม DEC-045 · ข้อเท็จจริงด้าน license อยู่ในภาคผนวก C และกติกาตัดสินอยู่ใน `VISUAL_PROTOTYPE_PLAN.md §2.3`
- **อัปเดต 2026-10-26 (DEC-058):** ผู้พัฒนายังไม่ยอมรับค่า Spine จึง**พัก A3-S ไว้** และ VP0-c รอบนี้เทียบเฉพาะ **A3-B กับ A1-L**

### DEC-015 — Depth sorting และ occlusion
- **Status:** Open (ตัดสินจาก spike M1-T06) · **Context [F]:** TECH L117, L121 และ ART §3 ระบุว่าเป็นความเสี่ยงหลัก
- **แนวทางที่จะทดลองใน spike [R]:** quad ตั้งฉากกับพื้นที่ anchor ที่เท้า (เขียน depth จริง) เทียบกับ billboard + sorting แบบกำหนดเอง และวิธี fade/cutaway ของ occluder · วัดผลด้วย visual QA checklist (TEST §6) ไม่ใช่ความรู้สึก
- **ห้าม:** เลือกวิธีก่อนมีผล spike

### DEC-016 — Collision/walkable data ที่ใช้ร่วมกัน
- **Status:** Proposed · **ต้องปิดก่อน:** M1 · **Ref:** D-17, R-02
- **Context [F]:** TECH L81 ห้าม server import Babylon · ART L26–27 ให้แยก collision proxy และระบุ walkable data ให้ชัด · ไม่พบ `blender` ใน PATH **[?]**
- **Recommendation [R]:**
  - ใช้รูปแบบเดียวที่ไม่ผูกกับ engine: polygon หรือ grid บน XZ plane เป็น JSON ใน `packages/game-data` พร้อม Zod schema และ `formatVersion`
  - geometry function (point-in-walkable, clamp movement, LOS แบบง่าย) อยู่ใน `packages/game-rules` และเป็น pure function
  - **VS0:** เขียน JSON ด้วยมือสำหรับ zone เล็ก · **หลัง VS0:** script export จาก collision mesh ใน Blender (ต้องยืนยันว่ามี Blender ติดตั้ง)
  - client และ server ตรวจ hash ของไฟล์ตรงกันตอนเข้า room
- **Impact ถ้าไม่ทำ:** rubber-banding และ server ปฏิเสธการเดินที่ถูกต้อง ทำให้ต้องรื้อ movement

### DEC-017 — Multiplayer authority และ netcode model
- **Status:** Proposed · **Ref:** D-16, D-18, C-14, C-15
- **Recommendation [R]:**
  1. Server ตัดสินตำแหน่ง, combat, status, loot, inventory และ progression (ยืนยัน DEC-L5 และ TECH §3)
  2. Client ทำนายเฉพาะการเดินของตัวเองแล้ว reconcile ตาม sequence ส่วนผู้เล่นและ entity อื่นใช้ interpolation
  3. `MoveInput = {sequence, direction}` **ตัด "input duration" ออก** (แก้ C-15) ให้ server คำนวณระยะจาก tick ของตัวเอง
  4. ตำแหน่งอยู่ใน room state ที่ sync อัตโนมัติ ส่วน `MoveState` ใช้เป็น ack ของ client เจ้าของตัวละครถ้าจำเป็น (แก้ C-14)
  5. Combat events เป็น discriminated union เดียวใน `shared-contracts` (แก้ C-13)
  6. Tick rate และ patch rate เป็นค่า config ที่เลือกค่าเริ่มต้นใน spike M0-T06 หรือ M3-T05 แล้ววัดผล โดยยังไม่ล็อกตัวเลข (TECH L126)
- **Conflict ที่ต้องบันทึก:** ข้อ 3 ขัดกับข้อความใน `NETWORK_PROTOCOL.md` L15 ถ้าอนุมัติ ต้องแก้ L15 และแสดง diff ให้ผู้พัฒนาดูก่อน

### DEC-018 — Lag compensation และ i-frames
- **Status:** Proposed · **Recommendation [R]:**
  - VS0 **ไม่ rewind** ให้ server resolve ตามตำแหน่ง ณ tick ที่ resolve (นิยาม "defined simulation moment" ของ COMBAT L35)
  - windup ของ telegraph ต้องนานพอให้ผู้เล่นมีเวลาตอบสนองแม้มี latency (ตัวเลขอยู่ใน game-data และ tune จาก playtest)
  - i-frame ของ `ward_step` มีช่วงที่ server กำหนดบวก grace สั้น ๆ เป็น config
  - ทบทวน rewind หลังวัด latency จริงใน M7
- **Trade-off:** ผู้เล่นที่ ping สูงจะเสียเปรียบ แลกกับความเรียบง่ายและการโกงที่ยากขึ้น

### DEC-019 — Persistence write strategy และ character lease
- **Status:** Proposed · **ต้องปิดก่อน:** M3 gate · **Ref:** C-23, R-01, R-07
- **Context [F]:** DATABASE §5 L41 บอกให้ "persist on important state transitions and periodically" ส่วน DATABASE §3 บอกให้ใช้ transaction กับรางวัลและการซื้อขาย แต่ไม่ได้กำหนดว่าข้อมูลมีต้นฉบับอยู่ที่ไหน
- **Recommendation [R]:**
  - **ข้อมูลที่มีมูลค่า** (item, currency, XP ที่ได้, การจบ quest): DB transaction + idempotency key ที่เป็น unique (`sourceEventId`) commit ก่อน แล้วจึงแก้ room state เมื่อ commit สำเร็จ ถ้าล้มเหลวจะไม่มีอะไรเกิดขึ้น
  - **ข้อมูลที่ไม่มีมูลค่า** (ตำแหน่ง, HP ปัจจุบัน): อยู่ในหน่วยความจำ บันทึกเป็น checkpoint เมื่อ logout, เปลี่ยน zone หรือตามรอบเวลา และยอมรับว่าหายได้ไม่เกินช่วง checkpoint
  - **Lease:** `Character.activeSessionId` + `leaseExpiresAt` อัปเดตใน transaction ตอน join ถ้ามี lease ที่ยังไม่หมดอายุให้ปฏิเสธ และต่ออายุเป็นระยะ
  - **ห้าม** ทำ DB I/O แบบ blocking ใน tick ให้ entity อยู่ในสถานะ "pending" ระหว่างรอ commit (R-21)
- **Impact ถ้าไม่ตัดสิน:** เสี่ยง item dupe ซึ่งเป็นความเสี่ยงระดับ Critical (R-01)

### DEC-020 — Auth
- **Status:** M3 = Proposed · M4 = Open · **Ref:** C-04
- **Recommendation [R]:**
  - **M3:** `AuthProvider` interface + dev token provider ที่ทำงานเฉพาะ `NODE_ENV=development` และ server ต้องปฏิเสธ provider นี้ใน env อื่น (มี test)
  - **M4:** เลือก library หรือบริการ auth ที่ใช้แพร่หลาย ผ่าน ADR (ห้ามเขียน crypto เอง ตาม SECURITY L21) พร้อมกำหนดรูปแบบ token สำหรับ WebSocket
  - **Open:** library ที่จะใช้, ต้องยืนยันอีเมลหรือไม่ในช่วง closed test

### DEC-021 — MVP เป็น PvE เท่านั้น
- **Status:** Proposed · **Conflict [F]:** GDD §1 L4 "cooperate or compete" และ COMBAT §5 L43 "PvP scaling" ขัดกับ GDD §6 ที่ไม่มี PvP
- **Recommendation [R]:** MVP เป็น PvE เท่านั้น แล้วเพิ่ม "PvP" ในรายการ deferred ของ GDD §7 (ต้องแก้เอกสารต้นฉบับหลังอนุมัติ)
- **ผลกระทบ:** ขอบเขตงาน anti-cheat และ balance ลดลงมาก แต่ถ้ามีแผนทำ PvP ภายหลัง ต้องออกแบบ damage formula ให้รองรับ scaling ได้

### DEC-022 — Loot และ credit
- **Status:** Proposed · **Recommendation [R]:** personal loot ผู้เล่นทุกคนที่มีส่วนร่วม (เช่น ทำ damage ≥ X% หรือโดนโจมตีจาก enemy ภายในช่วงเวลา) ได้ roll ของตัวเอง ไม่มีการแย่ง loot ส่วน party ไว้ M8 ตาม ROADMAP L69 · ค่า X เป็น config

### DEC-023 — Stat model ขั้นต่ำสำหรับ VS0
- **Status:** Proposed (ชื่อ resource ยัง Open)
- **Recommendation [R]:**
  - stat: `maxHp`, `maxResource`, `power`, `defense`, `moveSpeed`
  - สูตรตาม COMBAT §5 โดยนิยาม `mitigationMultiplier` จาก `defense` แบบมีเพดาน และเก็บค่าสัมประสิทธิ์ทั้งหมดใน game-data
  - ไม่มี crit ใน VS0 (COMBAT L43 ให้นิยามก่อนเพิ่ม)
- **Open:** ชื่อ resource ภาษาไทย (เช่น "พลังเวท") และ level cap ของ VS0

### DEC-024 — Death และ respawn ใน VS0
- **Status:** Proposed · **[R]:** ตายแล้วเกิดที่จุด safe ของ zone หลัง N วินาที (config) ไม่มีบทลงโทษใน VS0 และ enemy reset aggro

### DEC-025 — Cooldown เริ่มนับเมื่อไร
- **Status:** Proposed · **Context [F]:** COMBAT §3 L21 ให้เลือก default 1 แบบ แล้ว override เป็นราย skill ได้
- **[R]:** เริ่มนับเมื่อ cast ถูก **accept** (เข้า Windup) เพื่อกันการกด spam ระหว่าง windup และถ้าถูก interrupt จะไม่คืน cooldown (เป็นค่า default ที่ override ได้)

### DEC-026 — Control scheme การเดิน
- **Status:** Proposed · **[R]:** WASD + mouse aim ใน VS0 เพราะเข้ากับ directional combat และไม่ต้องมี pathfinding ฝั่ง server · click-to-move ทบทวนหลัง VS0

### DEC-027 — ล็อกกล้องไม่ให้หมุน
- **Status:** Proposed · **[R]:** กล้องหมุนไม่ได้ตลอด MVP (GDD L8 ระบุว่าเลื่อนไปอยู่แล้ว) ทิศของ sprite จึงคงที่ตาม world · aim indicator แยกจาก sprite (C-16)

### DEC-028 — ~~ไม่มี paper-doll ใน MVP~~ (Superseded)
- **Status:** ~~Proposed~~ → **Superseded by DEC-045** (ผู้พัฒนา, 2026-10-26) · ข้อเสนอเดิมที่เก็บไว้เป็นประวัติ: **[R]:** อุปกรณ์ไม่เปลี่ยนรูปลักษณ์ตัวละคร แสดงผลผ่านไอคอนหรือ VFX แทน ซึ่งลดงาน art และ texture memory (R-04)
- **⚠ ขัดแย้ง (พบ 2026-10-26):** DEC-040 §3 กำหนดมาตรฐาน "การเปลี่ยนชุดโดยไม่ทำให้สัดส่วนหรือ Art Style เปลี่ยน" และภาพอ้างอิงแสดงหน้าอุปกรณ์ที่มีตัวละครสวมชุด **ผู้ตรวจไม่ได้เลือกแทน** ให้ผู้พัฒนาตัดสินใน DEC-045 ซึ่งผลลัพธ์จะทำให้ entry นี้ถูก Accepted หรือ Superseded → **ผลการตัดสิน 2026-10-26: Superseded** (ผู้พัฒนาเลือก paper-doll)

### DEC-029 — เป้าหมาย performance และวิธีวัด
- **Status:** Proposed — **ตัวเลขทั้งหมดเป็นสมมติฐาน** ห้ามอ้างเป็น capacity claim (TEST §7 L62)
- **Context [F]:** ฮาร์ดแวร์ของเครื่องพัฒนา (2026-10-26): Intel Core i5-14600K (14C/20T), NVIDIA GeForce RTX 5070, RAM 31.7 GB, จอ 1920×1080 @ 179 Hz, Chrome 155.0.8059.85, Edge 156.0.4314.42 · **เครื่องนี้แรงกว่าผู้เล่นทั่วไปมาก จึงใช้เป็นเป้า min-spec ไม่ได้**
- **วิธีวัด [R]:**
  - benchmark scene ที่บันทึกไว้ใน repo พร้อมเงื่อนไขครบตาม TEST §7 (browser/version, hardware, resolution, zoom, จำนวน entity, effects)
  - เก็บ avg และ p95 ของ frame time, memory, load time และฝั่ง server เก็บ tick duration p50/p95, message throughput และ bandwidth ต่อ client
  - รันบน 2 ระดับฮาร์ดแวร์: เครื่องพัฒนา และเครื่อง min-spec (**Open:** ผู้พัฒนาต้องเลือกเครื่องอ้างอิง เช่น laptop ที่ใช้ GPU ในตัว)
- **สมมติฐานเริ่มต้นสำหรับ VS0 [R] (ยืนยันหลังวัด baseline ใน M1-T09):**
  - client: frame time p95 ≤ 16.7 ms ที่ 1080p บนเครื่องพัฒนา (4 ตัวละคร + 1 enemy + VFX ของ VS0) และ min-spec ตั้งเป้าหลังวัด baseline
  - server: tick duration p95 ≤ 25% ของ tick budget ที่ 4 client
  - โหลด zone ใน local ≤ 5 วินาที
  - memory กลับสู่ระดับเดิมหลังโหลดและ unload zone 10 รอบ (ข้อนี้เป็น correctness test ไม่ใช่ performance)
- **กฎ:** ถ้าวัดแล้วไม่ถึงเป้า ให้บันทึกผลจริงและปรับเป้าผ่าน entry นี้ ห้ามแก้ตัวเลขเงียบ ๆ

### DEC-030 — รูปแบบ game-data และ content versioning
- **Status:** Proposed · **[R]:** definition เป็น TS module หรือ JSON ที่ validate ด้วย Zod ตอน build (COMBAT L102), DB เก็บแค่ `definitionId` + `dataVersion`, ห้ามลบ id ให้ใช้ deprecate (แก้ C-17 และ R-14)

### DEC-031 — React ↔ Babylon state bridge และ in-world UI
- **Status:** Proposed · **[R]:** network layer เขียนลง client store กลางเพียงทางเดียว แล้ว React (overlay) และ Babylon (render) อ่านจาก store นั้น ห้าม React แก้ scene ตรง ๆ · ป้ายชื่อและตัวเลข damage ใน VS0 ทำด้วย DOM overlay ที่ฉายตำแหน่งจากโลก (เกี่ยวกับ DEC-032) · การเลือก state library ต้องขออนุมัติเป็น dependency ใหม่

### DEC-032 — การแสดงผลภาษาไทยและ font
- **Status:** Open · **[?]:** การแสดงสระและวรรณยุกต์ไทยใน Babylon GUI กับ DOM และ license ของ font ไทยที่จะ bundle · **[R] ชั่วคราว:** ข้อความภาษาไทยทั้งหมดอยู่ใน DOM ใน VS0
- **Open:** UI ภาษาไทยอย่างเดียว หรือไทยกับอังกฤษ

### DEC-033 — การตั้งค่า Claude Code สำหรับ M0–M1
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · รายละเอียดอยู่ใน**ภาคผนวก A** · **[F]** รูปแบบไฟล์ตรวจกับเอกสารทางการ `code.claude.com/docs` (หน้า memory, skills, sub-agents, hooks, permissions) เมื่อ 2026-10-26

### DEC-034 — ลำดับชั้นเอกสาร Definition of Done
- **Status:** **Accepted (delegated, 2026-10-26)** → ดู §4.0 · ~~Proposed~~ · **Context [F]:** มีเกณฑ์ done หรือรายงานปิดงานที่ซ้อนกัน 5 แหล่ง ดูภาคผนวก B
- **[R]:** ให้ `docs/DEFINITION_OF_DONE.md` เป็นต้นฉบับ ส่วนเอกสารอื่นค่อยแก้ให้ลิงก์มาที่นี่**หลังได้รับอนุมัติ** ตอนนี้ยังไม่ได้แก้เอกสารเดิม

### DEC-035 — Asset provenance (รวม asset ที่ AI สร้าง)
- **Status:** Open · **Context [F]:** ART §6 L57 ห้ามใช้ asset ที่ไม่รู้สิทธิ์การแจกจ่าย
- **Open:** นโยบายการใช้ asset จาก AI generator (สิทธิ์ทางการค้า, การบันทึก prompt, tool และวันที่) · **[R] ชั่วคราว:** VS0 ใช้ placeholder ที่ทำเองหรือมี license ชัด และบันทึกทุกชิ้นใน asset manifest
- **อัปเดต 2026-10-26:** ประเมิน PixelLab แล้ว ผล: **ไม่ใช้สำหรับตัวละครหรือ asset ในเกม และไม่ใช้เป็น placeholder ของ VP0** เพราะสร้างแต่ pixel art ซึ่งขัดกับ DEC-040 (รายละเอียดและเงื่อนไข ToS อยู่ในภาคผนวก C.2) · นโยบาย AI โดยรวมยังเป็น Open

### DEC-036 — Browser support matrix
- **Status:** Proposed · **[R]:** VS0 ใช้ Chromium (Chrome/Edge บน Windows) และ WebGL2 เป็น baseline **[?]** (ตรวจว่า Babylon 9 ใช้ WebGL2 หรือ WebGPU เป็น default) · Firefox และ Safari ทบทวนก่อน M7

### DEC-037 — Observability ขั้นต่ำ
- **Status:** Proposed · **[R]:** structured JSON log ไปที่ stdout พร้อม sessionId และ characterId (ห้ามมี token ตาม NETWORK L50), metric ที่ระบุใน TECH L143 และ NETWORK §7, endpoint metrics เฉพาะ dev · การเลือก logger library ต้องขออนุมัติ

### DEC-038 — Class model
- **Status:** Open (ไม่บล็อก VS0 เพราะ VS0 มีตัวละครแบบเดียว) · **Conflict [F]:** GDD L32 กับ L62–73 และ ROADMAP L45 · ตัดสินก่อน M5

### DEC-039 — Remote repository และ backup นอกเครื่อง
- **Status:** **Accepted (delegated, 2026-10-26): GitHub private repo** → ดู §4.0 · ~~Open~~ · **Context [F]:** ไม่มี git, ไม่พบ `gh` CLI และไม่รู้ว่าผู้พัฒนาใช้ GitHub หรือ GitLab หรือไม่
- **[R]:** ใช้ remote แบบ private เพื่อเป็น backup นอกเครื่องและรัน CI · **การ push ครั้งแรกต้องได้รับอนุมัติ** (ถือว่าเป็นการส่งข้อมูลออกนอกเครื่อง)

---

### DEC-040 — Art Direction: 2.5D HD-2D 🔒
- **Status:** **Accepted** · **ผู้อนุมัติ:** ผู้พัฒนา · **วันที่:** 2026-10-26 · **ที่มา:** คำสั่ง "ART DIRECTION LOCK — KHAMANG WET MMORPG" ในแชต + ภาพอ้างอิง 2 ภาพ (key visual mockup และตารางสเปกภาพ)
- **Decision:** ทิศทางภาพหลักคือ 2.5D HD-2D (ฉาก 3D isometric มีแสง เงา หมอก + ตัวละคร 2D HD รายละเอียดสูง) ธีม Thai Occult & Sorcery dark fantasy · **ห้าม**เปลี่ยนเป็น Pixel Art, Chibi, Full 3D Realistic หรือรูปแบบอื่นโดยไม่ได้รับอนุญาต
- **ยังไม่ล็อกโดยตั้งใจ:** วิธีสร้างฉากและระบบแอนิเมชัน (ตัดสินหลังทดสอบต้นแบบ) ซึ่งเป็น DEC-014 และ DEC-041 ถึง DEC-056
- **สอดคล้องกับ:** DEC-L2 (3D isometric world + 2D HD characters)
- **ผลกระทบต่อ entry อื่น:** DEC-014 กลับเป็น Open · DEC-028 ขัดแย้ง (ดู DEC-045) · DEC-029 ต้องรวม post-processing ไว้ในงบ performance (ดู DEC-048) · DEC-035 ครอบคลุมภาพอ้างอิงที่ยังไม่รู้ที่มาด้วย
- **รายละเอียด:** `ART_BIBLE.md` · `ASSET_PIPELINE.md` · `VISUAL_PROTOTYPE_PLAN.md`

### DEC-045 — การเปลี่ยนชุด: paper-doll ตาม equipment ระหว่างเล่น
- **Status:** **Accepted** · **ผู้อนุมัติ:** ผู้พัฒนา · **วันที่:** 2026-10-26 · **ที่มา:** คำสั่งในแชต "DEC-045: ต้องการให้รูปลักษณ์ตัวละครเปลี่ยนตาม equipment ระหว่างเล่น (paper-doll) ให้ถือว่า DEC-028 ถูกแทนที่ และให้ VP0-c ให้น้ำหนักกับ runtime skeletal"
- **Decision:** รูปลักษณ์ของตัวละครผู้เล่นเปลี่ยนตาม equipment ที่สวมระหว่างเล่น โดยสัดส่วนและ art style ไม่เปลี่ยน (DEC-040 §3) · **Supersedes:** DEC-028
- **คำสั่งต่อ VP0-c:** ให้น้ำหนักกับ runtime skeletal (A3) ส่วนกติกาการตัดสินอยู่ใน `VISUAL_PROTOTYPE_PLAN.md §2.3`
- **ผลกระทบที่ต้องรู้ [R]:**
  - **Animation:** A1 และ A2 แบบทั้งตัวตัดออก เหลือ A3 (skins หรือ attachments) และทางสำรอง A1-L (layer ต่อ slot)
  - **งาน art:** ทุก item ที่แสดงผลต้องวาดหรือ rig ตามทุกทิศที่วาดจริง (2 ทิศถ้า 4 ทิศ mirror) จึงต้องจำกัดจำนวน visual slot (DEC-057) และให้ item ใช้ template ร่วมกันหรือเปลี่ยนสี (tint) ได้
  - **Network:** appearance (definition ID ต่อ visual slot) เป็น **public room state** ที่ต้อง sync ให้ทุก client (ขนาดเล็ก ไม่ใช่ข้อมูลลับ) โดยต้องแยกจาก inventory ที่เป็นข้อมูลส่วนตัว (R-11, DEC-017)
  - **Performance:** มีต้นทุน CPU ต่อตัวละครของ skeletal และจำนวน texture หรือ atlas ต่อ appearance ซึ่งต้องวัด P8–P10 (`VISUAL_PROTOTYPE_PLAN.md §5.2`)
  - **Scope:** equipment visuals เข้าอยู่ใน M5 (backlog M5-E07) ส่วน VS0 ยังใช้ชุดพื้นฐานชุดเดียว แต่ VP0 ต้องพิสูจน์การเปลี่ยนชุดอย่างน้อย 2 ชิ้น
  - **License:** ตรวจ Spine แล้วเมื่อ 2026-10-26 (ภาคผนวก C.1) และ A3-B ใช้ Blender ซึ่งไม่มีค่า license (ภาคผนวก C.3)

### DEC-058 — VP0-c เทียบ A3-B กับ A1-L ก่อน (ยังไม่ซื้อ Spine)
- **Status:** **Accepted** · **ผู้อนุมัติ:** ผู้พัฒนา · **วันที่:** 2026-10-26 · **ที่มา:** คำสั่งในแชต "G1: ยังไม่ยอมรับค่า Spine ให้ VP0-c เทียบแค่ A3-B กับ A1-L ก่อน"
- **Decision:**
  - G1 ของ A3-S (Spine Professional $379) **ยังไม่ผ่าน ณ ตอนนี้** จึงไม่รวม A3-S ใน VP0-c รอบนี้
  - VP0-c เทียบ **A3-B (Blender → glTF)** ซึ่งเป็นตัวเลือกตั้งต้นตามน้ำหนักของ DEC-045 กับ **A1-L** (frame แยกชั้นต่อ slot)
- **คำว่า "ก่อน" = ทบทวนได้ [R]:** ถ้า A3-B ไม่ผ่าน G2, G4 หรือ G5 และแก้ไม่ได้ภายใน time-box ผู้ตรวจจะรายงานผลของทุก gate แล้วให้ผู้พัฒนาเลือกระหว่าง (a) ใช้ A1-L หรือ (b) เปิด G1 ของ A3-S ใหม่ **ผู้ตรวจจะไม่เลือกแทน**
- **ผลกระทบ:**
  - ไม่มีค่า license ใน VP0
  - ไม่ต้องเขียน Spine renderer (RA-06 ถูกพักไว้)
  - A3-B เป็นทาง skeletal ทางเดียว (RA-12 สูงขึ้นเป็น High)
  - ต้องติดตั้ง Blender (DEC-054) ก่อน M1-T19
  - A1-L ต้องทำตัวอย่างขั้นต่ำจริงเพื่อให้เทียบกันได้ (ไม่ใช่แค่ทางสำรองบนกระดาษ)

### DEC-041 ถึง DEC-056 — การตัดสินใจด้าน art ก่อนผลิต asset จำนวนมาก
- **Status:** Open ทั้งหมด (ดูคอลัมน์ "ตัดสินโดย" ใน `VISUAL_PROTOTYPE_PLAN.md §6`)
- คำถาม เหตุผลที่บล็อก และกำหนดเวลาของแต่ละข้ออยู่ใน `VISUAL_PROTOTYPE_PLAN.md §6` เพื่อไม่ให้เนื้อหาซ้ำ ไฟล์นี้เก็บแค่สถานะในตาราง §1
- **ข้อที่ผู้พัฒนาต้องตัดสินเอง (ไม่ได้มาจาก prototype):** DEC-051, 052, 053, 055, 056 และ DEC-035 (DEC-045 ตัดสินแล้ว) · DEC-057 ให้ผู้พัฒนาตัดสินร่วมกับผลของ VP0-c

---

## 5. Unresolved Conflicts Register

**[F]** ข้อขัดแย้งจากรายงาน onboarding ที่ยังไม่มีการแก้เอกสารต้นฉบับ ทุกข้อรอการตัดสินใจตามคอลัมน์ขวา

| Conflict | สรุป | รอ |
|---|---|---|
| ~~C-01, C-02~~ | เอกสารซ้ำและชื่อไฟล์ไม่ตรง | **ปิดแล้ว 2026-10-26:** DEC-002 ทำแล้วใน M0-T03 (ลบไฟล์ซ้ำ และแก้ `GDD.md` เป็น `GAME_VISION_GDD.md` ใน TECH §5) |
| ~~C-03, C-24~~ | repo root และไม่มี git | **ปิดแล้ว 2026-10-26:** DEC-001 ทำแล้วใน M0-T02 |
| C-04 | auth อยู่ใน M4 แต่ M3 ต้องใช้ | DEC-020 |
| C-05 | co-op โดยไม่มี party | DEC-022 |
| C-06 | สถานะ PvP | DEC-021 |
| C-07 | archetype หรือ build path | DEC-038 |
| C-08 | การแบ่ง skill ตาม path และ summon | backlog M5-E01 |
| C-09 | ไม่มี spec ของ ritual และ investigation | backlog M5-E00 |
| C-10 | karma และ reputation ใน MVP | Open (ตัดสินก่อน M5) |
| C-11 | shop, craft, currency ไม่อยู่ใน milestone ใด | backlog M5 |
| C-12 | ตำแหน่งของ tutorial quest | backlog M6 |
| C-13, C-14, C-15 | combat event, MoveState และ input duration | DEC-017 |
| C-16 | sprite 4 ทิศกับ aim อิสระ | DEC-027, DEC-014 |
| C-17 | definition อยู่ใน DB หรือ git | DEC-030 |
| C-18 | path ของ Prisma กับ rule | DEC-008 ✔ ตัดสินแล้ว (schema อยู่ใต้ `database/`) และรอทำ M4-T01 |
| ~~C-19~~ | `.claude/rules` ไม่ครอบคลุม `packages/**` | **ปิดแล้ว 2026-10-26:** เพิ่ม `shared.md` ใน M0-T05 |
| C-20 | skills ซ้ำกับ prompts | DEC-033 (รอ M0-T14) |
| ~~C-21~~ | prompts/01 และ 02 อ้างถึง `CLAUDE.md` ที่ยังไม่มี | **ปิดแล้ว 2026-10-26:** สร้าง `CLAUDE.md` ใน M0-T04 |
| C-22 | offline sandbox ขัดกับ authority | backlog M2-T09 (local sim) |
| C-23 | ต้นฉบับของข้อมูลที่มีมูลค่า | DEC-019 |
| ~~C-A1~~ | DEC-028 (ไม่มี paper-doll) ขัดกับมาตรฐานการเปลี่ยนชุดใน Art Lock §3 | **ปิดแล้ว 2026-10-26:** DEC-045 Accepted และ DEC-028 Superseded |
| C-A2 (ใหม่) | ภาพอ้างอิงมีตัวละคร 4 แบบ แต่ GDD §6 มี 1 archetype กับ 2 paths | DEC-055, DEC-038 |
| C-A3 (ใหม่) | ภาพอ้างอิงมี UI party/guild chat และ minimap แต่ ROADMAP L69 เลื่อน party/guild ไปไว้ M8 และ GDD L39 ไม่มี minimap | DEC-055 |
| C-A4 (ใหม่) | รายการท่าของ Art Lock ไม่มี Interact แต่ ART §2.4 มี | ART_BIBLE §4.2 ใช้การรวมทั้งสองรายการ (เพิ่ม Interact) ซึ่งต้องให้ผู้พัฒนายืนยัน |

---

## ภาคผนวก A — ข้อเสนอการตั้งค่า Claude Code สำหรับ M0–M1 (DEC-033)

> **ยังไม่ได้สร้างไฟล์ใดในภาคผนวกนี้** ทั้งหมดเป็นข้อเสนอ **[R]** และเลือกเฉพาะสิ่งที่จำเป็นต่อ M0–M1 ตาม AI_WORKFLOW §5 L39–40 ("Hooks… only after commands are verified" และ "Use current official Claude Code documentation…")
> **[F] ข้อเท็จจริงจากเอกสารทางการ (2026-10-26):**
> - project CLAUDE.md อยู่ที่ `./CLAUDE.md` หรือ `./.claude/CLAUDE.md` และควรสั้นกว่า 200 บรรทัด
> - `@path` import โหลดไฟล์ทั้งไฟล์เข้า context จึงไม่ช่วยลดขนาด context
> - `.claude/rules/*.md` ใช้ frontmatter `paths` (YAML list) ได้ rule ที่ไม่มี `paths` โหลดทุกเซสชัน
> - skills อยู่ที่ `.claude/skills/<name>/SKILL.md` และ `disable-model-invocation: true` ทำให้เรียกได้ด้วย `/name` เท่านั้น
> - subagents อยู่ที่ `.claude/agents/<name>.md` ต้องมี `name` และ `description` และ `tools: Read, Grep, Glob` ทำให้เป็น read-only
> - hooks ตั้งใน `.claude/settings.json` ถ้า hook ออกด้วย exit 2 จะบล็อก action และ `CLAUDE_PROJECT_DIR` ชี้ไปที่ root ของโปรเจกต์
> - permissions ตรวจตามลำดับ deny → ask → allow และ `Bash(git push *)` **ไม่ match** `git -C . push …` ดังนั้น deny rule เป็นแค่ guardrail ไม่ใช่ security boundary
> - CLAUDE.md เป็น context ไม่ใช่สิ่งที่ถูกบังคับใช้ ถ้าต้องการบังคับให้ใช้ PreToolUse hook
>
> **[F] รูปแบบ `.claude/rules/*.md` ทั้ง 3 ไฟล์ที่มีอยู่ถูกต้องตามเอกสารปัจจุบัน**

### A.1 `CLAUDE.md` (สร้างใน M0-T04 จาก `CLAUDE_TEMPLATE.md` และยาวไม่เกิน ~120 บรรทัด)
- **คงไว้:** Project (1–2 บรรทัด), Engineering Rules (ย่อเหลือประมาณ 12 ข้อ), Required Workflow, Current Priority
- **เพิ่ม:**
  - `## Commands` ใส่**เฉพาะคำสั่งที่รันได้จริง** หลัง M0-T10 (ตอนนี้ยังไม่มีคำสั่งใด)
  - `## Pinned versions` ชี้ไปที่ ADR-001 (ไม่ใช่ copy ตัวเลข)
  - `## Where things are` อ้างถึง path ด้วย backtick **ไม่ใช้ `@import`** เพื่อประหยัด context ได้แก่ `docs/DECISIONS.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/DEFINITION_OF_DONE.md`, `docs/IMPLEMENTATION_BACKLOG.md`
- **ย้ายออก:** Completion Report → อ้าง `docs/DEFINITION_OF_DONE.md §8`
- **แก้ path:** `docs/GAME_VISION_GDD.md` และอื่น ๆ ตาม DEC-002

### A.2 Rules (`.claude/rules/`)
| ไฟล์ | การดำเนินการ | เหตุผล |
|---|---|---|
| `client.md`, `server.md` | คงไว้ตามเดิม | รูปแบบถูกต้อง และจะเริ่มทำงานเมื่อมี `apps/web` และ `apps/game-server` |
| `database.md` | ปรับ glob หลัง DEC-008 (ถ้า schema อยู่ใต้ `database/` ก็ใช้ได้ตามเดิม) | C-18 |
| **`shared.md` (ใหม่)** `paths: packages/**/*` | pure function เท่านั้นใน game-rules, ห้าม IO, Date หรือ Math.random, RNG และ clock ต้อง inject, contract ต้องมี Zod schema + version, ห้ามแก้ contract เงียบ ๆ | C-19 เพราะ logic หลักอยู่ที่นี่ |
| **`docs.md` (ใหม่)** `paths: docs/**/*` | ห้ามเขียนเอกสารใหม่ทั้งไฟล์, ให้ mark superseded แทนการลบ, อัปเดต STATUS พร้อมหลักฐาน, ห้ามเปลี่ยน DECISIONS เป็น Accepted เอง | ป้องกันเอกสารเบี่ยง |

### A.3 Skills (`.claude/skills/`) — เพิ่มทีละตัวเมื่อจำเป็น
| Skill | เริ่มใช้ | หน้าที่ | หมายเหตุ |
|---|---|---|---|
| `implement-task` | M0 หลัง T10 | `/implement-task M1-T02` → อ่าน task ใน backlog + `prompts/02` + DoD แล้วทำตาม workflow | `disable-model-invocation: true` และเป็น wrapper บางที่ชี้ไปที่ `prompts/02` เพื่อไม่ให้เนื้อหาซ้ำ (C-20) |
| `verify` | M0 หลัง T10 | รัน `pnpm verify` แล้วรายงาน output จริง | ห้ามสรุปว่าผ่านถ้าไม่ได้รัน |
| `milestone-gate` | จบ M0 | รวม `prompts/03` + `prompts/08` + เช็กลิสต์ gate ใน DoD §7 | ไม่บังคับ |

### A.4 Subagents (`.claude/agents/`) — 1 ตัวใน M0–M1
| Agent | tools | หน้าที่ |
|---|---|---|
| `reviewer` | `Read, Grep, Glob` (read-only และไม่มี Bash) | รีวิว diff ด้วยมุมของ `prompts/03` (code) และ `prompts/05` (2.5D art/tech ใน M1) แล้วรายงานตามระดับความรุนแรง ห้ามแก้ไฟล์ |
- เพิ่ม `security-reviewer` (มุมของ `prompts/04`) เมื่อเริ่ม M3 · **Open:** `model` ของ subagent เป็นการเลือกด้านค่าใช้จ่ายของผู้พัฒนา

### A.5 Hooks และ Permissions (`.claude/settings.json`)
- **M0 (ทันทีที่มี git):** `PreToolUse` matcher `Edit|Write` เรียก script **Node** (`node "$CLAUDE_PROJECT_DIR/.claude/hooks/guard-files.mjs"`) ที่ exit 2 เมื่อจะแก้ `.env*` หรือ `pnpm-lock.yaml` (lockfile ควรเปลี่ยนผ่าน pnpm เท่านั้น) **[F]** ไม่พบ `jq` ในเครื่อง จึงเสนอให้ใช้ Node แทน shell + jq
- **M0 หลัง T10:** ยังไม่เสนอ Stop hook ที่รัน `pnpm verify` ทุกครั้ง เพราะอาจช้า ให้ใช้ skill `verify` แทน แล้วพิจารณา PostToolUse formatter เฉพาะไฟล์ที่แก้ หลังตัดสิน DEC-010
- **Permissions ที่เสนอ (project, commit เข้า repo):**
  - `deny`: `Read(./.env)`, `Read(./.env.*)`, `Bash(git push --force *)`, `Bash(git push -f *)`, `Bash(git reset --hard *)`, `Bash(rm -rf *)`
  - `ask`: `Bash(git push *)`, `Bash(pnpm add *)`, `Bash(pnpm remove *)`, `Bash(pnpm update *)`, `Bash(pnpm prisma migrate *)`
  - `allow` (หลังคำสั่งมีจริง): `Bash(pnpm verify)`, `Bash(pnpm typecheck)`, `Bash(pnpm lint)`, `Bash(pnpm test *)`, `Bash(git status)`, `Bash(git diff *)`, `Bash(git log *)`
  - **หมายเหตุ [F]:** rule เหล่านี้ไม่ครอบคลุมทุกรูปแบบของคำสั่ง (เช่น `git -C . push`) จึงต้องมี branch protection บน remote ด้วย (DEC-011, DEC-039)

---

## ภาคผนวก B — แหล่งของเกณฑ์ "Done" ที่ซ้อนกัน (สำหรับ DEC-034)

| แหล่ง | สิ่งที่มี | ต่างจากแหล่งอื่น |
|---|---|---|
| `TEST_STRATEGY.md §2–3` (L11–25) | 10 quality gates + นิยาม done | มีข้อ "Production build succeeds", "No generated files committed" และ "Git diff reviewed" |
| `prompts/01 §Definition of Done` (L77–84) | 6 ข้อ | มีข้อ "known risks and next step are recorded" แต่ไม่มีข้อ build |
| `CLAUDE_TEMPLATE.md §Completion Report` (L34–41) | 6 หัวข้อรายงาน | มีข้อ "Recommended next task" |
| `AI_WORKFLOW.md §8` (L54–62) | 8 หัวข้อรายงาน | มีข้อ "Architecture decisions" และ "Commit recommendation" |
| `prompts/02` (L21–31) | workflow 8 ขั้น | มีข้อ "Do not claim completion if a test could not run" |

**[F]** ไม่มีข้อใดขัดแย้งกันตรง ๆ แต่แต่ละแหล่งไม่ครบเท่ากัน · `DEFINITION_OF_DONE.md` รวมทุกข้อเป็น superset โดยไม่ได้แก้แหล่งเดิม

---

## ภาคผนวก C — Tool & License Research Log

> ข้อมูลจากหน้าเว็บทางการ ณ วันที่ตรวจ **ราคาและเงื่อนไขเปลี่ยนได้** ให้ตรวจซ้ำก่อนซื้อหรือก่อนผูกโปรเจกต์กับเครื่องมือ · **นี่เป็นการสรุปจากเอกสาร ไม่ใช่คำปรึกษาทางกฎหมาย**

### C.1 Spine (Esoteric Software) — ตรวจ 2026-10-26
**ที่มา:** esotericsoftware.com/spine-purchase, /spine-runtimes-license, /spine-editor-license

| หัวข้อ | ข้อเท็จจริง [F] |
|---|---|
| Essential | $69 (ราคาปกติ $99) · "Meshes and other advanced features are not included" และหน้าราคาระบุ IK เป็นตัวอย่างของฟีเจอร์ที่มีเฉพาะใน Professional · named user (1 คนต่อ license) |
| Professional | $379 (ราคาปกติ $449) · ครบทุกฟีเจอร์ · named user |
| Enterprise | $2,499 + $379 ต่อคน · license รายปี · **บังคับใช้เมื่อธุรกิจมีรายได้เกิน $500,000 USD ต่อปี** (หน้าราคาเขียนทั้ง "more than" และ "or more" จึงคลุมเครือเล็กน้อย) |
| การอัปเดต | Essential และ Professional: "All future updates are provided, without any additional charges" (หน้าเว็บไม่ได้เขียนคำว่า "one-time" ตรง ๆ) |
| ใช้ runtime ในเกม | "Your Spine license also grants you permission to use the Spine Runtimes in your games and applications" |
| แจกจ่ายเกม | Editor License §2.2 อนุญาตให้ "market, sell, publish, distribute" runtime ที่อยู่ในเกม และ**ไม่ได้กำหนดให้ผู้เล่นต้องมี license** |
| Royalty | ไม่พบเงื่อนไข royalty หรือส่วนแบ่งรายได้ |
| เขียน renderer เองสำหรับ Babylon | ทำได้ในฐานะ derivative work (§2.1, §2.4) แต่ต้องมี license ที่ยังใช้ได้ตอนนำเข้า และผู้ที่แก้ runtime ต้องมี license ของตัวเอง |
| เงื่อนไขอื่น | ต้องแนบข้อความ license (Exhibit A) ไว้ในเอกสารของเกม · ผลิตภัณฑ์ต้องเพิ่ม "significant and primary functionality" (เกมเข้าข่าย) |
| License หมดอายุ | สิทธิ์แจกจ่ายที่ได้ไปแล้วยังอยู่ (§2.2, §2.3 survive) แต่ต้องมี license ที่ยังใช้ได้เมื่อนำ runtime เข้าผลิตภัณฑ์ใหม่ |
| ข้อความที่อาจสับสน | หน้า Runtimes License เขียนว่า "each user of the Products must obtain their own Spine Editor license" แต่ §2.2 และหน้าราคายืนยันว่าแจกจ่ายเกมได้โดยผู้เล่นไม่ต้องมี license จึง**น่าจะหมายถึงนักพัฒนาที่ใช้ runtime** **[?]** |
| ยังไม่ได้ตรวจ | Spine มีรุ่นทดลองที่ export ไฟล์ได้หรือไม่ (มีผลว่าต้องซื้อก่อนเริ่ม M1-T19 หรือไม่) |

**สรุปสำหรับโปรเจกต์ [R]:** สำหรับ solo dev ต้นทุนของ A3-S คือ **Professional $379 × 1 คน** (Essential ไม่มี mesh และ IK จึงเสี่ยงไม่ผ่าน G4) ไม่มีค่าใช้จ่ายต่อผู้เล่น แต่ต้องเขียนและดูแล renderer บน Babylon เอง เพราะไม่มี runtime ทางการ
**สถานะ (2026-10-26):** ผู้พัฒนายังไม่ยอมรับค่าใช้จ่าย จึง**พัก A3-S ไว้** (DEC-058) ซึ่งเปิดทบทวนได้

### C.2 PixelLab — ตรวจ 2026-10-26
**ที่มา:** pixellab.ai/termsofservice และคำตอบจากระบบ help ของ PixelLab (ผ่าน MCP `search_help`)

| หัวข้อ | ข้อเท็จจริง [F] |
|---|---|
| ประเภท | AI สร้างภาพ **pixel art** (ตัวละคร, แอนิเมชัน, tile) ไม่ใช่เครื่องมือทำ skeletal animation |
| สไตล์ | "PixelLab's tools are for pixel art" และไม่มีวิธีที่ระบุไว้ในเอกสารสำหรับสร้างภาพวาด HD |
| ความละเอียด | `create_character` สูงสุด 128×128 (standard/pro) และ 256×256 (v3) · `animate_with_skeleton_v3` สูงสุด 256×256 · ไม่มี canvas 256×384 |
| แอนิเมชัน | `animate_with_skeleton_v3` ส่งออกเป็น **frame ที่เรนเดอร์แล้ว** ไม่มีไฟล์ rig เช่น Spine JSON |
| Paper-doll | ไม่มีการ export แยกชั้นชุด ผลลัพธ์ถูก flatten |
| Format | PNG, GIF, PNG spritesheet |
| ToS: ความเป็นเจ้าของ | "You retain ownership of any content you create using PixelLab" |
| ToS: เชิงพาณิชย์ | ใช้ได้ "for both commercial and non-commercial purposes with no need for permission" และไม่ได้ผูกกับแผนราคา · ไม่ต้องให้เครดิต |
| ToS: ข้อจำกัด | ห้ามนำภาพไป train model อื่นโดยไม่ได้รับอนุญาต · ต้องปฏิบัติตาม Open RAIL-M · ผู้ใช้รับผิดชอบทางกฎหมายต่อเนื้อหาเอง · PixelLab อาจเก็บ input และ output ไว้เพื่อ debug และปรับปรุง |
| ราคา | ยังไม่ได้ตรวจ |

**ผลประเมิน [R]:**
- **ไม่ใช้สำหรับตัวละคร asset ในเกม หรือ placeholder ของ VP0** เพราะขัด DEC-040 (ห้าม pixel art), ความละเอียดไม่พอ, ไม่รองรับ paper-doll (DEC-045) และถ้าใช้เป็น placeholder จะทำให้ผลการประเมินภาพ HD-2D ใน VP0 คลาดเคลื่อน
- จะเปลี่ยนการตัดสินนี้ได้เฉพาะเมื่อผู้พัฒนาอนุญาตเปลี่ยน art direction

### C.3 Blender (สำหรับ A3-B) — ตรวจ 2026-10-26
**ที่มา:** blender.org/about/license และ doc.babylonjs.com (glTF importer)

| หัวข้อ | ข้อเท็จจริง [F] |
|---|---|
| License ของโปรแกรม | GNU GPL (source เป็น "GPL Version 2 or later" และ binary แจกจ่ายภายใต้ GPL v3 or later) · ฟรี |
| ผลงานที่สร้าง | "What you create with Blender is your sole property" ครอบคลุมภาพ วิดีโอ ไฟล์ `.blend` และ "other data files Blender can write" (หน้าเว็บไม่ได้ระบุ glTF ตรง ๆ แต่เข้าข่ายไฟล์ที่ Blender เขียนได้) |
| ใช้เชิงพาณิชย์ | ใช้ได้ฟรี รวมถึงทำเกมเชิงพาณิชย์ |
| ข้อควรระวัง | script ที่ใช้ Python API (`bpy`) **ถ้าเผยแพร่** ต้องใช้ license ที่เข้ากันกับ GPL · script export ที่ใช้ภายในและไม่เผยแพร่ไม่น่าเป็นปัญหา **[?]** · โค้ดเกมไม่ได้ link กับ Blender จึงไม่ได้รับผลกระทบ |
| Babylon รองรับ glTF skinning | docs ของ glTF importer อ้างถึงหน้า "Skinning" สำหรับ glTF 2.0 · รายละเอียดของ animation group และข้อจำกัดต้องตรวจใน spike **[?]** |
| สถานะในเครื่อง | ไม่พบ `blender` ใน PATH (`IMPLEMENTATION_STATUS.md §2.3`) |

**สรุปสำหรับโปรเจกต์ [R]:** A3-B **ไม่มีค่า license** และ**ไม่ต้องเขียน runtime เอง** แต่ต้องรับข้อแลกเปลี่ยนด้าน workflow (Blender ไม่ได้ออกแบบมาเพื่อแอนิเมชัน 2D) และต้องจัดการ draw order กับ depth ภายในตัวละครเอง (`VISUAL_PROTOTYPE_PLAN.md §2.3`)

### C.4 ยังไม่ได้ตรวจ
เครื่องมือ 2D skeletal อื่น (เช่น Rive) ยังไม่ได้ตรวจเงื่อนไข ราคา และการรองรับ Babylon จึงยังไม่ได้รวมไว้ในตัวเลือก
