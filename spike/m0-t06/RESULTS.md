# M0-T06 Version Compatibility Spike — Results

- **วันที่:** 2026-10-26 · **Branch:** `spike/m0-t06-versions` (throwaway, **ไม่ merge**)
- **เครื่อง:** Windows 11, Node v24.19.0, corepack 0.35.0, i5-14600K
- **ที่มาของตัวเลข:** log จริงใน `logs/` ทุกบรรทัดในไฟล์นี้อ้างคำสั่งที่รันแล้ว
- **Set A** = TypeScript 7.0.2 + Biome · **Set B** = TypeScript 6.0.3 + ESLint/typescript-eslint · dependency อื่นใช้ exact version เดียวกันทั้งสอง set (`set-*/package.json`)

## สรุป
| Test | Set A (TS 7.0.2) | Set B (TS 6.0.3) | หลักฐาน |
|---|---|---|---|
| T1 pnpm 12.15.0 install + `--frozen-lockfile` จาก clean | ✔ (หลังกำหนด `allowBuilds`) | ✔ | `logs/t1-*` |
| T2a `schema()` style: typecheck + encode/decode round-trip | ✔ | ✔ | `logs/t2-*-tsc.log`, `logs/t3-*-vitest-*.log` |
| T2b `@type()` decorators (`experimentalDecorators`) compile + round-trip ใน Node | ✔ | ✔ | `logs/t2b-*` + output `{"ok":true}` |
| T3 Colyseus 0.18 room + `@colyseus/sdk` client (state sync + validation) | ✔ (หลังปรับ test ตามพฤติกรรมจริง ดู F3) | ✔ | `logs/t3-*-vitest*.log` |
| T4 Vite 8 + React 19 build + typecheck | ✔ | ✔ | `logs/t4-*` |
| T5 Babylon.js 9: NullEngine + ortho camera, glTF loader, tree-shaking | ✔ | ✔ | `logs/t3-*`, `logs/t4-*` |
| T6 Prisma 7.10.1 generate (CLI = client) + typecheck generated types | ✔ **แต่มีการดาวน์โหลดนอกแผน** (F1) | ✔ (เหมือนกัน) | `logs/t6-*` |
| T7 Zod 4 + Vitest 5 (valid / invalid / oversized) | ✔ | ✔ | `logs/t3-*` |
| T8 Lint | Biome ✔ · **ESLint + typescript-eslint ✘** ("does not support TS 7.0") | Biome ✔ · ESLint + typescript-eslint ✔ (ทำงานได้และพบ 13 จุดจริง) | `logs/t8-*` |
| T9 `engineStrict` บน Node 24.19.0 | ✔ ติดตั้งได้ และ**บล็อก** engines `>=99` ด้วย `ERR_PNPM_UNSUPPORTED_ENGINE` | ✔ | output ในเซสชัน |

## ตัวเลขที่วัดได้
| รายการ | ค่า |
|---|---|
| เวลา install (store อุ่นแล้ว) | ~1.5–3 วินาทีต่อ set |
| ขนาด `.pnpm-store` | 633 MB · `.corepack` (pnpm binary) 55 MB · รวมทั้งโฟลเดอร์ spike 785 MB |
| `pnpm-lock.yaml` | Set A 4,060 บรรทัด · Set B 3,859 บรรทัด |
| Typecheck (`tsc -p tsconfig.json`, 3 รอบ) | **TS 7: 322–353 ms** · **TS 6: 1,732–1,745 ms** (≈ 5× เร็วกว่า) |
| Web bundle: Babylon import ทีละ module | 1,246,728 bytes raw / **315,334 bytes gzip** |
| Web bundle: `import * from "@babylonjs/core"` | 7,412,592 bytes raw / **1,627,423 bytes gzip** (≈ 5.2× ใหญ่กว่า) |
| Vitest | 8/8 ผ่านทั้งสอง set (~1 วินาที) |

## Findings (ข้อเท็จจริงที่พบ)
- **F1 — Prisma CLI ดาวน์โหลด Schema Engine เองตอน runtime (นอกแผน):** แม้บล็อก postinstall ของ `@prisma/engines` แล้ว คำสั่ง `prisma --version` และ `prisma generate` ยังดาวน์โหลด `schema-engine-windows.exe` (20,791,808 bytes) ลงใน `node_modules/.pnpm/@prisma+engines@7.10.1/...` ของทั้งสอง set และสร้าง cache ที่ **`C:\Users\mixza\AppData\Roaming\prisma\master\d1b3f377…\windows\`** (schema-engine + ไฟล์ `.sha256` 2 ไฟล์ รวม ~20 MB, สร้างเมื่อ 2026-10-26 01:29:12) ซึ่งอยู่**นอกโฟลเดอร์ spike** · host ใน `@prisma/fetch-engine` คือ `binaries.prisma.sh` · หลังพบ ไม่ได้รันคำสั่ง Prisma CLI อีก · **ยังไม่ได้ลบ cache นี้ รอผู้พัฒนาตัดสิน**
- **F2 — Prisma 7 "Query Compiler: enabled":** `prisma generate` ไม่ต้องใช้ query engine แบบ Rust และใช้แค่ wasm (`@prisma/prisma-schema-wasm`) · Schema Engine binary จำเป็นสำหรับ migrate (ซึ่งจะต้องใช้ใน M4) · `prisma` 7.10.1 มี dependency `@prisma/dev` + `@electric-sql/pglite` (Postgres แบบ WASM) ซึ่งอาจเป็นทางเลือกของ DEC-009 **[?]** ต้องตรวจเพิ่ม
- **F3 — Colyseus 0.18.23: validation ในตัวจะตัดการเชื่อมต่อ:** `onMessage(type, zodSchema, handler)` ใช้ Standard Schema ได้ตรงกับ Zod 4 แต่ถ้า payload ไม่ผ่าน จะเรียก `client.leave(CloseCode.WITH_ERROR)` (= **4002**) ทันที (อ่านจาก `RoomMessages.mjs` และยืนยันด้วย T3b) · ห้องยังให้บริการ client อื่นได้ตามปกติ · ถ้าต้องการ "ทิ้ง message โดยไม่ตัดการเชื่อมต่อ" ต้อง `safeParse` เองใน handler (T3a) · T3 ฉบับแรกล้มเหลวเพราะสมมติว่าจะทิ้ง message (`logs/t3-set-a-vitest.log`) จึงแก้ test ให้ตรวจพฤติกรรมทั้งสองแบบ
- **F4 — Colyseus 0.18 มีของที่เกี่ยวกับการตัดสินใจของเรา:** `Rewind` / `RewindView` (lag compensation, DEC-018), `InputBufferImpl` + `setSimulationInterval` (DEC-017) และ `StateView` / `@view` ใน schema (กรองข้อมูลต่อ client, R-11) **[?]** ยังไม่ได้ทดสอบใน spike นี้
- **F5 — `@colyseus/schema` 5 แนะนำ `schema()` แทน decorators:** README ระบุว่า decorators ต้องใช้ legacy `experimentalDecorators` + `useDefineForClassFields: false` ซึ่ง "conflict with modern toolchain defaults (esbuild, SWC, Vite)" · ทั้งสองแบบให้ wire format เดียวกัน · README ระบุว่ารองรับ TypeScript 5.x, 6.x และ 7.x
- **F6 — typescript-eslint 8.72.0 กับ TS 7:** peer `typescript >=4.8.4 <6.1.0` และ runtime โยน error "typescript-eslint does not support TS 7.0" พร้อมลิงก์ไปยังแนวทาง "running side-by-side with TypeScript 6.0" ในประกาศ TS 7 และ issue #10940 (ติดตามการรองรับ TS >=7.1) · แนวทาง side-by-side **ยังไม่ได้ทดสอบ**
- **F7 — Type-aware lint ให้คุณค่าเพิ่ม:** บน Set B ESLint พบ 13 จุดใน `room.test.ts` ที่ `room.state` จาก SDK เป็น `any` แม้ส่ง `rootSchema` แล้ว (tsc และ Biome ไม่เตือน)
- **F8 — pnpm 12:** ถ้ามี build script ที่ไม่ได้อนุมัติ install จะ**ล้มเหลว** (`ERR_PNPM_IGNORED_BUILDS`, สังเกตตอน `CI=true`) · การตั้งค่าคือ `allowBuilds` ใน `pnpm-workspace.yaml` (แทน `onlyBuiltDependencies` ตั้งแต่ pnpm 11 ตาม CHANGELOG) · ใน spike ปฏิเสธทั้ง 3 ตัว (`@prisma/engines`, `prisma`, `msgpackr-extract`) และทุก test ยังผ่าน · `engineStrict` และ `storeDir` อ่านจาก `pnpm-workspace.yaml` ได้
- **F9 — corepack:** `corepack pnpm@12.15.0` ทำงานได้โดยไม่ต้อง `corepack enable` และไม่มี shim ในโฟลเดอร์ Node · ตั้ง `COREPACK_HOME` ไว้ในโฟลเดอร์ spike ได้
- **F10 — Biome 2.6.3:** ทำงานได้กับทั้งสอง set (ไม่พึ่ง TypeScript) แต่แนะนำ `biome migrate` (`"recommended": true` → `"preset": "recommended"`)
- **F11 — `skipLibCheck: false`:** ทั้งสอง TS major มี 7 error จาก `.d.ts` ของ Colyseus ที่อ้างถึง `@types/express` และ `@types/debug` ซึ่งไม่ได้ติดตั้ง (ปัญหา typing ของ library ไม่ใช่ของ TS major)
- **F12 — Babylon.js 9:** `SceneLoader.IsPluginForExtensionAvailable(".glb")` เป็น true หลัง import `@babylonjs/loaders/glTF` · `@babylonjs/loaders` ต้องการ peer `babylonjs-gltf2interface` ซึ่ง pnpm ติดตั้งให้อัตโนมัติ

## สิ่งที่ spike นี้ไม่ได้ครอบคลุม
- การรันใน browser จริง (ไม่มี Playwright) · ต่อ PostgreSQL หรือ migrate · Rewind, InputBuffer และ StateView ของ Colyseus · การรัน typescript-eslint แบบ side-by-side กับ TS 7 · import-boundary lint (ย้ายไป M0-T09)
