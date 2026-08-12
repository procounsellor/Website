import { describe, it, expect, vi, beforeEach } from "vitest";
import startRecharge from "@/api/wallet";
import { cacheTokenInMemory, setToken } from "@/lib/tokenManager";

/**
 * This is the call that opens Razorpay. It failed for every brand-new signup
 * because it read localStorage directly, while a user who has not finished
 * onboarding holds their JWT in memory only — so it bailed out with
 * "auth token not found." and the payment window never appeared.
 */

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(jsonResponse({ orderId: "order_1", keyId: "key_1", amount: 200000, currency: "INR" }));
  vi.stubGlobal("fetch", fetchMock);
});

describe("startRecharge", () => {
  it("works for a NEW user whose JWT is in memory only (nothing in localStorage)", async () => {
    cacheTokenInMemory("memory-only-jwt");
    expect(localStorage.getItem("jwt")).toBeNull();

    const order = await startRecharge("9876543210", 2000);

    expect(order).toMatchObject({ orderId: "order_1" });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer memory-only-jwt");
  });

  it("works for an existing user whose JWT is in localStorage", async () => {
    setToken("stored-jwt", "9876543210");

    const order = await startRecharge("9876543210", 2000);

    expect(order).toMatchObject({ orderId: "order_1" });
  });

  it("sends the amount and user id the caller asked for", async () => {
    cacheTokenInMemory("jwt");

    await startRecharge("9876543210", 1500);

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/api/proCoins/addProCoins");
    expect(url).toContain("userId=9876543210");
    expect(url).toContain("amount=1500");
  });

  it("refuses with a string when there is genuinely no token", async () => {
    const result = await startRecharge("9876543210", 2000);

    expect(result).toBe("auth token not found.");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
