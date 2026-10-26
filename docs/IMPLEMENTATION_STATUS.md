# IMPLEMENTATION STATUS — Khamang Wet

- **Snapshot:** 2026-10-26 · **ตรวจโดย:** Claude Code (read-only checks)
- **Repository state:** เป็น git repository ตั้งแต่ 2026-10-26 (M0-T02) · branch `main` · baseline commit `2ab369f` · ~~ยังไม่มี remote (DEC-039 รอผู้พัฒนาสร้าง repo)~~ **DEC-061 (2026-10-26):** ผู้พัฒนาสร้าง GitHub repo `mixagent42/KhamangWet` แบบ public แล้ว ~~แต่ยังไม่ได้เพิ่ม remote และยังไม่ได้ push~~ **M0-T11 (2026-10-26):** remote `origin` push `main` และ tag `spike/m0-t06` แล้ว · CI tier 1 เขียว · `main` มี ruleset `main-protection` · ประวัติ git ถูกเขียนใหม่ให้ใช้อีเมล noreply (hash ทุกตัวเปลี่ยน ดูตารางเทียบใน §2.5)
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
| Implemented | 10 (เอกสาร 2 รายการ + git repository + `CLAUDE.md` + `.claude/rules/` + Claude Code config + pnpm workspace + lint/format + `pnpm verify` + CI tier 1 · ยังไม่มีโค้ดเกม) |
| Partial | 4 |
| Missing | 23 (infrastructure 1 + game systems 21 + art assets 1) |
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
| **(M0-T02, 2026-10-26)** `git init -b main` + `git config --local user.name/user.email` | สร้าง repo ที่ `E:/KhamangWet/KhamangWet_FullSystem/.git/` · `HEAD` = `refs/heads/main` · identity แบบ local = `mixza <[redacted]>` · **หมายเหตุ DEC-061 (2026-10-26):** อีเมลส่วนตัวที่ตั้งไว้ตอนนั้นถูกลบออกจากประวัติ git ทั้งหมดด้วยการเขียนประวัติใหม่ (§2.1 DEC-061, §2.5) · ตั้งแต่ M0-T10 ใช้ GitHub noreply `328789487+mixagent42@users.noreply.github.com` |
| `git rev-list --count HEAD` + `git log` | 2 commit: `2ab369f` chore: import baseline design docs (unchanged) · `94b822b` docs: add onboarding report, foundation and art planning docs |
| `git show 2ab369f:<path> \| md5sum` เทียบกับ §2.4 ทั้ง 34 ไฟล์ | match=34, mismatch=0 · ใน commit มี 34 ไฟล์ · 1,882 insertions (เท่ากับจำนวนบรรทัดของไฟล์ต้นฉบับ) |
| `git status --porcelain` (หลัง commit 2) | ว่าง = clean |
| `git ls-files --eol` | 44 ไฟล์ทั้งหมดเป็น `i/lf` · `git check-attr` ได้ `eol: lf` |
| **(M0-T03, 2026-10-26)** `cmp` root กับ `docs/` ทั้ง 10 คู่ ก่อนลบ | IDENTICAL ครบ 10/10 |
| `git rm` 10 ไฟล์ที่ root + `git mv PROJECT_ONBOARDING_REPORT.md docs/` | branch `m0/t03-dedupe-docs` commit `da1c627` (→ squash `06f5219` บน `main`): 13 files changed, 24 insertions, 778 deletions |
| ตรวจ blob ที่ซ้ำกันใน index (`git ls-files -s`) | ไม่มีเนื้อหาซ้ำแล้ว · เอกสารหลักทั้ง 10 มีแค่ใน `docs/` |
| md5 ของไฟล์ต้นฉบับที่ไม่ได้ตั้งใจแก้ | `docs/` 9 ไฟล์ + prompts + rules + CLAUDE_TEMPLATE ตรง baseline · ที่เปลี่ยนตามที่อนุมัติคือ `README.md` และ `docs/TECHNICAL_ARCHITECTURE.md` (ยังมี 147 บรรทัด) |
| `git log --follow docs/PROJECT_ONBOARDING_REPORT.md` | ประวัติตามมาครบ (`94b822b` ถึง `da1c627` บน branch · บน `main` คือ `94b822b` ถึง `06f5219`) |
| สแกนการอ้างอิง `*.md` ทุกไฟล์ | ไม่มีการอ้างอิงที่เสีย ที่หาไม่เจอเป็นไฟล์ที่ยังไม่ได้สร้างตามแผน (`CLAUDE.md`, rule `shared.md` และ `docs.md`, ADR, `QUEST_AND_INTERACTION_SPEC.md`) |
| **(M0-T04, 2026-10-26)** `wc -l` / `wc -c` ของ `CLAUDE.md` | 66 บรรทัด, 5,724 bytes (เกณฑ์ ≤ 200 บรรทัด) · `git ls-files --eol` = `i/lf` |
| ค้นหา `@` นอก code span (ตัด `` `…` `` ออกก่อนแล้ว grep) | ไม่พบ จึงไม่มี `@import` ที่จะโหลดไฟล์ใหญ่เข้า context |
| ค้นหาบรรทัดคำสั่ง (`pnpm`, `npm`, `npx`, `node`, `git`) และ `package.json` | ไม่มีบรรทัดคำสั่ง · ไม่มี `package.json` (ส่วน Commands จึงเขียนว่ายังไม่มี) |
| ตรวจ path, section และ DEC ที่อ้างใน `CLAUDE.md` | path มีจริงทุกตัว ยกเว้น `database/` ที่วางแผนไว้ใน M4 · GDD §7, ART_BIBLE §3.4, DoD §8 และ TECH L117 ตรงกับที่อ้าง · DEC ที่อ้างทั้ง 10 ตัวมีในทะเบียน |
| เทียบกับ `.claude/rules/*` | ไม่ขัดกัน · rule 10 ปรับให้ตรงกับ `database.md` (migration ที่ทำลายข้อมูลต้องได้รับอนุมัติ + มี backup) |
| `git commit` บน branch `m0/t04-claude-md` | `fd3749a` (→ squash `ead01b9` บน `main`) · ผู้พัฒนาอนุมัติเนื้อหาก่อน commit |
| **(M0-T05, 2026-10-26)** ตรวจโครงสร้าง frontmatter ของ `shared.md` และ `docs.md` | บรรทัดที่ 1 = `---`, บรรทัดที่ 2 = `paths:`, ปิดที่บรรทัดที่ 4 · glob = `"packages/**/*"` และ `"docs/**/*"` (รูปแบบเดียวกับ rule เดิม) |
| md5 ของ `client.md`, `server.md`, `database.md` เทียบกับ §2.4 | ตรงทั้ง 3 ไฟล์ (ไม่ได้แก้) |
| path ของ schema ตาม DEC-008 (`database/schema.prisma`) เทียบกับ glob ของ `database.md` | match ทั้ง `database/**/*` และ `**/*schema.prisma` **จึงไม่ต้องแก้** `database.md` |
| ตรวจการอ้างอิงใน rule ใหม่ | DEC-013, `docs/DECISIONS.md`, `docs/IMPLEMENTATION_STATUS.md` และชื่อเอกสารต้นฉบับทั้ง 10 มีอยู่จริง |
| `wc -l` และ `git ls-files --eol .claude/rules/` | `shared.md` 13 บรรทัด, `docs.md` 12 บรรทัด · ทั้ง 5 ไฟล์เป็น `i/lf` |
| `git commit` บน branch `m0/t05-rules` | `52c44ac` (→ squash `71da7db` บน `main`) · ผู้พัฒนาอนุมัติเนื้อหาก่อน commit |
| **(M0-T06, 2026-10-26)** spike 2 ชุด (TS 7.0.2 กับ TS 6.0.3) ด้วย pnpm 12.15.0 | tag `spike/m0-t06` → `ce3eed4` (spike `15a0b05` + log ดิบ 24 ไฟล์ · ไม่ merge) · log จริงอยู่ใน `spike/m0-t06/logs/` และ `RESULTS.md` ภายใน tag · สรุปอยู่ใน `docs/adr/001-stack-and-versions.md` |
| T1 install + `--frozen-lockfile` จาก clean, T9 `engineStrict` | exit 0 ทั้งสองชุด (หลังกำหนด `allowBuilds`) · engines `>=99` ถูกบล็อกด้วย `ERR_PNPM_UNSUPPORTED_ENGINE` |
| T2 ถึง T7 (Colyseus schema และ room, Vite + React, Babylon, Prisma generate, Zod + Vitest) | ผ่านทั้งสองชุด · Vitest 8/8 · ตัวเลขอยู่ใน ADR-001 |
| T8 lint | TS 7: typescript-eslint error "does not support TS 7.0" · TS 6.0.3: ESLint ทำงานได้และพบ `any` รั่ว 13 จุด · Biome ผ่านทั้งสองชุด |
| ผลข้างเคียงนอกแผน | Prisma CLI ดาวน์โหลด Schema Engine 20 MB และสร้าง `%APPDATA%\prisma` (DEC-059 Open) · ยังไม่ได้ลบ |
| ขนาดบนดิสก์ของ spike (ignored, ไม่อยู่ใน git) | `spike/m0-t06/` เคยใช้ 785 MB (store 633 MB, corepack 55 MB) และเคยซ่อนจาก `git status` บน `main` ด้วย `.git/info/exclude` · **ลบแล้ว 2026-10-26** (ดูแถว cleanup ด้านล่าง) |
| **(M0-T06 cleanup, 2026-10-26)** ตรวจก่อนลบ: `git ls-tree` ของ `15a0b05` เทียบกับไฟล์บนดิสก์ | พบว่า log 24 ไฟล์**ไม่อยู่ใน `15a0b05`** เพราะ root `.gitignore` มี `*.log` (ADR-001 อ้างผิด) |
| `git add -f` log 24 ไฟล์ → commit `ce3eed4` · `git tag -a spike/m0-t06 ce3eed4` | tag มี 97 ไฟล์ (log 24 ไฟล์ + ไฟล์ของ `15a0b05` ครบ) · เนื้อหา log ใน tag ตรงกับบนดิสก์ 24/24 (เทียบโดยไม่สน CR; มี 1 ไฟล์ที่ถูก normalize จาก CRLF เป็น LF) |
| `git branch -D spike/m0-t06-versions` | ลบแล้ว (tip `ce3eed4` = commit ของ tag) |
| `rm -rf spike/m0-t06` + `rmdir spike` | ลบแล้ว 842 MB · ก่อนลบตรวจว่า `main` ไม่ track ไฟล์ใดใน `spike/` (0 ไฟล์) |
| แก้ `.git/info/exclude` | เอาบรรทัด `/spike/` และ comment ออก · ไฟล์กลับไปตรงกับ default template ของ git ทุกบรรทัด |
| ไม่ได้แตะ | cache ของ Prisma ที่ `%APPDATA%\prisma` (DEC-059 ยัง Open) → **ลบแล้วในแถวถัดไป** |
| **(DEC-059 (1), 2026-10-26)** ตรวจ `%APPDATA%\prisma` ก่อนลบ (`find -printf`, `tasklist`) | 3 ไฟล์และ 4 โฟลเดอร์, 20,791,936 bytes · สร้างระหว่าง 01:29:12 ถึง 01:29:15 ทั้งหมด · ไม่มี process `schema-engine` ทำงานอยู่ |
| `rm -rf "%APPDATA%\prisma"` | exit 0 · ตรวจซ้ำแล้วว่าไม่มีโฟลเดอร์ |
| ตรวจโฟลเดอร์ระดับผู้ใช้อื่นที่ชื่อเกี่ยวกับเครื่องมือของ spike | พบที่มาจาก spike 4 รายการ: `%LOCALAPPDATA%\pnpm-cache` (335,190,585 bytes), `pnpm-store-operation-locks`, `biomejs`, `%APPDATA%\prisma-nodejs` · พบ `%LOCALAPPDATA%\vitest` ซึ่งสร้างเมื่อ 2026-09-28 (มีอยู่ก่อน ไม่แตะ) · **ยังไม่ได้ลบ** และรอ DEC-060 → ดำเนินการแล้วในแถวถัดไป |
| **(DEC-060 = B, 2026-10-26)** ตรวจซ้ำก่อนลบ (`Get-ChildItem -Recurse`, `Get-Process`) | `pnpm-store-operation-locks` (2 ไฟล์ .lock, 0 bytes), `biomejs` (โฟลเดอร์ว่าง `biome/cache`), `prisma-nodejs` (`Config/commands.json` 52 bytes) · ทุก entry สร้างระหว่าง 01:24 ถึง 01:31 · ไม่มี process ของ pnpm, Biome หรือ Prisma ทำงานอยู่ |
| `Remove-Item -Recurse -Force` 3 รายการ | `Test-Path` = False ทั้ง 3 รายการ · `%APPDATA%\prisma` ยังไม่มี (ลบแล้วจาก DEC-059 (1)) |
| snapshot ของโฟลเดอร์ที่เก็บไว้ ก่อนและหลังลบ | `pnpm-cache`: 424 ไฟล์ / 335,190,585 bytes / เขียนล่าสุด 01:26:07 (ก่อน = หลัง) · `vitest`: 1 ไฟล์ / 37 bytes / 2026-09-28 (ก่อน = หลัง) |
| **(M0-T14 part 1, 2026-10-26)** pipe-test `.claude/hooks/guard-files.mjs` ด้วย payload 14 แบบที่สร้างด้วย `JSON.stringify` (script อยู่ใน scratchpad ของเซสชัน ไม่อยู่ใน repo) | ผ่าน 14/14 · exit 2: `.env`, `.env.local`, `.env.production`, `pnpm-lock.yaml` (path แบบ Windows และ posix ทั้งที่ root และโฟลเดอร์ย่อย) · exit 0: `.env.example`, `.envrc`, `env.ts`, `pnpm-workspace.yaml`, `docs\DECISIONS.md`, ไม่มี `file_path`, JSON เสีย, stdin ว่าง |
| pipe-test รอบแรก (ส่ง JSON ผ่าน shell) | FAIL 2 กรณี: path แบบ Windows ของ `.env` และ `pnpm-lock.yaml` ได้ exit 0 · สาเหตุคือ shell ยุบ `\\` เหลือ `\` ทำให้ JSON ไม่ถูกต้อง (`Bad escaped character`) hook จึง fail-open ตามที่ออกแบบ · ไม่ใช่ bug ของ hook จึงทดสอบใหม่ด้วยแถวบน |
| `node -e` อ่าน `.claude/settings.json` ด้วย `JSON.parse` แล้วตรวจโครงสร้าง | JSON ถูกต้อง · `hooks.PreToolUse[0].matcher` = `Edit\|Write` · deny 11 rule, ask 9 rule, ไม่มี allow · `Read(!.env.example)` อยู่หลัง `Read(.env.*)` |
| ตรวจ path ที่ skill และ agent อ้างถึง, `git check-ignore`, นับ CR bytes, `wc -l CLAUDE.md` | path มีจริง 8/8 · `.claude/settings.local.json` ถูก ignore (`.gitignore:33`) ส่วนไฟล์ใหม่ 4 ไฟล์ไม่ถูก ignore · CR = 0 ทุกไฟล์ · `CLAUDE.md` 68 บรรทัด |
| ทดสอบจริง: Write `.env` ลงใน scratchpad ของเซสชัน | **ไม่ถูกบล็อก** (ลบไฟล์ทดสอบแล้ว) เพราะเซสชันนี้เริ่มก่อนจะมี `.claude/settings.json` · **ยังไม่ผ่าน AC ข้อ hook** ต้องทดสอบซ้ำในเซสชันใหม่ที่เปิดที่ `E:\KhamangWet\KhamangWet_FullSystem` |
| อ่านเอกสาร `code.claude.com/docs/en/permissions` (ตรวจ 2026-10-26) | ชื่อไฟล์เปล่าใช้ gitignore semantics และ match ทุกระดับ (`Read(.env)` = `Read(**/.env)`) ส่วน `./.env` match เฉพาะโฟลเดอร์ปัจจุบัน · `!` carve-out มีผลกับ rule ที่อยู่ก่อนหน้าใน list เดียวกัน · ask rule ยังถามแม้อยู่ใน auto mode |
| `git commit` บน branch `m0/t14-claude-config` | `2235350` (→ squash `e934840` บน `main`) (5 files, +111 −1) · ผู้พัฒนาอนุมัติเนื้อหาและจุดที่ต่างจาก DECISIONS ภาคผนวก A.5 ทั้ง 6 ข้อก่อน commit |
| **(M0-T07, 2026-10-26)** `corepack enable pnpm --install-directory "%APPDATA%\npm"` | exit 0 · เพิ่ม shim 6 ไฟล์ใน `%APPDATA%\npm` (`pnpm`, `pnpm.CMD`, `pnpm.ps1`, `pnpx`, `pnpx.CMD`, `pnpx.ps1`) ซึ่งชี้ไปที่ corepack ใน `C:\Program Files\nodejs` · ไฟล์ `claude*` และ `node_modules` เดิมไม่ถูกแตะ |
| `pnpm --version` ครั้งแรก (Git Bash) | corepack ดาวน์โหลด `registry.npmjs.org/pnpm/-/pnpm-12.15.0.tgz` และไฟล์รันของ win32-x64 · ได้ `12.15.0`, exit 0, 3.3 วินาที |
| `pnpm --version` ใน PowerShell และ cmd.exe | `12.15.0` ทั้งสองตัว (PowerShell ใช้ `pnpm.ps1` ภายใต้ execution policy `Bypass` ของเซสชัน Claude) |
| ขนาด `%LOCALAPPDATA%\node\corepack` หลังดาวน์โหลด | 451 ไฟล์, 56,684,425 bytes (`v1\pnpm\12.15.0` + `lastKnownGood.json` 160 bytes) · ตรงกับ registry: `pnpm` 4.2 MB + `@pnpm/exe.win32-x64` 52.5 MB · ไม่มี store, `node_modules` หรือโฟลเดอร์ pnpm อื่นถูกสร้าง · `pnpm-cache` ไม่เปลี่ยน (424 ไฟล์) |
| ผลนอกแผน: `pnpm --version` สร้าง `pnpm-lock.yaml` | 158 บรรทัด มีเฉพาะส่วน `packageManagerDependencies` (integrity 15 ตัว) · `cmp` 157 บรรทัดแรกกับ lockfile ของ spike set-b ใน tag `spike/m0-t06` แล้ว **IDENTICAL** · integrity ของ `pnpm@12.15.0` ตรงกับ registry และกับ sha512 ใน `packageManager` · ผู้พัฒนาอนุมัติให้ commit |
| `git commit` บน branch `m0/t07-pnpm` | `d72e0cf` (→ squash `e7e4932` บน `main`) (4 files) · ผู้พัฒนาอนุมัติ diff ก่อน commit |
| **(M0-T08, 2026-10-26)** `pnpm install` | exit 0 · 7 workspace projects · `Packages: +18` (resolved 18, downloaded 18) · store `E:\.pnpm-store\v11` แบบ hardlink · 616 ms |
| เทียบ lockfile กับ spike (`closure.mjs` ใน scratchpad ของเซสชัน + `cmp`) | closure ของ win32-x64 ตรงกับ lockfile ของ spike set-b **ทุกตัว** (18 package; ไม่มี `jiti` ตามที่คาด) · ส่วน pnpm (157 บรรทัดแรก) ไม่เปลี่ยนจาก T07 · lockfile +521 −0 |
| `pnpm -r build` และ `pnpm build` (script ที่ root) | exit 0 ทั้งสองคำสั่ง · ~~6 package: `tsc` ×5 และ `vite build` ของ web~~ **แก้ 2026-10-26 (M0-T09): 5 package ที่มี build script** (`packages/config` ไม่มี build) · `tsc` 5 ครั้ง (รวม typecheck ของ web) และ `vite build` 1 ครั้ง (29 ms, `dist/assets/index-*.js` 0.67 kB) · script ที่เรียก `pnpm` หา pnpm เจอผ่าน shim |
| AC (1) สำเนาใหม่: tree ชั่วคราว `360ac0f` (index แยก + `git add -A`) → `git archive` ไปที่ `E:\KhamangWet\kw-clone-test` | ไม่มี `node_modules` และ `dist` · `pnpm install --frozen-lockfile` exit 0 (reused 18, downloaded 0, พิมพ์ "Lockfile passes supply-chain policies") · `pnpm -r build` exit 0 · lockfile หลัง install `cmp` = IDENTICAL |
| ทดสอบกลับ: เพิ่ม `picocolors` ใน `apps/web/package.json` ของสำเนาโดยไม่อัปเดต lockfile | `pnpm install --frozen-lockfile` **exit 1** พร้อมคำแนะนำให้สร้าง lockfile ใหม่ ซึ่งเป็นผลที่ต้องการ |
| ลบสำเนาทดสอบ | `rm -rf` ลบเนื้อหาได้ แต่ตัวโฟลเดอร์ถูก lock เพราะ `cd` ของ Claude ย้าย working directory ของเซสชันเข้าไป · ย้ายกลับมาที่ repo แล้ว `rmdir` สำเร็จ · `E:\KhamangWet\` เหลือแค่ `KhamangWet_FullSystem` |
| AC (3) ขอบเขต (`ls`, `pnpm -r ls --depth -1`, รวม dependency ตรง) | โฟลเดอร์: `apps/{web,game-server}`, `packages/{config,shared-contracts,game-rules,game-data}` เท่านั้น · dependency ตรง: `typescript`, `@types/node`, `vite` (ผ่าน `catalog:`) และ `@kw/config` (`workspace:*`) |
| ไฟล์ระดับผู้ใช้หลัง install | `E:\.pnpm-store` 512 ไฟล์ 62,879,008 bytes · `pnpm-cache` +1,444 bytes · `pnpm-store-operation-locks` 2 ไฟล์ 0 bytes · นอกแผน: `pnpm-state\pnpm-state.json` 51 bytes (`lastUpdateCheck`) และ `pnpm-dir-locks\` (โฟลเดอร์ว่าง) |
| `git diff --stat 360ac0f HEAD` | ต่างกันแค่ `CLAUDE.md` (แก้หลังทดสอบ) · ไฟล์อื่นตรงกับ tree ที่ทดสอบทุกไฟล์ |
| `git commit` บน branch `m0/t08-monorepo-skeleton` | `00c3378` (→ squash `ad2a544` บน `main`) (24 files, +738 −1) · ผู้พัฒนาอนุมัติ diff ก่อน commit |
| **(M0-T09, 2026-10-26)** `pnpm install` (เพิ่ม `eslint` 10.13.0, `typescript-eslint` 8.72.0, `prettier` 3.9.10 ใน catalog) | exit 0 · `Packages: +92` ตามที่ประเมินไว้ · ไม่มี `jiti` และ `@eslint/js` · virtual store รวม 110 package · lockfile +823 −1 |
| `eslint .` บนโค้ดปัจจุบัน | exit 0 · lint 7 ไฟล์ · `--print-config` ของไฟล์ใน game-rules มีกฎ 76 ข้อ รวม type-aware (`no-floating-promises`, `no-unsafe-call`) และกฎ boundary 3 ข้อ · `projectService: true` |
| AC: `node --test tests/lint/*.test.mjs` | **9/9 ผ่าน** · ต้อง fail 7 กรณี: (a) game-server import Babylon (b) web import Prisma (c) game-rules import `node:fs` และใช้ `document` + `Math.random`, `Date.now`, `performance.now` · ต้องผ่าน 2 กรณี: web import Babylon และ game-rules รับ RNG เป็น parameter |
| mutation test: ลบ `babylon` ออกจากกฎของ game-server ชั่วคราว | test จับได้: pass 8, fail 1, exit 1 · คืน `eslint.config.js` แล้ว `cmp` ตรงกับต้นฉบับ |
| พิสูจน์ตาม DEC-010: ใส่ `export { Scene } from "@babylonjs/core/scene"` ใน `apps/game-server/src/main.ts` | `pnpm lint` **exit 1** (`no-restricted-imports`: "Babylon.js is rendering code; it belongs in apps/web only") · คืนไฟล์แล้ว `git diff` ว่าง |
| `pnpm format:check` ก่อนจัดรูปแบบ | exit 1 · 3 ไฟล์: `eslint.config.js`, `tests/lint/import-boundaries.test.mjs` และ `.claude/hooks/guard-files.mjs` · ในขอบเขตมี 27 ไฟล์ ไม่มี `.md` และ lockfile |
| `pnpm format` แล้วตรวจซ้ำ | ทั้ง 3 ไฟล์เปลี่ยนแค่การตัดบรรทัด · `format:check` exit 0 · pipe-test ของ hook ยังผ่าน 14/14 · `pnpm lint` exit 0 (9/9) · `pnpm build` exit 0 · `pnpm install --frozen-lockfile` = up to date |
| `git commit` บน branch `m0/t09-lint-format-boundaries` | `108adea` (→ squash `4829ccf` บน `main`) (9 files, +1083 −4) · ผู้พัฒนาอนุมัติ diff ก่อน commit |
| **(M0-T10, 2026-10-26)** `pnpm install` (เพิ่ม `vitest` 5.0.5 ใน catalog และเป็น devDep ของ `game-rules`) | exit 0 · `Packages: +19` ตามที่ประเมินไว้ · ไม่มี `jiti` · Vitest ใช้ `vite@8.3.5(@types/node@24.19.2)` ตัวเดิม · virtual store รวม 129 package |
| `vitest run` ใน `packages/game-rules` | Test Files 1 passed · **Tests 5 passed (5)**: ค่าในช่วง, ต่ำกว่า, สูงกว่า, เท่าขอบ และ `min > max` โยน `RangeError` |
| ลบ `packages/game-rules/dist` แล้ว build ด้วย `tsconfig.build.json` | exit 0 · `dist/` มีแค่ `clamp.*` และ `index.*` (ไม่มีไฟล์ test) |
| **AC:** `pnpm verify` | **exit 0** (3.9 วินาที) · log ยืนยันว่ารันครบ 5 ขั้น: `pnpm -r typecheck` (5 package) → `eslint .` + `node --test` (9/9) → `pnpm -r test` (5/5) → `pnpm -r build` (5 package) → `prettier --check .` |
| **AC:** แก้ `toBe(5)` เป็น `toBe(6)` ใน `clamp.test.ts` ชั่วคราว | `pnpm verify` **exit 1** ("AssertionError: expected 5 to be 6", `Tests 1 failed \| 4 passed`) · ขั้น build และ format:check **ไม่ได้รัน** · คืนไฟล์แล้ว `cmp` ตรงกับต้นฉบับ · `pnpm verify` exit 0 อีกครั้ง |
| `pnpm install --frozen-lockfile` | "Lockfile is up to date" |
| **(A2, ผู้พัฒนาอนุมัติ 2026-10-26)** `git config --local user.email` | เปลี่ยนจากอีเมลส่วนตัวเป็น GitHub noreply `328789487+mixagent42@users.noreply.github.com` ก่อน commit ของ T10 · ไม่มี global `user.email` · ~~การเขียนประวัติเก่าใหม่รอแผนที่ผู้พัฒนาจะอนุมัติ~~ เขียนใหม่แล้ว (แถว DEC-061 ด้านล่าง) |
| `git commit` บน branch `m0/t10-verify` | `4d9afb4` (→ squash `590fe6b` บน `main`) (14 files, +258 −12) · author/committer = noreply · ผู้พัฒนาอนุมัติ diff ก่อน commit |
| **(DEC-061, 2026-10-26)** GitHub API `GET /repos/mixagent42/KhamangWet` (ไม่ใช้ credentials) + `git ls-remote` (ปิด credential prompt) | HTTP 200 · `"private": false, "visibility": "public"` · ขนาด 0 KB · `ls-remote` ไม่มี ref = repo ว่าง · ขัดกับ DEC-039 (private) จึงหยุดและถามผู้พัฒนา → ผู้พัฒนาเลือกเก็บเป็น public |
| สแกนสิ่งที่จะเปิดเผยถ้า push (สคริปต์ node อ่าน `main` และ tag) | อีเมลส่วนตัวอยู่ใน author/committer ของ 15 commit, `tagger` ของ tag object และ STATUS 1 บรรทัด (12 blob ใน 14 commit) · ไม่มีใน commit message · path ในเครื่องและชื่อผู้ใช้ `mixza` อยู่ในเอกสารและ log ของ spike (ผู้พัฒนาเลือกเก็บไว้) · **ไม่พบ secret** และไม่มี `.env` ที่ถูก track |
| Rewrite Phase 0: snapshot (`snapshot.mjs`) | 14 commit บน `main` + 2 commit เฉพาะ tag + tag object · `pnpm verify` exit 0 ก่อนเริ่ม |
| Rewrite Phase 1: backup ที่ `E:\KhamangWet\_backup\pre-rewrite-20261026\` | `git bundle create --all` 276,379 bytes · `git bundle verify` = complete history (`main` + tag เดิม) · SHA-256 `c294eae3f6a5ce32336c110acaa3094336a8a73726ec5021b19fb7bd9af24d25` · สำเนา `.git` 340 ไฟล์ `diff -rq` ตรงกับต้นฉบับ · สคริปต์, snapshot และตารางเทียบเก็บไว้ใน `rewrite-record\` · backup นี้ยังมีอีเมลเดิมและอยู่ในเครื่องเท่านั้น |
| Rewrite Phase 2: `git filter-branch --env-filter (env-filter.sh) --index-filter (redact-index.mjs) -- main tmp/spike` | exit 0 · เขียนใหม่ 16/16 commit · env-filter เปลี่ยน email ของ author/committer ที่เป็นอีเมลเดิมเป็น noreply · index-filter แทน `mixza <อีเมลเดิม>` ใน STATUS ด้วย `mixza <[redacted]>` ระดับ byte · สร้าง annotated tag `spike/m0-t06` ใหม่ (`bdbf62c`) ด้วย message และวันที่เดิม (`1792953892 +0700`) และ tagger เป็น noreply (tag เดิมไม่มีลายเซ็น) · ลบ `tmp/spike` |
| Rewrite Phase 3: `verify-rewrite.mjs` + `pnpm verify` | ผ่านครบ 7 ข้อ: (1) commit object ทุกตัวตรงกับเดิมยกเว้น tree/parent/email (16/16) (2) ไม่พบอีเมลเดิมใน 279 object + tag (3) 14 commit ต่างแค่ STATUS −1 +1 บรรทัด และ 2 commit tree เหมือนเดิม (4) md5 baseline 34 ไฟล์ตรง §2.4 และ root tree ไม่เปลี่ยน (5) tip เดิมกับใหม่ต่างแค่ 1 บรรทัด (6) `pnpm verify` exit 0 (7) tag ตรงกับที่คาด และเปิด `RESULTS.md` ได้ · **ข้อ 4 รอบแรก FAIL** เพราะสคริปต์คาดว่า §2.4 มี md5 34 บรรทัด แต่จริงมี 24 บรรทัด + 10 ไฟล์ใน `docs/` ที่ระบุว่าตรงกับคู่ที่ root · ตรวจใหม่ครอบคลุม 34 ไฟล์แล้วผ่าน |
| Rewrite Phase 4: ลบ `refs/original/*` และโฟลเดอร์ว่าง | ref ที่เหลือมีแค่ `refs/heads/main` (`590fe6b`) และ `refs/tags/spike/m0-t06` (`bdbf62c`) · `git rev-list --all --objects` 279 object ไม่พบอีเมลเดิม · ไม่ได้รัน `gc` หรือ `prune`: reflog (80 รายการ) และ object เดิมยังอยู่ใน `.git` แต่ไม่มี ref ชี้ถึง จึงไม่ถูก push ถ้า push เฉพาะ `main` และ tag แบบระบุชื่อ |
| Phase 5: แก้เอกสาร (`update-citations.mjs` + แก้ทีละจุด) | hash ของ commit ที่ถูกเขียนใหม่ 29/29 จุดเป็นค่าใหม่ · ข้อ C: 8 commit บน branch ระบุ squash commit บน `main` · `git grep` อีเมลเดิมใน working tree = 0 ไฟล์ · hash ทุกตัวที่อ้างมีอยู่จริง · ตารางทุกไฟล์มีจำนวนคอลัมน์ถูกต้อง · `pnpm verify` exit 0 · **พลาด 1 ครั้ง:** รอบแรกแทนที่ได้ 0 จุดเพราะ shell ยุบ `\\b` ในโค้ดที่ส่งผ่าน heredoc จึงย้ายโค้ดไปเป็นไฟล์แล้วรันใหม่ |
| `git commit` บน branch `m0/dec-061-public-repo` | `ed517b2` (→ squash `6489da0` บน `main`) (8 files, +99 −33) · author = noreply · ผู้พัฒนาอนุมัติ diff ก่อน commit · squash commit บน `main` คือ "docs: record the public repo decision and the history rewrite (DEC-061)" |
| **(M0-T14 part 2, 2026-10-26)** ทดสอบ hook จริงในเซสชันที่เริ่มที่ root ของ repo: Write `.env` และ `pnpm-lock.yaml` ลงใน scratchpad ของเซสชัน | **ถูกบล็อกทั้งสองไฟล์** · `PreToolUse:Write hook error: … Blocked by .claude/hooks/guard-files.mjs: .env may hold secrets…` และ `… pnpm-lock.yaml changes only through pnpm (install, add, remove, update).` · `test -e` ยืนยันว่าไม่มีไฟล์ถูกสร้าง · สองครั้งก่อนหน้าไม่ถูกบล็อก เพราะครั้งแรกเซสชันเริ่มก่อนจะมี `.claude/settings.json` และครั้งที่สองแค่ย้าย working directory ซึ่งไม่ทำให้ hook โหลด |
| `allow` list ใน `.claude/settings.json` | 20 rule (Bash 10 + PowerShell 10) เฉพาะคำสั่งที่มีจริง: `pnpm verify`, `typecheck`, `lint`, `test *`, `build`, `format:check`, `--version`, `git status *`, `git diff *`, `git log *` · `JSON.parse` ผ่าน · ไม่มี rule ที่ซ้ำกับ deny หรือ ask · ยังไม่ได้ทดสอบว่าไม่ถามสิทธิ์ เพราะเซสชันนี้อยู่ใน auto mode |
| skill `verify` (`.claude/skills/verify/SKILL.md`) | Claude Code โหลด skill ทันทีที่สร้างไฟล์ (ปรากฏในรายการ skill) · เรียกผ่าน Skill tool แล้วรัน `pnpm verify`: exit 0 · typecheck 5 package · lint fixture 9/9 · test 5/5 · build 5 package · format:check ผ่าน |
| `git commit` บน branch `m0/t14-claude-config-part2` | `b5e611e` (→ squash `3821a23` บน `main`) (6 files, +45 −9) · author = noreply · ผู้พัฒนาอนุมัติ diff ก่อน commit · squash commit บน `main` คือ "chore(claude): add the verify skill and an allow list; prove the guard hook (M0-T14 part 2)" |
| **(M0-T11, 2026-10-26)** เขียน `.github/workflows/ci.yml` ตามร่างที่ผู้พัฒนาอนุมัติ | `cmp` ตรงกับร่าง · 36 บรรทัด LF · `prettier --check` ผ่าน (Prettier parse YAML ได้และจัดรูปแบบแล้วไม่เปลี่ยน) · `pnpm verify` exit 0 · checkout `3d3c42e5…` (v7.0.1) และ setup-node `949feb24…` (v7.1.0) ตาม SHA ที่ GitHub API ให้ · lockfile มี binding ของ linux-x64 ครบ (`@rolldown/binding-linux-x64-gnu`, `lightningcss-linux-x64-gnu`, `@pnpm/exe.linux-x64`) · **ยังไม่ได้ push จึงยังไม่มีผลรันบน GitHub** |
| `git commit` บน branch `m0/t11-ci` | `6a0af3d` (→ squash `6af21d5` บน `main`) · author = noreply · ผู้พัฒนาอนุมัติ workflow ก่อน commit · squash commit บน `main` คือ "ci: add the tier 1 GitHub Actions workflow (M0-T11)" |
| **(M0-T11, ผู้พัฒนาอนุมัติ)** สแกนก่อน push (`main` + tag) | 311 object + tag object ประมาณ 291 KB · ทั้ง 19 commit และ tagger ใช้ noreply · อีเมลเดิม 0 · ไม่มีไฟล์ที่ดูเหมือน secret · GitHub repo ยังว่าง (0 ref) |
| `git remote add origin https://github.com/mixagent42/KhamangWet.git` + `git push -u origin main` + `git push origin refs/tags/spike/m0-t06` | exit 0 ทั้งสามคำสั่ง (ผู้พัฒนา login ผ่าน Git Credential Manager) · `[new branch] main -> main` และ `[new tag] spike/m0-t06` · `git ls-remote origin` ตรงกับในเครื่อง: `main` = `6af21d5`, tag = `bdbf62c` → `ce3eed4` · `main...origin/main` sync |
| **AC 1:** GitHub Actions run `40260667719` (push บน `main`, `6af21d5`) | **success** · 29 วินาทีบน `ubuntu-24.04` · ผ่านครบ 7 ขั้น: checkout, setup-node (Node 24.22.1), corepack, `pnpm --version`, `pnpm install --frozen-lockfile`, `pnpm verify` · ตรวจผ่าน GitHub API โดยไม่ใช้ credentials |
| **AC 2:** branch ชั่วคราว `ci/red-check` (`ca73353`: `toBe(5)` → `toBe(6)`) | ในเครื่อง `pnpm test` exit 1 · push แล้ว run `40261106928` = **failure** ที่ขั้น `Run pnpm verify` ส่วนขั้นก่อนหน้าผ่านหมด · ลบแล้วด้วย `git push origin --delete ci/red-check` และ `git branch -D ci/red-check` · บน remote เหลือแค่ `main` และ tag · run ที่แดงยังอยู่ในประวัติ Actions |
| **AC 3:** ruleset (ผู้พัฒนาตั้งใน UI) ตรวจด้วย `GET rules/branches/main`, `GET rulesets`, `GET branches/main` | ruleset `main-protection` (id `25851121`) · `enforcement: active` · target `branch` · include `~DEFAULT_BRANCH` · rule `deletion` + `non_fast_forward` · `main` `protected: true` · ไม่ได้บังคับ status check ตามแผนที่อนุมัติ (flow squash ในเครื่องแล้ว push ตรง) · bypass list ดูผ่าน API ไม่ได้ถ้าไม่ใช้ credentials |
| push หลักฐานของ T11 (`git push origin main`, ไม่ force) | `6af21d5..a00a0f8` · สแกนก่อน push ไม่พบอีเมลเดิม · run `40262249551` ของ `a00a0f8` = **success** (22 วินาที, ครบ 7 ขั้น) |
| **(DEC-062, 2026-10-26)** บันทึกการมอบอำนาจ | DEC-062 อยู่ใน `DECISIONS.md` · การแก้ `CLAUDE.md`, `.claude/rules/docs.md` และ skill `implement-task` ให้ตรงกับ DEC-062 ถูก auto mode classifier ปฏิเสธ (Self-Modification) · คืนไฟล์ทั้งสามเป็นแบบเดิมแล้ว ไม่ได้หาทางเลี่ยง · ผู้พัฒนาตัดสินว่าจะแก้เองหรือไม่ |
| **(M0-T12, 2026-10-26)** เขียน ADR ใน `docs/adr/` | `003-walkable-data.md`, `004-netcode-model.md`, `006-dev-auth.md`, `007-mvp-scope-pve-loot.md` (Accepted) และ `005-persistence-strategy.md` (Draft) · ทุกไฟล์มี Status, Date, Context, Decision, Alternatives และ Consequences ตาม TECH §10 |
| ตรวจบรรทัดที่ ADR อ้างถึง (`sed -n`) | 12/12 ตรงกับเนื้อหาที่อ้าง: TECH L81, L115, L126 · ART_ANIMATION L26, L27 · SECURITY L21 · ROADMAP L69 · COMBAT L35, L43 · DATABASE L41 · GDD L4 · NETWORK_PROTOCOL L15 |
| แก้เอกสารต้นฉบับแบบในบรรทัดเดิม | `NETWORK_PROTOCOL.md` L15: ตัด "input duration or movement intent" ออก และให้ server คำนวณระยะจาก tick (ADR-004) · `GAME_VISION_GDD.md` L44: "Large-scale guild wars." → "PvP of any kind, including large-scale guild wars (MVP is PvE only, ADR-007)." · จำนวนบรรทัดไม่เปลี่ยน (50 และ 104) จึงไม่กระทบเลขบรรทัดที่เอกสารอื่นอ้าง |
| `DECISIONS.md` (สคริปต์ที่ทุกการแทนที่ต้อง match 1 ครั้งพอดี) | 24/24 จุด: header · index ของ DEC-009 และ 016 ถึง 022 · status ในแต่ละ entry พร้อมลิงก์ ADR · DEC-017 (แก้ L15 แล้ว) · DEC-021 (แก้ GDD §7 แล้ว) · ปิด C-04, C-05, C-06, C-13 ถึง 15 · C-23 รอ ADR-005 Accept |
| **(M0 gate follow-ups, 2026-10-26)** ป้องกันไฟล์ `*.env` | `.gitignore` เพิ่ม `*.env` (`git check-ignore`: `prod.env`, `secrets.env` ถูก ignore · `.env.example`, `env.ts`, `env.md` ยัง track) · guard hook บล็อกชื่อไฟล์ที่ลงท้ายด้วย `.env` หรือขึ้นต้นด้วย `.env.` (ยกเว้น `.env.example`) · `settings.json` deny เพิ่ม `Read(*.env)` · classifier ยอมให้แก้ทั้งสามจุดเพราะเป็นการจำกัดสิทธิ์เพิ่ม |
| regression test ของ guard hook: `tests/hooks/guard-files.test.mjs` (`node --test`) | **18/18 ผ่าน** (บล็อก 8 กรณีรวม `prod.env` และ `secrets.env` · ปล่อยผ่าน 10 กรณีรวม `.env.example`, JSON เสีย และ stdin ว่าง) · mutation test: เอาเงื่อนไข `*.env` ออกชั่วคราวแล้ว fail 2 กรณี exit 1 · คืนไฟล์แล้ว (`cmp`) · `pnpm lint` รัน `tests/*/*.test.mjs` แล้ว 27/27 · `pnpm verify` exit 0 (รอบแรก exit 1 ที่ format:check เพราะเงื่อนไขใหม่ยาวเกิน 80 ตัว จึงรัน Prettier แล้ว test ยังผ่าน 18/18) |
| อัปเดต Node: ดาวน์โหลด `node-v24.22.1-x64.msi` จาก nodejs.org | 33,333,248 bytes · SHA-256 `3bda4baf1ee709b33cf920dd633106ddb23951e322bff9c03ec9f64ab8981b01` ตรงกับ `SHASUMS256.txt` ทางการ · Authenticode = Valid (OpenJS Foundation) |
| `msiexec /i … /passive /norestart` (ผู้พัฒนากด UAC) | exit 0 · MSI = Node.js 24.22.1 · `node` v24.22.1, npm 11.19.1, corepack 0.36.0, `pnpm` 12.15.0 ผ่าน shim เดิม · `pnpm install --frozen-lockfile` up to date · `pnpm verify` exit 0 (typecheck 5, tooling test 27/27, test 5/5, build 5, format) |
| `engines.node` `^24.19.0` → `^24.22.1` (ตัดสินตาม DEC-062) | เครื่องพัฒนาและ CI ใช้ 24.22.1 · `engineStrict` จะปฏิเสธ Node ที่เก่ากว่า |
| **(M1-T01, 2026-10-26)** `pnpm install` (`@babylonjs/core` 9.32.0 ผ่าน catalog + `vitest` ใน `apps/web`) | exit 0 · `Packages: +1` · Apache-2.0, ไม่มี dependency และไม่มี install script · ออก 2026-10-22 และเป็นเวอร์ชันที่ ADR-001 pin ไว้ |
| `pnpm verify` | exit 0 · typecheck 5 package · tooling test 27/27 · test: game-rules 5/5 และ web 9/9 (`iso-camera-math.test.ts`: ทิศ yaw 45°, ความสูงแบบ true isometric, ระยะ, ortho bounds, ซูมในช่วง และปฏิเสธ NaN/Infinity) · build 5 package · format |
| `vite build` ของ `apps/web` | chunk หลัก 1,004 kB raw / **239 kB gzip** (spike แบบ import ทีละ module ได้ 315 kB gzip) · texture loader ของ Babylon แยกเป็น chunk ที่โหลดทีหลัง · Vite เตือนว่า chunk ใหญ่กว่า 500 kB (บันทึกไว้ ยังไม่แก้) |
| เปิดใน browser pane (`.claude/launch.json` config `web` → `pnpm --filter @kw/web dev`) | scene แสดงพื้นแบบ isometric และ occluder ครบ 3 แบบ · canvas เป็น `webgl2` ("WebGL 2.0 (OpenGL ES 3.0 Chromium)") · console: "Babylon.js v9.32.0 - WebGL2" ไม่มี error · scroll wheel ซูมได้ · ลากเมาส์แล้วภาพไม่เปลี่ยน (กล้องหมุนไม่ได้) |

### 2.2 Build / Typecheck / Lint / Test
> **[F] ไม่มีคำสั่ง build, typecheck, lint หรือ test ใน repository** ผลด้านล่างคือการลองรันจริง ซึ่ง**ล้มเหลวทั้งหมด** ไม่มีผลสำเร็จใดที่จะรายงานได้
> **อัปเดต M0-T08 (2026-10-26):** มี `pnpm build` (= `pnpm -r build`) และผ่านแล้ว (§2.1 M0-T08) · typecheck, lint และ test ยังไม่มี (M0-T09, M0-T10) · ตารางด้านล่างคือผลตอน onboarding
> **อัปเดต M0-T09 (2026-10-26):** มี `pnpm lint` และ `pnpm format:check` และผ่านแล้ว (§2.1 M0-T09) · typecheck และ test ยังไม่มี (M0-T10)
> **อัปเดต M0-T10 (2026-10-26):** มี `pnpm typecheck`, `pnpm test` และ `pnpm verify` และผ่านแล้ว (§2.1 M0-T10) · ตารางด้านล่างคงไว้เป็นผลตอน onboarding

| คำสั่ง | Exit code | Output สำคัญ |
|---|---|---|
| `npm run build` | 127 (non-zero, รันจาก Git Bash) | `npm error code ENOENT` · `path E:\KhamangWet\KhamangWet_FullSystem\package.json` |
| `npm run typecheck` | 127 | เหมือนกัน (ไม่มี `package.json`) |
| `npm run lint` | 127 | เหมือนกัน |
| `npm run test` | 127 | เหมือนกัน |
| `pnpm --version` | 127 → **0 (M0-T07)** | `pnpm: command not found` (ตอน onboarding) · หลัง M0-T07 ได้ `12.15.0` (§2.1 M0-T07) |
| `command -v tsc eslint vitest playwright prisma` | — | ไม่พบทั้ง 5 คำสั่ง |

**สิ่งที่ต้องมีก่อนรันคำสั่งเหล่านี้ได้:** backlog M0-T07 (pnpm), M0-T08 (workspace), M0-T09 (lint), M0-T10 (`pnpm verify`)

### 2.3 Toolchain และฮาร์ดแวร์
| รายการ | ผลตรวจ | ใช้ใน |
|---|---|---|
| git | 2.55.0.windows.5 | DEC-001 |
| node | ~~v24.19.0~~ **v24.22.1** (อัปเดต 2026-10-26 ผ่าน MSI ทางการ · ตรวจ SHA-256 และ Authenticode แล้ว) · npm 11.19.1 | DEC-004 |
| npm | 11.17.0 | — |
| corepack | ~~0.35.0~~ **0.36.0** (มากับ Node 24.22.1 · shim ของ `pnpm` ยังใช้ได้) | DEC-005 |
| pnpm | ~~ไม่พบใน PATH~~ · เรียก `corepack pnpm@12.15.0` ได้โดยไม่ต้อง `corepack enable` (M0-T06) · **M0-T07:** `pnpm` 12.15.0 ผ่าน corepack shim ใน `%APPDATA%\npm` (ตัว pnpm อยู่ที่ `%LOCALAPPDATA%\node\corepack`) | DEC-005 |
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
**หมายเหตุ M0-T03 (2026-10-26):** สำเนาที่ root ถูกลบแล้วแต่ดูได้ใน commit `2ab369f` (เดิม `ce6117d` ดู §2.5) · `README.md` และ `docs/TECHNICAL_ARCHITECTURE.md` ถูกแก้ตามที่อนุมัติ จึงมี md5 ต่างจากรายการข้างบน ซึ่งเป็นค่าของ baseline

### 2.5 ตารางเทียบ hash หลังเขียนประวัติใหม่ (DEC-061, 2026-10-26)
การเขียนประวัติใหม่เพื่อลบอีเมลส่วนตัว (§2.1 แถว DEC-061) ทำให้ hash ของทุก commit บน `main` และ tag `spike/m0-t06` เปลี่ยน · การอ้างอิงในเอกสารทั้ง 29 จุดเปลี่ยนเป็น hash ใหม่แล้ว · commit message ยังมี hash เดิมอยู่ (เช่น "Squashed from branch … (tip)") ให้ใช้ตารางนี้แทน

| เดิม | ใหม่ | commit |
|---|---|---|
| `ce6117d` | `2ab369f` | chore: import baseline design docs (unchanged) |
| `c8cbe36` | `94b822b` | docs: add onboarding report, foundation and art planning docs |
| `d8d090f` | `f9feed1` | docs: record M0-T02 evidence (git repo initialized) |
| `1349c25` | `06f5219` | docs: make docs/ canonical and remove root duplicates (M0-T03) |
| `e281cc6` | `ead01b9` | docs: add CLAUDE.md project instructions (M0-T04) |
| `2a28ef5` | `71da7db` | chore: add path-scoped rules for packages/ and docs/ (M0-T05) |
| `7a806c9` | `70f3f73` | docs: add ADR-001 stack and pinned versions (M0-T06) |
| `71bd2ca` | `79f3d23` | docs: point M0-T06 evidence at tag spike/m0-t06 after cleanup |
| `0f2ae10` | `f548436` | docs: record spike leftover cleanup outside the repo (DEC-059, DEC-060) |
| `b202f69` | `e934840` | chore(claude): add Claude Code settings, guard hook, reviewer and implement-task (M0-T14 part 1) |
| `0325603` | `e7e4932` | chore: pin pnpm 12.15.0 through corepack (M0-T07) |
| `1d6ddd8` | `ad2a544` | chore: add pnpm workspace skeleton (M0-T08) |
| `45c0ee0` | `4829ccf` | chore: add type-aware lint, import boundaries and Prettier (M0-T09) |
| `87b4087` | `590fe6b` | chore: add pnpm verify and the first unit test (M0-T10) |
| `c4bf28e` | `15a0b05` | spike: M0-T06 version compatibility spike (เฉพาะใน tag) |
| `9d43ddf` | `ce3eed4` | spike: add raw M0-T06 command logs (commit ที่ tag ชี้) |
| `4013203` | `bdbf62c` | tag object `spike/m0-t06` |

- **commit บน branch ที่ squash แล้ว** (เช่น `2235350`, `d72e0cf`) ไม่อยู่บน `main` และไม่ถูก push · ในเอกสารจึงระบุ squash commit บน `main` ไว้ข้างกัน · ตัว commit เองมีอยู่แค่ใน `.git` ของเครื่องนี้และใน backup
- tree ชั่วคราว `360ac0f` (§2.1 M0-T08) มีอยู่แค่ใน `.git` ของเครื่องนี้ ไม่ถูก push
- ตารางฉบับเต็ม (hash 40 ตัว) อยู่ใน `E:\KhamangWet\_backup\pre-rewrite-20261026\rewrite-record\mapping.json`

### 2.6 M0 gate review (M0-T15, 2026-10-26)
- **ผู้ตัดสิน:** Claude ตาม DEC-062 ตามคำสั่งของผู้พัฒนา "เริ่ม M0-T15 gate review ได้เลย ตาม DoD §7 ตัดสินเองตาม DEC-062 แล้วรายงานผล" (ต่างจาก DoD §7 ข้อ 7 ที่ให้ผู้พัฒนาประกาศเอง โดยผู้พัฒนาเป็นผู้สั่ง)
- **ผล: ผ่าน** · tag `m0-gate` อยู่ที่ squash commit ของ M0-T15 บน `main`

**DoD §7**
| ข้อ | เกณฑ์ | ผล | หลักฐาน |
|---|---|---|---|
| 1 | task ทุกตัวเป็น Done หรือย้ายออกพร้อมเหตุผล | ✔ | T01–T12, T14, T15 Done · T13 Deferred → M3 (DEC-009) |
| 2 | exit criteria ของ M0 มีหลักฐานครบ | ✔ | ตารางถัดไป |
| 3 | decision ที่ต้องปิดก่อน M0 เป็น Accepted | ✔ | ทั้ง 16 entry ที่มีป้าย M0 ใน DECISIONS §1 · DEC-039 เป็น Superseded by DEC-061 ซึ่ง Accepted |
| 4 | prompts/03 และ prompts/08 ไม่มี Critical หรือ High ค้าง | ✔ | Critical 0 · High 0 · Medium 3 · Low 5 (ตาราง finding) |
| 5 | อัปเดต STATUS และ risk register | ✔ | section นี้ และหมายเหตุหลัง M0 gate ใน `PROJECT_ONBOARDING_REPORT.md` §5 |
| 6 | tag `m0-gate` | ✔ | annotated tag ที่ squash commit ของ T15 |
| 7 | ผู้พัฒนาประกาศผ่าน | ⚠ | ผู้พัฒนามอบให้ Claude ตัดสิน (คำสั่ง T15 + DEC-062) |

**Exit criteria ของ M0**
| # | Criterion | ผล | หลักฐาน (รัน 2026-10-26) |
|---|---|---|---|
| 1 | baseline commit และ md5 ตรงกับ §2.4 | ✔ | root `2ab369f` มี 34 ไฟล์ · 24/24 บรรทัดใน §2.4 + สำเนา `docs/` 10/10 ตรง |
| 2 | `pnpm install --frozen-lockfile` บน clone ใหม่ | ✔ | `git clone` จาก GitHub (HEAD `ff45dc4` = `main`) → exit 0 · 129 package (reuse จาก store) |
| 3 | `pnpm verify` ผ่านทั้ง local และ CI | ✔ | clone ใหม่: exit 0 (typecheck 5 package, lint fixture 9/9, test 5/5, build 5 package, format) · CI run `40263688557` บน `ff45dc4` = success |
| 4 | lint fixture ที่ import ผิดกฎทำให้ lint ล้ม | ✔ | fixture 9/9 ใน `pnpm lint` · mutation test และ import ผิดกฎจริงทำให้ exit 1 (§2.1 M0-T09) |
| 5 | ADR ตามข้อที่แก้แล้ว | ✔ | ADR-001, 003, 004, 006, 007 Accepted · ADR-005 Draft · ADR-002 หลัง VP0-c |
| 6 | ไม่มี decision ที่ต้องปิดก่อน M0 ค้าง | ✔ | เหมือน DoD ข้อ 3 |

Gate ของ ROADMAP M0 ("no unknown critical constraint before prototype"): ✔ ความเสี่ยงระดับ Critical คือ R-01 (M4) และ R-02 (M1) รู้แล้วและมีแนวทางใน ADR-005 และ ADR-003

**Code review (prompts/03) ของ diff ทั้ง M0** (ตรวจกับไฟล์จริงแล้ว)
| ระดับ | ไฟล์ | ปัญหา | ผลกระทบ | แนวทางแก้ | test ที่ควรมี |
|---|---|---|---|---|---|
| Medium | `.claude/hooks/guard-files.mjs` | ไม่มี regression test ใน repo มีแค่ pipe-test ชั่วคราวใน scratchpad | ถ้าแก้ hook ผิด (เช่นตอน Prettier จัดรูปแบบ) จะไม่มีอะไรจับได้ และไฟล์ `.env` อาจถูกแก้ | เพิ่ม test ของ hook ใน `tests/` และรันใน `pnpm lint` | 14 กรณีแบบที่ pipe-test ใช้ |
| Medium | `.gitignore`, guard hook, `Read` deny | ไฟล์ชื่อแบบ `*.env` เช่น `prod.env` ไม่ถูก ignore ไม่ถูกบล็อกและอ่านได้ (ตรวจแล้ว: hook exit 0, `git check-ignore` ไม่ match) | secret อาจหลุดขึ้น repo ที่เป็น public | เพิ่ม `*.env` ในทั้งสามจุด โดยยกเว้น `.env.example` | กรณี `prod.env` ใน test ของ hook |
| Medium | เครื่องพัฒนา | Node ในเครื่องเป็น 24.19.0 ส่วน CI เป็น 24.22.1 ซึ่งเป็น security release | เครื่องพัฒนาขาด security fix และ local กับ CI ต่างกัน | อัปเดต Node ในเครื่อง (ผู้พัฒนากด UAC) | `node --version` |
| Low | `.claude/settings.json` | `Bash(git diff *)` และ `Bash(git log *)` ครอบ `--output=<file>` ซึ่งเขียนไฟล์ได้ (ตามเอกสารของ git) | เขียนไฟล์ได้โดยไม่ถาม | เพิ่ม ask rule สำหรับ `--output` หรือยอมรับความเสี่ยง | — |
| Low | `eslint.config.js` | รายการ DOM และ Node globals ยังไม่ครบ และยังไม่ห้าม `new Date()` ใน game-rules | logic ที่ไม่ deterministic อาจหลุดเข้า game-rules | เพิ่มเมื่อเริ่มเขียน game-rules จริง · `tsc` ไม่มี DOM lib อยู่แล้ว | fixture เพิ่ม |
| Low | `.github/workflows/ci.yml` | `cancel-in-progress` อาจยกเลิก run ของ push ก่อนหน้าบน `main` | commit นั้นจะไม่มีผล CI | ยอมรับได้ตอนนี้ (push ห่างกัน) | — |
| Low | `README.md` | ส่วน "วิธีใช้" ยังเขียนว่า "แตก ZIP" และ Contents ยังไม่มี `docs/adr/` กับ `.github/` | ผู้อ่านใหม่สับสน | แก้เมื่อปรับ README ครั้งถัดไป | — |
| Low | foundation docs | DECISIONS, BACKLOG และ DoD ยังเขียนว่า "Draft ที่รออนุมัติ" | สถานะเอกสารไม่ตรงกับการใช้งานจริง | ตัดสินสถานะเอกสารใน task ถัดไป | — |

**Doc sync (prompts/08) ที่แก้ใน task นี้:** `ROADMAP.md` L9 (ADR ที่ย้ายไป M1 และ M3, แก้ในบรรทัดเดิม) · หัวของ BACKLOG · `CLAUDE.md` ส่วน Current state · หมายเหตุใน DoD §7 ข้อ 7 · risk register

**Known issues และ evidence bundle**
- ไม่มี test tier 2–3, Playwright report, perf JSON และ visual QA เพราะ M0 ยังไม่มีโค้ดเกม
- ไฟล์คำสั่งของ Claude (`CLAUDE.md` ส่วน approvals, `.claude/rules/docs.md`, skill `implement-task`) ยังไม่ได้แก้ตาม DEC-062 เพราะ auto mode classifier ปฏิเสธ
- ruleset ไม่บังคับ status check ตามที่ออกแบบไว้ (DoD §6.2)
- `.git` ในเครื่องและ backup ยังมี object เดิมที่มีอีเมลส่วนตัว แต่ไม่มี ref ชี้ถึงจึงไม่ถูก push
- Follow-ups ทั้ง 3 ข้อ (Medium) อยู่หัวส่วน M1 ของ BACKLOG

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
| Git repository, `.gitignore`, `.gitattributes` | **Implemented** | `2ab369f` (baseline 34 ไฟล์ md5 ตรงครบ) + `94b822b` (docs + `.gitattributes` + `.gitignore`) · clean · LF ทุกไฟล์ (§2.1, M0-T02) · ~~ยังไม่มี remote~~ · **DEC-061:** ประวัติเขียนใหม่ให้ใช้อีเมล noreply แล้ว (ตารางเทียบ hash ใน §2.5) · **M0-T11:** remote `origin` = `mixagent42/KhamangWet` (public) push `main` และ tag แล้ว · ruleset `main-protection` ห้ามลบและห้าม force push | M0-T02 ✔, M0-T11 ✔ |
| `CLAUDE.md` | **Implemented** | 66 บรรทัด สร้างจาก template และผู้พัฒนาอนุมัติเนื้อหาแล้ว · ไม่มี `@import` · ยังไม่มีส่วน Commands เพราะยังไม่มีคำสั่ง (§2.1 M0-T04) | M0-T04 ✔ |
| `.claude/settings.json`, skills, agents, hooks | **Implemented** | `settings.json` (allow 20, deny 11, ask 9), hook `guard-files.mjs` ที่**บล็อกได้จริงในเซสชัน** (`.env` และ `pnpm-lock.yaml`), subagent `reviewer`, skill `implement-task` และ `verify` (เรียกจริงแล้ว) · pipe-test 14/14 (§2.1 M0-T14 part 1 และ part 2) | M0-T14 ✔ |
| `docs/adr/` | **Partial** | ADR-001 (stack), 003 (walkable), 004 (netcode), 006 (dev auth) และ 007 (PvE + loot) เป็น Accepted · ADR-005 (persistence) เป็น Draft จนถึง M3-T12 · ADR-002 (animation runtime) ทำหลัง VP0-c · ครบตามที่ M0 ต้องการแล้ว (§2.1 M0-T12) | M0-T06 ✔, M0-T12 ✔ |
| pnpm workspace + lockfile | **Implemented** | `pnpm-workspace.yaml` (catalog + `engineStrict`), 7 workspace projects (`@kw/*`) ที่มีแค่ entry point ว่าง, `pnpm-lock.yaml` · `pnpm install --frozen-lockfile` และ `pnpm -r build` ผ่านบนสำเนาใหม่ (§2.1 M0-T08) · ยังไม่มีโค้ดเกม | M0-T07 ✔, M0-T08 ✔ |
| Lint / format / import boundary | **Implemented** | `eslint.config.js` (type-aware + กฎ boundary ด้วย ESLint core rules), `tests/lint/import-boundaries.test.mjs` (9/9), Prettier 3.9.10 สำหรับ code และ config (`.prettierignore`) · `pnpm lint` และ `pnpm format:check` exit 0 · import ผิดกฎทำให้ `pnpm lint` exit 1 (§2.1 M0-T09) | M0-T09 ✔ |
| `pnpm verify` (typecheck + lint + test + build) | **Implemented** | `pnpm verify` = typecheck → lint → test → build → format:check, exit 0 · unit test ตัวอย่าง `clamp` ใน `game-rules` (Vitest 5/5) · test ที่ fail ทำให้ verify exit 1 และหยุดที่ขั้น test (§2.1 M0-T10) | M0-T10 ✔ |
| CI pipeline | **Implemented** (tier 1) | `.github/workflows/ci.yml` · run บน `main` เขียว (`40260667719`) · branch ที่ test fail ขึ้นแดง (`40261106928`) · ruleset `main-protection` บน `main` · tier 2–3 ยังไม่มี (ต้องมี integration test และ E2E ก่อน) (§2.1 M0-T11) | M0-T11 ✔ |
| Local PostgreSQL | **Missing** | ไม่พบ docker หรือ psql · **เลื่อนไป M3 (DEC-009, 2026-10-26)** โดยลอง PGlite ก่อน | M0-T13 (Deferred → M3) |

### 3.2 Game systems (เทียบกับ GDD §6 MVP Scope และ TECH §4)
| ระบบ | สถานะ | หมายเหตุ | Milestone |
|---|---|---|---|
| `apps/web` — Babylon scene, iso camera | **Partial** | graybox scene (พื้น 20 × 20 m + occluder กำแพง ต้นไม้ ชายคา) และกล้อง orthographic iso ที่หมุนไม่ได้ พร้อมซูม · pitch สุดท้ายรอ ADR-009 (M1-T11) (§2.1 M1-T01) | M1 |
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
| 2026-10-26 | M0-T02 Done: git repository = Implemented (`2ab369f`, `94b822b`) แล้วบันทึกหลักฐานใน commit ถัดไป | §2.1 (M0-T02) |
| 2026-10-26 | M0-T03 Done: `docs/` เป็นต้นฉบับเดียวและลบไฟล์ซ้ำแล้ว แล้ว squash merge เข้า `main` | §2.1 (M0-T03) |
| 2026-10-26 | M0-T04 Done: `CLAUDE.md` = Implemented (66 บรรทัด) แล้ว squash merge เข้า `main` | §2.1 (M0-T04) |
| 2026-10-26 | M0-T05 Done: `.claude/rules/` = Implemented (5 ไฟล์) แล้ว squash merge เข้า `main` | §2.1 (M0-T05) |
| 2026-10-26 | M0-T06 Done: spike ผ่าน · ADR-001 เขียนแล้ว · `docs/adr/` = Partial · DEC-059 เปิดใหม่ | §2.1 (M0-T06) |
| 2026-10-26 | M0-T06 cleanup: log ดิบเก็บใน tag `spike/m0-t06` (`ce3eed4`) · ลบ branch และโฟลเดอร์ spike · คืนค่า `.git/info/exclude` · แก้การอ้างอิงหลักฐานใน ADR-001 | §2.1 (M0-T06 cleanup) |
| 2026-10-26 | DEC-059 (1): ลบ `%APPDATA%\prisma` แล้ว · พบไฟล์ระดับผู้ใช้อื่นที่ spike สร้าง 4 รายการ (DEC-060 Open) | §2.1 (DEC-059 (1)) |
| 2026-10-26 | DEC-060 = B: ลบ `pnpm-store-operation-locks`, `biomejs` และ `prisma-nodejs` · เก็บ `pnpm-cache` · ไม่แตะ `vitest` | §2.1 (DEC-060) |
| 2026-10-26 | M0-T14 part 1: `.claude/settings.json`, guard hook, `reviewer` และ `implement-task` = Partial · รอทดสอบ hook จริงในเซสชันใหม่ และรอ skill `verify` หลัง T10 | §2.1 (M0-T14 part 1) |
| 2026-10-26 | M0-T07 Done: pnpm 12.15.0 ผ่าน corepack shim · root `package.json` + `pnpm-lock.yaml` (ส่วนของ pnpm) · pnpm workspace + lockfile = Partial | §2.1 (M0-T07), §2.3 |
| 2026-10-26 | M0-T08 Done: pnpm workspace + lockfile = Implemented (7 projects, 18 packages) · มี `pnpm build` แล้ว · convention 4–6 ใน ADR-001 | §2.1 (M0-T08), §2.2 |
| 2026-10-26 | M0-T09 Done: lint/format/import boundary = Implemented · DEC-010 ปิดครบ (Prettier + ESLint core rules) · แก้ตัวเลขในแถว build ของ M0-T08 จาก 6 เป็น 5 package | §2.1 (M0-T08, M0-T09), §2.2 |
| 2026-10-26 | M0-T10 Done: `pnpm verify` = Implemented · unit test แรก (`clamp`) · git email ของ repo เปลี่ยนเป็น noreply (A2) | §2.1 (M0-T10), §2.2 |
| 2026-10-26 | DEC-061: repo เป็น public · เขียนประวัติ git ใหม่ให้ใช้อีเมล noreply (backup ไว้นอก repo) · hash ในเอกสาร 29 จุดเปลี่ยนเป็นค่าใหม่ · เพิ่ม §2.5 ตารางเทียบ hash · หลักฐานที่อ้าง commit บน branch ระบุ squash commit บน `main` ไว้ข้างกัน | §2.1 (DEC-061), §2.5 |
| 2026-10-26 | M0-T14 Done: hook บล็อกได้จริงในเซสชัน · เพิ่ม `allow` list และ skill `verify` · Claude Code config = Implemented | §2.1 (M0-T14 part 2) |
| 2026-10-26 | M0-T11 (ส่วนในเครื่อง): เพิ่ม workflow CI tier 1 · CI pipeline = Partial จนกว่าจะ push และเห็นผลรันจริง | §2.1 (M0-T11) |
| 2026-10-26 | M0-T11 Done: push ครั้งแรก (`main` + tag) · CI บน `main` เขียว · branch ทดสอบขึ้นแดงแล้วลบทิ้ง · ruleset `main-protection` · CI pipeline = Implemented (tier 1) | §2.1 (M0-T11) |
| 2026-10-26 | DEC-062: ผู้พัฒนามอบอำนาจการตัดสินใจให้ Claude ยกเว้นเรื่องที่มีค่าใช้จ่าย · ไฟล์คำสั่งของ Claude ยังไม่ได้แก้ตาม | §2.1 (DEC-062) |
| 2026-10-26 | M0-T12 Done: ADR-003, 004, 006, 007 Accepted และ ADR-005 Draft · แก้ NETWORK_PROTOCOL L15 และ GDD §7 · M0-T13 เลื่อนไป M3 (DEC-009) | §2.1 (M0-T12) |
| 2026-10-26 | M0-T15 Done: **M0 gate ผ่าน** (ผู้ตัดสิน: Claude ตาม DEC-062) · tag `m0-gate` · code review Critical 0, High 0 · follow-ups 3 ข้อใน BACKLOG M1 | §2.6 |
| 2026-10-26 | M0 gate follow-ups: ป้องกัน `*.env` (gitignore, hook, Read deny) และมี regression test ของ guard hook ใน `pnpm lint` · เหลือ follow-up เรื่อง Node | §2.1 (M0 gate follow-ups) |
| 2026-10-26 | Node 24.22.1 บนเครื่องพัฒนา (follow-up ข้อสุดท้ายของ M0 gate) · `engines.node` = `^24.22.1` | §2.1, §2.3 |
| 2026-10-26 | M1-T01 Done: Babylon scene + iso camera = Partial (pitch รอ ADR-009) · DEC-027 และ DEC-036 Accepted (delegated) | §2.1 (M1-T01) |
