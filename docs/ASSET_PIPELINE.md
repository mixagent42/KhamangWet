# ASSET PIPELINE — ขมังเวท (Khamang Wet)

- **เวอร์ชัน:** v0.5 Draft · **สร้างเมื่อ:** 2026-10-26 · **แก้ล่าสุด:** 2026-10-26 (M1-T01: ค่ากล้องชั่วคราวของ graybox)
- **ขอบเขต:** ชนิดไฟล์ ขนาดภาพ รูปแบบแอนิเมชัน การตั้งชื่อ asset โครงสร้างโฟลเดอร์ manifest งบทรัพยากร และวิธีนำ asset เข้าเกม
- **ทั้งเอกสารเป็นข้อเสนอ [R]** ยกเว้นที่ระบุว่าเป็น **[F]** ค่าตัวเลขเป็นสมมติฐานที่ยืนยันใน VP0 (`VISUAL_PROTOTYPE_PLAN.md`)

### ข้อเท็จจริงตั้งต้น [F] (ตรวจเมื่อ 2026-10-26)
- **ยังไม่มี asset ใด ๆ ใน workspace** (`find` หา png, jpg, webp, psd, blend, glb, gltf, spine, json และ ktx2 ไม่พบ)
- **ยังไม่มีโค้ด engine** โดย Babylon.js เป็นเพียง stack ที่เสนอ (`latest` บน npm = 9.32.0 เมื่อ 2026-10-25)
- ไม่พบ `blender` ใน PATH และยังไม่มีเครื่องมือ texture หรือ atlas ใดติดตั้ง
- **Babylon.js รองรับ texture แบบ `.ktx2`** (Basis Universal: ETC1S และ UASTC) โดยสร้าง `Texture` ที่ชี้ไปที่ไฟล์ `.ktx2` ได้ตรง ๆ และ glTF รองรับผ่าน extension `KHR_texture_basisu` ส่วนเครื่องมือที่ docs แนะนำคือ `toktx` จาก KTX-Software (ข้อมูลจาก doc.babylonjs.com หน้า KTX2 Compression)
- ข้อกำหนด WebGL2 (OpenGL ES 3.0) รับประกัน `MAX_TEXTURE_SIZE` ขั้นต่ำเพียง **2048**
- `ART_ANIMATION_PIPELINE.md §6` กำหนดฟิลด์ของ asset manifest ไว้ 10 ฟิลด์ และ §4 L31 ให้แยกไฟล์ต้นฉบับออกจากไฟล์ runtime

---

## 1. หมวด Asset

| หมวด | Prefix | ตัวอย่าง | ไฟล์ต้นฉบับ | Runtime |
|---|---|---|---|---|
| Character (ผู้เล่น) | `chr` | จอมขมังเวท | ภาพวาด, rig หรือ 3D (DEC-043) | atlas + anim JSON |
| NPC | `npc` | หลวงพ่อ, หมอยา | เหมือนข้างบน | เหมือนข้างบน |
| Monster | `mon` | วิญญาณเร่ร่อน | เหมือนข้างบน | เหมือนข้างบน |
| Boss | `boss` | — | เหมือนข้างบน | เหมือนข้างบน (อาจแบ่งหลายชิ้น) |
| Equipment visual (paper-doll, DEC-045) | `eqv` | ชุดคลุมผ้าไหมหมึก, ดาบลงอาคม | ชิ้นส่วนภาพวาดแยกชั้นบน body template | skin หรือ attachment ของ Spine (A3-S) · mesh ที่ผูกกับ armature เดียวกันใน `.glb` (A3-B) · layer frame set (A1-L, ทางสำรอง) |
| Body template | `bdy` | ร่างผู้ชายผู้ใหญ่ | rig ใน Spine หรือ Blender (`.blend`) + ชิ้นส่วนร่าง | skeleton + atlas ของร่าง (A3-S) · `.glb` ที่มี armature + skinned mesh (A3-B) |
| Environment kit | `env` | กำแพงศาล, พื้นลาน | `.blend` | `.glb` |
| Prop | `prop` | โคมหิน, กระถางธูป | `.blend` | `.glb` |
| Texture | `tex` | พื้นหิน | PSD, KRA หรือ EXR | `.ktx2` |
| VFX | `vfx` | วงยันต์ระเบิด | ภาพ flipbook + นิยามอนุภาค | `.ktx2` + `.vfx.json` |
| Decal | `dcl` | วงอักขระบนพื้น | PSD หรือ SVG | `.ktx2` |
| UI | `ui` | กรอบ panel | SVG หรือ PSD | SVG หรือ PNG (9-slice) |
| Icon | `ico` | ไอคอนสกิล | PSD | PNG หรือ WebP (atlas) |
| Portrait | `prt` | ภาพหน้าตัวละคร | PSD | WebP |
| Font | `fnt` | font ไทย | OTF หรือ TTF | WOFF2 |
| Audio (อนาคต) | `sfx` และ `bgm` | — | WAV | OGG หรือ M4A (**[?]** ตรวจการรองรับของ browser) |

---

## 2. โครงสร้างโฟลเดอร์ (เสนอ)

```
art-src/                         # ไฟล์ต้นฉบับเท่านั้น ไม่ถูกส่งไปที่ client (การเก็บไฟล์ binary: DEC-051)
  characters/<id>/               #   chr_yantra-adept/ : .psd/.kra/.clip/.spine/.blend + reference
  monsters/<id>/
  environment/<zone-id>/         #   .blend + texture source
  vfx/<skill-id>/
  ui/
tools/asset-pipeline/            # script export, pack, compress, validate (ไม่มี logic ของเกม)
apps/web/public/assets/          # ไฟล์ runtime ที่ pipeline สร้าง (ชื่อไฟล์มี content hash)
  manifest.json                  # asset manifest รวม (§11)
packages/game-data/zones/        # walkable data ที่ใช้ร่วมกับ server (DEC-016) ไม่อยู่ใน assets/
docs/art/reference/              # ภาพอ้างอิง (reference-only, ห้าม ship)
```
**กฎ:**
- ไฟล์ใน `apps/web/public/assets/` ต้องสร้างจาก pipeline เท่านั้น ห้ามแก้ด้วยมือ
- walkable data ไม่อยู่ในโฟลเดอร์ asset เพราะ server ต้องใช้ด้วย (TECH L81)

---

## 3. การตั้งชื่อ (Naming Convention)

### 3.1 ไวยากรณ์
```
<prefix>_<subject>[_<variant>][_<descriptor>...][_<dir>][_<frame>].<ext>
```
- ใช้เฉพาะ **a–z, 0–9, `_` (คั่น token), `-` (คำหลายคำใน token เดียว)** และใช้ตัวพิมพ์เล็กทั้งหมด
- **ห้ามใช้ภาษาไทย ช่องว่าง หรืออักษรพิเศษในชื่อไฟล์** เพราะ path ข้ามระบบปฏิบัติการ, CDN และ URL ต้องปลอดภัย ส่วนชื่อภาษาไทยเก็บใน manifest (`displayNameTh`)
- regex สำหรับตรวจ: `^[a-z]{2,4}_[a-z0-9-]+(_[a-z0-9-]+)*\.[a-z0-9.]+$`
- เลข frame ใช้ 2 หลัก (`00`–`99`) และทิศใช้ token จาก §3.2

### 3.2 ทิศ (screen-relative, กล้องหมุนไม่ได้ตาม DEC-027)
| Token | ความหมาย | 4 ทิศ | 8 ทิศ | Mirror จาก |
|---|---|---|---|---|
| `se` | หันเฉียงลงขวา (หน้า 3/4) | ✔ วาด | ✔ วาด | — |
| `sw` | หันเฉียงลงซ้าย | ✔ | ✔ | `se` (ถ้า `mirrorable=true`) |
| `ne` | หันเฉียงขึ้นขวา (หลัง 3/4) | ✔ วาด | ✔ วาด | — |
| `nw` | หันเฉียงขึ้นซ้าย | ✔ | ✔ | `ne` |
| `s`, `n`, `e` | หันลง / ขึ้น / ขวา | — | ✔ วาด | — |
| `w` | หันซ้าย | — | ✔ | `e` |

**ผลต่องาน art [R]:** 4 ทิศที่ mirror ได้ต้องวาดจริงแค่ **2 ทิศ** ส่วน 8 ทิศต้องวาด **5 ทิศ** ถ้าตัวละครไม่สมมาตร (เช่น ถืออาวุธมือขวา หรือมีลายสักแขนเดียว) จะ mirror ไม่ได้และต้องวาดเพิ่ม (DEC-042)

### 3.3 ตัวอย่าง
| Asset | ชื่อไฟล์ |
|---|---|
| atlas ตัวละคร | `chr_yantra-adept_base_atlas_p0.ktx2` (`p0` = หน้าที่ 0) |
| metadata แอนิเมชัน | `chr_yantra-adept_base.anim.json` |
| frame ต้นฉบับ (ก่อน pack) | `chr_yantra-adept_base_walk_se_04.png` |
| monster | `mon_wandering-spirit_base_atlas_p0.ktx2` |
| environment piece | `env_shrine-courtyard_wall-a_lod0.glb` |
| prop | `prop_lantern-stone_a.glb` |
| texture | `tex_ground-cobble_a_albedo.ktx2` (suffix: `albedo`, `normal`, `orm`, `emissive`, `lightmap`, `mask`) |
| VFX flipbook | `vfx_seal-burst_impact_flipbook.ktx2` |
| VFX definition | `vfx_seal-burst.vfx.json` |
| decal | `dcl_seal-burst_glyph-ring.ktx2` |
| UI frame (9-slice) | `ui_frame_panel-dark_9s.png` |
| icon | `ico_skill_seal-burst_128.png` |
| collision proxy ใน Blender | object ชื่อ `COL_<name>` และพื้นที่เดินได้ `WALK_<name>` (ไม่ถูก export เป็นภาพ แต่แปลงเป็น walkable JSON) |

### 3.4 Asset ID (แยกจากชื่อไฟล์)
manifest ใช้ ID ที่คงที่ เช่น `chr.yantra-adept.base` ส่วนชื่อไฟล์ runtime มี content hash (เช่น `…_atlas_p0.3f9a1c.ktx2`) เพื่อให้ cache ได้ โค้ดเกมอ้าง **ID เท่านั้น** ห้ามอ้าง path

---

## 4. หน่วยและมาตรฐาน (Units & Conventions)

| หัวข้อ | มาตรฐาน **[R]** |
|---|---|
| หน่วยโลก | 1 world unit = **1 เมตร** ทั้งใน Blender, Babylon และ game-data |
| แกน | Babylon เป็น Y-up และ Blender เป็น Z-up (ให้ glTF exporter แปลงแกน **[?]** ยืนยันการตั้งค่าใน M1) |
| Pivot ของ prop และ env | กึ่งกลางฐานบนพื้น ส่วนชิ้นที่ต่อกันเป็นโมดูลใช้ grid snap (เช่น 0.5 m) |
| Pivot ของตัวละคร | จุดกึ่งกลางระหว่างเท้า (ground anchor) เป็นพิกัด px ใน frame และคงที่ทุก frame และทุกทิศ |
| ความสูงอ้างอิง | ผู้ใหญ่ 1.70–1.80 m (class M) |
| กล้อง | orthographic + yaw 45° + pitch ตาม DEC-041 (ตัวเลือกที่จะทดสอบ: 30°, 35.26°, 45°) · **ค่าชั่วคราวของ graybox (M1-T01)** จนกว่า ADR-009 จะล็อก: pitch 35.26°, yaw 45° (วัดจาก +X ไป +Z) และกล้องอยู่ฝั่ง +X+Z มองลงไปทาง −X−Z, view height 16 m ที่ default zoom, zoom 8–24 m (เข้า 2× ออก 1.5×), หมุนไม่ได้ (DEC-027) · ค่าอยู่ใน `apps/web/src/camera/iso-camera-math.ts` |

### 4.1 ความละเอียดของ sprite (สูตร)
- `px ต่อเมตรบนจอ = screenHeightPx / orthoViewHeightM`
- `ความสูงบนจอของวัตถุตั้งตรง ≈ H × cos(pitch) × px ต่อเมตร`

**ตัวอย่าง [R]** (1080p, `orthoViewHeight` = 16 m ที่ default zoom, pitch 35.26°): px ต่อเมตร = 67.5 → ตัวละคร 1.75 m สูงบนจอ ≈ **96 px** ถ้าซูมเข้าสุด 2× จะสูง ≈ **193 px**
**[F]** ตัวละครในภาพอ้างอิงหมายเลข 1 (ภาพขนาด 1536×1024) สูงประมาณ 85–95 px ซึ่งใกล้เคียงกับตัวอย่างนี้

### 4.2 ขนาด frame ตั้งต้น **[R]** (ยืนยันใน VP0, DEC-046)
| Class | Canvas ต่อ frame | ความสูงของตัวละครใน canvas | หมายเหตุ |
|---|---|---|---|
| M (ผู้เล่น, NPC) | **256 × 384 px** | ~290 px (≈ 1.5× ของขนาดเมื่อซูมเข้าสุด) | trim พื้นที่โปร่งใสตอน pack แต่ pivot คงเดิม |
| S | 192 × 256 px | — | — |
| L | 384 × 512 px | — | — |
| XL (boss) | กำหนดราย boss | — | อาจแบ่งเป็นหลายชิ้นหรือใช้ skeletal |
| Portrait | 512 × 512 px | — | UI |
| Icon | 128 × 128 px (ใช้แสดงที่ 64 px) | — | 2× สำหรับจอ HiDPI |

### 4.3 Texel density ของ environment **[R]**
- ประมาณ **2× ของ px ต่อเมตรบนจอที่ default zoom** (ถ้าใช้ตัวอย่าง §4.1 จะได้ ≈ 128–160 px/m) เพื่อให้ซูมเข้าแล้วยังคม
- hero prop (เช่น ศาล) ใช้ได้ถึง 2× ของค่านี้
- พื้นที่กว้างใช้ tiling + decal

---

## 5. รูปแบบไฟล์

| ชนิด | ต้นฉบับ | Runtime | Compression | ขนาดสูงสุด **[R]** | หมายเหตุ |
|---|---|---|---|---|---|
| โมเดล env และ prop | `.blend` | `.glb` (glTF 2.0 binary) | Draco หรือ meshopt **[?]** ต้องทดสอบ loader | ตาม zone budget §12 | collision proxy ไม่อยู่ใน `.glb` ที่ใช้เรนเดอร์ |
| Texture สี (albedo) | PSD, KRA, PNG 16-bit | `.ktx2` | **UASTC** สำหรับ hero และตัวละคร, **ETC1S** สำหรับ env ทั่วไป | 4096² (ตรวจ capability แล้ว fallback เป็น 2048²) | ขนาดต้องหารด้วย 4 ลงตัว (block compression ใช้ block 4×4) |
| Normal, ORM, mask | EXR หรือ PNG | `.ktx2` UASTC | docs ของ Babylon ระบุว่า ETC1S ทำงานไม่ดีกับ non-color data | 2048² | — |
| Lightmap (ถ้าใช้ baked) | EXR (Cycles bake) | `.ktx2` UASTC หรือ HDR **[?]** | — | 2048² ต่อ zone chunk | DEC-050 |
| Sprite atlas | frame PNG (RGBA) | `.ktx2` UASTC + premultiplied alpha **[?]** | — | **4096²** ต่อหน้า (fallback 2048²) | ใช้ texture packer (DEC-043) |
| Anim metadata | ส่งออกจากเครื่องมือ | `.anim.json` (§6.3) | gzip หรือ brotli ผ่าน HTTP | — | validate ด้วย Zod |
| Skeletal: A3-S (⏸ พักไว้ตาม DEC-058) | `.spine` | JSON หรือ binary ที่ Spine export + atlas | — | — | ต้องปิด DEC-014 ก่อน และใช้ Spine Professional (`DECISIONS.md` ภาคผนวก C.1) |
| Skeletal: A3-B (ถ้าเลือก) | `.blend` | `.glb` (armature + skinned mesh + animation) + atlas ของชิ้นส่วนแบบ `.ktx2` | ไม่บีบอัด mesh ก่อนทดสอบ **[?]** (ตรวจผลของ Draco/meshopt ต่อ skinning) | — | ต้องปิด DEC-014 ก่อน · ข้อกำหนดอยู่ใน §6.5 |
| VFX texture | PSD, EXR | `.ktx2` | — | 2048² | flipbook ขนาด 4×4 หรือ 8×8 cell |
| VFX definition | — | `.vfx.json` | — | — | อธิบาย emitter, phase, lifetime และงบ |
| UI frame | SVG, PSD | SVG หรือ PNG | — | — | CSS `border-image` 9-slice (UI เป็น DOM ตาม DEC-031) |
| Icon | PSD | PNG หรือ WebP atlas | — | 2048² | — |
| Font | OTF/TTF (license ต้อง bundle ได้) | WOFF2 + subset | — | — | ต้องมีครบชุดอักษรไทย (DEC-052) |

---

## 6. แอนิเมชันตัวละคร

### 6.1 จำนวน frame ตั้งต้นต่อทิศ **[R]** (frame-based, 12 fps, ปรับได้ใน VP0)
| State | Frames | Loop | Events (แสดงผลเท่านั้น) |
|---|---|---|---|
| idle | 8 | ✔ | — |
| walk | 8 | ✔ | `foot_l`, `foot_r` |
| run | 8 | ✔ | `foot_l`, `foot_r` |
| attack | 8 | ✗ | `strike` |
| cast | 10 | ✗ | `release` |
| hit | 4 | ✗ | — |
| dodge | 6 | ✗ | — |
| death | 10 | ✗ | `fall` |
| interact | 6 | ✗ | `use` |
| **รวม** | **68** | | |

- Event ทุกตัวใช้กระตุ้นเสียงและ VFX เท่านั้น ส่วน timing ของ gameplay มาจาก server (ART §2.6)
- **กฎเท้าไถล:** `stride_m × (steps_per_cycle / cycle_s) = moveSpeed` (m/s) และต้องตรวจตัวเลขนี้ตอน validate (§10)

### 6.2 ประมาณการ texture memory ต่อชุดตัวละคร (เพื่อประกอบ DEC-014, 042, 045)
**สมมติฐาน:** canvas 256×384 (98,304 px/frame), 68 frame ต่อทิศ, ไม่นับ mipmap (ถ้าใช้ mipmap จะเพิ่มประมาณ 33%)

| ทิศ (ที่วาดจริง) | Frames | Pixels | RGBA8 ไม่บีบอัด | GPU 8 bpp (UASTC→BC7/ASTC) | หลัง trim ~45% **[R]** |
|---|---|---|---|---|---|
| 4 ทิศ mirror (2 ทิศ) | 136 | 13.37 M | **53.5 MB** | **13.4 MB** | ~7.4 MB |
| 8 ทิศ mirror (5 ทิศ) | 340 | 33.42 M | **133.7 MB** | **33.4 MB** | ~18.4 MB |

**สิ่งที่ตัวเลขนี้บอก [R]:**
- frame-based HD **ทำได้**สำหรับ archetype จำนวนน้อยที่มีชุดคงที่
- แต่ถ้าต้อง**เปลี่ยนชุดตาม equipment** (paper-doll) frame-based จะคูณ memory ตามจำนวนชิ้นของชุด ซึ่งเป็นเหตุผลหลักที่ต้องเปรียบเทียบกับ skeletal ใน VP0 (DEC-014, DEC-045)
- ผู้เล่นหลายสิบคนที่ใช้ archetype เดียวกัน**แชร์ atlas เดียว**กันได้ ต้นทุนจึงขึ้นกับจำนวน "ชุดที่ต่างกันบนจอ" ไม่ใช่จำนวนผู้เล่น
- **อัปเดตหลัง DEC-045 (paper-doll, 2026-10-26):** การ bake ทั้งตัว (A1 หรือ A2) จะต้องมี atlas ต่อ**ทุกการผสมของ item** ซึ่งเป็นไปไม่ได้ในทางปฏิบัติ จึงเหลือ 2 แนวทาง:
  - **A3 (runtime skeletal):** memory ต่อ item ≈ ขนาดชิ้นส่วนใน atlas ของ item นั้น (ไม่ขึ้นกับจำนวน frame)
  - **A1-L (layer ต่อ slot):** memory ต่อ item ≈ ตัวเลขในตารางข้างบนคูณสัดส่วนพื้นที่ของชิ้นนั้น เช่น ผ้าคลุมกินพื้นที่ ~40% ของร่าง จะได้ ≈ 3 MB หลัง trim สำหรับ 4 ทิศ mirror ซึ่ง**ต้นทุนการวาดคูณตามจำนวน item × frame × ทิศ**
  - ตัวเลขจริงวัดใน VP0-c (P9)

### 6.3 `.anim.json` (โครงร่างสำหรับ frame-based, schema จริงทำใน M1-T03)
```json
{
  "formatVersion": 1,
  "assetId": "chr.yantra-adept.base",
  "pivotPx": { "x": 128, "y": 360 },
  "pxPerMeter": 166,
  "atlasPages": ["chr_yantra-adept_base_atlas_p0.<hash>.ktx2"],
  "directions": { "se": "drawn", "sw": { "mirrorOf": "se" }, "ne": "drawn", "nw": { "mirrorOf": "ne" } },
  "states": {
    "walk": { "fps": 12, "loop": true, "strideM": 0.7,
              "frames": { "se": [ { "page": 0, "rect": [0, 0, 180, 300], "offsetPx": [38, 60] } ] },
              "events": [ { "frame": 2, "name": "foot_l" }, { "frame": 6, "name": "foot_r" } ] }
  },
  "fallbackState": "idle"
}
```

---

### 6.4 Paper-doll / Equipment visuals (DEC-045 Accepted, รายละเอียดเป็น **[R]** ที่ยืนยันใน VP0-c)
- **องค์ประกอบ:** `bdy_<body-type>` (skeleton หรือ template + ร่าง) + `eqv_<slot>_<item>` ต่อ visual slot (รายการ slot: DEC-057, ART_BIBLE §4.3.1)
- **การตั้งชื่อ:**
  - `eqv_robe_ink-silk_a` (ชื่อ skin หรือ attachment ใน A3)
  - `eqv_robe_ink-silk_a_walk_se_04.png` (frame ใน A1-L)
  - `bdy_male-adult_base.skel.json` (A3-S: รูปแบบไฟล์ตามที่ Spine export)
  - `bdy_male-adult_base_se.glb` และ `eqv_robe_ink-silk_a_se.glb` (A3-B: 1 ไฟล์ต่อทิศที่วาด ตาม §6.5)
- **Draw order:** ข้อมูลต่อทิศและต่อท่าเก็บใน metadata ของ body template (เช่น `drawOrder.se = ["cape-back", "body", "lower", "robe", "weapon", "head"]`) ห้าม hardcode ในโค้ด
- **Attachment points:** มือขวา, มือซ้าย, หลัง, เอว และศีรษะ ซึ่งกำหนดใน template ต่อทิศ
- **Mirroring:** item ที่ไม่สมมาตร (เช่น ฝักดาบด้านซ้าย) ต้องมี `mirrorable=false` แล้ววาดทิศที่ mirror ไม่ได้เพิ่ม หรือออกแบบให้สมมาตร (DEC-042)
- **Tint และ palette swap:** item มี mask ของพื้นที่ที่เปลี่ยนสีได้ (`tex_..._mask`) และรุ่นสีเป็นข้อมูลใน game-data ไม่ใช่ไฟล์ภาพใหม่
- **Runtime appearance:** client ประกอบภาพจาก appearance (definition ID ต่อ slot) ที่ได้รับจาก **public room state** แล้วโหลด asset ของ item แบบ lazy ตาม manifest ระหว่างโหลด ให้แสดงชุดพื้นฐานหรือ fallback ก่อนโดยไม่ทำให้ frame กระตุก (P10)
- **Validate (เพิ่มในขั้น 4 ของ §10):** item อ้างถึง body template ที่มีจริง, มีครบทุกทิศและทุกท่าที่ template ประกาศ (A1-L), attachment points ตรงกัน และ draw order ครบทุกทิศ

### 6.5 A3-B: ข้อกำหนด Blender cutout → glTF (ทดสอบใน VP0-c, ทั้งหมดเป็น **[R]** และรายการ **[?]** ต้องยืนยันใน spike)
| หัวข้อ | ข้อกำหนด |
|---|---|
| หน่วยและการวางตัว | 1 unit = 1 m · ชิ้นส่วนเป็น plane ที่ตั้งตรงและหันตาม yaw ของกล้อง (สอดคล้อง R3 ใน `VISUAL_PROTOTYPE_PLAN.md §2.1`) · root ของ armature อยู่ที่ ground anchor (origin) |
| ทิศ | 1 rig ต่อทิศที่วาดจริง (`se` และ `ne` ถ้าเป็น 4 ทิศ mirror) โดยแยกเป็นไฟล์หรือ collection `DIR_se` และ `DIR_ne` ส่วนทิศที่ mirror ใช้การกลับด้านตอน runtime |
| ชื่อ armature และกระดูก | `ARM_<body-type>` · กระดูกเป็น `b_<part>[_l\|_r]` (เช่น `b_root`, `b_hip`, `b_spine`, `b_head`, `b_arm-upper_l`) · **ชื่อและลำดับกระดูกต้องเหมือนกันทุก item ของ body template เดียวกัน** |
| ชื่อ mesh ของชิ้นส่วน | `PART_<slot>_<item>_<piece>` (เช่น `PART_body_base_torso`, `PART_robe_ink-silk-a_sleeve_l`) |
| Draw order | custom property `kw_order` (int) ต่อ mesh ต่อทิศ แล้ว export เป็น glTF `extras` **[?]** (ตรวจตัวเลือก custom properties ของ exporter) จากนั้น loader ของเราจัดลำดับการวาดตามค่านี้ · glTF ไม่มี draw order ต่อ keyframe จึงต้องใช้ค่าคงที่ต่อทิศ หรือเก็บตารางเปลี่ยนลำดับตามท่าเป็นข้อมูลแยก |
| Weight | ไม่เกิน 4 influence ต่อ vertex และ normalize แล้ว **[?]** |
| Animation | 1 action ต่อท่า ตั้งชื่อตาม state ใน §6.1 (`idle`, `walk`, `cast`, …) และ bake IK หรือ constraint เป็น keyframe ตอน export **[?]** (ตรวจว่า exporter ส่งออกหลาย action ได้อย่างไร) |
| Item (paper-doll) | `.glb` ของ item มีเฉพาะ mesh ของ item ที่ผูกกับ armature ชุดเดียวกัน ตอน runtime ผูก mesh ของ item เข้ากับ skeleton ของร่างที่โหลดไว้แล้ว **[?]** (ตรวจ API ของ Babylon และเงื่อนไขเรื่องลำดับกระดูก) |
| Texture | exporter ส่งออกเป็น PNG แล้ว pipeline แปลงเป็น `.ktx2` (§10 ขั้น 3) และรวมชิ้นส่วนของร่างหรือ item ไว้ใน atlas เดียวต่อชิ้น |
| Script | `tools/asset-pipeline/blender/export_character.py` (`bpy`) รันแบบ headless · **[F]** ถ้าเผยแพร่ script นี้ต้องใช้ license ที่เข้ากันกับ GPL (blender.org) ส่วนการใช้ภายในเป็นข้อเสนอ **[R]** |
| Validate (เพิ่มในขั้น 4) | ชื่อกระดูกและลำดับตรงกับ template, `kw_order` ครบทุก mesh และทุกทิศ, จำนวน influence ไม่เกิน, action ครบทุก state ที่ประกาศ |

## 7. Environment Pipeline
1. **Blockout** ใน Blender ด้วยหน่วย 1 m และ grid snap แล้วทดสอบมุมกล้องกับตัวละครจริง (ART §3 L22)
2. **Collision และ walkable:** object ชื่อ `COL_*` และ `WALK_*` ถูกแปลงเป็น walkable JSON ใน `packages/game-data` (DEC-016) โดย VS0 ใช้ JSON ที่เขียนด้วยมือได้
3. **Modeling:** low/medium poly, ใช้ instancing กับ prop ที่ซ้ำ (ART §4 L28)
4. **Lighting:** baked lightmap (Cycles) สำหรับแสงคงที่ + dynamic light จำนวนจำกัดสำหรับแสงที่ขยับหรือแสงใกล้ผู้เล่น (DEC-050) **[?]** ตรวจจำนวน light ต่อ material ที่ Babylon รองรับโดยค่าเริ่มต้น
5. **Export:** `.glb` ต่อ module หรือ zone chunk แล้วแปลง texture เป็น `.ktx2`
6. **Zone group:** ทุก asset มี `loadingGroup` = zone id สำหรับโหลดและ dispose (TECH L120)

## 8. VFX Pipeline
- **องค์ประกอบ:** flipbook texture (ควันหมึก, ไฟ, กระดาษไหม้), decal (วงอักขระบนพื้น), particle emitter และ shader (dissolve หรือ burn ของกระดาษ)
- **`.vfx.json`:** phases (`anticipation`, `telegraph`, `impact`, `dissipation`) โดยแต่ละ phase อ้างถึง emitter และ decal พร้อม `durationSource: "server-event"` หรือ `"fixed"`, `maxParticles`, `intensityTier` และ `lightPulse` (ถ้ามี)
- **Pooling:** ทุก VFX ใช้ pool และมี lifetime สูงสุด (ART §5 L43)
- **เครื่องมือ [?]:** ระบบ particle และ node material ของ Babylon (ต้องยืนยัน API และรูปแบบ serialize ของ Babylon 9 ใน M1) หรือ format ของเราเองที่แปลงเป็น Babylon ตอนโหลด (DEC-049)

## 9. UI Pipeline
- กรอบเป็น 9-slice (SVG หรือ PNG) + CSS `border-image` ส่วนลายมุมเป็น SVG แยก
- icon pack เป็น atlas พร้อม JSON และ portrait เป็น WebP
- font เป็น WOFF2 subset (ครบอักษรไทยและตัวเลข) และต้องตรวจ license ก่อน bundle (DEC-052)
- ข้อความทั้งหมดอยู่ใน DOM ไม่ฝังในภาพ (ART_BIBLE §8)

---

## 10. ขั้นตอนนำเข้า (Import Pipeline)

```
art-src/ ──► [1 Export] ──► [2 Pack] ──► [3 Compress] ──► [4 Validate] ──► [5 Hash+Manifest] ──► apps/web/public/assets/
                                                              │ fail → หยุดและแสดง error
                                                              ▼
                                               CI: asset check (tier 1)
```

| ขั้น | ทำอะไร | เครื่องมือ (ต้องตรวจก่อนใช้ **[?]**) |
|---|---|---|
| 1 Export | `.blend` → `.glb` + walkable JSON · ตัวละคร A3-B: `.blend` → `.glb` (§6.5) · A3-S: Spine → JSON + atlas · A1-L: ภาพวาด → frame PNG | Blender CLI แบบ headless (ไม่พบใน PATH) · Spine Editor (ต้องมี license และ ⏸ พักไว้ตาม DEC-058) · เครื่องมือวาดของผู้ผลิต |
| 2 Pack | รวม frame เป็น atlas + trim + บันทึก offset และ pivot | texture packer (เลือกใน DEC-043: commercial, open source หรือ script เอง) |
| 3 Compress | PNG → `.ktx2` (UASTC หรือ ETC1S) | `toktx` (KTX-Software) ตามที่ docs ของ Babylon แนะนำ **[F]** |
| 4 Validate | ตรวจชื่อตาม regex §3.1, ขนาดหารด้วย 4 ลงตัวและไม่เกินเพดาน, pivot อยู่ในขอบ, frame ครบทุก state และทิศที่ประกาศ, `strideM` สอดคล้อง `moveSpeed`, ฟิลด์ license และ provenance ไม่ว่าง, ไม่เกินงบ §12 | script ใน `tools/asset-pipeline` + Zod (schema เดียวกับที่ client ใช้โหลด) |
| 5 Hash + Manifest | ตั้งชื่อด้วย content hash แล้วอัปเดต `manifest.json` | script |
| โหลดในเกม | manifest → โหลดตาม `loadingGroup` → ถ้าโหลดไม่ได้ให้ใช้ fallback asset (TEST §6 L52) → dispose ตอน unload zone | loader ของ Babylon (`.glb`, `.ktx2`) + loader ของเราสำหรับ `.anim.json` และ `.vfx.json` |

**กฎ:** asset ที่ไม่ผ่านขั้น 4 เข้า build ไม่ได้ และ CI ต้องรันขั้น 4 ทุก push ที่แตะ `art-src/` หรือ `assets/`

---

## 11. Asset Manifest Schema
ฟิลด์จาก **[F]** ART §6 L46–56 + ฟิลด์ที่เสนอเพิ่ม **[R]**

| ฟิลด์ | ที่มา | ตัวอย่าง |
|---|---|---|
| `id` (stable) | F | `chr.yantra-adept.base` |
| `sourcePath` | F | `art-src/characters/yantra-adept/base.psd` |
| `runtimePath` | F | `assets/chr_yantra-adept_base_atlas_p0.3f9a1c.ktx2` |
| `type` | F | `character-atlas` |
| `dimensions` / `format` | F | `4096x4096` / `ktx2-uastc` |
| `pivotScale` | F | `{ pivotPx:[128,360], pxPerMeter:166 }` |
| `license` / `provenance` | F | ดูฟิลด์ provenance ด้านล่าง |
| `owningFeature` | F | `vs0.player` |
| `loadingGroup` | F | `zone.shrine-courtyard` |
| `fallbackAsset` | F | `chr.fallback.silhouette` |
| `displayNameTh` | R | `จอมขมังเวท` |
| `contentHash`, `pipelineVersion` | R | — |
| `gpuBytesEstimate` | R | ใช้ตรวจงบ §12 |
| `provenance.creator`, `.tool`, `.aiGenerated` (bool), `.aiTool`, `.licenseUrl`, `.date`, `.notes` | R | นโยบายเรื่อง AI ยังเป็น Open (DEC-035) |
| `mirrorable` | R | `true` |
| `reviewStatus` | R | `placeholder`, `in-review`, `approved` |
| `bodyTemplate` (เฉพาะ `eqv`) | R | `bdy.male-adult` |
| `visualSlot` (เฉพาะ `eqv`) | R | `robe` |
| `tintMask` (ถ้ามี) | R | `tex.eqv.robe-ink-silk-a.mask` |

---

## 12. งบทรัพยากร (สมมติฐานสำหรับ VP0 **[R]** แล้วปรับจากการวัดจริง)

| งบ | ค่าเริ่มต้น | วัดด้วย |
|---|---|---|
| Texture memory ต่อ zone (env + props + lightmap) | ≤ 256 MB บนเครื่องพัฒนา (เป้า min-spec ตั้งหลังวัด baseline) | ผลรวม `gpuBytesEstimate` + Babylon inspector **[?]** |
| Texture memory ต่อชุดตัวละครที่ต่างกันบนจอ | ≤ 16 MB (4 ทิศ mirror หลัง trim ตาม §6.2) | manifest |
| Texture memory ต่อ equipment visual 1 ชิ้น (paper-doll) | ≤ 2 MB สำหรับ A3, ≤ 4 MB สำหรับ A1-L (วัดจริงใน VP0-c P9) | manifest |
| Equipment visual ที่ต่างกันบนจอพร้อมกัน (S3) | วัดค่าและตั้งเพดานหลัง VP0-c | manifest + debug hook |
| Draw calls (VP0 scenario S2, §5.2 ของแผน VP0) | เป้าตั้งต้น ≤ 150 | `SceneInstrumentation.drawCallsCounter` **[F]** (มีอยู่ใน Babylon) |
| Particles ที่ active ทั้งฉาก | ≤ 2,000 (สกิลเดียว ≤ 400) | ระบบ VFX (นับเอง) |
| Dynamic lights ที่กระทบตัวละครพร้อมกัน | ≤ 4 **[?]** ตรวจขีดจำกัดของ material | ทดสอบใน VP0 |
| ขนาดดาวน์โหลดตอนเข้า zone แรก | ≤ 60 MB (ก่อน gzip/brotli ของ JSON) | network log |

---

## 13. Provenance และ Licensing
- **[F]** ห้ามใช้ asset ที่ไม่รู้สิทธิ์การแจกจ่าย (ART §6 L57) และ `.claude/rules/client.md` L10 ห้ามเพิ่ม asset ที่ license หรือที่มาไม่ชัด
- **[R]** ทุก asset ต้องมีฟิลด์ provenance ครบก่อนเปลี่ยน `reviewStatus` เป็น `approved`
- **[R]** asset ที่ซื้อหรือดาวน์โหลดจากภายนอกให้เก็บไฟล์ license ไว้คู่กันที่ `art-src/<…>/LICENSE.txt`
- **Open (DEC-035):** การใช้ AI generator (ใช้ได้หรือไม่, ใช้กับอะไร, ต้องบันทึกอะไร) ระหว่างนี้ asset ที่ AI สร้างใช้ได้เฉพาะสถานะ `placeholder` และห้าม ship
- ภาพอ้างอิงใน `docs/art/reference/` เป็น reference-only (ART_BIBLE §2)

## 14. Version Control ของไฟล์ binary (DEC-051, Open)
| ทางเลือก | ข้อดี | ข้อเสีย |
|---|---|---|
| Git LFS | ไฟล์ทั้งหมดอยู่ใน repo เดียว | ต้องตั้งค่า และมีโควตาหรือค่าใช้จ่ายของ host |
| แยก `art-src/` ไว้นอก git (cloud drive + backup) และ commit เฉพาะ runtime | repo เล็ก | ประวัติของไฟล์ต้นฉบับแยกจากโค้ด |
| commit ไฟล์ต้นฉบับตรงเข้า git | ง่ายที่สุด | repo บวมเร็วมาก (PSD และ blend) |

**[R]** ตัดสินก่อนมีไฟล์ต้นฉบับชิ้นแรกใน M1-T03

## 15. Asset Acceptance Checklist (DoD ของ asset)
☐ ชื่อและ ID ถูกต้องตาม §3 · ☐ ผ่าน validate (§10 ขั้น 4) · ☐ provenance ครบ · ☐ pivot และ scale ถูกต้องใน benchmark scene · ☐ ทุกทิศ ทุก state และ fallback ใช้ได้ · ☐ ไม่เท้าไถล · ☐ ผ่าน rubric ของ ART_BIBLE (§9) · ☐ อยู่ในงบ §12 · ☐ dispose ได้ครบเมื่อ unload zone · ☐ บันทึกใน manifest แล้ว

## Change Log
| เวอร์ชัน | วันที่ | การเปลี่ยนแปลง |
|---|---|---|
| v0.1 | 2026-10-26 | สร้างครั้งแรก |
| v0.2 | 2026-10-26 | DEC-045 paper-doll: เพิ่มหมวด `eqv` และ `bdy`, หมายเหตุใน §6.2, เพิ่ม §6.4, ฟิลด์ใน manifest และงบใน §12 |
| v0.3 | 2026-10-26 | เพิ่ม A3-B: แถวใน §1 และ §5, ตัวอย่างชื่อใน §6.4, เพิ่ม §6.5 ข้อกำหนด Blender cutout และขั้น Export ใน §10 |
| v0.4 | 2026-10-26 | DEC-058: ทำเครื่องหมายพัก A3-S ไว้ใน §5 และ §10 (ไม่ได้ลบข้อมูล เพื่อให้เปิดทบทวนได้) |
| v0.5 | 2026-10-26 | M1-T01: ค่ากล้องชั่วคราวของ graybox และทิศของแกนใน §4 |
