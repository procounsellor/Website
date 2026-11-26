import { describe, expect, it } from "vitest";
import { fixMojibake, repairText } from "@/lib/textRepair.mjs";

// Real samples from the backend (blogs and deadlines) as they reached the site.
describe("fixMojibake", () => {
  it("undoes a single layer of UTF-8-as-Latin-1", () => {
    expect(fixMojibake("Amrita Entrance Examination \u00e2\u0080\u0093 Engineering")).toBe("Amrita Entrance Examination – Engineering");
    expect(fixMojibake("SRM\u00e2\u0080\u0099s")).toBe("SRM’s");
    expect(fixMojibake("\u00e2\u0082\u00b91,500")).toBe("₹1,500");
  });

  it("undoes three layers", () => {
    const tripled = "Everyone\u00c3\u0083\u00c2\u00a2\u00c3\u0082\u00c2\u0080\u00c3\u0082\u00c2\u0099s got an opinion";
    expect(fixMojibake(tripled)).toBe("Everyone’s got an opinion");
  });

  it("leaves correct text alone", () => {
    for (const ok of ["Fee ₹1,500 — “quoted” café", "Señor Müller", "plain ASCII", "", "naïve résumé"]) {
      expect(fixMojibake(ok)).toBe(ok);
    }
  });

  it("repairs every string inside nested data", () => {
    const data = { title: "SRM\u00e2\u0080\u0099s", tags: ["A \u00e2\u0080\u0094 B"], n: 3, ok: true, none: null };
    expect(repairText(data)).toEqual({ title: "SRM’s", tags: ["A — B"], n: 3, ok: true, none: null });
  });
});
