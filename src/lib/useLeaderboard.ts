import { useCallback, useEffect, useMemo, useState } from 'react';
import { listSchoolStudents, type SchoolStudent } from '@/api/schoolStudentApi';

export type Ranked = SchoolStudent & {
  /** 1-based. Equal scores share a rank, and the next rank skips accordingly. */
  rank: number;
  isYou: boolean;
};

export type Scope = 'all' | 'school' | 'class';

/**
 * The leaderboard.
 *
 * There is no ranking endpoint — `getAllSchoolStudents` returns the whole
 * collection and the ordering is done here. Two consequences worth knowing:
 *
 *   - it is a full-collection read, so it is fetched once per mount and the
 *     three scopes are derived from that one response rather than re-fetched;
 *   - ties are real and common while everyone is on zero, so equal scores share
 *     a rank ("joint 4th") instead of being ordered by whatever Firestore
 *     happened to return first. Ordering ties by name would invent a ranking
 *     the data does not support.
 */
export function useLeaderboard(you: string | null) {
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    // See useSchoolStudentRecord for why this ignores rather than aborts.
    let ignore = false;
    setLoading(true);
    setError(null);

    listSchoolStudents(nonce > 0)
      .then((next) => {
        if (ignore) return;
        setStudents(next);
        setLoading(false);
      })
      .catch((cause) => {
        if (ignore) return;
        console.error('Leaderboard failed:', cause);
        setError("We couldn't load the leaderboard. Try again in a moment.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [nonce]);

  const yourRecord = useMemo(
    () => students.find((student) => student.schoolStudentId === you) ?? null,
    [students, you],
  );

  const rank = useCallback(
    (scope: Scope): Ranked[] => {
      const pool = students.filter((student) => {
        if (scope === 'all') return true;
        if (!yourRecord) return true;
        if (scope === 'school') return student.schoolId === yourRecord.schoolId;
        return (
          student.schoolId === yourRecord.schoolId && student.className === yourRecord.className
        );
      });

      const sorted = [...pool].sort(
        (a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0) || (b.currentStreak ?? 0) - (a.currentStreak ?? 0),
      );

      let lastPoints: number | null = null;
      let lastStreak: number | null = null;
      let lastRank = 0;

      return sorted.map((student, index) => {
        const tied = student.totalPoints === lastPoints && student.currentStreak === lastStreak;
        const position = tied ? lastRank : index + 1;
        lastPoints = student.totalPoints;
        lastStreak = student.currentStreak;
        lastRank = position;
        return { ...student, rank: position, isYou: student.schoolStudentId === you };
      });
    },
    [students, yourRecord, you],
  );

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { rank, yourRecord, loading, error, reload, total: students.length };
}

/** A student's display name, never blank. */
export const displayName = (student: SchoolStudent): string =>
  [student.firstName, student.lastName].filter(Boolean).join(' ').trim() || 'A student';

/** Two-letter monogram for the avatar tile. */
export const initials = (student: SchoolStudent): string => {
  const first = student.firstName?.trim()?.[0] ?? '';
  const last = student.lastName?.trim()?.[0] ?? '';
  return (first + last).toUpperCase() || '?';
};
