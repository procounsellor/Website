// Repairs "mojibake": UTF-8 text that was decoded as Latin-1 one or more times
// on the way into the backend ("Everyone’s" stored as "EveryoneÃÂ¢ÃÂÃÂs",
// "—" as "â\u0080\u0094"). Shared by the build-time snapshot scripts and the
// browser code that reads the same API, so both show the same, readable text.

const RUN = /[\u0080-\u00ff]{2,}/g;
const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { fatal: true }) : null;

/** Decode one run of U+0080–U+00FF characters as the UTF-8 bytes they really are; unchanged if that isn't valid UTF-8. */
function decodeRun(run) {
  if (!decoder) return run;
  try {
    return decoder.decode(Uint8Array.from(run, (ch) => ch.charCodeAt(0)));
  } catch {
    return run;
  }
}

/**
 * @param {string} text
 * @returns {string}
 */
export function fixMojibake(text) {
  if (typeof text !== "string" || !/[\u00c2-\u00f4][\u0080-\u00bf]/.test(text)) return text;
  let current = text;
  // Each pass undoes one layer of double-encoding; three layers are seen in practice.
  for (let pass = 0; pass < 4; pass++) {
    const next = current.replace(RUN, decodeRun);
    if (next === current) break;
    current = next;
  }
  return current;
}

/**
 * Apply fixMojibake to every string inside a JSON-like value (returns a copy).
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function repairText(value) {
  if (typeof value === "string") return /** @type {T} */ (fixMojibake(value));
  if (Array.isArray(value)) return /** @type {T} */ (value.map((v) => repairText(v)));
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = repairText(v);
    return /** @type {T} */ (out);
  }
  return value;
}
