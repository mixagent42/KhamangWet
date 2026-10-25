// T8: type-aware typescript-eslint. Supports TypeScript >=4.8.4 <6.1.0 per its peer range.
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist-*/**", "generated/**", "node_modules/**", "src/deco/**"] },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
);
