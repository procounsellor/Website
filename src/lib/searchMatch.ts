/**
 * Search matching for the site search (header and home hero).
 *
 * Students search the way they talk: "VJTI", "SPJIMR", "COEP", "sibm pune".
 * Matching only the full name ("Veermata Jijabai Technological Institute")
 * found none of those, so the box that suggests "e.g. VJTI, SPJIMR, COEP"
 * answered "No results". This also matches the initials of the name, the
 * college id ("VJTI_MUMBAI") and a few well-known nicknames.
 */

const STOP_WORDS = new Set(["of", "and", "the", "for", "in", "at", "&"]);

/** Nicknames that are neither the initials nor in the id. Keys are compact (letters/digits only). */
const NICKNAMES: Record<string, string[]> = {
  CEP_PUNE: ["coep"],
  SJIMR_MUMBAI: ["spjimr", "spjain"],
  WIMDR_MUMBAI: ["welingkar", "weschool"],
  KSIMSR_MUMBAI: ["kjsim", "somaiya"],
  SJMSM_MUMBAI: ["sjmsom", "iitbombay"],
  SCFMHRD_PUNE: ["scmhrd"],
  MUICT_MUMBAI: ["ict", "udct"],
  DMS_PUNE: ["pumba"],
};

const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** "S.P. Jain Institute of Management and Research" → "spjimr". */
export function initialsOf(name: string): string {
  return name
    .split(/[\s.\-–,()/]+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
    .map((w) => w[0])
    .join("")
    .toLowerCase();
}

export function matchesSearch(
  query: string,
  item: { name: string; subtitle?: string; id?: string },
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const name = item.name.toLowerCase();
  const subtitle = (item.subtitle ?? "").toLowerCase();
  if (name.includes(q) || subtitle.includes(q)) return true;

  const cq = compact(q);
  if (cq.length < 2) return false;
  // Every word of the query somewhere in the name/city ("sibm pune", "pune engineering").
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((w) => name.includes(w) || subtitle.includes(w))) return true;
  if (initialsOf(item.name).startsWith(cq)) return true;
  if (item.id) {
    const idCompact = compact(item.id); // "vjtimumbai"
    const idHead = compact(item.id.split("_")[0]); // "vjti"
    if (idHead.startsWith(cq) || idCompact === cq) return true;
    if ((NICKNAMES[item.id] ?? []).some((n) => n.startsWith(cq))) return true;
  }
  return false;
}
