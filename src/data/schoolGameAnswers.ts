/**
 * The answer key for the school-programme games.
 *
 * ─── Why this file exists ────────────────────────────────────────────────────
 *
 * `getGameItemById` and `getItemsBySetId` deliberately omit the correct option,
 * and `/api/schoolStudent` has no endpoint that marks an attempt. So a student
 * could play every game on the programme and never be told whether they were
 * right. That is not a game; it is a form.
 *
 * Until the backend can mark an attempt, the marking happens here. Three of the
 * five engines need nothing from this file at all — they carry their own truth:
 *
 *   sudoku_v1     the rules ARE the key (see lib/sudoku)
 *   flag_guess    the answer is in the item's own imageUrl (…/japan.svg)
 *   binary_card_v1 kept below only because "myth" vs "fact" cannot be read off
 *                 anything structural — the explanation has to be read.
 *
 * ─── Why it is written by hand and not generated ─────────────────────────────
 *
 * Every answer below is also derivable from the item's own `explanation`, and a
 * token-overlap heuristic over those explanations was tried first. It resolved
 * 25 of 30 quiz items, left 4 unresolved — and got ONE wrong: itm_q1_09, whose
 * explanation ends "…they do not perform surgery", so the negated option scored
 * highest. A key that is 97% right is worse than no key, because the 3% tells a
 * fourteen-year-old they failed a question they answered correctly.
 *
 * So this table is read and checked by a person, one item at a time, against
 * the live payload. `node scripts/check-school-answer-key.mjs` audits it: it
 * flags every published item with no entry here, every entry whose option id no
 * longer exists on the item, and every entry the heuristic disagrees with.
 * Run it whenever a new set is published.
 *
 * ─── The trade this makes ────────────────────────────────────────────────────
 *
 * The key ships to the browser, so a student who opens devtools can read it.
 * That is a real cost, accepted knowingly: these are 1-5 point practice games,
 * and a game that cannot tell you your score is worth less than one a
 * determined student could cheat at. DELETE THIS FILE the day the backend can
 * mark an attempt — `markMcq` in lib/schoolMarking is the only reader, and it
 * already prefers a server verdict when one is available.
 */

/** itemId → the id of the correct option, exactly as the item spells it. */
export const MCQ_ANSWERS: Record<string, string> = {
  // ── quiz_careers_s1 · "Set 1 — Know Your Careers" ─────────────────────────
  itm_q1_01: 'b', // Architect — "must register with the Council of Architecture"
  itm_q1_02: 'a', // ICAI — "The Institute of Chartered Accountants of India"
  itm_q1_03: 'b', // NEET — "the single qualifying exam for MBBS and BDS"
  itm_q1_04: 'b', // Weather and atmosphere — "not meteors"
  itm_q1_05: 'b', // Interior designer — "plan internal spaces"
  itm_q1_06: 'a', // Mechanical engineering — "machines, engines and moving systems"
  itm_q1_07: 'b', // Life in oceans and seas — "living organisms in seawater"
  itm_q1_08: 'b', // Journalist — "work in the field and newsroom, not a laboratory"
  itm_q1_09: 'b', // Preparing and dispensing medicines (NOT (a) surgery — the
  //                 explanation names surgery only to rule it out)
  itm_q1_10: 'a', // Animator — "use drawing and software to create motion"

  // ── quiz_careers_s2 · "Set 2 — Exams and Entry Routes" ────────────────────
  itm_q2_01: 'b', // JEE Advanced — "must clear JEE Advanced for IIT admission"
  itm_q2_02: 'a', // National Law Universities
  itm_q2_03: 'b', // Architecture — "National Aptitude Test in Architecture"
  itm_q2_04: 'a', // Fashion and design — NIFT
  itm_q2_05: 'a', // DGCA — "Directorate General of Civil Aviation"
  itm_q2_06: 'a', // Science with Biology — "Physics, Chemistry and Biology"
  itm_q2_07: 'a', // Defence services — "Army, Navy and Air Force officer entry"
  itm_q2_08: 'a', // Bar Council of India
  itm_q2_09: 'b', // A bachelor's degree
  itm_q2_10: 'b', // Polytechnic diploma — "can be started after Class 10"

  // ── quiz_careers_s4 · "Set 4 — Who Does What" ─────────────────────────────
  itm_q4_01: 'b', // Auditor
  itm_q4_02: 'c', // Optometrist (NOT the optician the explanation also names)
  itm_q4_03: 'a', // Structural engineer
  itm_q4_04: 'd', // Agronomist
  itm_q4_05: 'b', // Embedded software engineer
  itm_q4_06: 'a', // Advocate
  itm_q4_07: 'c', // Sound engineer
  itm_q4_08: 'd', // News editor
  itm_q4_09: 'b', // Clinical research associate
  itm_q4_10: 'c', // Graphic designer

  // ── mythfact_s1 · "Set 1 — Career Myths" ──────────────────────────────────
  // An explanation opening "True." confirms its statement; the rest refute
  // theirs and are therefore myths.
  itm_mf_01: 'myth',
  itm_mf_02: 'myth',
  itm_mf_03: 'fact', // "True. The title is legally protected in India"
  itm_mf_04: 'myth',
  itm_mf_05: 'myth',
  itm_mf_06: 'fact', // "True. It is the single qualifying exam"
  itm_mf_07: 'myth',
  itm_mf_08: 'myth',
  itm_mf_09: 'fact', // "True. Diploma holders can enter the second year"
  itm_mf_10: 'myth',

  // flags_world needs no entries: `answerFor` reads the country off the item's
  // own imageUrl. Adding them here would be a second source of truth to keep
  // in step with the first.
};

/**
 * itemId → the word, for word_guess_v1.
 *
 * The item gives `length`, `displayPattern` and three hints but never the word.
 * Each entry below was read from those three and then checked back against the
 * pattern — `checkWord` re-checks the same two constraints at runtime, so an
 * entry of the wrong length or shape is caught rather than marking a correct
 * guess wrong.
 */
export const WORD_ANSWERS: Record<string, string> = {
  itm_wg_01: 'ARCHITECT', //  9 · A_______T · "Designs buildings before they are built"
  itm_wg_02: 'SURGEON', //    7 · S______  · "Works in an operating theatre"
  itm_wg_03: 'PILOT', //      5 · P____    · "Licensed by the DGCA in India"
  itm_wg_04: 'ANIMATOR', //   8 · A_______ · "Makes drawings move"
  itm_wg_05: 'GEOLOGIST', //  9 · G_______T · "Studies rocks and the earth's crust"
  itm_wg_06: 'ECOLOGIST', //  9 · E_______T · "Studies how living things affect each other"
  itm_wg_07: 'PARAMEDIC', //  9 · P_______C · "First to reach an emergency"
  itm_wg_08: 'ECONOMIST', //  9 · E_______T · "Studies how money moves through a country"
  itm_wg_09: 'PHARMACIST', // 10 · P________T · "Prepares and dispenses medicines"
  itm_wg_10: 'JOURNALIST', // 10 · J________T · "Finds and reports news"
  itm_wg_11: 'AGRONOMIST', // 10 · A________T · "Works on soil, seeds and yields"
};
