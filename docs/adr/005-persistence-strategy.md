# ADR-005 — Persistence write strategy และ character lease

- **Status:** **Draft** · **Date:** 2026-10-26 · จะเปลี่ยนเป็น Accepted ใน M3-T12 (M3 exit criterion 6)
- **ผู้ตัดสิน:** ผู้พัฒนาอนุมัติทิศทางตามข้อเสนอใน DEC-019 (2026-10-26) · รายละเอียดที่ยังต้องยืนยันอยู่ในหัวข้อ "ต้องยืนยันก่อน Accept"
- **เกี่ยวข้อง:** `docs/DECISIONS.md` DEC-019 (C-23, R-01, R-07, R-21) · `DATABASE_AND_ECONOMY.md` §3 และ §5 (L41) · `CLAUDE.md` rule 7 · `.claude/rules/database.md`

## Context
- DATABASE §5 L41 ให้ "persist on important state transitions and periodically" และ §3 ให้ใช้ transaction กับรางวัลและการซื้อขาย แต่ไม่ได้บอกว่าข้อมูลมีต้นฉบับอยู่ที่ไหน (C-23)
- ถ้า room state กับ DB ไม่ตรงกันตอน server crash ไอเทมอาจถูก duplicate ซึ่งเป็นความเสี่ยงระดับ Critical (R-01)
- ถ้าผู้เล่นคนเดียว login จากสองที่ ตัวละครอาจถูกเขียนทับกัน (R-07)
- DB I/O ที่ block tick ทำให้ทั้ง room กระตุก (R-21)

## Decision (ร่าง)
1. **ข้อมูลที่มีมูลค่า** (item, currency, XP ที่ได้, การจบ quest): ใช้ DB transaction พร้อม idempotency key ที่ unique (`sourceEventId`) · commit ให้สำเร็จก่อน แล้วจึงแก้ room state · ถ้า commit ล้มเหลวจะไม่มีอะไรเปลี่ยน
2. **ข้อมูลที่ไม่มีมูลค่า** (ตำแหน่ง, HP ปัจจุบัน): อยู่ในหน่วยความจำ บันทึกเป็น checkpoint ตอน logout, เปลี่ยน zone และตามรอบเวลา · ยอมรับว่าหายได้ไม่เกินช่วง checkpoint
3. **Character lease:** `Character.activeSessionId` + `leaseExpiresAt` อัปเดตใน transaction ตอน join · ถ้ายังมี lease ที่ไม่หมดอายุให้ปฏิเสธการ join · ต่ออายุเป็นระยะระหว่างเล่น
4. **ห้าม DB I/O แบบ blocking ใน tick:** entity อยู่ในสถานะ "pending" ระหว่างรอ commit

## ต้องยืนยันก่อน Accept (M3-T12)
- ช่วงเวลา checkpoint และอายุของ lease
- รูปแบบของ `sourceEventId` และ unique constraint ใน schema (M4)
- ผลของ integration test ที่ kill server ระหว่างต่อสู้แล้วต้องไม่มี dupe (AC ของ M4)

## Alternatives ที่พิจารณา
- **เก็บทุกอย่างในหน่วยความจำแล้ว snapshot เป็นรอบ:** ง่ายกว่า แต่ถ้า crash ระหว่าง snapshot จะ dupe หรือ rollback (R-01) → ไม่เลือก
- **Event sourcing:** audit ได้ดี แต่หนักเกินไปสำหรับ solo developer → ไม่เลือกใน VS0
- **เขียน DB ทุก tick:** โหลดสูงและ block tick → ไม่เลือก

## Consequences
- **ข้อดี:** ข้อมูลที่มีมูลค่าไม่หายและไม่ซ้ำแม้ server crash · การ login ซ้อนถูกกันที่ DB
- **ข้อเสีย:** การให้รางวัลจะช้ากว่าการแก้ state อย่างเดียวเท่ากับเวลา commit · ตำแหน่งอาจย้อนไปที่ checkpoint ล่าสุดหลัง crash
