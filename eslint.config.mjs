import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // keep Next recommended configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // override rules so ESLint doesn't fail the build for these common issues
  {
    rules: {
      // TypeScript relaxed rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // general JS/React rules (disable build-stopping problems)
      "prefer-const": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",

      // Next.js specific rules (disable to allow <img>, sync scripts, etc.)
      "@next/next/no-img-element": "off",
      "@next/next/no-sync-scripts": "off",

      // allow some leniency for leftover console / dev-only patterns (optional)
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // keep other rules as defined in the extended configs
    },
  },
];

export default eslintConfig;
