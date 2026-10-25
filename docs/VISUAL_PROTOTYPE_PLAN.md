# VISUAL PROTOTYPE PLAN (VP0) — ขมังเวท

- **เวอร์ชัน:** v0.4 Draft · **สร้างเมื่อ:** 2026-10-26 · **แก้ล่าสุด:** 2026-10-26 (DEC-058: VP0-c เทียบ A3-B กับ A1-L และพัก A3-S ไว้) · **สถานะ:** รออนุมัติ (ยังไม่เริ่มงานใด)
- **เป้าหมาย:** พิสูจน์ว่า Art Direction 2.5D HD-2D (DEC-040 LOCKED) **ทำได้จริงบน stack ที่เสนอ** ด้วยฉาก 1 ฉาก ตัวละคร 1 ตัว ศัตรู 1 ตัว และสกิลอาคม 1 สกิล แล้วใช้ผลตัดสินเรื่องที่ยังไม่ล็อกก่อนผลิต asset จำนวนมาก
- **เอกสารที่เกี่ยวข้อง:** `ART_BIBLE.md` (มาตรฐานภาพ) · `ASSET_PIPELINE.md` (ไฟล์และการนำเข้า) · `IMPLEMENTATION_BACKLOG.md` M1 (task ID) · `DECISIONS.md`
- ป้าย: **[F]** ข้อเท็จจริงที่ตรวจแล้ว · **[R]** ข้อเสนอ · **[?]** ต้องยืนยันใน spike

### ข้อจำกัดของ VP0
- **ไม่มี server, combat rules, inventory หรือ quest** สกิลและการโจมตีของศัตรูถูกกระตุ้นด้วยปุ่ม debug และ timing มาจากไฟล์ข้อมูลในเครื่อง
- **ไม่ผลิต asset จำนวนมาก** ผลิตเฉพาะชิ้นที่ระบุใน §3 เท่านั้น
- โค้ดที่เขียนใน VP0 ต้องเป็นไปตามกฎของ M1 (renderer แยกจาก rules) เพื่อให้นำไปใช้ต่อใน VS0 ได้ ส่วนโค้ด spike ที่ทดลองหลายวิธีให้ทิ้งหลังได้ ADR

---

## 1. สถานะ Technical Architecture จริง [F] (ตรวจ 2026-10-26)

| หัวข้อ | สถานะ |
|---|---|
| Repository | ไม่ใช่ git repo, ไม่มีโค้ด, ไม่มี `package.json`, ไม่มี asset (`IMPLEMENTATION_STATUS.md`) |
| Renderer | **ยังไม่ได้ติดตั้ง** Babylon.js เป็นข้อเสนอใน `TECHNICAL_ARCHITECTURE.md §1` (`latest` = 9.32.0, license Apache-2.0) |
| กล้อง | เอกสารกำหนด orthographic isometric (TECH §6 L114; GDD L8) และหมุนกล้องไม่ได้ (DEC-027 Proposed) |
| ความเสี่ยงที่เอกสารระบุไว้แล้ว | depth sorting และ occlusion ต้องอิง ground anchor ไม่ใช่ศีรษะ (TECH L117, L121; ART §3) |
| Spine บน Babylon | **ไม่พบ runtime ทางการ** ใน npm (มีสำหรับ threejs, pixi, phaser, webgl, canvas) และ license เป็น proprietary (`LicenseRef-LICENSE`) · ตรวจเงื่อนไขแล้ว: Professional $379 ต่อคน ไม่มี royalty และผู้เล่นไม่ต้องมี license (`DECISIONS.md` ภาคผนวก C.1) · **ผู้พัฒนายังไม่ยอมรับค่าใช้จ่าย และพักไว้ตาม DEC-058** |
| Blender + glTF skinning | Blender เป็น GPL ฟรี และ "What you create with Blender is your sole property" · docs ของ glTF importer ใน Babylon อ้างถึงการรองรับ skinning (`DECISIONS.md` ภาคผนวก C.3) · ไม่พบ Blender ใน PATH |
| PixelLab | ประเมินแล้ว: ทำแต่ pixel art (ขัด DEC-040) จึงไม่ใช้ (`DECISIONS.md` ภาคผนวก C.2) |
| Texture compression | Babylon รองรับ `.ktx2` (ETC1S, UASTC) และ glTF `KHR_texture_basisu` ส่วนเครื่องมือสร้างไฟล์คือ `toktx` (doc.babylonjs.com) |
| Instrumentation | `SceneInstrumentation` (`frameTimeCounter`, `drawCallsCounter`, `renderTimeCounter`, `particlesRenderTimeCounter`, `spritesRenderTimeCounter`) และ `EngineInstrumentation` (`gpuFrameTimeCounter` ต้องมี extension `EXT_DISJOINT_TIMER_QUERY` ซึ่งไม่ใช่ทุก browser ที่มี) (doc.babylonjs.com, Optimize your scene) |
| Sprite ของ Babylon | docs ระบุ `cellIndex`, `playAnimation`, `invertU/V`, `width/height`, `angle` **แต่ไม่ได้ระบุ**การรองรับแสงของ scene, เงา หรือการตั้งค่า depth → **[?]** ต้องตรวจใน spike |
| ฮาร์ดแวร์เครื่องพัฒนา | i5-14600K, RTX 5070, RAM 31.7 GB, 1080p @ 179 Hz, Chrome 155, Edge 156 (แรงกว่าเครื่องผู้เล่นทั่วไปมาก) |

---

## 2. วิธีเรนเดอร์ตัวละคร 2D HD บนฉาก 3D (Babylon.js)

### 2.1 Geometry และ depth (สำคัญที่สุด เพราะกระทบ occlusion)

**ปัญหาหลัก (คำนวณ):** กล้อง orthographic ก้มลงด้วยมุม θ (pitch) ระนาบที่**หันหน้าหากล้องเต็มที่** (camera-facing billboard) มี depth เท่ากันทั้งแผ่น (เท่ากับ depth ที่เท้า) ถ้าตัวละครยืนห่างกำแพงด้านหลังเป็นระยะ Δ (เมตร) ส่วนของ sprite ที่สูงเกิน `s* = Δ / sin θ` จะถูกกำแพง**บังผิด** ตัวอย่างที่ θ = 35° และ Δ = 0.5 m: s* ≈ 0.87 m ซึ่งเท่ากับ**ครึ่งบนของตัวละครหายเข้าไปในกำแพง**
ส่วนระนาบที่**ตั้งตรงในโลก** (upright) มี depth ลดลงตามความสูงเหมือนวัตถุจริง ทำให้กำแพงที่อยู่ด้านหลังอยู่หลังตัวละครเสมอ (สำหรับกำแพงที่ขนานกับระนาบ sprite)

| รหัส | วิธี | ข้อดี | ข้อเสีย / ข้อจำกัด |
|---|---|---|---|
| **R1** | `SpriteManager` / `Sprite` ของ Babylon | เขียนน้อยที่สุด มี animation ด้วย cell ให้ในตัว และ batch ได้ดี | **[?]** ไม่รู้ว่ารับแสง เงา หรือ shader เองได้หรือไม่ (docs ไม่ระบุ) · ถ้าเป็น camera-facing จะเจอปัญหา clipping ข้างบน · ควบคุมวัสดุ (rim, hit flash, dissolve) ได้จำกัด |
| **R2** | Quad mesh + `billboardMode` แบบ ALL (หันหากล้องเต็มที่) | ภาพไม่ถูกบีบในแนวตั้ง และใช้ material ใดก็ได้ | **clipping กับกำแพงด้านหลังตามสูตรข้างบน** ซึ่งรุนแรงเมื่อยืนชิดกำแพง |
| **R3** | Quad mesh **ตั้งตรง** หันตาม yaw ของกล้อง (กล้องหมุนไม่ได้ จึงตั้งทิศครั้งเดียวได้ ไม่ต้องคำนวณ billboard ทุก frame) | depth ถูกต้องกับกำแพงด้านหลังและวัตถุด้านหน้า, quad ทุกตัวขนานกันจึงไม่ตัดกันเอง, ใช้ material, light และ instancing ได้เต็มที่ | ภาพบนจอหดลงด้วย cos θ จึงต้องขยาย quad ในแนวตั้งด้วย 1/cos θ ทำให้ขอบบนของ quad สูงเกินตัวจริง (ที่ 35° คือ 1.75 m → 2.14 m) และอาจโดนชายคาบัง (ต้องมีกติกา cutaway/fade ตาม ART §3 L19) · ส่วนที่ยื่นด้านข้าง (อาวุธ) อาจแทงเข้ากำแพงที่ทำมุม 45° (ใช้ collision radius หรือ depth bias **[?]**) |
| **R3b** | R3 แต่ **เอนไปทางกล้อง** เป็นมุม φ (0 ≤ φ ≤ θ) | ปรับสมดุลระหว่างความสูงเกินกับ clipping ได้ | ต้องหามุม φ จากการทดลอง |
| **R4** | Quad + shader ที่**เขียน depth เอง** (`gl_FragDepth`, WebGL2) จาก ground anchor | ควบคุม depth ได้ทุกกรณี (เช่น depth ของระนาบตั้งตรงโดยภาพไม่หด) | ซับซ้อนที่สุด, เขียน depth เองทำให้ early-Z ใช้ไม่ได้กับ fragment นั้น และ **[?]** ต้องตรวจว่า NodeMaterial หรือ ShaderMaterial ของ Babylon 9 รองรับอย่างไร |

**ขอบภาพและความโปร่งใส:** ภาพวาด HD มีขอบนุ่ม (ผม, ผ้า, ไฟ) ซึ่ง alpha-test อย่างเดียวจะทำให้ขอบแตก ส่วน alpha-blend อย่างเดียวต้องเรียงลำดับและอาจไม่เขียน depth **[R] ทดสอบ:** (a) alpha-test ที่ threshold + เขียน depth และ (b) 2 pass: ตัวทึบ (cutout + depth) และขอบนุ่ม (blend, ไม่เขียน depth) **[?]** ตรวจพฤติกรรมการเรียงลำดับวัตถุโปร่งใสของ Babylon

**ข้อเสนอสำหรับเริ่ม VP0 [R]:** **R3 เป็นตัวหลัก** แล้วเทียบกับ R2 และ R1 ในฉากทดสอบเดียวกัน ส่วน R3b และ R4 ใช้เฉพาะเมื่อ R3 ไม่ผ่านเกณฑ์ใน §5.1 (V5) ผลลัพธ์คือ **ADR-008** (ปิด DEC-015)

### 2.2 แสง เงา และความอ่านง่ายของ sprite
| รหัส | วิธี | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **L1** | Unlit + tint ตามสีแสงในบริเวณ (คำนวณเองหรือจาก light probe แบบง่าย) | เบาที่สุด สีตรงตามที่ artist วาด | ไม่ตอบสนองกับโคมที่อยู่ใกล้ และดูเหมือน "สติกเกอร์" |
| **L2** | Lit (diffuse) ใช้ albedo ของ sprite กับ light ในฉาก | ตอบสนองต่อแสงโคมและไฟวิญญาณ | ด้านหน้าของ quad รับแสงแบบแบน ไม่มีปริมาตร และอาจมืดเกินไปในฉากกลางคืน |
| **L3** | L2 + **normal map ต่อ frame** | มีปริมาตรแบบ HD-2D ชัดที่สุด | งาน art เพิ่มเกือบเท่าตัว (หรือต้องใช้เครื่องมือสร้าง normal map จากภาพ ซึ่งต้องประเมิน) และ memory เพิ่มขึ้น |
| **L4** | Custom material: rim light, hit flash, dissolve (การสลาย), outline บาง | ช่วยความอ่านง่ายในฉากมืดและ combat feedback | ต้องเขียนและดูแล shader |

| รหัส | เงา | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **S1** | Blob shadow (decal หรือ quad ที่พื้น) | เบา ทำให้ตัวละครติดพื้นเสมอ (ART §3 L21) | ไม่มีรูปทรงของตัวละคร |
| **S2** | Shadow map จาก quad (alpha-tested) | เงามีรูปทรงจริง | เงาบางเมื่อแสงมาจากด้านข้างเพราะ quad แบน และมีต้นทุนต่อแหล่งแสง |

**[R] เริ่มด้วย L2 + L4 (rim + hit flash) + S1** แล้วทดลอง L3 กับตัวละครตัวเดียวเพื่อดูว่าคุ้มกับงาน art หรือไม่ · **Hero light** (แสงอ่อนติดตัวผู้เล่น) ทดสอบภายใต้ L2 · ผลลัพธ์คือ **ADR-010** (ปิด DEC-047)

### 2.3 แหล่งแอนิเมชัน (ระบบแอนิเมชันยังไม่ล็อกตามภาพอ้างอิงหมายเลข 2)
| รหัส | วิธี | ข้อดี | ข้อเสีย / ข้อจำกัด |
|---|---|---|---|
| **A1** | วาด frame-by-frame (hand-painted) | คุณภาพ HD และน้ำหนักควบคุมได้เต็มที่, runtime ง่าย (เลื่อน UV) | **ต้นทุนการผลิตสูงที่สุด** (136 frame ต่อชุดสำหรับ 4 ทิศ mirror ตาม `ASSET_PIPELINE.md §6.1`), memory สูง และเปลี่ยนชุดต้องวาดใหม่ทั้งหมด · **❌ ใช้กับ paper-doll (DEC-045) ไม่ได้ถ้า bake ทั้งตัว** |
| **A1-L** | frame-based **แยกชั้นต่อ slot** (ร่าง + item แต่ละชิ้นมี frame ครบ) แล้วซ้อนกันตอน runtime | ทางสำรองสำหรับ paper-doll ที่ไม่ต้องมี skeletal runtime และ runtime ยังง่าย | ต้องวาดครบทุก frame และทุกทิศของ**ทุก item** ทำให้ต้นทุนคูณตามจำนวน item, ต้องจัด draw order ต่อทิศและต่อ frame, และมี draw call หรือ quad ต่อชั้นมากขึ้น |
| **A2** | ทำ skeletal (cutout) ในเครื่องมือ แล้ว **bake เป็น frame** | ผลิต frame จำนวนมากได้เร็วกว่า A1 และสัดส่วนคงที่ทุกชุด, runtime เหมือน A1 | memory เท่า A1 ต่อชุด และอาจดู "หุ่นเชิด" ถ้า rig ไม่ดี · ต้องตรวจ license การ export ของเครื่องมือ **[?]** |
| **A3-S** ⏸ พักไว้ (DEC-058) | Skeletal แบบ runtime ด้วย **Spine** (`spine-core` + renderer ที่เขียนเองบน Babylon ตามแนวเดียวกับ spine-threejs **[?]**) | ลื่นไหลทุก fps, blend ระหว่างท่าได้, **เปลี่ยนชุดด้วย skin ได้โดยสัดส่วนไม่เปลี่ยน**, มีฟีเจอร์เฉพาะ 2D ในตัว (draw order ต่อ keyframe, attachment, skin) และ editor ออกแบบมาเพื่อแอนิเมชัน 2D จึงน่าจะผลิตงานได้เร็วที่สุด | **[F] ไม่มี runtime ทางการสำหรับ Babylon** จึงต้องเขียนและดูแล renderer เอง · **[F] ต้องซื้อ Professional $379 ต่อคน** (Essential ไม่มี mesh และ IK) แต่ไม่มี royalty · ใช้ CPU ต่อตัวละครทุก frame (ต้องวัดที่ 32 ตัว) · ต้องมี rig แยกต่อทิศ (2 หรือ 5 ชุด) |
| **A3-B** | Skeletal ด้วย **Blender cutout → glTF → Babylon skinned mesh** (ภาพวาด HD แยกชิ้นแปะบน plane แล้วผูก armature + weight จากนั้น export glTF ที่มี skin และ animation) | **[F] ไม่มีค่า license** (Blender ฟรี และผลงานเป็นของผู้สร้าง) · **ไม่ต้องเขียน runtime เอง** เพราะ Babylon โหลด glTF skinning ได้ · ใช้เครื่องมือเดียวกับงานฉาก · มี mesh deform และ weight · paper-doll ทำได้ด้วยการผูก mesh ของ item เข้ากับ armature เดียวกันแล้วสลับ mesh | Blender ไม่ได้ออกแบบมาเพื่อแอนิเมชัน 2D จึงทำงานช้ากว่า Spine · **glTF ไม่มี draw order ต่อ keyframe** จึงต้องจัดลำดับชั้นภายในตัวละครด้วยโค้ดของเราตามทิศ · ชิ้นส่วนที่ซ้อนกันใกล้มากเสี่ยงภาพกระพริบเพราะ depth ชนกัน · IK ถูก bake เป็น keyframe ตอน export (ไม่มี IK ตอน runtime) · ต้องเขียน script export ด้วย `bpy` (ถ้าเผยแพร่ต้องใช้ license ที่เข้ากันกับ GPL) · mesh ต่อชิ้นอาจเพิ่ม draw call (ต้องวัด P3) · ยังไม่ได้ติดตั้ง Blender |
| **A4** | โมเดล 3D + rig แล้ว render เป็น frame 2D (ใช้ shader แบบ painterly หรือ toon) | 8 ทิศได้แทบฟรี, สัดส่วนคงที่, เปลี่ยนชุดด้วยการ render ใหม่ | ต้องใช้ทักษะ 3D, ทำให้ดูเป็น "2D HD วาดมือ" ได้ยาก (เสี่ยงเรื่อง style) และ memory เท่า A1 |
| ~~A5~~ | ตัวละคร 3D แบบ real-time + shader ให้ดูเป็น 2D | — | ❌ **ขัด Art Lock** ("ตัวละคร 2D HD") |

**[R]:** VP0-a ใช้ placeholder ตามแนว A1 (frame น้อย) เพื่อทดสอบ renderer ก่อน

**กติกาของ VP0-c หลัง DEC-045 (ผู้พัฒนาสั่งให้ "ให้น้ำหนักกับ runtime skeletal"):**
- **ตัวเลือกที่เทียบใน VP0-c รอบนี้ (DEC-058, 2026-10-26):** **A3-B (Blender → glTF)** กับ **A1-L** ส่วน A3-S พักไว้เพราะผู้พัฒนายังไม่ยอมรับค่า Spine
- ใช้ชิ้นส่วนตัวละครชุดเดียวกันจาก M1-T13 กับทั้งสองตัวเลือก
- **A3-B ได้น้ำหนักตาม DEC-045:** ถ้าผ่าน G1–G5 ทุกข้อ **A3-B ถูกเลือก**
- **A1-L ทำตัวอย่างขั้นต่ำจริง** (ท่า walk และ idle ถ้าทันใน time-box, ทิศ `se` และ `ne`, ร่าง + item 1 ชิ้น) เพื่อวัดชั่วโมงผลิต (P11), เท้าไถล (V3), paper-doll (V9) และ memory (P9) ไว้เทียบ และเป็นทางสำรองที่พิสูจน์แล้ว
- **ถ้า A3-B ไม่ผ่าน gate และแก้ไม่ได้ภายใน time-box:** รายงานผลทุก gate แล้วให้**ผู้พัฒนาเลือก**ระหว่าง (a) ใช้ A1-L หรือ (b) เปิด G1 ของ A3-S ใหม่ (DEC-058) **ผู้ตรวจจะไม่เลือกแทน**
- A1 และ A2 แบบทั้งตัวตัดออก เพราะใช้กับ paper-doll ไม่ได้ ส่วน A2 ยังใช้เป็น**เครื่องมือผลิต** frame ของ A1-L ได้ (bake ทีละชั้น)

| Gate | เงื่อนไขที่ตัวเลือก A3 ต้องผ่าน | วัดด้วย |
|---|---|---|
| G1 License | license ของ runtime และเครื่องมืออนุญาตให้ ship ใน web game และผู้พัฒนายอมรับค่าใช้จ่าย · **A3-S:** ตรวจแล้ว ship ได้ ไม่มี royalty แต่ต้องซื้อ Professional $379 → **ผู้พัฒนายังไม่ยอมรับ (DEC-058) จึงไม่ผ่าน G1 ณ ตอนนี้** · **A3-B:** ตรวจแล้ว ไม่มีค่า license (ภาคผนวก C.3) → ผ่าน · **A1-L:** ไม่ใช้ runtime ของบุคคลที่สาม → ผ่าน | `DECISIONS.md` ภาคผนวก C, DEC-058 |
| G2 Integration | เรนเดอร์บน Babylon โดยใช้ geometry และ depth ตาม ADR-008 และแสงตาม ADR-010 ได้เท่ากับ sprite ภายใน time-box · **A3-B ต้องพิสูจน์เพิ่ม:** ลำดับชั้นภายในตัวละครถูกต้องทุกทิศ (draw order และ depth ของชิ้นส่วน) โดยไม่มีภาพกระพริบ · **A3-S (ถ้ากลับเข้ามา):** renderer ที่เขียนเองต้องแสดงผล mesh, skin และ draw order ได้ครบ | V5, V7, V9 |
| G3 Performance | ต้นทุน CPU ของ animation ที่ 32 ตัวละคร (P8) และ S3 ยังผ่าน P1 | P1, P8 |
| G4 Quality | น้ำหนักและความลื่นไหลไม่ดู "หุ่นเชิด" และ style ตรงกับ bible | V3, V6 (rubric ด้านน้ำหนัก ≥ 4) |
| G5 Paper-doll | เปลี่ยน item 2 ชิ้นได้ครบทุกทิศโดยสัดส่วนไม่เปลี่ยนและ draw order ถูกต้อง | V9, P9, P10 |

**Tie-break ระหว่าง A3-S กับ A3-B [R]** (ใช้เฉพาะเมื่อเปิด G1 ของ A3-S ใหม่ตาม DEC-058 แล้วทั้งคู่ผ่าน gate · ผู้พัฒนาปรับได้):
1. ถ้าคะแนน rubric ด้านน้ำหนักและความลื่นไหล (G4) ต่างกัน ≥ 1 คะแนน (จาก 5) ให้เลือกตัวที่คุณภาพสูงกว่า
2. ถ้าไม่ต่างกันถึงเกณฑ์ ให้เลือกตัวที่**ต้นทุนรวมต่ำกว่า** = ค่า license + ชั่วโมงทำและดูแล integration + **ชั่วโมงผลิตต่อท่าและต่อ item ที่วัดจริง × จำนวนที่ต้องผลิตใน MVP** (ใช้ตัวเลขจาก DEC-056)
3. ผู้พัฒนาเป็นผู้ตัดสินสุดท้าย

**สิ่งที่ต้องทดลองใน A3-B โดยเฉพาะ [?]:** วิธีจัดลำดับชั้นภายในตัวละคร ได้แก่
- (a) วางชิ้นส่วนเหลื่อมกันเล็กน้อยตามแกนหน้า-หลังของตัวละคร
- (b) จัดลำดับการวาดของ mesh โปร่งใสภายในตัวละคร (ต้องตรวจกลไกการจัดลำดับของ Babylon)
- (c) เรนเดอร์ตัวละครลง texture ก่อนแล้ววางบน quad แบบ R3 (มีต้นทุน render target ต่อตัว)

และยังต้องทดสอบการ export หลาย animation จาก Blender, การ bake IK และการผูก mesh ของ item เข้ากับ skeleton เดิมตอน runtime

ผลลัพธ์คือ **ADR-002** (ปิด DEC-014 และ DEC-043) ซึ่งต้องบันทึกผลของทุก gate ของทุกตัวเลือก แม้จะเลือก A3

### 2.4 Post-processing สำหรับบรรยากาศ HD-2D
| Effect | บทบาท | ต้นทุนและความเสี่ยง | ข้อเสนอ **[R]** |
|---|---|---|---|
| Bloom | แสงโคม ไฟวิญญาณ และวงอักขระ | ปานกลาง และทำให้ telegraph เบลอได้ | จำกัดเฉพาะค่าที่สว่างมาก และไม่ใช้ bloom กับขอบ telegraph |
| Tilt-shift (เบลอฉากหน้าและฉากหลัง) | เอกลักษณ์ของ HD-2D | DOF ที่ใช้ depth มีต้นทุนสูง | ทดสอบ **blur ตามแนวตั้งของจอ (screen-space)** ซึ่งถูกกว่าและควบคุมง่ายกว่า โดย**ห้ามเบลอแถบ gameplay** |
| Fog (ระยะและความสูง) | ความลึกและความลึกลับ | ต่ำ | ต้องมีเพดานความหนาแน่นในระนาบเล่นเกม (ART_BIBLE §3.3) |
| Color grading (LUT) | อารมณ์ของแต่ละ zone | ต่ำ | 1 LUT ต่อ zone |
| Vignette | โฟกัสสายตา | ต่ำ | เบา ๆ ไม่ให้มุมจอมืดจนบัง UI |
| God rays, volumetric | บรรยากาศ | สูง | Quality High เท่านั้น |

**Quality tiers [R]:** **Low** (ไม่มี post ยกเว้น fog และ grading, ไม่มี dynamic shadow) · **Medium** (+ bloom, tilt-shift แบบ screen-space) · **High** (+ L3 หรือ effect หนัก, light มากขึ้น) **[?]** ตรวจ effect ที่ rendering pipeline สำเร็จรูปของ Babylon 9 มีให้ ผลลัพธ์คือ **ADR-010** (ปิด DEC-048)

### 2.5 ชุดเริ่มต้นสำหรับ VP0 [R]
**R3 + L2 + L4 (rim, hit flash) + S1 + A1 placeholder + Medium tier** (ส่วน animation เป้าหมายคือตระกูล A3 (A3-S หรือ A3-B) ตาม DEC-045 และตัดสินใน VP0-c)

---

### 2.6 เครื่องมือที่ประเมินแล้วและไม่ใช้
| เครื่องมือ | เหตุผล | ที่มา |
|---|---|---|
| **PixelLab** | สร้างแต่ **pixel art** (ขัด DEC-040), ตัวละครสูงสุด 256×256 (เล็กกว่า canvas 256×384 ที่วางไว้), ส่งออกเป็น frame สำเร็จรูปและไม่มี rig, และไม่มีการแยกชั้นสำหรับ paper-doll (DEC-045) · **ไม่ใช้เป็น placeholder ของ VP0 ด้วย** เพราะจะทำให้ผลประเมินภาพ HD-2D คลาดเคลื่อน | `DECISIONS.md` ภาคผนวก C.2 |
| สร้าง skeletal editor เอง | งานใหญ่มาก (ประมาณการหยาบหลายเดือนถึงเป็นปี) ไม่คุ้มสำหรับ solo dev และขัดหลัก scope discipline ใน GDD §3 · การเขียนเฉพาะ runtime ไม่ช่วยลดค่า license ถ้ายังใช้ Spine Editor | การวิเคราะห์ 2026-10-26 |

---

## 3. ขอบเขตของ VP0

| องค์ประกอบ | รายละเอียด | ทดสอบอะไร |
|---|---|---|
| **ฉาก: ลานศาลร้างชายป่า** (~20×20 m) | พื้นหินมีตะไคร่, ศาลร้าง (hero prop), กำแพงหินช่วงหนึ่ง, ต้นไม้ใหญ่ผูกผ้า, ศาลามีชายคา, โคมหิน 2–3 ตัว (แหล่งแสง), บันได (เปลี่ยนระดับพื้น), ต้นไม้ฉากหลังจางในหมอก, พุ่มไม้ฉากหน้า (ทดสอบ tilt-shift) | occluder 3 แบบ (กำแพง, ต้นไม้, ชายคา) ตาม M1, แสงโคม, หมอก, ความอ่านง่ายในฉากมืด |
| **ตัวละคร: จอมขมังเวท** (Yantra Adept บน body template 1 แบบ) | 4 ทิศ (วาด `se` และ `ne` แล้ว mirror) · ท่าบังคับ: idle, walk, cast, hit · ท่าเสริม: run, dodge, death · **Paper-doll (DEC-045):** ชุดพื้นฐาน + ชุดคลุมแบบที่ 2 + อาวุธหรือเครื่องราง 1 ชิ้น ซึ่งเปลี่ยนได้ด้วยปุ่ม debug | pivot, เท้าไถล, น้ำหนัก, แสงกับ sprite, การอ่านทิศ, **การเปลี่ยนชุดโดยสัดส่วนไม่เปลี่ยนและ draw order ถูกต้อง** |
| **ศัตรู: วิญญาณเร่ร่อน** (class M, ลอยได้) | ท่า idle (ลอย), move, attack, hit, banish · การโจมตีมี **telegraph วงแดงชาดบนพื้น (decal เท่านั้น)** | ความอ่านง่ายของศัตรูโปร่งแสงหรือเรืองแสงบนพื้นมืด และการแยก telegraph ของศัตรูกับของผู้เล่น |
| **สกิล: วงยันต์ระเบิด** (`seal_burst`, พื้นที่วงกลม) | **Anticipation:** ควันหมึกที่มือ + กระดาษยันต์หมุน · **Telegraph:** วงอักขระสีทองค่อย ๆ ปรากฏบนพื้นตลอด windup · **Impact:** ยันต์ลุกไหม้เป็นไฟวิญญาณ + light pulse + เศษกระดาษ · **Dissipation:** เถ้าโปรยลง และวงอักขระจางหาย | ครบ 3 ช่วงตาม Art Lock §4, ทิศและขนาดอ่านได้, ไม่บังศัตรู และวัดงบ particle |
| **HUD mock** (static DOM) | HP และ resource, skill bar 3 ช่อง, target frame (ข้อมูลปลอม) | UI art ตาม palette และพื้นที่กลางจอยังเห็นการต่อสู้ |

**นอกขอบเขต:** server, combat rules จริง, เสียง (ไม่บังคับ), zone ที่สอง, NPC, ตัวละครตัวที่สอง, ระบบ UI จริง, asset สำหรับ VS0 นอกเหนือจากที่ระบุ

---

## 4. Phases และ Tasks

| Phase | Task (backlog ID) | Size | ผลลัพธ์ |
|---|---|---|---|
| **VP0-a Tech spike** (graybox + placeholder) | M1-T01 scene, camera, units · **M1-T11 เทียบ pitch และช่วงซูม** · M1-T02 walkable data · M1-T03 placeholder sprite + manifest · M1-T04 renderer (R3) · M1-T06 depth spike (R1, R2, R3 ±R3b/R4) · **M1-T12 แสง, เงา, post และ quality tiers** · M1-T07 debug hook · M1-T09 benchmark | M–L รวม | **ADR-009** (กล้อง: pitch และ zoom), **ADR-008** (depth), **ADR-010** (lighting และ post) |
| **VP0-b1 ชิ้นส่วนตัวละคร** | **M1-T13 ชิ้นส่วนแยกชั้นและ turnaround คุณภาพเป้าหมาย** ของร่าง + item 2 ชิ้น (ใช้ได้กับทั้ง A3 และ A1-L) | M | ชิ้นส่วนที่ใช้ทดสอบ VP0-c ได้ |
| **VP0-c Animation runtime** (ก่อนเริ่ม: ติดตั้ง Blender สำหรับ A3-B ตาม DEC-054 · A3-S พักไว้ตาม DEC-058) | **M1-T19 A3-B (Blender → glTF) เทียบกับ A1-L** ด้วยชิ้นส่วนจาก T13 · A3-B: ท่า idle, walk, cast + เปลี่ยนชุด · A1-L: ตัวอย่างขั้นต่ำ (§2.3) | M–L (time-box ต่อตัวเลือก) | **ADR-002** (animation runtime) ตามกติกา G1–G5 (§2.3) |
| **VP0-b2 Art slice** | **M1-T20 animation ชุดเต็มของตัวละครใน runtime ตาม ADR-002** · **M1-T14 ศัตรู** · **M1-T15 VFX วงยันต์ระเบิด** (scripted) · **M1-T16 hero props และ dressing ของฉาก** · **M1-T17 HUD mock** · **M1-T18 readability และ clarity test session** | L รวม | ART_BIBLE v1.0, ASSET_PIPELINE v1.0 และผลวัดตาม §5 |

**ลำดับ (ปรับหลัง DEC-045):** **VP0-a → VP0-b1 → VP0-c → VP0-b2 → VP0 review**
- VP0-a ต้องเสร็จก่อน เพราะ**ต้องล็อก pitch ของกล้องก่อนวาดตัวละครคุณภาพจริง**
- ชิ้นส่วนแยกชั้น (T13) ใช้ได้กับทั้ง A3 และ A1-L จึงทำก่อนการตัดสิน runtime ได้
- **ห้ามผลิต animation ชุดเต็มก่อน ADR-002** เพราะวิธีผลิตของ A3-S (rig ใน Spine), A3-B (rig ใน Blender) และ A1-L (วาดทีละ frame ทีละชั้น) ต่างกันโดยสิ้นเชิง
- ศัตรู (T14), ฉาก (T16) และ HUD (T17) ไม่ใช้ paper-doll จึงทำคู่ขนานกับ VP0-c ได้
- VP0 review ผู้พัฒนาเป็นผู้ตัดสิน

**Exit criteria ของ VP0:**
1. ADR-008, 009, 010 และ 002 เป็น Accepted
2. เกณฑ์ใน §5 ผ่าน หรือมีบันทึกพร้อมเหตุผลและแผนแก้
3. ผู้พัฒนาอนุมัติ ART_BIBLE v1.0 และ ASSET_PIPELINE v1.0
4. ทุกข้อใน §6 ที่มีป้าย "ก่อนผลิตจำนวนมาก" ปิดแล้ว

---

## 5. วิธีวัดผล

> ตัวเลขทั้งหมดเป็น **เป้าตั้งต้น [R]** ซึ่งปรับได้หลังวัด baseline โดยต้องบันทึกการปรับใน DECISIONS (DEC-029) ห้ามแก้เงียบ ๆ
> **เครื่องมือ:** Playwright ถ่าย screenshot ที่ตำแหน่งกล้องคงที่ · debug hook (M1-T07) · **[R]** โหมด debug render แบบ mask (ตัวละคร, ศัตรู และ VFX แยกสี) สำหรับคำนวณ contrast และสัดส่วนที่ถูกบัง · `SceneInstrumentation` และ `EngineInstrumentation` **[F]** · Chrome DevTools (Performance และการจำลองภาวะตาบอดสีในแท็บ Rendering)

### 5.1 คุณภาพภาพ (Visual Quality)
| ID | ตัวชี้วัด | วิธีวัด | เป้า |
|---|---|---|---|
| V1 | Silhouette | screenshot ขาวดำ + blur ที่ default zoom แล้วให้ผู้ทดสอบระบุตัวเรา ศัตรู และทิศที่หัน | ถูก ≥ 90% |
| V2 | Pivot | วาง marker ที่ ground anchor แล้ววัดระยะจากเท้าในทุกทิศและทุก state | ≤ 1 px ที่ default zoom |
| V3 | เท้าไถล | วัดการเลื่อนของเท้าที่แตะพื้นในแต่ละ contact phase ของ walk และ run | ≤ 2 px และ `strideM` สอดคล้อง `moveSpeed` (validate อัตโนมัติ) |
| V4 | อ่านทิศได้ | screenshot ทิศแบบสุ่ม 8 ภาพต่อผู้ทดสอบ | ถูก ≥ 90% |
| V5 | Occlusion ถูกต้อง | occluder 3 แบบ × หน้า/หลัง × 4 ทิศ = 24 กรณี + ยืนชิดกำแพง (Δ = 0.3 m) | ผิด 0 กรณี |
| V6 | Style consistency | rubric 1–5 ใน 6 ด้าน (สัดส่วน, palette, ขอบ, การเข้ากันของแสง, วัสดุ, อารมณ์) เทียบกับ ART_BIBLE | เฉลี่ย ≥ 4 และไม่มีด้านใดได้ ≤ 2 |
| V7 | การเข้ากันของแสง | ตัวละครเดินจากใต้โคมไปที่มืด แล้วตัดสินว่าดูเหมือน "สติกเกอร์" หรือไม่ (rubric) | ≥ 4/5 |
| V8 | Lighting floor | ค่าความสว่างเฉลี่ยใน mask ของตัวละครและศัตรู ณ จุดที่มืดที่สุดของระนาบเล่นเกม | ≥ ค่าที่ตั้งใน VP0-a (บันทึกใน ADR-010) |
| V9 | Paper-doll consistency (DEC-045) | สลับ item ทุกแบบใน 4 ทิศและทุกท่าที่มี แล้วซ้อนภาพเทียบ silhouette ของร่าง, ตรวจ attachment และ draw order | สัดส่วนของร่างเปลี่ยน 0 px, attachment คลาดได้ ≤ 1 px, draw order ผิด 0 กรณี, rubric style ของ item ≥ 4 |

### 5.2 Performance
**Scenario (รันอัตโนมัติด้วยกล้องคงที่, 60 วินาที/ครั้ง, 3 ครั้ง):**
- **S1** ฉาก + ตัวละคร 1 ตัว
- **S2** ตัวละคร 4 + ศัตรู 1 + สกิลทุก 2 วินาที
- **S3** ตัวละคร 16 + ศัตรู 4 + สกิล 4 ตัวพร้อมกัน
- **S4 (stress)** ตัวละคร 32 + สกิลรัว

| ID | ตัวชี้วัด | เครื่องมือ | เป้าตั้งต้น (เครื่องพัฒนา, 1080p) |
|---|---|---|---|
| P1 | Frame time p50, p95, p99 | `SceneInstrumentation.frameTimeCounter` + `performance.now()` | S2 Medium: p95 ≤ 16.7 ms · S3 Medium: p95 ≤ 16.7 ms · S4: บันทึกค่าเท่านั้น |
| P2 | GPU frame time | `EngineInstrumentation.gpuFrameTimeCounter` (ถ้า browser รองรับ extension) | บันทึกค่า |
| P3 | Draw calls | `drawCallsCounter` | S2 ≤ 150 |
| P4 | Particles ที่ active | ตัวนับของระบบ VFX | สกิลเดียว ≤ 400 · ทั้งฉาก ≤ 2,000 |
| P5 | Texture memory | ผลรวม `gpuBytesEstimate` ใน manifest (+ inspector **[?]**) | zone ≤ 256 MB · ชุดตัวละคร ≤ 16 MB |
| P6 | Load time ของ zone | จับเวลาตั้งแต่สั่งโหลดถึง frame แรก (local) | ≤ 5 วินาที |
| P7 | Memory leak | load และ unload 10 รอบ (M1-T08) | ทรัพยากรกลับสู่ baseline |
| P8 | ต้นทุน animation runtime (VP0-c) | CPU ms ต่อ frame ที่ 32 ตัวละคร, A3-B และ A1-L (A3-S ถ้ากลับเข้ามา) + draw call ต่อตัวละคร (สำคัญกับ A3-B ที่มี mesh ต่อชิ้น) | A3-B: เป้าตั้งต้น ≤ 4 ms บนเครื่องพัฒนา (สมมติฐาน **[R]**) และ S3 ยังผ่าน P1 และ P3 |
| P9 | Memory ต่อ equipment visual | `gpuBytesEstimate` ต่อ item | A3-S และ A3-B ≤ 2 MB · A1-L ≤ 4 MB (`ASSET_PIPELINE.md §12`) |
| P11 | ชั่วโมงผลิต (VP0-c) | จับเวลาจริงต่อท่า (idle, walk, cast) และต่อ item ในแต่ละตัวเลือก | บันทึกค่าเพื่อใช้ใน tie-break และ DEC-056 |
| P10 | การสลับชุดไม่กระตุก | frame time ระหว่างสลับ item (โหลดแบบ lazy + fallback) | ไม่มี frame ใดเกิน 2× ของ p95 ปกติ |
- **min-spec:** รัน S1–S3 บนเครื่องอ้างอิงที่ผู้พัฒนาเลือก (DEC-048) แล้วตั้งเป้าหลังเห็นผล ห้ามตั้งเป้าล่วงหน้า (TEST §7 L62)
- ทุกผลบันทึกเป็น JSON ใน `docs/perf/` พร้อมเงื่อนไขครบตาม TEST §7 L55–61

### 5.3 ความชัดเจนของการต่อสู้ (Combat Clarity)
| ID | ตัวชี้วัด | วิธีวัด | เป้า |
|---|---|---|---|
| C1 | Telegraph lead | frame ที่ telegraph ปรากฏเทียบกับ event และระยะเวลาที่แสดง | ปรากฏภายใน 1 frame หลัง event และแสดงครบ 100% ของ windup |
| C2 | Telegraph อ่านได้ทุกสายตา | ตรวจ screenshot แบบปกติ, ขาวดำ, protanopia, deuteranopia และ tritanopia | ขอบเขตของวงอ่านได้ทุกโหมด และแยกของศัตรูกับของผู้เล่นได้ด้วยรูปทรง |
| C3 | VFX ไม่บังศัตรู | mask render: สัดส่วนพิกเซลของศัตรูที่ถูก VFX (alpha > 0.5) บังที่จุด peak ของ impact | ≤ 40% และศัตรูยังระบุได้ (V1) |
| C4 | Hit confirmation | เวลาตั้งแต่ event impact ถึง hit flash หรือท่า hit ของศัตรู | ≤ 100 ms (local) |
| C5 | Playtest การหลบ | ผู้ทดสอบ 5 คน หลบ telegraph ของศัตรูคนละ 10 ครั้ง (หลังซ้อม 3 ครั้ง) | สำเร็จ ≥ 80% และอธิบายได้ว่าทำไมโดน (GDD L99) |
| C6 | หาตัวเองเจอในฝูงคน | S3: เวลาที่ผู้ทดสอบใช้ชี้ตัวละครของตัวเอง | ≤ 1 วินาที |
| C7 | Photosensitivity | วิเคราะห์ความสว่างทั้งจอแบบต่อ frame ใน S4 | flash เต็มจอไม่เกิน 3 ครั้งต่อวินาที (WCAG 2.3.1) |
| C8 | Intensity tiers | VFX ของผู้เล่นอื่นที่ระดับ 25–35% ใน S3 | C3 ยังผ่าน |

---

## 6. สิ่งที่ต้องตัดสินใจก่อนผลิต Asset จำนวนมาก

| DEC | คำถาม | ทำไมบล็อก | ตัดสินโดย | ภายใน |
|---|---|---|---|---|
| **DEC-041** | Pitch ของกล้องและช่วงซูม | **sprite ทุกตัววาดตามมุมกล้อง ถ้าเปลี่ยนภายหลังต้องวาดใหม่ทั้งหมด** | VP0-a (M1-T11) + ผู้พัฒนา | ก่อน M1-T13 |
| **DEC-014** (เปิดใหม่) | Animation runtime: A3-B (Blender → glTF) หรือ A1-L (ทางสำรอง) · A3-S พักไว้ตาม DEC-058 | กำหนดเครื่องมือ รูปแบบไฟล์ memory และวิธีผลิต paper-doll | VP0-c ตามกติกา G1–G5 (§2.3) | **ก่อน M1-T20** |
| **DEC-042** | 4 หรือ 8 ทิศ + นโยบาย mirror (ตัวละครไม่สมมาตร) | ทำให้จำนวน frame ต่างกัน 2.5 เท่า | VP0-b + งบ | ก่อนผลิตจำนวนมาก |
| **DEC-043** | วิธีผลิตตัวละครและเครื่องมือ: rig ใน Blender (A3-B) หรือวาดแยกชั้นสำหรับ A1-L (อาจใช้ A2 หรือ A4 ช่วยผลิต) · rig ใน Spine (A3-S) พักไว้ตาม DEC-058 รวมถึง texture packer | กำหนด workflow และต้นทุน | VP0-c + ผู้พัฒนา | ก่อน M1-T20 |
| **DEC-044** | เครื่องมือช่วยความอ่านง่าย: rim, outline, hero light, ground ring และค่า lighting floor | กระทบทุก sprite และทุกฉาก | VP0-a/b | ก่อนผลิตจำนวนมาก |
| ~~DEC-045~~ | ขอบเขตการเปลี่ยนชุด | **✔ ตัดสินแล้ว 2026-10-26:** paper-doll ตาม equipment และ DEC-028 Superseded | ผู้พัฒนา | — |
| **DEC-057** | Visual slots (ข้อเสนอ ≤ 5), draw order ต่อทิศ และการแสดงรอยสัก | จำนวน item ที่ต้องผลิตคูณตามจำนวน slot | ผู้พัฒนาร่วมกับ VP0-c | ก่อน M1-T13 |
| ~~G1 ของ A3-S~~ | ยอมรับค่า Spine หรือไม่ | — | **✔ ตัดสินแล้ว 2026-10-26: ยังไม่ยอมรับ (DEC-058)** และทบทวนได้ถ้า A3-B ไม่ผ่าน | — |
| **DEC-046** | ความละเอียดของ sprite และ texel density | กำหนดขนาดไฟล์ทุกชิ้น | VP0-a/b | ก่อนผลิตจำนวนมาก |
| **DEC-047** | โมเดลแสงและเงาของ sprite (L1–L4, S1–S2) + หลักการวาดแสงในภาพ | กำหนดวิธีวาดทุกตัว | VP0-a | ก่อน M1-T13 |
| **DEC-048** | Post-processing, quality tiers และเครื่อง min-spec | กำหนดงบ performance | VP0-a + ผู้พัฒนา (เลือกเครื่อง) | ก่อน VP0 review |
| **DEC-049** | วิธีสร้าง VFX (ระบบ particle ของ Babylon หรือ format ของเราเอง) และ intensity tiers | กำหนด pipeline ของ VFX | VP0-b | ก่อนผลิต VFX จำนวนมาก |
| **DEC-050** | แสงในฉากแบบ baked lightmap หรือ dynamic | กำหนด workflow ใน Blender และ performance | VP0-a | ก่อนผลิตฉากจำนวนมาก |
| **DEC-051** | ที่เก็บไฟล์ต้นฉบับ (Git LFS หรือนอก git) | ต้องรู้ก่อนมีไฟล์ต้นฉบับชิ้นแรก | **ผู้พัฒนา** | ก่อน M1-T03 |
| **DEC-052** | Font ไทยและโลโก้ | กระทบ UI ทุกหน้าจอ | **ผู้พัฒนา** | ก่อน M1-T17 |
| **DEC-053** | แนวทางด้านวัฒนธรรมและผู้ตรวจ | ต้องตั้งกติกาก่อนออกแบบยันต์ ตัวละคร และสถานที่ | **ผู้พัฒนา** | ก่อน M1-T13 |
| **DEC-054** | เครื่องมือของ Blender pipeline (ติดตั้ง Blender, การบีบอัด glTF, การ bake lightmap และ **script export ของ A3-B**) | ไม่พบ Blender ใน PATH | ผู้พัฒนา + VP0-a | ก่อน M1-T16 หรือ M1-T19 (อันไหนมาก่อน) |
| **DEC-035** | Provenance และการใช้ AI สร้าง asset | ทุก asset ต้องมี provenance ก่อน ship | **ผู้พัฒนา** | ก่อน M1-T13 |
| **DEC-055** | Roster ของ MVP เทียบกับ 4 archetype ในภาพอ้างอิง และ UI ในภาพที่อยู่นอกขอบเขต (party/guild chat, minimap) | กำหนดจำนวนตัวละครที่ต้องผลิต | **ผู้พัฒนา** | ก่อนผลิตจำนวนมาก |
| **DEC-056** | **กำลังการผลิต art** (ผลิตเอง จ้าง ซื้อ หรือใช้ AI ช่วย) และงบ | ตัวละคร HD แบบ A1 มี 136 frame ต่อชุด ซึ่ง**อาจใช้หลายร้อยชั่วโมงต่อชุดถ้าวาดมือทุกเฟรม** (ประมาณการหยาบ ขึ้นกับทักษะและเครื่องมือ) จึงเป็นข้อจำกัดใหญ่ที่สุดของ solo dev | **ผู้พัฒนา** | **ก่อน VP0-b** |

---

## 7. ความเสี่ยงของ VP0 และ Art Pipeline
| ID | ระดับ | ความเสี่ยง | Mitigation |
|---|---|---|---|
| RA-01 | **Critical** | กำลังการผลิต art ของ solo dev ไม่พอสำหรับตัวละคร HD (DEC-056) | ตัดสินวิธีผลิตก่อน VP0-b, ลดจำนวนทิศและท่า, ใช้ A2/A3/A4 ช่วยลดงานวาด และใช้ asset ร่วมกัน (เปลี่ยนสี, เปลี่ยนชิ้นส่วน) |
| RA-02 | High | เปลี่ยน pitch ของกล้องหลังผลิต asset ไปแล้ว | ล็อก ADR-009 ก่อน M1-T13 และห้ามเปลี่ยนโดยไม่มี ADR ใหม่ |
| RA-03 | High | sprite แทงเข้ากำแพงหรือโดนชายคาบัง (§2.1) | spike R1–R4 + กติกา cutaway และ collision radius |
| RA-04 | High | ฉากมืดและหมอกทำให้อ่านเกมไม่ออก | lighting floor, hero light, rim และการวัด V8, C2, C3 |
| RA-05 | High | Texture memory พุ่งเมื่อมี item หลายแบบบนจอ (`ASSET_PIPELINE.md §6.2`) | A3 + เพดานต่อ item (P9) + tint หรือ palette swap |
| RA-06 | ⏸ ไม่ active ระหว่างที่ A3-S พักไว้ (DEC-058) · เดิมเป็น High | ต้องเขียนและดูแล renderer ของ Spine สำหรับ Babylon เอง เพราะไม่มีตัวทางการ (เรื่อง license ตรวจแล้วตามภาคผนวก C.1) | ทำ VP0-c แบบ time-box และมี A3-B ซึ่งไม่ต้องเขียน runtime เป็นตัวเทียบ รวมถึง A1-L เป็นทางสำรอง |
| RA-07 | Medium | Post-processing หนักเกินไปบนเครื่อง min-spec | quality tiers + วัด P1 บน min-spec |
| RA-08 | Medium | ความอ่อนไหวทางวัฒนธรรม | ART_BIBLE §3.4 + DEC-053 |
| RA-09 | Medium | Asset ที่ไม่รู้ที่มา (รวมถึงภาพอ้างอิง) หลุดเข้า build | ฟิลด์ provenance บังคับ + validate ใน CI |
| RA-10 | Medium | Scope creep จากภาพอ้างอิง (4 archetype, party/guild, minimap) | ART_BIBLE §2 + DEC-055 |
| RA-11 | High | ต้นทุน art ของ paper-doll คูณตาม item × ทิศ (และ × frame ถ้าเป็น A1-L) | จำกัดจำนวน slot (DEC-057), ใช้ template ร่วม + tint, จำกัดจำนวน item ที่แสดงผลใน MVP และรวมไว้ในแผนกำลังการผลิต (DEC-056) |
| RA-12 | **High** (A3-B เป็นทาง skeletal ทางเดียวใน VP0-c ตาม DEC-058) | workflow แอนิเมชัน 2D ใน Blender ช้า, ลำดับชั้นภายในตัวละครผิดหรือกระพริบ, และ glTF ไม่มี draw order ต่อ keyframe | ทดลองวิธี (a)/(b)/(c) ใน §2.3, จับเวลา P11 และเทียบกับตัวอย่าง A1-L ถ้าไม่ผ่านให้ผู้พัฒนาเลือก A1-L หรือเปิด A3-S ใหม่ |

## 8. สิ่งที่ต้องมีก่อนเริ่ม VP0 (จาก backlog เดิม)
**[F]** VP0 อยู่ใน M1 จึงต้องผ่าน M0 ก่อน ได้แก่ git (M0-T02), workspace และ `pnpm verify` (M0-T08 ถึง T10) และ ADR-001 ที่ pin เวอร์ชันของ Babylon.js (M0-T06, T12) **ห้ามเริ่ม VP0 บน repo ที่ยังไม่มี git**
