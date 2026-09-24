import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.tsx"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
  },
});
