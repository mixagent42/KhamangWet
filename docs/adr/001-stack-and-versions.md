# ADR-001 — Stack และเวอร์ชันที่ pin

- **Status:** Accepted · **Date:** 2026-10-26
- **ผู้ตัดสิน:** ผู้พัฒนาเลือก TypeScript และ lint เอง (DEC-006, DEC-010) · ข้ออื่นมาจากการมอบอำนาจใน M0-T01 (DEC-003, 004, 005, 007, 008) ซึ่งเงื่อนไข "ต้องผ่าน spike" ได้รับการยืนยันแล้วใน M0-T06 · **ผู้พัฒนาอนุมัติ ADR ทั้งฉบับรวม conventions 3 ข้อเมื่อ 2026-10-26** ("อนุมัติ ADR-001 และ conventions ทั้ง 3 ข้อ")
- **หลักฐาน:** annotated tag **`spike/m0-t06`** → commit `ce3eed4` ซึ่งมีโค้ด, lockfile และ `spike/m0-t06/RESULTS.md` (จาก commit `15a0b05`) + log ดิบ 24 ไฟล์ใน `spike/m0-t06/logs/` (force-add ใน `ce3eed4` เพราะ root `.gitignore` มี `*.log`) · branch spike และโฟลเดอร์บนดิสก์ถูกลบแล้วเมื่อ 2026-10-26 · ดูได้ด้วย `git show refs/tags/spike/m0-t06:spike/m0-t06/RESULTS.md` · ข้อมูลสำคัญคัดลอกไว้ในไฟล์นี้แล้วด้วย
- **เกี่ยวข้อง:** `docs/DECISIONS.md` DEC-003 ถึง 008, DEC-010 · `docs/TECHNICAL_ARCHITECTURE.md §1` (L17 "Check compatibility, latest stable versions, and licensing before pinning dependencies. Commit lockfile.")

## Context
- `TECHNICAL_ARCHITECTURE.md §1` เสนอ stack ไว้แต่ยังไม่ได้กำหนดเวอร์ชัน
- npm registry (ตรวจ 2026-10-25/26) มีกับดักหลายจุด:
  - tag `latest` ของ `prisma` CLI = `8.0.0-rc.27` (release candidate) ขณะที่ `@prisma/client` = `7.10.1`
  - `typescript` latest = `7.0.2` แต่ `typescript-eslint` 8.72.0 มี peer `typescript >=4.8.4 <6.1.0`
  - Colyseus ยังเป็น 0.x และ client SDK ย้ายจาก `colyseus.js` ไปเป็น `@colyseus/sdk`
- จึงต้องทำ spike เพื่อพิสูจน์ความเข้ากันได้จริงก่อน pin

## Decision

### Runtime และเครื่องมือ
| ส่วน | เวอร์ชันที่ pin (exact) | หมายเหตุ |
|---|---|---|
| Node.js | `^24.19.0` (`engines.node`), สาย 24 LTS | เครื่องพัฒนามี 24.19.0 |
| pnpm | **12.15.0** (`packageManager: "pnpm@12.15.0+sha512.…"`) | เรียกผ่าน `corepack pnpm@12.15.0` ได้โดยไม่ต้อง `corepack enable` (การติดตั้งถาวรอยู่ใน M0-T07) · **M0-T07 (2026-10-26):** ใช้ corepack shim ใน `%APPDATA%\npm` (`corepack enable pnpm --install-directory "%APPDATA%\npm"`, ไม่ต้องใช้สิทธิ์ admin) · pnpm อยู่ที่ `%LOCALAPPDATA%\node\corepack` (56.7 MB รวมไฟล์รันสำหรับ win32-x64) · `packageManager` มี sha512 ของ tarball ตามที่ corepack แนะนำ · pnpm 12 บันทึกตัวเองใน `pnpm-lock.yaml` (`packageManagerDependencies`) |
| TypeScript | **6.0.3** | ผู้พัฒนาเลือก (DEC-006) เพื่อให้ใช้ type-aware lint ได้ |
| ESLint | **10.13.0** | DEC-010 |
| typescript-eslint | **8.72.0** (`recommendedTypeChecked` + `projectService`) | DEC-010 |
| Prettier | **3.9.10** | formatter เฉพาะ code และ config (DEC-010, M0-T09) · ไม่มี dependency · 10 MB |

### Libraries
| กลุ่ม | Package | เวอร์ชัน |
|---|---|---|
| Server | `@colyseus/core` | 0.18.23 |
| | `@colyseus/ws-transport` | 0.18.4 |
| | `@colyseus/schema` | 5.0.42 |
| | `express` (peer ของ ws-transport) | 5.3.0 |
| Client | `@colyseus/sdk` | 0.18.6 |
| | `@babylonjs/core`, `@babylonjs/loaders` | 9.32.0 |
| | `react`, `react-dom` | 19.3.1 |
| | `@types/react`, `@types/react-dom` | 19.3.0 |
| Shared | `zod` | 4.6.7 |
| Persistence | `prisma` (CLI), `@prisma/client` | **7.10.1 ทั้งคู่** (ไม่ใช้ 8.0 RC) |
| Build / test | `vite` | 8.3.5 |
| | `@vitejs/plugin-react` | 6.1.2 |
| | `vitest` | 5.0.5 |
| | `@colyseus/testing` / `@colyseus/tools` | 0.18.6 / 0.18.10 |
| | `@types/node` | 24.19.2 (ตรงกับ Node 24 ไม่ใช่ `latest` 26.x) |

### การตั้งค่า pnpm (`pnpm-workspace.yaml`)
- `engineStrict: true` (ทดสอบแล้วว่าบล็อก Node ที่ไม่ตรงด้วย `ERR_PNPM_UNSUPPORTED_ENGINE`)
- `allowBuilds` (กลไกของ pnpm 11 ขึ้นไป แทน `onlyBuiltDependencies`) ค่าเริ่มต้นคือ**ปฏิเสธทั้งหมด**:
  - `@prisma/engines: false` (postinstall ดาวน์โหลด binary จาก `binaries.prisma.sh`)
  - `prisma: false` (preinstall check)
  - `msgpackr-extract: false` (native accelerator ที่ไม่บังคับ, prebuilt package ติดตั้งให้อยู่แล้ว)
- pnpm 12 จะ**ล้ม install** ถ้ามี build script ที่ยังไม่ได้ตัดสิน (`ERR_PNPM_IGNORED_BUILDS`) จึงต้องตัดสินทุกตัวที่ขอ build ไว้ใน `allowBuilds`

### Conventions ที่มาจากหลักฐานใน spike (✔ ผู้พัฒนาอนุมัติ 2026-10-26)
1. **Colyseus state ใช้ `schema()` + `t.*`** ไม่ใช้ `@type()` decorators: README ของ `@colyseus/schema` 5 แนะนำ และ decorators ต้องใช้ legacy `experimentalDecorators` + `useDefineForClassFields: false` ซึ่งขัดกับ default ของ Vite (ทั้งสองแบบทำงานได้จริงใน spike และให้ wire format เดียวกัน)
2. **Babylon.js import ทีละ module** (เช่น `@babylonjs/core/scene`) ไม่ใช้ `import * from "@babylonjs/core"`: bundle gzip 315 KB เทียบกับ 1.63 MB (≈ 5.2×)
3. **tsconfig ฐาน:** `strict`, `noUncheckedIndexedAccess`, `isolatedModules`, `verbatimModuleSyntax`, `moduleResolution: "bundler"` (สำหรับ web) และ `skipLibCheck: true` (เพราะ `.d.ts` ของ Colyseus อ้างถึง `@types/express` และ `@types/debug` ซึ่งทำให้มี 7 error ถ้าปิด skipLibCheck)

### Conventions ของ workspace (M0-T08, ✔ ผู้พัฒนาอนุมัติในแผน 2026-10-26)
4. **ชื่อ package ใช้ scope `@kw/*`** (เช่น `@kw/game-rules`) ทุกตัวเป็น `private` และอ้างกันด้วย `workspace:*` จึงไม่ดึงจาก npm registry
5. **เวอร์ชันที่ใช้ร่วมกันอยู่ใน `catalog` ของ `pnpm-workspace.yaml`** เป็น exact version (DEC-003) และ package อ้างด้วย `"catalog:"` · เพิ่ม dependency ใหม่ให้เพิ่มใน catalog ก่อน
6. **tsconfig 3 ชั้นใน `packages/config`:**
   - `tsconfig.base.json`: flag ตามข้อ 3 + target และ lib = ES2023 (ไม่มี DOM)
   - `tsconfig.lib.json`: สำหรับ runtime packages และ `apps/game-server` · `module`/`moduleResolution: "nodenext"`, ออก `.d.ts` และ source map, `types: []` จึงไม่มี Node types ถ้าไม่ประกาศเอง
   - `tsconfig.web.json`: สำหรับ `apps/web` · เพิ่ม DOM, `moduleResolution: "bundler"`, `noEmit` (Vite เป็นคน build)
   - `rootDir`, `outDir` และ `types` ตั้งใน tsconfig ของแต่ละ package เพราะ path ใน config ที่ extends จะ resolve จากตำแหน่งของไฟล์ config ต้นทาง

## หลักฐานจาก spike (สรุป)
| Test | TS 7.0.2 (เทียบ) | **TS 6.0.3 (เลือก)** |
|---|---|---|
| T1 pnpm install + `--frozen-lockfile` จาก clean | ✔ | ✔ |
| T2 Colyseus schema: `schema()` และ decorators (typecheck + encode/decode) | ✔ | ✔ |
| T3 Colyseus room + `@colyseus/sdk` (state sync, validation) | ✔ | ✔ |
| T4 Vite 8 + React 19 build + typecheck | ✔ | ✔ |
| T5 Babylon 9: NullEngine + ortho camera, glTF loader, tree-shaking | ✔ | ✔ |
| T6 Prisma 7.10.1 generate + typecheck types | ✔ | ✔ |
| T7 Zod 4 + Vitest 5 | ✔ | ✔ |
| T8 ESLint + typescript-eslint | ✘ ("typescript-eslint does not support TS 7.0") | ✔ (พบ `any` รั่ว 13 จุด ซึ่ง tsc และ Biome ไม่เตือน) |
| T9 engineStrict | ✔ | ✔ |
| Typecheck (3 รอบ) | 322–353 ms | 1,732–1,745 ms |

## Alternatives ที่พิจารณา
- **TS 7.0.2 + Biome 2.6.3:** typecheck เร็วกว่า ≈ 5× แต่ไม่มี type-aware lint → ไม่เลือก
- **TS 7 + typescript-eslint ที่รันคู่กับ TS 6 API:** ข้อความ error ของ typescript-eslint แนะนำแนวทางนี้ แต่ซับซ้อนกว่าและยังไม่ได้ทดสอบ → ไม่เลือก
- **Prisma 8.0.0-rc.27:** เป็น prerelease → ไม่เลือก (DEC-008)
- **Colyseus meta package `colyseus`:** peer ที่ไม่ optional ดึง Redis และ uWebSockets มาด้วย → ใช้ `@colyseus/core` + `@colyseus/ws-transport` แทน

## Consequences
- **ข้อดี:** build ทำซ้ำได้ (lockfile + exact pin), lint จับ `any` และ promise ที่หลุดได้, ทุกส่วนของ stack พิสูจน์แล้วว่าทำงานร่วมกันบน Node 24
- **ข้อเสีย:** typecheck ช้ากว่า TS 7 ≈ 5× (ยังเร็วพอที่ขนาดโปรเจกต์ตอนนี้) และ TS 6 จะต้องย้ายไป TS 7 ในอนาคต
- **ข้อจำกัดที่ต้องรู้:**
  - Prisma CLI ดาวน์โหลด Schema Engine (~20 MB) จาก `binaries.prisma.sh` ตอน runtime แม้จะบล็อก postinstall แล้ว และเก็บ cache ไว้ที่ `%APPDATA%\prisma` (finding F1) · การตัดสินใจเรื่องนี้ยัง Open ใน DEC-008
  - Colyseus validation ในตัว (`onMessage(type, schema, handler)`) **ตัดการเชื่อมต่อ client** (code 4002) เมื่อ payload ไม่ผ่าน (finding F3) · นโยบายตัดสินใน M3-T04
- ~~**Formatter ยังไม่ได้เลือก:** DEC-010 ครอบคลุม lint แล้ว ส่วน formatter (Biome แบบใช้เฉพาะ formatter หรือ Prettier) ตัดสินใน M0-T09~~ **เลือกแล้วใน M0-T09 (2026-10-26):** Prettier 3.9.10 เฉพาะ code และ config (DEC-010)

## Revisit triggers
| เมื่อ | ทบทวน |
|---|---|
| typescript-eslint รองรับ TS 7 (ติดตามใน issue #10940 ของ typescript-eslint) | ย้ายไป TS 7 (DEC-006) |
| Prisma 8 GA และจบ M4 แล้ว | Prisma major |
| Node 26 เข้า LTS และจบ M4 แล้ว | Node line (DEC-004) |
| จบแต่ละ milestone | อัปเดต patch และ minor ใน branch แยกพร้อมรัน `pnpm verify` (DEC-003) |
| Colyseus ออก minor ใหม่ (0.x อาจมี breaking change) | อ่าน migration guide ก่อนอัปเดต |
