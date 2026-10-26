// Regression tests for .claude/hooks/guard-files.mjs (DEC-033 A.5, M0 gate
// follow-up). Each case pipes a PreToolUse payload into the hook and checks
// its exit code: 2 blocks the edit, 0 lets it through.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { test } from "node:test";

const hook = resolve(
  import.meta.dirname,
  "../../.claude/hooks/guard-files.mjs",
);
const root = "E:\\KhamangWet\\KhamangWet_FullSystem";

function run(input) {
  const result = spawnSync(process.execPath, [hook], {
    input,
    encoding: "utf8",
  });
  return result.status;
}

const payload = (tool, filePath) =>
  JSON.stringify({ tool_name: tool, tool_input: { file_path: filePath } });

const blocked = [
  ["Write .env (Windows path)", payload("Write", `${root}\\.env`)],
  [
    "Edit .env.local (Windows path)",
    payload("Edit", `${root}\\apps\\web\\.env.local`),
  ],
  [
    "Write .env.production (relative)",
    payload("Write", "apps/web/.env.production"),
  ],
  [
    "Write .env (POSIX path)",
    payload("Write", "/e/KhamangWet/KhamangWet_FullSystem/.env"),
  ],
  ["Write prod.env", payload("Write", "apps/web/prod.env")],
  [
    "Edit secrets.env (Windows path)",
    payload("Edit", `${root}\\packages\\x\\secrets.env`),
  ],
  ["Edit pnpm-lock.yaml", payload("Edit", `${root}\\pnpm-lock.yaml`)],
  [
    "Write nested pnpm-lock.yaml",
    payload("Write", "packages/x/pnpm-lock.yaml"),
  ],
];

const allowed = [
  ["Write .env.example", payload("Write", `${root}\\.env.example`)],
  ["Write apps/web/.env.example", payload("Write", "apps/web/.env.example")],
  ["Edit docs/DECISIONS.md", payload("Edit", `${root}\\docs\\DECISIONS.md`)],
  ["Write .envrc", payload("Write", ".envrc")],
  ["Write src/env.ts", payload("Write", "src/env.ts")],
  ["Write docs/env.md", payload("Write", "docs/env.md")],
  ["Write pnpm-workspace.yaml", payload("Write", "pnpm-workspace.yaml")],
  ["no file_path", JSON.stringify({ tool_name: "Write", tool_input: {} })],
  ["malformed JSON (fail-open)", "not json"],
  ["empty stdin (fail-open)", ""],
];

for (const [name, input] of blocked) {
  test(`blocks: ${name}`, () => assert.equal(run(input), 2));
}

for (const [name, input] of allowed) {
  test(`allows: ${name}`, () => assert.equal(run(input), 0));
}
