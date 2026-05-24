import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ["typescript", "unicorn", "oxc", "react", "eslint"],
  categories: {
    correctness: "error",
  },
  rules: {},
  env: {
    builtin: true,
  },
  overrides: [
    {
      files: ["src/**/*.test.{ts,tsx}"],
      plugins: ["node"],
    },
  ],
});
