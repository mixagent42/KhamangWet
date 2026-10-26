# ADR-003 — Walkable และ collision data ที่ client กับ server ใช้ร่วมกัน

- **Status:** Accepted · **Date:** 2026-10-26
- **ผู้ตัดสิน:** ผู้พัฒนาอนุมัติตามข้อเสนอใน DEC-016 (2026-10-26)
- **เกี่ยวข้อง:** `docs/DECISIONS.md` DEC-016 (D-17, R-02) · `TECHNICAL_ARCHITECTURE.md` §4 (L81 ห้าม server import Babylon.js) และ §6 (L115 world-space บน walkable plane ที่นิยามไว้) · `ART_ANIMATION_PIPELINE.md` L26–27 · `.claude/rules/shared.md`

## Context
- server ต้องตรวจการเดินเอง (authoritative) แต่ห้าม import Babylon.js (TECH L81) จึงใช้ navmesh หรือ collision ของ engine ฝั่ง client ที่ server ไม่ได้
- ART L26–27 ให้แยก collision proxy ออกจาก mesh ที่ใช้แสดงผล และระบุ walkable data ให้ชัด
- ถ้า client กับ server ใช้ข้อมูลไม่ตรงกัน ผู้เล่นจะเจอ rubber-banding และ server จะปฏิเสธการเดินที่ถูกต้อง (R-02)
- **[F]** เครื่องพัฒนาไม่มี `blender` ใน PATH (`IMPLEMENTATION_STATUS.md §2.3`)

## Decision
1. **รูปแบบ:** พื้นที่เดินได้เป็น polygon (หรือ grid) บนระนาบ XZ ในหน่วย world unit · ไฟล์ JSON หนึ่งไฟล์ต่อ zone ใน `packages/game-data` · มี Zod schema และ `formatVersion`
2. **ฟังก์ชัน:** point-in-walkable, clamp movement และ line of sight แบบง่ายเป็น pure function ใน `packages/game-rules` · client และ server เรียกฟังก์ชันเดียวกัน (ไม่ fork logic)
3. **ความตรงกัน:** client และ server เทียบ hash ของไฟล์ walkable ตอนเข้า room ถ้าไม่ตรงให้ปฏิเสธการเข้า room พร้อมบอกเหตุผล
4. **การสร้างข้อมูล:** VS0 เขียน JSON ด้วยมือสำหรับ zone เล็ก · หลัง VS0 ทำ script export จาก collision mesh ใน Blender (ต้องติดตั้ง Blender ก่อน)

## Alternatives ที่พิจารณา
- **Navmesh ของ Babylon.js (recast):** ได้ pathfinding มาด้วย แต่ server ต้อง import Babylon ซึ่งขัด TECH L81 → ไม่เลือก
- **Physics engine แยกบน server (เช่น Rapier):** แม่นกว่า แต่เป็น dependency หนักและเกินความจำเป็นของ zone แบบ isometric → ไม่เลือกใน VS0
- **ให้ client ส่งตำแหน่งแล้ว server เชื่อ:** ขัด `CLAUDE.md` rule 5 → ไม่เลือก

## Consequences
- **ข้อดี:** server ไม่ต้องพึ่ง engine · test ได้ใน Node ล้วน (M1 exit criterion 2) · ข้อมูลชุดเดียวใช้ได้ทั้งสองฝั่ง
- **ข้อเสีย:** ยังไม่มี pathfinding อัตโนมัติ ถ้า enemy ต้องเดินอ้อมสิ่งกีดขวางต้องเพิ่ม grid หรือ graph ทีหลัง · การเขียน JSON ด้วยมือใช้ได้แค่ zone เล็ก
- **ขอบเขตของ ADR นี้:** กำหนดรูปแบบและตำแหน่งของข้อมูลเท่านั้น ส่วนขนาด grid, tolerance และ schema จริงทำใน M1

## Revisit triggers
| เมื่อ | ทบทวน |
|---|---|
| zone ใหญ่จนเขียน JSON ด้วยมือไม่ไหว | ทำ exporter จาก Blender |
| enemy ต้องหาเส้นทางรอบสิ่งกีดขวาง | เพิ่ม navigation data |
