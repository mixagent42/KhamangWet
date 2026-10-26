# ADR-004 — Authority และ netcode model

- **Status:** Accepted · **Date:** 2026-10-26
- **ผู้ตัดสิน:** ผู้พัฒนาอนุมัติตามข้อเสนอใน DEC-017 และ DEC-018 (2026-10-26)
- **เกี่ยวข้อง:** `docs/DECISIONS.md` DEC-017 (D-16, D-18, C-13, C-14, C-15) และ DEC-018 (D-19, R-05) · `TECHNICAL_ARCHITECTURE.md` §3 และ L126 · `NETWORK_PROTOCOL.md` §2 (L15 แก้ใน M0-T12) · `COMBAT_SPEC.md` L35 · ADR-001 (Colyseus 0.18)

## Context
- client ไม่น่าเชื่อถือ server ต้องเป็นผู้ตัดสินผลทุกอย่างที่มีผลต่อเกม (`CLAUDE.md` rule 5, TECH §3)
- เอกสารเดิมขัดกัน 3 จุด: `MoveInput` ให้ส่ง "input duration" ได้ซึ่งทำให้ client กำหนดระยะเอง (C-15) · `MoveState` ซ้ำกับ room state (C-14) · combat event มีหลายรูปแบบ (C-13)
- **[F] จาก spike M0-T06:** `onMessage(type, zodSchema, handler)` ของ Colyseus 0.18.23 ตัดการเชื่อมต่อ client (code 4002) เมื่อ payload ไม่ผ่าน ส่วน `safeParse` ใน handler ทิ้ง message โดยไม่ตัด · Colyseus 0.18 มี `InputBufferImpl`, `setSimulationInterval`, `StateView` และ `Rewind`/`RewindView` **[?]** ยังไม่ได้ทดสอบ

## Decision
### Authority
1. server ตัดสินตำแหน่ง, combat, status, loot, inventory, currency และ progression
2. client ทำนายเฉพาะการเดินของตัวเอง (client-side prediction) แล้ว reconcile ตาม `sequence` ที่ server ยืนยัน · ผู้เล่นและ entity อื่นใช้ interpolation

### Messages
3. `MoveInput = { sequence, direction }` โดย `direction` เป็น unit vector บนระนาบ XZ · **ไม่มี input duration** · server คำนวณระยะจาก tick ของตัวเอง
4. ตำแหน่งอยู่ใน room state ที่ sync อัตโนมัติ · `MoveState` ใช้เป็น ack ของ `sequence` ให้ client เจ้าของตัวละครเท่านั้น ถ้าจำเป็น
5. combat event เป็น discriminated union เดียวใน `packages/shared-contracts` พร้อม protocol version

### เวลาและการตัดสินว่าโดน (DEC-018)
6. VS0 **ไม่ rewind:** server ตัดสินด้วยตำแหน่ง ณ tick ที่ resolve ซึ่งเป็น "defined simulation moment" ของ COMBAT L35
7. windup ของ telegraph ต้องนานพอให้ผู้เล่นตอบสนองทันแม้มี latency · ตัวเลขอยู่ใน `packages/game-data` และปรับจาก playtest
8. i-frame ของ `ward_step` เป็นช่วงที่ server กำหนดบวก grace สั้น ๆ เป็นค่า config
9. tick rate และ patch rate เป็นค่า config เลือกค่าเริ่มต้นใน M3-T05 แล้ววัดผล ยังไม่ล็อกตัวเลข (TECH L126)

### ยังไม่ตัดสินใน ADR นี้
- นโยบายเมื่อ validation ไม่ผ่าน (ตัดการเชื่อมต่อหรือทิ้ง message) → M3-T04
- จะใช้ `InputBufferImpl` และ `StateView` ของ Colyseus หรือไม่ → M3 หลังทดสอบ

## Alternatives ที่พิจารณา
- **ไม่ทำนายเลย:** ง่ายที่สุด แต่ทุกก้าวหน่วงเท่า round-trip → ไม่เลือก
- **ให้ client คุมการเดินแล้ว server ตรวจทีหลัง:** speedhack และ teleport ทำได้ง่าย ขัด rule 5 → ไม่เลือก
- **Rewind ตั้งแต่ VS0 (`Rewind`/`RewindView`):** ยุติธรรมกับผู้เล่น ping สูง แต่ซับซ้อนและยังไม่ได้ทดสอบ → ทบทวนใน M7
- **`MoveInput` มี duration:** client กำหนดระยะได้ (C-15) → ไม่เลือก

## Consequences
- **ข้อดี:** โกงยาก · สอดคล้องกับ rule 5 และ 6 · ลดจำนวน message type
- **ข้อเสีย:** ผู้เล่น ping สูงเสียเปรียบ (trade-off ของ DEC-018) · reconcile ต้องทำให้ลื่นเพื่อไม่ให้ตัวละครกระตุก
- **เอกสารที่แก้ตาม:** `NETWORK_PROTOCOL.md` L15 (M0-T12)

## Revisit triggers
| เมื่อ | ทบทวน |
|---|---|
| วัด latency จริงใน M7 แล้วผู้เล่น ping สูงเสียเปรียบเกินไป | rewind / lag compensation |
| playtest บอกว่า telegraph หรือ i-frame ไม่ยุติธรรม | ตัวเลขใน game-data |
| Colyseus ออก minor ใหม่ | API ของ input buffer และ state view |
