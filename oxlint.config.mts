import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: [
    ".zed/**/*",
    "dist/**",
    "vexflow.html",
    "src/routeTree.gen.ts",
    "node_modules/**/*",
  ],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ["typescript", "unicorn", "oxc", "react", "eslint"],
  // Load eslint-plugin-boundaries to enforce Feature-Sliced Design layering.
  // See https://www.jsboundaries.dev/docs/guides/oxlint-integration/
  jsPlugins: ["eslint-plugin-boundaries"],
  categories: {
    correctness: "error",
  },
  settings: {
    // Only classify our own source files as FSD elements.
    "boundaries/include": ["src/**/*.{ts,tsx}"],
    // Files that aren't part of the FSD layer graph (generated, entrypoints, tooling).
    "boundaries/ignore": [
      "src/routeTree.gen.ts",
      "src/routes.ts",
      "src/main.tsx",
      "src/**/*.test.{ts,tsx}",
      "src/shared/test/**/*",
    ],
    // FSD layers. `app` and `shared` hold segments directly (no slices);
    // `pages`, `widgets`, `features`, `entities` are sliced by domain.
    "boundaries/elements": [
      { type: "app", pattern: "src/app" },
      { type: "pages", pattern: "src/pages/*", capture: ["slice"] },
      { type: "widgets", pattern: "src/widgets/*", capture: ["slice"] },
      { type: "features", pattern: "src/features/*", capture: ["slice"] },
      // FSD `@x`-notation cross-import public API (Entities layer only).
      // `entities/<owner>/@x/<consumer>` is "owner crossed with consumer":
      // a dedicated public API that `owner` exposes for the `consumer` slice.
      // The `@x` folder is the element; the consumer slice is the file name
      // inside it (available as `fileInternalPath`, e.g. `score.ts`).
      // Must be declared BEFORE the generic `entities` descriptor so these
      // files classify as `entities-cross` and not as plain `entities`.
      {
        type: "entities-cross",
        pattern: "src/entities/*/@x",
        capture: ["owner"],
      },
      { type: "entities", pattern: "src/entities/*", capture: ["slice"] },
      { type: "shared", pattern: "src/shared" },
    ],
    // Required so boundaries can resolve the `~/*` -> `./src/*` path alias.
    // Without a resolver, alias imports are silently treated as external and skipped.
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.app.json",
      },
    },
  },
  rules: {
    "unicorn/filename-case": ["error", { case: "kebabCase" }],
    // Focus purely on FSD layering; disable the structural rules that would
    // flag config/tooling files that legitimately live outside the element graph.
    "boundaries/no-unknown": "off",
    "boundaries/no-unknown-files": "off",
    "boundaries/no-private": "off",
    "boundaries/entry-point": "off",
    // The core FSD rule: a layer may only import from layers strictly below it,
    // and slices on the same layer must stay isolated from one another.
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        message:
          "FSD violation: a '{{from.element.types.[0]}}' module may not import from '{{to.element.types.[0]}}'. Layers may only import from layers strictly below them (app > pages > widgets > features > entities > shared), and same-layer slices must stay isolated.",
        policies: [
          // Downward imports: each layer may import from every layer below it.
          {
            from: { element: { type: "app" } },
            allow: {
              to: {
                element: {
                  type: ["pages", "widgets", "features", "entities", "shared"],
                },
              },
            },
          },
          {
            from: { element: { type: "pages" } },
            allow: {
              to: {
                element: { type: ["widgets", "features", "entities", "shared"] },
              },
            },
          },
          {
            from: { element: { type: "widgets" } },
            allow: {
              to: { element: { type: ["features", "entities", "shared"] } },
            },
          },
          {
            from: { element: { type: "features" } },
            allow: { to: { element: { type: ["entities", "shared"] } } },
          },
          {
            from: { element: { type: "entities" } },
            allow: { to: { element: { type: ["shared"] } } },
          },
          {
            from: { element: { type: "shared" } },
            allow: { to: { element: { type: ["shared"] } } },
          },
          // Same-slice internal imports are allowed for sliced layers: a module
          // may import other modules from the *same* slice on its own layer.
          {
            from: { element: { type: "pages" } },
            allow: {
              to: {
                element: {
                  type: "pages",
                  captured: { slice: "{{from.element.captured.slice}}" },
                },
              },
            },
          },
          {
            from: { element: { type: "widgets" } },
            allow: {
              to: {
                element: {
                  type: "widgets",
                  captured: { slice: "{{from.element.captured.slice}}" },
                },
              },
            },
          },
          {
            from: { element: { type: "features" } },
            allow: {
              to: {
                element: {
                  type: "features",
                  captured: { slice: "{{from.element.captured.slice}}" },
                },
              },
            },
          },
          {
            from: { element: { type: "entities" } },
            allow: {
              to: {
                element: {
                  type: "entities",
                  captured: { slice: "{{from.element.captured.slice}}" },
                },
              },
            },
          },
          // FSD cross-imports via the `@x` public API (Entities layer only).
          // 1. An `@x` bridge file may reach into any entity slice — that is its
          //    whole purpose: it re-exports another slice's public surface.
          {
            from: { element: { type: "entities-cross" } },
            allow: { to: { element: { type: ["entities", "shared"] } } },
          },
          // 2. An entity slice may import another entity's `@x` public API, but
          //    only the one declared for it: `entities/<owner>/@x/<thisSlice>`.
          //    The consumer slice is the `@x` file name (fileInternalPath),
          //    matched against the importing slice via a template.
          {
            from: { element: { type: "entities" } },
            allow: {
              to: {
                element: {
                  type: "entities-cross",
                  fileInternalPath: "{{from.element.captured.slice}}.ts",
                },
              },
            },
          },
        ],
      },
    ],
  },
  env: {
    builtin: true,
  },
  overrides: [
    {
      files: ["src/**/*.test.{ts,tsx}"],
      plugins: ["node"],
      // Test files legitimately import test utilities and fixtures across layers.
      rules: {
        "boundaries/dependencies": "off",
      },
    },
  ],
});
