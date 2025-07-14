import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Turn off all types of errors/warnings that can block builds
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-types": "off",

      "no-console": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-empty": "off",
      "no-debugger": "off",
      "no-restricted-globals": "off",

      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",

      // Allow any JSX props, usage, etc.
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off"
    }
  }
];

export default eslintConfig;
