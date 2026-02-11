import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { academicApi } from "@/api/academic";

export interface SearchResult {
  id: string;
  originalId: string;
  name: string;
  type: 'exam' | 'counsellor';
  subtitle?: string; 
  imageUrl?: string;
  description?: string;
  url: string; 
}

type SearchState = {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  isSearchOpen: boolean;
  searchRequestId: number;
  
  setQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  setSearchOpen: (open: boolean) => void;
  clearResults: () => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: "",
      results: [],
      isSearching: false,
      isSearchOpen: false,
      searchRequestId: 0,

      setQuery: (query: string) => set({ query }),

      performSearch: async (query: string) => {
        if (!query.trim()) {
          set({ results: [], isSearching: false });
          return;
        }

        const currentRequestId = Date.now();

        set({ 
          isSearching: true, 
          query, 
          results: [], 
          searchRequestId: currentRequestId 
        });

        const handleIncomingResults = (newResults: SearchResult[]) => {
          const state = get();
          if (state.searchRequestId !== currentRequestId) return;

          set((state) => {
            const existingIds = new Set(state.results.map(r => r.id));
            const uniqueNewResults = newResults.filter(r => !existingIds.has(r.id));

            return {
              results: [...state.results, ...uniqueNewResults],
            };
          });
        };
        
        const examsPromise = academicApi.searchExams({ search: query })
          .then((examsResponse) => {
            if (get().searchRequestId !== currentRequestId) return;
            if (examsResponse?.exams) {
              const formatted: SearchResult[] = examsResponse.exams.map((exam: any) => ({
                id: `exam-${exam.examId}`,
                originalId: exam.examId,
                name: exam.examName,
                type: 'exam',
                subtitle: `${exam.examLevel} • ${exam.examType}`,
                imageUrl: exam.iconUrl,
                url: `/exams/${exam.examId}`
              }));
              handleIncomingResults(formatted);
            }
          })
          .catch(err => console.error("Exam search failed", err));

        const counselorsPromise = academicApi.searchAllLoggedOutCounsellors({ search: query })
          .then((counselorsResponse) => {
            if (get().searchRequestId !== currentRequestId) return;
            if (counselorsResponse?.counsellors) {
              const formatted: SearchResult[] = counselorsResponse.counsellors.map((counselor: any) => {
                const fullName = `${counselor.firstName} ${counselor.lastName}`;
                return {
                  id: `counsellor-${counselor.counsellorId}`,
                  originalId: counselor.counsellorId,
                  name: fullName,
                  type: 'counsellor',
                  subtitle: `${counselor.city} • ${counselor.languagesKnow?.join(', ')}`,
                  imageUrl: counselor.photoUrlSmall || undefined,
                  url: `/counselors/${counselor.counsellorId}`
                };
              });
              handleIncomingResults(formatted);
            }
          })
          .catch(err => console.error("Counselor search failed", err));

        Promise.allSettled([examsPromise, counselorsPromise]).then(() => {
            if (get().searchRequestId === currentRequestId) {
                set({ isSearching: false });
            }
        });
      },

      setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),
      clearResults: () => set({ results: [], query: "", isSearching: false })
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (_state) => ({ }), 
    }
  )
);