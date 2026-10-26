# DEFINITION OF DONE — Khamang Wet

- **สร้างเมื่อ:** 2026-10-26 · **สถานะ:** Draft ที่รออนุมัติ (DEC-034)
- **ขอบเขต:** เกณฑ์รับงานและ test ที่ต้องผ่าน ตั้งแต่ระดับ task จนถึงระดับ milestone
- **ความสัมพันธ์กับเอกสารเดิม [F]:** ไฟล์นี้**รวม** (superset) เกณฑ์จาก `TEST_STRATEGY.md §2–3`, `prompts/01 §Definition of Done`, `CLAUDE_TEMPLATE.md §Completion Report`, `AI_WORKFLOW.md §8` และ `prompts/02` โดย**ไม่ได้แก้ไฟล์เหล่านั้น** ความแตกต่างระหว่างแหล่งดูได้ใน `DECISIONS.md` ภาคผนวก B · test case รายโดเมนยังใช้ `TEST_STRATEGY.md §4–7` เป็นต้นฉบับ ไฟล์นี้แค่อ้างถึง
- ป้าย: **[F]** = มาจากเอกสารต้นฉบับ (ระบุที่มา) · **[R]** = เพิ่มโดยข้อเสนอนี้

---

## 1. หลักการ

1. **[F]** งานยังไม่ done แค่เพราะ compile ผ่านหรือดูน่าจะถูก ต้องตรง acceptance criteria, จัดการ error case, test ผ่าน และทำซ้ำได้ (TEST §3 L25)
2. **[F]** ห้ามอ้างว่า test หรือ build ผ่านถ้าไม่ได้รันจริง (CLAUDE_TEMPLATE L18; prompts/02 L31)
3. **[F]** แหล่งความจริงคือโค้ด, test, เอกสารที่อนุมัติแล้ว และพฤติกรรมที่วัดได้ ไม่ใช่ประวัติแชต (AI_WORKFLOW §1 L4)
4. **[R]** หลักฐานต้องตรวจซ้ำได้: ทุกข้อที่บอกว่า "ผ่าน" ต้องมีคำสั่งและ output หรือ path ของ artifact
5. **[R]** CI และ local ใช้ gate เดียวกัน ผ่าน `pnpm verify` (§6)

---

## 2. ระดับของ Done

| ระดับ | หน่วยงาน | เกณฑ์ | ผู้ตัดสิน |
|---|---|---|---|
| **Task Done** | 1 task ใน backlog = 1 branch = 1 squash commit | §3 + test ตามประเภทงาน (§4) | ผู้พัฒนา (AI เสนอ) |
| **Feature Done** | กลุ่ม task ที่ส่งมอบพฤติกรรม 1 อย่าง | Task Done ครบ + test ข้ามระบบ (integration/E2E) ตาม §5 | ผู้พัฒนา |
| **Milestone Gate** | M0…M8 | §7 + gate ใน `ROADMAP.md` + exit criteria ใน `IMPLEMENTATION_BACKLOG.md` | ผู้พัฒนาเท่านั้น |
| **Release Ready** | closed test (M7) ขึ้นไป | `prompts/07_RELEASE_CHECK.md` ให้ผล Go พร้อมหลักฐาน | ผู้พัฒนาเท่านั้น |

---

## 3. Task DoD — Universal Checklist

ทุกข้อต้องเป็น ☑ หรือ **N/A พร้อมเหตุผล** ถ้ามีข้อใดเป็น ☐ ถือว่า task ยังไม่ done

| # | เกณฑ์ | ที่มา |
|---|---|---|
| 1 | เขียน acceptance criteria **ก่อน**เริ่มเขียนโค้ด และอ้าง task ID ใน backlog | TEST §2.1; AI_WORKFLOW §2 |
| 2 | แก้เฉพาะ allowed scope ไม่แก้ไฟล์ที่ไม่เกี่ยวข้อง ไม่ refactor นอกขอบเขต | TEST §2.6; prompts/01 #14 |
| 3 | เพิ่มหรือแก้ test ที่เกี่ยวข้องตาม §4 และถ้าเป็น bug fix ต้องมี regression test | TEST §2.2; CLAUDE_TEMPLATE L23 |
| 4 | `typecheck` ผ่าน | TEST §2.3 |
| 5 | `lint` ผ่าน รวมถึง import boundary | **[R]** (DEC-010) |
| 6 | unit/integration test ผ่าน หรือรายงาน failure อย่างโปร่งใส (§9) | TEST §2.4 |
| 7 | production `build` ผ่าน | TEST §2.5 |
| 8 | ไม่มี secret, credential, token หรือ production data และไม่มี generated file หลุดเข้า commit | TEST §2.7; CLAUDE_TEMPLATE L19 |
| 9 | ไม่เพิ่ม dependency ใหม่โดยไม่มีเหตุผล การตรวจ compatibility และ license และไม่มีการอนุมัติ | CLAUDE_TEMPLATE L16; prompts/01 #9 |
| 10 | ไม่เปลี่ยน shared interface, network contract, DB schema หรือ architecture แบบเงียบ ๆ ถ้าเปลี่ยนต้องมี entry ใน `DECISIONS.md` | prompts/01 #10 |
| 11 | ถ้าแก้ schema ต้องผ่าน migration และทดสอบบน DB ที่ทิ้งได้ | `.claude/rules/database.md` L7–8 |
| 12 | รีวิว git diff แล้ว (รวมถึงการรีวิวโดย subagent `reviewer` เมื่อมี) | TEST §2.10; AI_WORKFLOW §4.5 |
| 13 | มีขั้นตอนทำซ้ำหรือทดสอบด้วยมือ | TEST §2.8 |
| 14 | บันทึกความเสี่ยงและข้อจำกัดที่รู้ | TEST §2.9; prompts/01 DoD |
| 15 | อัปเดตเอกสารเฉพาะส่วนที่พฤติกรรมหรือการตัดสินใจเปลี่ยน | AI_WORKFLOW §4.6 |
| 16 | อัปเดต `IMPLEMENTATION_STATUS.md` พร้อมหลักฐาน (คำสั่ง + ผล + วันที่) | **[R]** |
| 17 | รายงานปิดงานครบตาม §8 | CLAUDE_TEMPLATE §Completion; AI_WORKFLOW §8 |
| 18 | CI ของ branch เป็นสีเขียวก่อน merge (เมื่อมี CI แล้ว) | **[R]** (DEC-011) |

---

## 4. Test ที่ต้องมีตามประเภทงาน **[R]**

| ประเภทงาน (path) | Unit | Contract | Room integration | DB integration | E2E | Visual QA (manual) | Perf capture |
|---|---|---|---|---|---|---|---|
| `packages/game-rules` | **ต้องมี** (seeded RNG + injected clock) | — | ถ้ากระทบ server | — | — | — | — |
| `packages/shared-contracts` | **ต้องมี** | **ต้องมี** (valid + invalid + oversized) | ถ้ามี message ใหม่ | — | — | — | — |
| `packages/game-data` | schema validation ตอน build | — | — | ถ้ากระทบ instance ใน DB (`dataVersion`) | — | — | — |
| `apps/game-server` (rooms, movement, combat) | **ต้องมี** สำหรับ logic ที่แยกได้ | ต้องมี | **ต้องมี** | ถ้าแตะ persistence | smoke เมื่อพฤติกรรมเปลี่ยน | — | tick metrics ถ้าเกี่ยว hot path |
| Persistence / migrations | — | — | ต้องมี | **ต้องมี** (rollback, idempotency, concurrency) | relog flow | — | DB latency |
| `apps/web` rendering | ถ้าเป็น logic ที่แยกได้ | — | — | — | smoke (debug hook) | **ต้องมี** (TEST §6) | **ต้องมี** ถ้าแตะ render loop หรือ asset |
| `apps/web` UI / React | component logic | — | — | — | ถ้าอยู่ใน flow หลัก | ต้องมี | — |
| Assets | — | — | — | — | missing asset → fallback | **ต้องมี** + manifest และ license (ART §6) | texture memory |
| Dependencies / config | `pnpm verify` ทั้งหมด | ทั้งหมด | ทั้งหมด | ทั้งหมด | smoke | — | ถ้าเป็น renderer หรือ server runtime |
| เอกสารอย่างเดียว | — | — | — | — | — | — | — (ตรวจลิงก์และ path ว่าถูกต้อง) |

---

## 5. Mandatory Test Catalog (รายโดเมน)

> ต้นฉบับของ test case อยู่ในเอกสารที่อ้างถึง ส่วนนี้ระบุว่า case ใด**ต้องมีก่อนผ่าน gate ไหน**

| โดเมน | Test cases (ต้นฉบับ) | ต้องมีก่อน |
|---|---|---|
| Combat rules | TEST §4 L28–36; COMBAT §11 L95–102 (ตาย, silenced, cooldown, resource, range, spoofed damage, duplicate, area geometry, dodge, definition ที่ไม่ครบต้องล้ม) | M2 gate (ส่วนที่ไม่ใช้ network) และ M3 gate (ส่วนที่ใช้ network) |
| Multiplayer consistency | TEST §1 L7; COMBAT L101 (2 client เห็น HP และ status สุดท้ายตรงกัน) | M3 gate |
| Network hardening **[R]** | message ผิด schema, ขนาดเกิน, เกิน rate, ไม่ได้ auth, ส่ง request ที่ไม่ใช่ห้องของตัวเอง → ถูกปฏิเสธและ room ไม่ล่ม (NETWORK §1; SECURITY §3 L45) | M3 gate |
| Movement **[R]** | speed hack, เดินเข้าพื้นที่ห้ามเดิน, sequence ซ้ำหรือย้อนหลัง, hash ของ walkable data ตรงกันทั้งสองฝั่ง (COMBAT §6; DEC-016, DEC-017) | M1 (local), M3 |
| Inventory / loot | TEST §5 L39–44; SECURITY §3 L40–42 | M4 gate |
| Persistence **[R]** | relog คงสภาพ, ส่ง reward ซ้ำ, ย้าย item พร้อมกัน, crash ระหว่าง grant, login ตัวละครเดียวกันซ้อน (DEC-019) | M4 gate |
| Security | SECURITY §3 L39–46 ทั้งหมด | M4 (ส่วน auth), M7 (ทั้งหมด) |
| Visual | TEST §6 L47–52 | M1 gate และทุกครั้งที่แตะ renderer |
| Performance | TEST §7 L55–62 + DEC-029 | M1 (baseline), M3 (server), M6 |
| Reconnect | NETWORK §4 L32–37; TEST §4 L36 | M3 gate |

---

## 6. Enforcement — `pnpm verify` และ CI (ข้อเสนอ, DEC-011 / DEC-013)

> **[F]** ตอนนี้ยังไม่มีคำสั่งใดใน repository (`IMPLEMENTATION_STATUS.md §2.2`) ชื่อคำสั่งด้านล่างเป็น**ข้อเสนอ**ที่จะสร้างใน M0-T10
> **อัปเดต 2026-10-26 (M0-T10):** `pnpm verify` มีจริงแล้วและผ่าน (`IMPLEMENTATION_STATUS.md §2.1 M0-T10`) · คำสั่งอื่นในตาราง 6.1 ยังเป็นข้อเสนอ

### 6.1 คำสั่ง local
| คำสั่ง (เสนอ) | ทำอะไร | ใช้เมื่อ |
|---|---|---|
| `pnpm verify` ✔ (M0-T10) | typecheck → lint → unit test → build (ทุก package) → **format:check** (เพิ่มใน M0-T10 ตามที่ผู้พัฒนาอนุมัติ) · lint รวม fixture test ของ import boundary · หยุดที่ขั้นแรกที่ fail | ก่อน commit ทุกครั้ง และ CI tier 1 |
| `pnpm test:integration` | room + DB integration (ต้องมี PostgreSQL ตาม DEC-009) | ก่อน merge งานที่แตะ server หรือ DB |
| `pnpm test:e2e` | Playwright 2 client ผ่าน debug hook | ก่อน merge งานที่แตะ flow หลัก และ nightly |
| `pnpm perf:capture` | benchmark scene และ server tick capture แล้วบันทึกลง `docs/perf/` | งานที่แตะ render loop, asset หรือ hot path |

### 6.2 CI tiers (สำหรับ solo developer)
| Tier | Trigger | Jobs | เป้าเวลา **[R]** |
|---|---|---|---|
| 1 | ทุก push | `pnpm install --frozen-lockfile` + `pnpm verify` | ≤ 10 นาที |
| 2 | PR หรือ merge เข้า `main` | tier 1 + `test:integration` (PostgreSQL service container) + E2E smoke | ≤ 20 นาที |
| 3 | nightly หรือสั่งเอง | E2E เต็ม + load test (หลัง M3) + dependency audit + build จาก clone ใหม่ | ไม่จำกัด |

- ป้องกัน `main` ด้วย branch protection ให้ merge ได้เมื่อ tier 1–2 เขียวเท่านั้น (ต้องมี remote ตาม DEC-039)
- เก็บ Playwright trace, screenshot และ perf JSON เป็น CI artifact
- **ห้าม** ปิด test ที่ fail เพื่อให้ CI ผ่าน ถ้า test ไม่เสถียร ให้ทำตาม §9.3

---

## 7. Milestone Gate DoD

Milestone ผ่านได้เมื่อ:
1. task ทุกตัวใน milestone เป็น Done หรือถูกย้ายออกพร้อมเหตุผลใน backlog
2. exit criteria ของ milestone (`IMPLEMENTATION_BACKLOG.md`) มีหลักฐานครบทุกข้อ
3. decision ที่ milestone นี้ต้องปิด (`DECISIONS.md §1` คอลัมน์ "ต้องปิดก่อน") เป็น Accepted
4. รัน `prompts/03_CODE_REVIEW.md` บน diff ของทั้ง milestone และ `prompts/08_DOC_SYNC.md` แล้ว และไม่มี finding ระดับ Critical หรือ High ค้าง
5. อัปเดต `IMPLEMENTATION_STATUS.md` และ risk register แล้ว
6. tag `mN-gate` ที่ commit ที่ผ่าน (DEC-012)
7. ผู้พัฒนาประกาศผ่านด้วยตัวเอง โดย AI ไม่ประกาศแทน

**Evidence bundle ต่อ gate:** output ของ `pnpm verify` และ test tier 2–3 · Playwright report · perf JSON และเงื่อนไขการวัด · screenshot ของ visual QA · รายการ decision ที่ปิดแล้ว · รายการ known issue

---

## 8. Completion Report Template (รวมจาก 4 แหล่ง)

```
## Task <ID> — <title>
**Summary:** <1–3 บรรทัด>
**Acceptance criteria:** <แต่ละข้อ: ☑/☐ + หลักฐาน>
**Files changed:** <path: ทำอะไร>
**Decisions:** <DEC-xxx ที่เกี่ยวข้อง / ใหม่ / ไม่มี>
**Commands actually run:** <คำสั่ง → exit code → สรุป output>
**Tests:** <เพิ่ม/แก้อะไร, ผลจริง, ที่ไม่ได้รันพร้อมเหตุผล>
**Manual verification steps:** <ขั้นตอน>
**Known limitations / risks:** <...>
**Status doc updated:** <yes/no + section>
**Follow-up tasks:** <backlog IDs>
**Commit recommendation:** <message ที่เสนอ>
```

---

## 9. กฎการรายงานผลอย่างซื่อตรง

1. **ไม่ได้รัน = ไม่ผ่าน** ให้รายงานว่า "ไม่ได้รัน เพราะ …" ห้ามใช้คำว่า "น่าจะผ่าน"
2. **Fail ต้องแนบ output** ส่วนที่ล้มเหลวพร้อมการวิเคราะห์สาเหตุ ห้ามสรุปว่า "มีปัญหาเล็กน้อย"
3. **Flaky test:** ห้ามลบหรือ skip เงียบ ๆ ให้ mark ว่า quarantine พร้อม issue หรือ task ID และวันหมดอายุ ถ้าเกิน 1 milestone ต้องแก้หรือลบผ่านการตัดสินใจ
4. **Partial:** ถ้า acceptance criteria ผ่านไม่ครบ สถานะของ task คือ Partial ใน STATUS ไม่ใช่ Done
5. **Skip เพราะเครื่องมือไม่มี** (เช่น ไม่มี PostgreSQL) ให้ระบุใน report และ STATUS และ gate จะยังไม่ผ่าน
6. **หลักฐานที่อ้างว่าอยู่ใน git ต้องตรวจว่าอยู่จริง:** root `.gitignore` ignore `*.log` ถ้าต้องเก็บ log ไว้ใน commit ให้ใช้ `git add -f` แล้วตรวจด้วย `git ls-tree -r <commit>` ก่อนอ้างถึงในเอกสาร (บทเรียนจาก M0-T06 ที่ log ไม่ได้เข้า commit `15a0b05`)

---

## 10. Rollback และ Recovery (ข้อเสนอ, DEC-012)

| สถานการณ์ | ขั้นตอน |
|---|---|
| Task ที่ merge แล้วทำให้เกิด regression | (1) หยุดเพิ่มฟีเจอร์ (2) `git revert <squash-commit>` บน branch ใหม่ แล้วรัน `pnpm verify` และ merge (3) แก้ใน branch ใหม่พร้อม regression test (4) อัปเดต rule หรือ skill ถ้าเป็นความผิดซ้ำของ AI (AI_WORKFLOW §7 L45–52) |
| milestone ทั้งชุดมีปัญหา | สร้าง branch จาก tag `mN-gate` ล่าสุดเพื่อเปรียบเทียบ ใช้ revert ทีละ commit และ**ห้าม force-push `main`** |
| AI แก้ไฟล์ผิดระหว่างเซสชัน (ยังไม่ commit) | `git diff` → `git restore <file>` เฉพาะไฟล์ที่ผิด (ต้องยืนยันก่อนเพราะทำลายงานที่ยังไม่ commit) และใช้ checkpoint ของ Claude Code ได้ในเซสชันเดียวกัน |
| Migration ที่ apply แล้วมีปัญหา | สร้าง migration ใหม่ที่แก้ไข (forward-only) ห้ามแก้ไฟล์ migration เดิม · ใน environment ที่ใช้ร่วมกัน ให้ backup ก่อน migrate เสมอและ restore ตามขั้นตอนที่ซ้อมไว้ |
| Game-data เปลี่ยนแล้ว instance เดิมเสีย | ใช้ content migration script ตาม `dataVersion` และห้ามลบ id (DEC-030) |
| Dependency update ทำให้พัง | revert commit ที่แก้ lockfile (ต้อง update dependency ใน commit แยกเสมอ) |
| ฟีเจอร์เสี่ยงที่อยู่ใน main | ปิดด้วย config flag แล้ว revert ตามปกติ (flag ไม่ใช่ที่เก็บงานที่ยังไม่เสร็จระยะยาว) |

**[R]** ซ้อม rollback อย่างน้อย 1 ครั้งต่อ milestone ใน M0–M4 (revert 1 commit แล้วตรวจว่า CI เขียว) เพื่อพิสูจน์ว่าขั้นตอนใช้ได้จริง

---

## 11. ยังไม่ Done ถ้า…
- compile ผ่าน แต่ไม่มี test ของ acceptance criteria
- test ผ่านเฉพาะเครื่องเดียว และไม่ผ่านจาก clone ใหม่หรือใน CI
- ผลลัพธ์ทางเกม (damage, loot, position) คำนวณที่ client
- ใช้ข้อมูลหรือตัวเลขจาก client เป็นผลสุดท้าย
- มี TODO ที่กระทบความถูกต้องของข้อมูลที่มีมูลค่า
- มี dependency ใหม่ที่ไม่ได้อนุมัติ หรือ version ไม่ pin
- เอกสารยังอธิบายพฤติกรรมที่ต่างจากที่ทำจริง
- รายงานไม่มีคำสั่งและผลจริงที่รัน
