import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import { canSwitchToMba, onboardingNext } from "@/lib/mbaCourse";

const updateUser = vi.fn();
vi.mock("@/api/auth", async (orig) => ({ ...(await orig<typeof import("@/api/auth")>()), updateUser: (...a: unknown[]) => updateUser(...a) }));

import SwitchToMbaDialog from "@/components/Revamp/home/SwitchToMbaDialog";

const student = {
  userName: "9000000001",
  firstName: "Asha",
  role: "user",
  interestedCourse: "B.Tech",
  userInterestedStateOfCounsellors: ["Maharashtra", "Gujarat"],
} as unknown as NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;

const renderDialog = (onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <SwitchToMbaDialog to="/mba/gdpi/live" tool="Live AI mock interview" location="test" onClose={onClose} />
    </MemoryRouter>,
  );

beforeEach(() => {
  updateUser.mockReset();
  localStorage.clear();
  useAuthStore.setState({ isAuthenticated: true, role: "student", userId: "9000000001", user: student, returnToPath: null });
});

describe("helpers", () => {
  it("only lets main-site students switch themselves", () => {
    expect(canSwitchToMba("student")).toBe(true);
    expect(canSwitchToMba("user")).toBe(true);
    expect(canSwitchToMba("counselor")).toBe(false);
    expect(canSwitchToMba("schoolStudent")).toBe(false);
    expect(canSwitchToMba(null)).toBe(false);
  });

  it("onboarding returns to the MBA page the student was heading for", () => {
    expect(onboardingNext({ from: "/mba/gdpi/live" })).toBe("/mba/gdpi/live");
    expect(onboardingNext({ from: "/mba/onboarding" })).toBe("/mba/dashboard");
    expect(onboardingNext({ from: "https://evil.example/" })).toBe("/mba/dashboard");
    expect(onboardingNext(null)).toBe("/mba/dashboard");
  });
});

describe("switch to MBA dialog", () => {
  it("switches a student's course, keeps their states, and sends them on to the tool", async () => {
    updateUser.mockResolvedValue({});
    renderDialog();
    expect(screen.getByRole("dialog", { name: "Live AI mock interview is part of CAT prep" })).toBeTruthy();
    expect(screen.getByText("B.Tech")).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Switch to MBA and continue" }));

    await waitFor(() => expect(useAuthStore.getState().role).toBe("mbaStudent"));
    expect(updateUser).toHaveBeenCalledWith(
      "9000000001",
      { interestedCourse: "MBA", userInterestedStateOfCounsellors: ["Maharashtra", "Gujarat"] },
      null,
    );
    expect(useAuthStore.getState().returnToPath).toBe("/mba/gdpi/live");
    expect(useAuthStore.getState().user?.interestedCourse).toBe("MBA");
    expect(localStorage.getItem("role")).toBe("mbaStudent");
  });

  it("keeps the account as it was and says so when the save fails", async () => {
    updateUser.mockRejectedValue(new Error("500"));
    renderDialog();
    await userEvent.click(screen.getByRole("button", { name: "Switch to MBA and continue" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(useAuthStore.getState().role).toBe("student");
    expect(useAuthStore.getState().returnToPath).toBeNull();
    expect(screen.getByRole("button", { name: "Switch to MBA and continue" })).toBeTruthy();
  });

  it("explains, without a switch button, to a counsellor account", () => {
    useAuthStore.setState({ role: "counselor" });
    const onClose = vi.fn();
    renderDialog(onClose);
    expect(screen.getByText(/signed in as a counsellor/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Switch to MBA/ })).toBeNull();
    screen.getByRole("button", { name: "OK" }).click();
    expect(onClose).toHaveBeenCalled();
  });
});
