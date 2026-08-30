import { useCallback, useEffect, useState } from 'react';
import { getSchoolStudent, type SchoolStudent } from '@/api/schoolStudentApi';

/**
 * The student's own record, re-read on every mount.
 *
 * A school student stays signed in for months, so the profile persisted at
 * signup goes stale: their class rolls over, their points move, their
 * psychometric report appears. Branching the UI on the persisted copy is how a
 * dashboard starts quietly lying, which is why the shell reads this instead and
 * treats what signup stored as a fallback only.
 *
 * `record: null` with no error means the backend has no row for this phone —
 * an ordinary state for an account created before the collection existed, and
 * not something to show an error for.
 */
export function useSchoolStudentRecord(phone: string | null) {
  const [record, setRecord] = useState<SchoolStudent | null>(null);
  const [loading, setLoading] = useState(Boolean(phone));
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!phone) {
      setRecord(null);
      setLoading(false);
      return;
    }

    // No AbortController: cancelling on cleanup made React's development
    // double-mount look like "the API failed, then worked on retry". The
    // request is still worth finishing and caching — it just must not write
    // into a component that has gone away.
    let ignore = false;
    setLoading(true);
    setError(null);

    getSchoolStudent(phone, nonce > 0)
      .then((next) => {
        if (ignore) return;
        setRecord(next);
        setLoading(false);
      })
      .catch((cause) => {
        if (ignore) return;
        console.error('School student profile failed:', cause);
        setError("We couldn't load your profile just now.");
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [phone, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { record, loading, error, reload, setRecord };
}
