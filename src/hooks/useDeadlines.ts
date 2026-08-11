import { useQuery } from "@tanstack/react-query";
import { getDeadlines, type EventItem } from "@/api/deadlines";
import { DEADLINES_SNAPSHOT } from "@/data/contentSnapshot";

// The snapshot only ever contains live (non-deleted) deadlines — see
// scripts/generate-content-snapshot.mjs. Seeding the query with it means the
// deadline list renders real rows during the prerender, when the API is blocked.
const SEED = DEADLINES_SNAPSHOT as unknown as EventItem[];

export function useDeadlinesList() {
  return useQuery({
    queryKey: ["revamp-deadlines"],
    queryFn: () => getDeadlines(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: SEED.length ? SEED : undefined,
    initialDataUpdatedAt: 0,
  });
}
