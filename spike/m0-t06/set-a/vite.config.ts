// T4/T5: SPIKE_ENTRY=treeshake (per-module Babylon imports) or full (import * from core).
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const entry = process.env.SPIKE_ENTRY ?? "treeshake";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: `dist-${entry}`,
    emptyOutDir: true,
    rollupOptions: { input: `web/index-${entry}.html` },
  },
});
