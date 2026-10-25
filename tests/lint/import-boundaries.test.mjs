// Fixture tests for the boundary rules in eslint.config.js (M0-T09, DEC-010).
// Each snippet is linted as if it lived at a real workspace path. Boundary
// rules need no type information, so type-aware linting is turned off for
// these virtual files.
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";
import { ESLint } from "eslint";
import tseslint from "typescript-eslint";

const root = resolve(import.meta.dirname, "../..");
const eslint = new ESLint({
  cwd: root,
  overrideConfig: tseslint.configs.disableTypeChecked,
});

async function ruleIds(filePath, code) {
  const [result] = await eslint.lintText(code, {
    filePath: resolve(root, filePath),
  });
  return result.messages.map((message) => message.ruleId);
}

const mustFail = [
  [
    "game-server imports Babylon",
    "apps/game-server/src/fixture.ts",
    'export { Scene } from "@babylonjs/core/scene";',
    "no-restricted-imports",
  ],
  [
    "web imports Prisma",
    "apps/web/src/fixture.ts",
    'export { PrismaClient } from "@prisma/client";',
    "no-restricted-imports",
  ],
  [
    "game-rules imports node:fs",
    "packages/game-rules/src/fixture.ts",
    'export { readFileSync } from "node:fs";',
    "no-restricted-imports",
  ],
  [
    "game-rules uses the DOM",
    "packages/game-rules/src/fixture.ts",
    "export const title = () => document.title;",
    "no-restricted-globals",
  ],
  [
    "game-rules calls Math.random",
    "packages/game-rules/src/fixture.ts",
    "export const roll = () => Math.random();",
    "no-restricted-properties",
  ],
  [
    "game-rules calls Date.now",
    "packages/game-rules/src/fixture.ts",
    "export const now = () => Date.now();",
    "no-restricted-properties",
  ],
  [
    "game-rules calls performance.now",
    "packages/game-rules/src/fixture.ts",
    "export const now = () => performance.now();",
    "no-restricted-properties",
  ],
];

for (const [name, filePath, code, ruleId] of mustFail) {
  test(`fails: ${name}`, async () => {
    assert.ok(
      (await ruleIds(filePath, code)).includes(ruleId),
      `expected ${ruleId}`,
    );
  });
}

const mustPass = [
  [
    "web imports Babylon",
    "apps/web/src/fixture.ts",
    'export { Scene } from "@babylonjs/core/scene";',
  ],
  [
    "game-rules takes the RNG as a parameter",
    "packages/game-rules/src/fixture.ts",
    "export const roll = (rng: () => number) => rng();",
  ],
];

for (const [name, filePath, code] of mustPass) {
  test(`passes: ${name}`, async () => {
    assert.deepEqual(await ruleIds(filePath, code), []);
  });
}
