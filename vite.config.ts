import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      virtualRouteConfig: "./src/routes.ts",
      routesDirectory: "./src",
      quoteStyle: "double",
    }),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
