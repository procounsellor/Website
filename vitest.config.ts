import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Tests run in jsdom because the things worth testing here — the wallet/payment
 * plumbing — depend on localStorage and on a fake `window.Razorpay`.
 *
 * Kept separate from vite.config.ts so the app build never loads test-only
 * plugins or the setup file.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Every test lives in src/test — one place, not scattered next to sources.
    include: ["src/test/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
});
