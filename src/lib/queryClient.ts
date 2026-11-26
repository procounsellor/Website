import { QueryClient } from "@tanstack/react-query";

/** The app's single React Query client (shared with the prerender snapshot hook). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // prevents re-fetch flash when switching tabs
      retry: 1, // one retry on failure (not 3)
      staleTime: 60_000, // 1-min default stale time
    },
  },
});
