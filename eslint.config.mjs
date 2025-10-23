import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // This is broken
      "react-hooks/exhaustive-deps": "off",

      // Allow unused variables and imports
      "@typescript-eslint/no-unused-vars": "off",

      // Allow explicit any in certain cases
      "@typescript-eslint/no-explicit-any": "off",

      // Allow console statements in development
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Allow empty interfaces
      "@typescript-eslint/no-empty-interface": "off",

      // Allow non-null assertions
      "@typescript-eslint/no-non-null-assertion": "off",

      // Allow unused expressions in certain cases
      "no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],

      // Allow empty functions
      "no-empty-function": ["error", { allow: ["arrowFunctions"] }],

      // Allow unescaped entities
      "react/no-unescaped-entities": "off",

      // Allow unnamed components
      "react/display-name": "off",

      // Allow img tags
      "@next/next/no-img-element": "off",

      // Allow missing alt attributes
      "jsx-a11y/alt-text": "off",
    },
    ignores: [
      // Ignore specific files
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/public/**",
    ],
  },
];

export default eslintConfig;
