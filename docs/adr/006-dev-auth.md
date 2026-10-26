# ADR-006 — Auth สำหรับ development (M3)

- **Status:** Accepted (ส่วน M3) · **Date:** 2026-10-26 · ส่วน M4 (auth จริง) ยัง Open ใน DEC-020
- **ผู้ตัดสิน:** ผู้พัฒนาอนุมัติตามข้อเสนอใน DEC-020 (2026-10-26)
- **เกี่ยวข้อง:** `docs/DECISIONS.md` DEC-020 (C-04, D-22) · `SECURITY_THREAT_MODEL.md` L21 (ห้ามเขียน crypto เอง) · ROADMAP M3 และ M4

## Context
- M3 (authoritative multiplayer) ต้องรู้ว่าผู้เล่นคือใครเพื่อผูกกับตัวละคร แต่ auth จริงอยู่ใน M4 (C-04)
- SECURITY L21 ห้ามเขียน crypto หรือระบบ auth เอง

## Decision
1. server มี interface `AuthProvider` ที่ตรวจ token แล้วคืน account id หรือปฏิเสธ · โค้ดส่วนอื่นเรียกผ่าน interface นี้เท่านั้น
2. **Dev token provider** ทำงานได้เฉพาะเมื่อ `NODE_ENV=development` · server ต้องไม่ยอม start ถ้าเปิด provider นี้ใน env อื่น และต้องมี test ยืนยันข้อนี้
3. token ส่งครั้งเดียวตอน join room ไม่แนบไปกับทุก message
4. **M4:** เลือก library หรือบริการ auth ที่ใช้แพร่หลายผ่าน ADR ใหม่ และกำหนดรูปแบบ token สำหรับ WebSocket · ถ้าเป็นบริการที่มีค่าใช้จ่ายต้องถามผู้พัฒนาก่อน (DEC-062)

## Alternatives ที่พิจารณา
- **ใช้ auth library จริงตั้งแต่ M3:** เพิ่ม dependency และเวลาก่อนจะมี game loop → ไม่เลือก
- **ไม่มี auth ใน M3:** ผูกตัวละครกับ connection ได้ไม่มั่นคง และต้องรื้อทีหลัง → ไม่เลือก

## Consequences
- **ข้อดี:** M3 ทดสอบ multiplayer ได้โดยไม่ต้องรอ M4 · การเปลี่ยนไปใช้ auth จริงแก้ที่ `AuthProvider` จุดเดียว
- **ข้อเสีย:** ต้องมี test ที่กันไม่ให้ dev provider หลุดไปถึง env จริง
- **ยัง Open (DEC-020):** library ที่จะใช้ใน M4 และจะบังคับยืนยันอีเมลในช่วง closed test หรือไม่
