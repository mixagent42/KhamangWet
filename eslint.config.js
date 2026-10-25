// ESLint flat config for the workspace (DEC-010): type-aware typescript-eslint
// for TypeScript files, plus import boundaries between apps and packages
// (TECHNICAL_ARCHITECTURE.md §4, .claude/rules/shared.md).
// tests/lint/import-boundaries.test.mjs checks that each boundary rule fires.
import { builtinModules } from "node:module";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const babylon = {
  regex: "^@babylonjs/",
  message: "Babylon.js is rendering code; it belongs in apps/web only.",
};
const react = {
  regex: "^react(-dom)?(/|$)",
  message: "React is client UI code; it belongs in apps/web only.",
};
const database = {
  regex: "^(@prisma/|prisma(/|$)|pg(/|$))",
  message: "Database clients belong to the server persistence layer only.",
};
const colyseusServer = {
  regex: "^@colyseus/(core|ws-transport|tools|testing)(/|$)",
  message: "Colyseus server packages belong in apps/game-server only.",
};
const apps = {
  regex: "^@kw/(web|game-server)(/|$)",
  message: "Apps are entry points; nothing imports them.",
};
const nodeScheme = {
  regex: "^node:",
  message: "Node built-in modules are not available in the browser.",
};
const nodeBuiltins = builtinModules.map((name) => ({
  name,
  message: "Node built-in modules are not available in the browser.",
}));

const domGlobals = [
  "window",
  "document",
  "navigator",
  "location",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "HTMLElement",
  "customElements",
].map((name) => ({
  name,
  message: "Runtime packages run in Node too; do not use DOM APIs.",
}));
const nodeGlobals = ["process", "Buffer"].map((name) => ({
  name,
  message:
    "Runtime packages run in the browser too; do not use Node-only globals.",
}));

export default defineConfig(
  { ignores: ["**/dist/**"] },
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["apps/game-server/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [babylon, react, apps] }],
    },
  },
  {
    files: ["apps/web/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: nodeBuiltins,
          patterns: [database, colyseusServer, apps, nodeScheme],
        },
      ],
    },
  },
  {
    files: [
      "packages/shared-contracts/**",
      "packages/game-rules/**",
      "packages/game-data/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: nodeBuiltins,
          patterns: [
            babylon,
            react,
            database,
            colyseusServer,
            apps,
            nodeScheme,
          ],
        },
      ],
      "no-restricted-globals": ["error", ...domGlobals, ...nodeGlobals],
    },
  },
  {
    files: ["packages/game-rules/**"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message: "Take the RNG as a parameter (DEC-013).",
        },
        {
          object: "Date",
          property: "now",
          message: "Take the clock as a parameter (DEC-013).",
        },
        {
          object: "performance",
          property: "now",
          message: "Take the clock as a parameter (DEC-013).",
        },
      ],
    },
  },
);
