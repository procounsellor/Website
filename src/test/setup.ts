import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Every test starts from a cold browser: empty localStorage, no in-memory
 * token, no Razorpay. The in-memory JWT cache in tokenManager is module state,
 * so it MUST be reset between tests or a token cached by one test silently
 * makes the next one pass.
 */
beforeEach(async () => {
  localStorage.clear();
  const { clearToken } = await import("@/lib/tokenManager");
  clearToken();
  delete (window as unknown as { Razorpay?: unknown }).Razorpay;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// The app's API modules read import.meta.env at module load.
vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
