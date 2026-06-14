import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    exclude: [...configDefaults.exclude, "dist/*", ".tanstack/*", "dist/*"],
  },
});
