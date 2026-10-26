// PreToolUse guard for Edit|Write (DEC-033 A.5).
// Blocks edits to secret files (.env, .env.*, *.env) and to pnpm-lock.yaml, which must change only through pnpm.
// Exit 2 blocks the tool call and shows stderr to Claude. Unreadable input exits 0 (fail-open).
import { posix } from "node:path";

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let filePath = "";
try {
  const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  filePath = String(input?.tool_input?.file_path ?? "");
} catch {
  process.exit(0);
}

const name = posix.basename(filePath.replaceAll("\\", "/"));

if (
  (name.endsWith(".env") || name.startsWith(".env.")) &&
  name !== ".env.example"
) {
  console.error(
    `Blocked by .claude/hooks/guard-files.mjs: ${name} may hold secrets. Ask the developer to edit it; document variables in .env.example instead.`,
  );
  process.exit(2);
}

if (name === "pnpm-lock.yaml") {
  console.error(
    "Blocked by .claude/hooks/guard-files.mjs: pnpm-lock.yaml changes only through pnpm (install, add, remove, update).",
  );
  process.exit(2);
}

process.exit(0);
