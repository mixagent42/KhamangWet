# IMPLEMENTATION STATUS — Khamang Wet

- **Snapshot:** 2026-10-26 · **ตรวจโดย:** Claude Code (read-only checks)
- **Repository state:** เป็น git repository ตั้งแต่ 2026-10-26 (M0-T02) · branch `main` · baseline commit `ce6117d` · ยังไม่มี remote (DEC-039 รอผู้พัฒนาสร้าง repo)
- **กฎของไฟล์นี้:** อัปเดตได้เฉพาะเมื่อมี**หลักฐานจริง** (คำสั่งที่รัน + ผลลัพธ์ + วันที่ หรือ path ของไฟล์และ test) ห้ามเปลี่ยนสถานะเป็น Implemented ตามที่เอกสารออกแบบเขียนไว้ หรือตามที่ AI รายงานโดยไม่มีผลรันประกอบ

### นิยามสถานะ
| สถานะ | ความหมาย | หลักฐานขั้นต่ำ |
|---|---|---|
| **Implemented** | มีโค้ดหรือไฟล์จริง และผ่าน acceptance criteria ตาม `DEFINITION_OF_DONE.md` | path + test ที่ผ่าน + คำสั่งที่รัน |
| **Partial** | มีบางส่วน หรือมีแต่ยังไม่ผ่าน criteria หรือยังไม่ได้ทดสอบ | path + ส่วนที่ขาด |
| **Missing** | ตรวจแล้วไม่พบ | คำสั่งที่ใช้ตรวจ |
| **Unknown** | ตรวจจาก workspace นี้ไม่ได้ ต้องถามผู้พัฒนาหรือตรวจเพิ่ม | เหตุผลที่ตรวจไม่ได้ |

---

## 1. สรุป

| สถานะ | จำนวนรายการ (ตาราง §3) |
|---|---|
| Implemented | 5 (เอกสาร 2 รายการ + git repository + `CLAUDE.md` + `.claude/rules/` · ยังไม่มีโค้ด) |
| Partial | 3 |
| Missing | 29 (infrastructure 6 + game systems 22 + art assets 1) |
| Unknown | 4 |

**[F]** ยังไม่มีโค้ดเกม, ยังไม่มี build system และยังไม่มี test · เอกสารทั้งหมดเป็นแผนและข้อเสนอ ไม่ใช่สิ่งที่ทำไปแล้ว (README L5)

---

## 2. หลักฐานที่ใช้ (Evidence Log)

### 2.1 Repository และ Git
| คำสั่ง (รันเมื่อ 2026-10-26) | ผลลัพธ์จริง |
|---|---|
| `git status` ใน `KhamangWet_FullSystem/` | `fatal: not a git repository (or any of the parent directories): .git` |
| `git -C E:/KhamangWet status` | `fatal: not a git repository …` |
| `git config --get core.autocrlf` | `true` |
| `git config --get init.defaultBranch` | `master` |
| `git config --get user.name` / `user.email` | ไม่ได้ตั้งค่า (commit จะล้มเหลว) |
| `find E:/KhamangWet -type f` | 35 ไฟล์ = 34 ต้นฉบับ + `PROJECT_ONBOARDING_REPORT.md` (ก่อนสร้างไฟล์ foundation 4 ไฟล์นี้) |
| `find` หา `package.json`, `Makefile`, `justfile`, `turbo.json`, `nx.json`, `pyproject.toml`, `*.sln`, `Taskfile*`, `.github`, `.gitlab-ci.yml` | ไม่พบ |
| `test -e E:/package.json`, `E:/node_modules` | ไม่พบ (npm จึงไม่ได้ไปใช้ project ที่ parent directory) |
| นับ CR bytes ทุกไฟล์ (`tr -cd '\r' \| wc -c`) | 0 = ทุกไฟล์ใช้ LF |
| `ls .claude/` | มีแค่ `rules/` ไม่มี `settings.json`, `skills/`, `agents/` หรือ `hooks/` |
| (รอบ 2, 2026-10-26) `find` หาไฟล์ที่ไม่ใช่ `.md` และไฟล์ asset (png, jpg, webp, psd, blend, glb, gltf, spine, json, ktx2) | ไม่พบ · `git status` ยังเป็น `fatal: not a git repository` · md5 ของไฟล์ต้นฉบับ 34/34 OK |
| **(M0-T02, 2026-10-26)** `git init -b main` + `git config --local user.name/user.email` | สร้าง repo ที่ `E:/KhamangWet/KhamangWet_FullSystem/.git/` · `HEAD` = `refs/heads/main` · identity แบบ local = `mixza <[redacted]>` |
| `git rev-list --count HEAD` + `git log` | 2 commit: `ce6117d` chore: import baseline design docs (unchanged) · `c8cbe36` docs: add onboarding report, foundation and art planning docs |
| `git show ce6117d:<path> \| md5sum` เทียบกับ §2.4 ทั้ง 34 ไฟล์ | match=34, mismatch=0 · ใน commit มี 34 ไฟล์ · 1,882 insertions (เท่ากับจำนวนบรรทัดของไฟล์ต้นฉบับ) |
| `git status --porcelain` (หลัง commit 2) | ว่าง = clean |
| `git ls-files --eol` | 44 ไฟล์ทั้งหมดเป็น `i/lf` · `git check-attr` ได้ `eol: lf` |
| **(M0-T03, 2026-10-26)** `cmp` root กับ `docs/` ทั้ง 10 คู่ ก่อนลบ | IDENTICAL ครบ 10/10 |
| `git rm` 10 ไฟล์ที่ root + `git mv PROJECT_ONBOARDING_REPORT.md docs/` | branch `m0/t03-dedupe-docs` commit `da1c627`: 13 files changed, 24 insertions, 778 deletions |
| ตรวจ blob ที่ซ้ำกันใน index (`git ls-files -s`) | ไม่มีเนื้อหาซ้ำแล้ว · เอกสารหลักทั้ง 10 มีแค่ใน `docs/` |
| md5 ของไฟล์ต้นฉบับที่ไม่ได้ตั้งใจแก้ | `docs/` 9 ไฟล์ + prompts + rules + CLAUDE_TEMPLATE ตรง baseline · ที่เปลี่ยนตามที่อนุมัติคือ `README.md` และ `docs/TECHNICAL_ARCHITECTURE.md` (ยังมี 147 บรรทัด) |
| `git log --follow docs/PROJECT_ONBOARDING_REPORT.md` | ประวัติตามมาครบ (`c8cbe36` ถึง `da1c627`) |
| สแกนการอ้างอิง `*.md` ทุกไฟล์ | ไม่มีการอ้างอิงที่เสีย ที่หาไม่เจอเป็นไฟล์ที่ยังไม่ได้สร้างตามแผน (`CLAUDE.md`, rule `shared.md` และ `docs.md`, ADR, `QUEST_AND_INTERACTION_SPEC.md`) |
| **(M0-T04, 2026-10-26)** `wc -l` / `wc -c` ของ `CLAUDE.md` | 66 บรรทัด, 5,724 bytes (เกณฑ์ ≤ 200 บรรทัด) · `git ls-files --eol` = `i/lf` |
| ค้นหา `@` นอก code span (ตัด `` `…` `` ออกก่อนแล้ว grep) | ไม่พบ จึงไม่มี `@import` ที่จะโหลดไฟล์ใหญ่เข้า context |
| ค้นหาบรรทัดคำสั่ง (`pnpm`, `npm`, `npx`, `node`, `git`) และ `package.json` | ไม่มีบรรทัดคำสั่ง · ไม่มี `package.json` (ส่วน Commands จึงเขียนว่ายังไม่มี) |
| ตรวจ path, section และ DEC ที่อ้างใน `CLAUDE.md` | path มีจริงทุกตัว ยกเว้น `database/` ที่วางแผนไว้ใน M4 · GDD §7, ART_BIBLE §3.4, DoD §8 และ TECH L117 ตรงกับที่อ้าง · DEC ที่อ้างทั้ง 10 ตัวมีในทะเบียน |
| เทียบกับ `.claude/rules/*` | ไม่ขัดกัน · rule 10 ปรับให้ตรงกับ `database.md` (migration ที่ทำลายข้อมูลต้องได้รับอนุมัติ + มี backup) |
| `git commit` บน branch `m0/t04-claude-md` | `fd3749a` · ผู้พัฒนาอนุมัติเนื้อหาก่อน commit |
| **(M0-T05, 2026-10-26)** ตรวจโครงสร้าง frontmatter ของ `shared.md` และ `docs.md` | บรรทัดที่ 1 = `---`, บรรทัดที่ 2 = `paths:`, ปิดที่บรรทัดที่ 4 · glob = `"packages/**/*"` และ `"docs/**/*"` (รูปแบบเดียวกับ rule เดิม) |
| md5 ของ `client.md`, `server.md`, `database.md` เทียบกับ §2.4 | ตรงทั้ง 3 ไฟล์ (ไม่ได้แก้) |
| path ของ schema ตาม DEC-008 (`database/schema.prisma`) เทียบกับ glob ของ `database.md` | match ทั้ง `database/**/*` และ `**/*schema.prisma` **จึงไม่ต้องแก้** `database.md` |
| ตรวจการอ้างอิงใน rule ใหม่ | DEC-013, `docs/DECISIONS.md`, `docs/IMPLEMENTATION_STATUS.md` และชื่อเอกสารต้นฉบับทั้ง 10 มีอยู่จริง |
| `wc -l` และ `git ls-files --eol .claude/rules/` | `shared.md` 13 บรรทัด, `docs.md` 12 บรรทัด · ทั้ง 5 ไฟล์เป็น `i/lf` |
| `git commit` บน branch `m0/t05-rules` | `52c44ac` · ผู้พัฒนาอนุมัติเนื้อหาก่อน commit |
| **(M0-T06, 2026-10-26)** spike 2 ชุด (TS 7.0.2 กับ TS 6.0.3) ด้วย pnpm 12.15.0 | branch `spike/m0-t06-versions` commit `c4bf28e` (ไม่ merge) · log จริงอยู่ใน `spike/m0-t06/logs/` และ `RESULTS.md` บน branch นั้น · สรุปอยู่ใน `docs/adr/001-stack-and-versions.md` |
| T1 install + `--frozen-lockfile` จาก clean, T9 `engineStrict` | exit 0 ทั้งสองชุด (หลังกำหนด `allowBuilds`) · engines `>=99` ถูกบล็อกด้วย `ERR_PNPM_UNSUPPORTED_ENGINE` |
| T2 ถึง T7 (Colyseus schema และ room, Vite + React, Babylon, Prisma generate, Zod + Vitest) | ผ่านทั้งสองชุด · Vitest 8/8 · ตัวเลขอยู่ใน ADR-001 |
| T8 lint | TS 7: typescript-eslint error "does not support TS 7.0" · TS 6.0.3: ESLint ทำงานได้และพบ `any` รั่ว 13 จุด · Biome ผ่านทั้งสองชุด |
| ผลข้างเคียงนอกแผน | Prisma CLI ดาวน์โหลด Schema Engine 20 MB และสร้าง `%APPDATA%\prisma` (DEC-059 Open) · ยังไม่ได้ลบ |
| ขนาดบนดิสก์ของ spike (ignored, ไม่อยู่ใน git) | `spike/m0-t06/` = 785 MB (store 633 MB, corepack 55 MB) · ซ่อนจาก `git status` บน `main` ด้วย `.git/info/exclude` (local เท่านั้น) จนกว่าจะลบ |

### 2.2 Build / Typecheck / Lint / Test
> **[F] ไม่มีคำสั่ง build, typecheck, lint หรือ test ใน repository** ผลด้านล่างคือการลองรันจริง ซึ่ง**ล้มเหลวทั้งหมด** ไม่มีผลสำเร็จใดที่จะรายงานได้

| คำสั่ง | Exit code | Output สำคัญ |
|---|---|---|
| `npm run build` | 127 (non-zero, รันจาก Git Bash) | `npm error code ENOENT` · `path E:\KhamangWet\KhamangWet_FullSystem\package.json` |
| `npm run typecheck` | 127 | เหมือนกัน (ไม่มี `package.json`) |
| `npm run lint` | 127 | เหมือนกัน |
| `npm run test` | 127 | เหมือนกัน |
| `pnpm --version` | 127 | `pnpm: command not found` |
| `command -v tsc eslint vitest playwright prisma` | — | ไม่พบทั้ง 5 คำสั่ง |

**สิ่งที่ต้องมีก่อนรันคำสั่งเหล่านี้ได้:** backlog M0-T07 (pnpm), M0-T08 (workspace), M0-T09 (lint), M0-T10 (`pnpm verify`)

### 2.3 Toolchain และฮาร์ดแวร์
| รายการ | ผลตรวจ | ใช้ใน |
|---|---|---|
| git | 2.55.0.windows.5 | DEC-001 |
| node | v24.19.0 (สาย LTS ล่าสุด 24.22.1 ตาม nodejs.org index) | DEC-004 |
| npm | 11.17.0 | — |
| corepack | 0.35.0 | DEC-005 |
| pnpm | ไม่พบใน PATH · เรียก `corepack pnpm@12.15.0` ได้โดยไม่ต้อง `corepack enable` (M0-T06) | DEC-005 |
| docker | ไม่พบ | DEC-009 |
| psql | ไม่พบ | DEC-009 |
| blender | ไม่พบใน PATH | DEC-016 |
| jq | ไม่พบ | DEC-033 (hooks ใช้ Node แทน) |
| gh | ไม่พบ | DEC-039 |
| CPU / GPU / RAM | i5-14600K (14C/20T) / RTX 5070 (driver 32.0.16.1714) / 31.7 GB | DEC-029 |
| Display | 1920×1080 @ 179 Hz | DEC-029 |
| Browsers | Chrome 155.0.8059.85, Edge 156.0.4314.42 | DEC-036 |

### 2.4 Baseline hashes ของไฟล์ต้นฉบับ (md5, 2026-10-26)
ใช้ตรวจว่า commit แรก (DEC-001 ขั้นที่ 4) และการลบไฟล์ซ้ำ (DEC-002) ไม่ได้แก้เนื้อหาโดยไม่ตั้งใจ

```
229c9d23796f6d5f5276ecea7e1b9b62  .claude/rules/client.md
07b91a0fb3b36f7a18121d429ab5ba57  .claude/rules/database.md
609d38f3a46d00b8020e7685c68e09af  .claude/rules/server.md
9d92eb486ca163e41191efa45fabd6f9  AI_WORKFLOW.md              (= docs/AI_WORKFLOW.md)
e796f1829994921472646977e8c67f8a  ART_ANIMATION_PIPELINE.md   (= docs/…)
0c9167de4719cb879b08cadbac164a0d  CLAUDE_TEMPLATE.md
7650f42de979198c7bd5cc2836e0eee6  COMBAT_SPEC.md              (= docs/…)
6e7c03b9fd7d75a0114c462c8ab975b2  DATABASE_AND_ECONOMY.md     (= docs/…)
c7ae2ab03613d44bf58c1d4a6850be5b  GAME_VISION_GDD.md          (= docs/…)
c29f1f392516aa6a5566e32f79d12f08  NETWORK_PROTOCOL.md         (= docs/…)
1bd2509f8f0492f685349e198fa4bcb3  README.md
2452aefee006b7e459eec45af8ec0c47  ROADMAP.md                  (= docs/…)
981ca3de086c5c605eeb8405f4b82721  SECURITY_THREAT_MODEL.md    (= docs/…)
204c705e1f74d598800b295c1182b2fb  TECHNICAL_ARCHITECTURE.md   (= docs/…)
6759b892f3fd0fc7586d8af1fbe39c53  TEST_STRATEGY.md            (= docs/…)
bdda62c2416da9b38d95f66b27d01d80  prompts/00_BOOTSTRAP_AND_AUDIT.md
78079fd7349324b605f6f0a0056d668e  prompts/01_MASTER_SYSTEM_PROMPT.md
bebe553c95f3ec70dbc42dd463882600  prompts/02_IMPLEMENT_FEATURE.md
a05d61eb8ad600e7949f009dcc7f9a67  prompts/03_CODE_REVIEW.md
0828130dc193c27b7a1560846a4abab6  prompts/04_SECURITY_REVIEW.md
518ac495744915ce41eca9fa2d0bc290  prompts/05_ART_TECH_REVIEW.md
ec7a390099d9467f1cada7beedbdad10  prompts/06_TEST_PLAN.md
081748d4b6a3a57299223f700b66614b  prompts/07_RELEASE_CHECK.md
154550e59d992d1ad8e00ebbed34ea35  prompts/08_DOC_SYNC.md
```
(ไฟล์ใน `docs/` อีก 10 ไฟล์มี md5 ตรงกับคู่ที่ root ตามที่ระบุในวงเล็บ)
**หมายเหตุ M0-T03 (2026-10-26):** สำเนาที่ root ถูกลบแล้วแต่ดูได้ใน commit `ce6117d` · `README.md` และ `docs/TECHNICAL_ARCHITECTURE.md` ถูกแก้ตามที่อนุมัติ จึงมี md5 ต่างจากรายการข้างบน ซึ่งเป็นค่าของ baseline

---

## 3. สถานะรายส่วน

### 3.1 Project infrastructure
| ส่วน | สถานะ | หลักฐาน / หมายเหตุ | Backlog |
|---|---|---|---|
| เอกสาร design, spec และ roadmap | **Implemented** (เอกสาร) | 10 ไฟล์ใน `docs/` + README + CLAUDE_TEMPLATE · ไม่มีไฟล์ซ้ำแล้ว (M0-T03) | M0-T03 ✔ |
| Prompt library `prompts/00–08` | **Implemented** (เอกสาร) | 9 ไฟล์ | — |
| `.claude/rules/` | **Implemented** | 5 ไฟล์: `client.md` (`apps/web/**`), `server.md` (`apps/game-server/**`), `database.md` (`database/**`, `**/*schema.prisma`), `shared.md` (`packages/**`) และ `docs.md` (`docs/**`) · รูปแบบ `paths:` ถูกต้องตามเอกสาร Claude Code · rule ของ `apps/`, `packages/` และ `database/` จะเริ่มทำงานเมื่อมี path นั้นจริง (§2.1 M0-T05) | M0-T05 ✔ |
| Foundation docs (`DECISIONS`, `IMPLEMENTATION_STATUS`, `DEFINITION_OF_DONE`, `IMPLEMENTATION_BACKLOG`) | **Partial** | สร้างแล้ว 2026-10-26 แต่ยังเป็น Draft ที่รอผู้พัฒนาอนุมัติ | M0-T01 |
| Art docs (`ART_BIBLE`, `ASSET_PIPELINE`, `VISUAL_PROTOTYPE_PLAN`) | **Partial** | Draft (ART_BIBLE v0.2, ASSET_PIPELINE v0.4, VISUAL_PROTOTYPE_PLAN v0.4, 2026-10-26) · มาตรฐานตัวเลขรอ VP0 · Art Direction (DEC-040) และ paper-doll (DEC-045) เป็น Accepted · ไม่มีโค้ดหรือ asset ที่ทำตามเอกสารนี้ | M1 (VP0) |
| Art assets (ตัวละคร, ฉาก, VFX, UI) | **Missing** | ไม่พบไฟล์ asset ใด (§2.1 รอบ 2) · ภาพอ้างอิง 2 ภาพอยู่ในโฟลเดอร์ชั่วคราวนอก repo และยังไม่ได้คัดลอกเข้า repo | M1-T03, T13–T16 |
| Git repository, `.gitignore`, `.gitattributes` | **Implemented** | `ce6117d` (baseline 34 ไฟล์ md5 ตรงครบ) + `c8cbe36` (docs + `.gitattributes` + `.gitignore`) · clean · LF ทุกไฟล์ (§2.1, M0-T02) · ยังไม่มี remote | M0-T02 ✔ |
| `CLAUDE.md` | **Implemented** | 66 บรรทัด สร้างจาก template และผู้พัฒนาอนุมัติเนื้อหาแล้ว · ไม่มี `@import` · ยังไม่มีส่วน Commands เพราะยังไม่มีคำสั่ง (§2.1 M0-T04) | M0-T04 ✔ |
| `.claude/settings.json`, skills, agents, hooks | **Missing** | §2.1 | M0-T14 |
| `docs/adr/` | **Partial** | มี ADR-001 (stack และเวอร์ชัน) จากผล spike M0-T06 · ADR-003 ถึง 007 ยังไม่ได้เขียน (M0-T12) · ADR-002 เลื่อนไปหลัง VP0-c | M0-T06 ✔, M0-T12 |
| pnpm workspace + lockfile | **Missing** | §2.2 | M0-T08 |
| Lint / format / import boundary | **Missing** | §2.2 | M0-T09 |
| `pnpm verify` (typecheck + lint + test + build) | **Missing** | §2.2 | M0-T10 |
| CI pipeline | **Missing** | ไม่พบ `.github` หรือ `.gitlab-ci.yml` | M0-T11 |
| Local PostgreSQL | **Missing** | ไม่พบ docker หรือ psql | M0-T13 |

### 3.2 Game systems (เทียบกับ GDD §6 MVP Scope และ TECH §4)
| ระบบ | สถานะ | หมายเหตุ | Milestone |
|---|---|---|---|
| `apps/web` — Babylon scene, iso camera | **Missing** | — | M1 |
| 2D character renderer + animation | **Missing** | runtime ยังไม่ตัดสิน (DEC-014) | M1 |
| Walkable / collision data ที่ใช้ร่วมกัน | **Missing** | DEC-016 | M1 |
| Input + movement (local) | **Missing** | — | M1 |
| React UI overlay | **Missing** | — | M1–M2 |
| `packages/game-rules` — combat rules | **Missing** | — | M2 |
| `packages/game-data` — skills, enemies, items | **Missing** | — | M2 |
| `packages/shared-contracts` — messages และ schemas | **Missing** | — | M2 |
| Enemy AI | **Missing** | — | M2 |
| `apps/game-server` — Colyseus rooms | **Missing** | — | M3 |
| Authoritative movement + validation | **Missing** | — | M3 |
| Rate / payload limits | **Missing** | — | M3 |
| Reconnect | **Missing** | — | M3 |
| Auth / session | **Missing** | DEC-020 | M3 (dev), M4 |
| Database schema + migrations | **Missing** | — | M4 |
| Character save/load + lease | **Missing** | DEC-019 | M4 |
| Inventory / loot grant | **Missing** | — | M4 |
| Equipment, tattoo/amulet loadout | **Missing** | — | M5 |
| Quest (tutorial, investigation, hunt) | **Missing** | ยังไม่มี spec (C-09) | M5–M6 |
| NPC shop, crafting, currency ledger | **Missing** | ยังไม่ได้อยู่ใน milestone ใด (C-11) | M5 |
| Observability (logs, metrics) | **Missing** | — | M3 |
| Admin / debug commands | **Missing** | — | M3 (debug), M8 (admin) |

### 3.3 Unknown — ต้องถามผู้พัฒนา
| รายการ | ทำไมตรวจไม่ได้ |
|---|---|
| มี repository เกมหรือโค้ดอยู่ที่อื่นหรือไม่ | README L8 พูดถึงการแตก ZIP ลง repo เกม แต่ไม่มี repo ใน workspace |
| มี asset (art, Blender source, audio) อยู่ที่อื่นหรือไม่ | ไม่พบใน workspace |
| ติดตั้ง Blender ไว้หรือไม่ (นอก PATH) | ตรวจแค่ PATH |
| มี remote (GitHub หรือ GitLab) หรือบัญชี CI หรือไม่ | ไม่พบ `gh` และไม่มี git |

---

## 4. Change Log ของไฟล์นี้
| วันที่ | การเปลี่ยนแปลง | หลักฐาน |
|---|---|---|
| 2026-10-26 | สร้างครั้งแรกจากการตรวจ read-only | §2 |
| 2026-10-26 | ตรวจรอบ 2 หลัง Art Direction Lock และเพิ่มแถว art docs (Partial) กับ art assets (Missing) | §2.1 รอบ 2 |
| 2026-10-26 | DEC-045 (paper-doll) ทำให้ art docs เป็น v0.2 · สถานะ implementation ไม่เปลี่ยน (ยังไม่มีโค้ดหรือ asset) | — |
| 2026-10-26 | เพิ่ม A3-B ใน VP0-c และบันทึกผลตรวจ license ของ Spine, PixelLab และ Blender (`DECISIONS.md` ภาคผนวก C) · สถานะ implementation ไม่เปลี่ยน | — |
| 2026-10-26 | DEC-058: VP0-c เทียบ A3-B กับ A1-L และพัก A3-S ไว้ · สถานะ implementation ไม่เปลี่ยน | — |
| 2026-10-26 | M0-T01 Done: ผู้พัฒนามอบอำนาจ และ DEC-001 ถึง 008, 011, 012, 013, 033, 034, 039 เป็น Accepted (delegated) · สถานะ implementation ไม่เปลี่ยน (ยังไม่มี git หรือโค้ด) | `DECISIONS.md §4.0` |
| 2026-10-26 | M0-T02 Done: git repository = Implemented (`ce6117d`, `c8cbe36`) แล้วบันทึกหลักฐานใน commit ถัดไป | §2.1 (M0-T02) |
| 2026-10-26 | M0-T03 Done: `docs/` เป็นต้นฉบับเดียวและลบไฟล์ซ้ำแล้ว แล้ว squash merge เข้า `main` | §2.1 (M0-T03) |
| 2026-10-26 | M0-T04 Done: `CLAUDE.md` = Implemented (66 บรรทัด) แล้ว squash merge เข้า `main` | §2.1 (M0-T04) |
| 2026-10-26 | M0-T05 Done: `.claude/rules/` = Implemented (5 ไฟล์) แล้ว squash merge เข้า `main` | §2.1 (M0-T05) |
| 2026-10-26 | M0-T06 Done: spike ผ่าน · ADR-001 เขียนแล้ว · `docs/adr/` = Partial · DEC-059 เปิดใหม่ | §2.1 (M0-T06) |
