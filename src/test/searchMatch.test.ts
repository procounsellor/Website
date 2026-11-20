import { describe, it, expect } from "vitest";
import { initialsOf, matchesSearch } from "@/lib/searchMatch";

const vjti = { name: "Veermata Jijabai Technological Institute", subtitle: "Mumbai • Maharashtra", id: "VJTI_MUMBAI" };
const coep = { name: "College of Engineering Pune", subtitle: "Pune • Maharashtra", id: "CEP_PUNE" };
const spj = { name: "S.P. Jain Institute of Management and Research", subtitle: "Mumbai • Maharashtra", id: "SJIMR_MUMBAI" };
const sibm = { name: "Symbiosis Institute of Business Management", subtitle: "Pune • Maharashtra", id: "SIBM_PUNE" };

describe("site search matching", () => {
  it("finds the examples the search box suggests", () => {
    expect(matchesSearch("VJTI", vjti)).toBe(true);
    expect(matchesSearch("spjimr", spj)).toBe(true);
    expect(matchesSearch("COEP", coep)).toBe(true);
  });

  it("still matches full names, partial names and city", () => {
    expect(matchesSearch("veermata", vjti)).toBe(true);
    expect(matchesSearch("pune", coep)).toBe(true);
    expect(matchesSearch("sibm pune", sibm)).toBe(true);
    expect(matchesSearch("symbiosis", sibm)).toBe(true);
  });

  it("does not match unrelated colleges or numbers against ids it was not given", () => {
    expect(matchesSearch("VJTI", coep)).toBe(false);
    expect(matchesSearch("98", { name: "Ravi Kumar", subtitle: "Delhi" })).toBe(false);
    expect(matchesSearch("", vjti)).toBe(false);
  });

  it("builds initials without filler words", () => {
    expect(initialsOf(spj.name)).toBe("spjimr");
    expect(initialsOf(vjti.name)).toBe("vjti");
  });
});
