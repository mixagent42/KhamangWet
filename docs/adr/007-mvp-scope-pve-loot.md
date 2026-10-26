# ADR-007 — ขอบเขต MVP: PvE เท่านั้น และกติกา loot

- **Status:** Accepted · **Date:** 2026-10-26
- **ผู้ตัดสิน:** ผู้พัฒนาอนุมัติตามข้อเสนอใน DEC-021 และ DEC-022 (2026-10-26)
- **เกี่ยวข้อง:** `docs/DECISIONS.md` DEC-021 (D-01, C-06) และ DEC-022 (D-05, C-05) · `GAME_VISION_GDD.md` §6 และ §7 (แก้ใน M0-T12) · `COMBAT_SPEC.md` L43 · `ROADMAP.md` L69 · ADR-005

## Context
- เอกสารขัดกันเรื่อง PvP: GDD L4 เขียนว่า "cooperate or compete" และ COMBAT L43 พูดถึง "PvP scaling" แต่ GDD §6 (MVP) ไม่มี PvP (C-06)
- ยังไม่มีกติกาว่าใครได้ loot เมื่อหลายคนช่วยกันตี และ co-op ใน MVP ยังไม่มีระบบ party (C-05) ซึ่ง ROADMAP L69 เลื่อนไป M8

## Decision
1. **MVP เป็น PvE เท่านั้น** · PvP ทุกรูปแบบอยู่ในรายการ deferred ของ GDD §7
2. สูตร damage ต้องเปิดทางให้เพิ่ม scaling ตามบริบทในอนาคต (เช่น ตัวคูณแยกสำหรับ PvP) แต่ยังไม่ implement ส่วนนี้
3. **Personal loot:** ทุกคนที่มีส่วนร่วม (ทำ damage อย่างน้อย X% หรือถูก enemy โจมตีภายในช่วงเวลาที่กำหนด) ได้ roll ของตัวเอง · X และช่วงเวลาเป็นค่า config ใน `packages/game-data`
4. ไม่มีการแย่ง loot · party loot ไว้ M8 (ROADMAP L69)
5. การ roll และการให้ item ทำที่ server และบันทึกตาม ADR-005 (transaction + idempotency)

## Alternatives ที่พิจารณา
- **ใส่ PvP ใน MVP:** ขอบเขตงาน anti-cheat และ balance ใหญ่ขึ้นมาก → ไม่เลือก
- **คนตีแรกหรือคนทำ damage สูงสุดได้ loot:** ทำให้แย่ง kill กัน → ไม่เลือก
- **loot กองรวมให้เก็บ:** ต้องมีกติกาความเป็นเจ้าของและการแบ่ง → ไม่เลือก

## Consequences
- **ข้อดี:** ขอบเขต MVP เล็กลงชัดเจน · ไม่มีข้อพิพาทเรื่อง loot ระหว่างผู้เล่น
- **ข้อเสีย:** server ต้องเก็บ contribution ต่อ enemy · ค่าขั้นต่ำ X ต้องปรับจาก playtest เพื่อกันคนที่ไม่ได้ช่วยมารับของ
- **เอกสารที่แก้ตาม:** GDD §7 (M0-T12) · GDD L4 และ COMBAT L43 คงไว้ เพราะเป็นวิสัยทัศน์และข้อกำหนดสำหรับอนาคต
