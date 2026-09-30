import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests live next to the code they cover, in a `__tests__` folder
    // inside the module. They must not need Supabase, Mailpit or a dev
    // server, unlike the Playwright suite in e2e/.
    include: ["**/__tests__/**/*.test.ts"],
    exclude: ["**/node_modules/**", ".next/**", "e2e/**"],
    environment: "node",
  },
  resolve: {
    // The modules under test import their own dependencies via `@/*`, same
    // as the rest of the app, so this alias has to match tsconfig.json.
    alias: {
      "@": resolve(import.meta.dirname, "."),
    },
  },
});
