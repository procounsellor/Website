/**
 * The /api/schoolStudent service — transport, and everything about a student.
 *
 * Two behaviours of this backend are load-bearing, and both are invisible until
 * they bite:
 *
 *  1. **It content-negotiates, and its default is XML.** Without
 *     `Accept: application/json`, `getAllGames` answers
 *     `<List><item><gameId>…`, which is neither JSON nor an error — the page
 *     just renders empty. Every request here sends the header.
 *
 *  2. **"Nothing here" arrives as an HTTP 500.** A date with no game scheduled,
 *     and a student with no session yet, both answer 500 with a body of
 *     `{ success: false, message: "…" }`. Verified against the live service.
 *     So the body is read before the status line: that envelope means "no
 *     data", whatever the status says, and only a non-2xx WITHOUT the envelope
 *     is a real fault. Trusting the status code here would paint an ordinary
 *     quiet Saturday as an outage.
 *
 *  3. **`lastActiveDate` is a Firestore Timestamp, not a string.** PATCHing a
 *     string into it does not fail cleanly — it writes, and from then on EVERY
 *     read of that document 500s with "Failed to convert value of type
 *     java.lang.String to Timestamp", which also takes down
 *     `getAllSchoolStudents` for every other student. That is why
 *     `updateSchoolStudent` has a hard allowlist and cannot be handed an
 *     arbitrary partial record.
 *
 * These routes are open — no JWT, no user scoping — which is why this file has
 * its own small transport instead of going through the authenticated client.
 */

import { API_CONFIG } from '@/api/config';

const ROOT = `${API_CONFIG.baseUrl}/api/schoolStudent`;

type Failure = { success?: boolean; message?: string };

const isFailure = (value: unknown): value is Failure =>
  typeof value === 'object' && value !== null && (value as Failure).success === false;

/**
 * In-flight requests and their answers, keyed by path.
 *
 * Two problems this solves, and the second is why the abort-on-unmount pattern
 * was removed from every hook in this app:
 *
 *  - **React runs effects twice in development.** Mount → cleanup → mount. When
 *    cleanup aborted the request, the network tab showed every single call as
 *    `ERR_ABORTED` immediately followed by a successful retry — which reads
 *    exactly like "the API fails the first time and works the second". It was
 *    not the API. Deduping by path means the second mount joins the first
 *    request instead of racing it, so one mount is one network call.
 *  - **Navigating back and forth refetched everything.** The game catalogue does
 *    not change between two clicks of the rail; a short TTL makes that free.
 *
 * A hook that no longer aborts must still ignore a late answer, which every
 * caller here does with a local `ignore` flag. That is the correct shape: the
 * request was still worth finishing and caching, it just must not write into a
 * component that has gone away.
 */
const inflight = new Map<string, Promise<unknown>>();
const cache = new Map<string, { at: number; value: unknown }>();

/** Long enough to cover a mount/unmount/mount, short enough to stay live. */
const TTL_MS = 30_000;

/** Drop cached answers. Called after any write, and by every `reload()`. */
export function invalidateSchoolCache(match?: string): void {
  if (!match) {
    cache.clear();
    // Dropping in-flight entries too is what makes this a usable reset between
    // tests: a request started by one test must not be joined by the next.
    inflight.clear();
    return;
  }
  for (const key of cache.keys()) if (key.includes(match)) cache.delete(key);
}

/** GET a route. Resolves to `null` for the "nothing here" envelope. */
export async function schoolGet<T>(
  path: string,
  options: { fresh?: boolean } = {},
): Promise<T | null> {
  if (options.fresh) {
    cache.delete(path);
    inflight.delete(path);
  } else {
    const hit = cache.get(path);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T | null;

    const pending = inflight.get(path);
    if (pending) return pending as Promise<T | null>;
  }

  const request = fetchOnce<T>(path)
    .then((value) => {
      cache.set(path, { at: Date.now(), value });
      return value;
    })
    .finally(() => {
      inflight.delete(path);
    });

  inflight.set(path, request);
  return request;
}

async function fetchOnce<T>(path: string): Promise<T | null> {
  const response = await fetch(`${ROOT}${path}`, {
    headers: { Accept: 'application/json' },
  });

  const raw = await response.text();

  let data: unknown;
  try {
    data = raw.trim() ? JSON.parse(raw) : null;
  } catch {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    throw new Error('The service answered in an unexpected format.');
  }

  if (data === null || isFailure(data)) {
    if (data === null && !response.ok) throw new Error(`HTTP ${response.status}`);
    return null;
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  return data as T;
}

// ── The student record ────────────────────────────────────────────────────────

/** Firestore timestamps come across as `{ seconds, nanos }`, not as ISO strings. */
export type Stamp = { seconds: number; nanos: number } | null;

/**
 * What the backend holds for a school student.
 *
 * Note `totalPoints` and `currentStreak`: the server DOES own progress for this
 * role. That is newer than AuthStore's comment about this role having no
 * profile endpoint, and it is why the shell hydrates from here rather than
 * trusting what signup persisted months ago.
 *
 * `pyschometricReportPdfLink` is spelled that way on the backend (the typo is
 * theirs); a non-null value is the only reliable signal that a student has
 * finished the psychometric test.
 */
export type SchoolStudent = {
  schoolStudentId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  schoolId: string | null;
  schoolName: string | null;
  className: string | null;
  /** Present since 2026-08-30; null for records created before it existed. */
  state: string | null;
  role: string;
  pyschometricReportPdfLink: string | null;
  totalPoints: number;
  currentStreak: number;
  lastActiveDate: string | null;
  dateCreated: Stamp;
  lastDateAndTimeModified: Stamp;
  lastLoginDateAndTime: Stamp;
  deleted: boolean;
};

export const getSchoolStudent = (schoolStudentId: string, fresh = false) =>
  schoolGet<SchoolStudent>(
    `/getSchoolStudentById?schoolStudentId=${encodeURIComponent(schoolStudentId)}`,
    { fresh },
  );

/**
 * Every student on the programme — what the leaderboard is built from.
 *
 * There is no server-side ranking or paging endpoint, so the ordering is done
 * here. Deleted records are dropped: the backend soft-deletes and still returns
 * them, and a removed student must not hold a rank.
 */
export async function listSchoolStudents(fresh = false): Promise<SchoolStudent[]> {
  const students = await schoolGet<SchoolStudent[]>('/getAllSchoolStudents', { fresh });
  if (!Array.isArray(students)) return [];
  return students.filter((student) => !student.deleted);
}

/**
 * The only fields this app may write.
 *
 * A hard allowlist, not a convenience. `lastActiveDate` is a Firestore
 * Timestamp: PATCHing a string into it succeeds at the HTTP layer and then
 * makes the document permanently unreadable — `getSchoolStudentById` AND
 * `getAllSchoolStudents` both 500 from that point on, so one bad write takes
 * the leaderboard down for every student. `totalPoints` and `currentStreak`
 * deserialize fine but are the server's to move, and are left to it.
 */
const WRITABLE = ['firstName', 'lastName', 'className', 'schoolName', 'state'] as const;

export type WritableField = (typeof WRITABLE)[number];

/**
 * Update the fields a student is allowed to change about themselves.
 *
 * PATCH, the id in the query string, a partial object in the body, and
 * `Content-Type: application/json` — NOT `text/plain`, which the service
 * rejects outright with "Content-Type 'text/plain;charset=UTF-8' is not
 * supported". Only keys in `WRITABLE` are sent, and only strings: anything
 * else is dropped before the request is built.
 *
 * Answers with the full updated record, which callers can use directly.
 */
export async function updateSchoolStudent(
  schoolStudentId: string,
  fields: Partial<Record<WritableField, string>>,
): Promise<SchoolStudent | null> {
  const body: Record<string, string> = {};
  for (const key of WRITABLE) {
    const value = fields[key];
    if (typeof value === 'string' && value.trim()) body[key] = value.trim();
  }

  if (!Object.keys(body).length) return null;

  const response = await fetch(
    `${ROOT}/updateSchoolStudentFields?schoolStudentId=${encodeURIComponent(schoolStudentId)}`,
    {
      method: 'PATCH',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  const raw = await response.text();

  let data: unknown = null;
  try {
    data = raw.trim() ? JSON.parse(raw) : null;
  } catch {
    throw new Error(`We couldn't save that (HTTP ${response.status}).`);
  }

  if (isFailure(data)) {
    throw new Error((data as Failure).message?.trim() || "We couldn't save that.");
  }
  if (!response.ok) throw new Error(`We couldn't save that (HTTP ${response.status}).`);

  // The write invalidates both the student's own row and the list it appears in.
  invalidateSchoolCache('getSchoolStudentById');
  invalidateSchoolCache('getAllSchoolStudents');

  return (data as SchoolStudent) ?? null;
}

/**
 * Save a student's psychometric report.
 *
 * The only endpoint in this service that is authenticated (Bearer JWT) and the
 * only one that takes multipart rather than JSON. Do NOT set Content-Type by
 * hand: the browser has to write it, because it is the only thing that knows
 * the multipart boundary it generated. Setting it manually is the classic way
 * to get a 400 out of a form upload that looks perfectly correct.
 *
 * On success the student's `pyschometricReportPdfLink` is populated, which is
 * what the profile page and the quest state both read.
 */
export async function postPsychometricReport(
  schoolStudentId: string,
  file: File | Blob,
  token: string,
): Promise<SchoolStudent | null> {
  const form = new FormData();
  form.append('schoolStudentId', schoolStudentId);
  form.append('file', file);

  const response = await fetch(`${ROOT}/postPsychometricReport`, {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    body: form,
  });

  const raw = await response.text();

  let data: unknown = null;
  try {
    data = raw.trim() ? JSON.parse(raw) : null;
  } catch {
    throw new Error(`We couldn't save your report (HTTP ${response.status}).`);
  }

  if (isFailure(data)) {
    throw new Error((data as Failure).message?.trim() || "We couldn't save your report.");
  }
  if (!response.ok) throw new Error(`We couldn't save your report (HTTP ${response.status}).`);

  invalidateSchoolCache('getSchoolStudentById');
  invalidateSchoolCache('getAllSchoolStudents');

  return (data as SchoolStudent) ?? null;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

/** yyyy-mm-dd in the student's own timezone — the API keys schedules by date. */
export function today(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/** "10" → 10, "Class 9" → 9, "" → null. Never guesses a grade it cannot read. */
export function parseGrade(className: string | null | undefined): number | null {
  const match = String(className ?? '').match(/\d+/);
  if (!match) return null;
  const grade = Number(match[0]);
  return Number.isFinite(grade) && grade > 0 && grade <= 12 ? grade : null;
}
