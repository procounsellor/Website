import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerOptionForm, isOptionFormRegistered, payOptionFormFromWallet } from "@/api/optionForm";

/**
 * The registration row is created ONCE per phone. Everything here guards that
 * rule, because breaking it is what produced
 * "Option-form registration already exists for this phone number" on a retry.
 */

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const payload = {
  name: "Ananya Sharma",
  marks: 0,
  stateDomicile: "-",
  phoneNumber: "9876543210",
  optionFormRequirement: "METTLE" as const,
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

describe("registerOptionForm", () => {
  it("creates the row on the first call and remembers it", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true, data: { id: 1 } }));

    await registerOptionForm(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/api/optionFormRegistration/register");
    expect(isOptionFormRegistered("9876543210", "METTLE")).toBe(true);
  });

  it("makes NO second request once the row exists", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }));
    await registerOptionForm(payload);
    fetchMock.mockClear();

    // This is the retry after a cancelled payment.
    const result = await registerOptionForm(payload);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({ success: true, skipped: true });
  });

  it("treats the backend's duplicate answer as success and remembers it", async () => {
    // No local memo (fresh device / cleared storage), so the request goes out
    // and comes back refused.
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ success: false, message: "Option-form registration already exists for this phone number" })
    );

    await expect(registerOptionForm(payload)).resolves.toMatchObject({ success: false });
    expect(isOptionFormRegistered("9876543210", "METTLE")).toBe(true);

    // …and the next attempt does not even ask.
    fetchMock.mockClear();
    await registerOptionForm(payload);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still throws on a genuine failure, and does not remember it", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: false, message: "Marks are required" }, 400));

    await expect(registerOptionForm(payload)).rejects.toThrow("Marks are required");
    expect(isOptionFormRegistered("9876543210", "METTLE")).toBe(false);
  });

  it("keeps phones separate, so another student on the same device still registers", async () => {
    // A fresh Response each call — a body can only be read once.
    fetchMock.mockImplementation(async () => jsonResponse({ success: true }));
    await registerOptionForm(payload);
    fetchMock.mockClear();

    await registerOptionForm({ ...payload, phoneNumber: "9000000000" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("payOptionFormFromWallet", () => {
  it("sends the amount and the wallet id", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: true, message: "Transferred" }));

    await payOptionFormFromWallet("9876543210", 2000);

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("transferProCoinsToProCounsel");
    expect(url).toContain("userId=9876543210");
    expect(url).toContain("amount=2000");
  });

  it("throws when the backend answers 200 with a failure body", async () => {
    // The debit endpoint reports business failures inside a 200 — treating that
    // as success would start the test without taking the money.
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: false, message: "Insufficient ProCoins" }));

    await expect(payOptionFormFromWallet("9876543210", 2000)).rejects.toThrow("Insufficient ProCoins");
  });
});
