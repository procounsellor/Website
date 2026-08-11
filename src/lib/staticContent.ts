// Same-origin fallbacks for API-backed detail pages.
//
// The Cloud Run backend scales to zero, so the first request after an idle
// period can 503 or hang — and it is blocked entirely during the build-time
// prerender. When that happens these pages used to collapse to a bare
// "College not found" / "Could not load this deadline", which is exactly what
// the AdSense reviewer saw. scripts/generate-content-snapshot.mjs writes a
// static copy of every published college and live deadline to public/data/,
// served from our own CDN, so there is always something real to render.

async function fetchStatic<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Runs `primary` (the live API) and falls back to the build-time static copy.
 * Returns null only when both are unavailable *and* the item genuinely has no
 * snapshot — i.e. a real 404 rather than a backend hiccup.
 */
export async function withStaticFallback<T>(
  primary: () => Promise<T>,
  staticPath: string,
): Promise<T | null> {
  try {
    const result = await primary();
    if (result) return result;
  } catch {
    // fall through to the static copy
  }
  return fetchStatic<T>(staticPath);
}

export function collegeStaticPath(id: string) {
  return `/data/colleges/${encodeURIComponent(id)}.json`;
}

export function deadlineStaticPath(id: string) {
  return `/data/deadlines/${encodeURIComponent(id)}.json`;
}
