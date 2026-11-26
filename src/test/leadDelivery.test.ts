import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureLead, flushPendingLeads } from "@/api/leads";

// Lead delivery when the backend is down: retried, then kept on the device and
// re-sent on a later page load. (The backend was off for two days in Nov 2026.)

const PENDING_KEY = "pc-pending-leads";
const lead = { phoneNumber: "9876543210", firstName: "Asha", remarks: "test" };

const ok = () => new Response("{}", { status: 200 });
const down = () => new Response("down", { status: 503 });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.useFakeTimers();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Run captureLead to completion through its retry delays. */
async function send() {
  const result = captureLead(lead).then(
    (value) => ({ ok: true as const, value }),
    (error: unknown) => ({ ok: false as const, error }),
  );
  await vi.runAllTimersAsync();
  return result;
}

const pending = () => JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");

describe("captureLead", () => {
  it("succeeds after a transient failure without saving anything", async () => {
    fetchMock.mockResolvedValueOnce(down()).mockResolvedValueOnce(ok());
    const result = await send();
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(pending()).toEqual([]);
  });

  it("retries twice, then keeps the lead on the device and throws", async () => {
    fetchMock.mockImplementation(async () => down());
    const result = await send();
    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(pending()).toHaveLength(1);
    expect(pending()[0].payload.phoneNumber).toBe(lead.phoneNumber);
  });

  it("keeps the lead when the network itself fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const result = await send();
    expect(result.ok).toBe(false);
    expect(pending()).toHaveLength(1);
  });

  it("does not retry or keep a lead the backend refused (4xx)", async () => {
    fetchMock.mockResolvedValue(new Response("bad", { status: 400 }));
    const result = await send();
    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(pending()).toEqual([]);
  });

  it("keeps one entry per phone number", async () => {
    fetchMock.mockImplementation(async () => down());
    await send();
    await send();
    expect(pending()).toHaveLength(1);
  });
});

describe("flushPendingLeads", () => {
  it("re-sends a saved lead and clears it once the backend answers", async () => {
    fetchMock.mockImplementation(async () => down());
    await send();
    expect(pending()).toHaveLength(1);

    fetchMock.mockReset().mockResolvedValue(ok());
    await flushPendingLeads();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).phoneNumber).toBe(lead.phoneNumber);
    expect(localStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("leaves the lead saved while the backend is still down", async () => {
    fetchMock.mockImplementation(async () => down());
    await send();
    fetchMock.mockClear();
    await flushPendingLeads();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(pending()).toHaveLength(1);
  });

  it("drops leads older than two weeks", async () => {
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify([{ payload: lead, savedAt: Date.now() - 15 * 24 * 3600 * 1000 }]),
    );
    await flushPendingLeads();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(localStorage.getItem(PENDING_KEY)).toBeNull();
  });
});
