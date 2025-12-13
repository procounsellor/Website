import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { academicApi } from "@/api/academic";
import type { ExamApiResponse, AllCounselor } from "@/types/academic";

export interface SearchResult {
  id: string;
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
  
  setQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  setSearchOpen: (open: boolean) => void;
  clearResults: () => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: "",
      results: [],
      isSearching: false,
      isSearchOpen: false,

      setQuery: (query: string) => set({ query }),

      performSearch: async (query: string) => {
        if (!query.trim()) {
          set({ results: [] });
          return;
        }

        set({ isSearching: true, query });

        try {
          const [exams, counselors] = await Promise.all([
            academicApi.getExams().catch(() => []),
            academicApi.getLoggedOutCounsellors().catch(() => [])
          ]);

          const results: SearchResult[] = [];
          const searchLower = query.toLowerCase();

          exams.forEach((exam: ExamApiResponse) => {
            if (exam.examName?.toLowerCase().includes(searchLower) || 
                exam.examLevel?.toLowerCase().includes(searchLower) ||
                exam.examType?.toLowerCase().includes(searchLower)) {
              results.push({
                id: exam.examId,
                name: exam.examName,
                type: 'exam',
                subtitle: `${exam.examLevel} • ${exam.examType}`,
                imageUrl: exam.iconUrl,
                url: `/exams/${exam.examId}`
              });
            }
          });


          counselors.forEach((counselor: AllCounselor) => {
            const fullName = `${counselor.firstName} ${counselor.lastName}`;
            if (fullName?.toLowerCase().includes(searchLower) ||
                counselor.city?.toLowerCase().includes(searchLower) ||
                counselor.languagesKnow?.some((lang: string) => 
                  lang.toLowerCase().includes(searchLower))) {
              results.push({
                id: counselor.counsellorId,
                name: fullName,
                type: 'counsellor',
                subtitle: `${counselor.city} • ${counselor.languagesKnow?.join(', ')}`,
                imageUrl: counselor.photoUrlSmall || undefined,
                url: `/counselors/${counselor.counsellorId}`
              });
            }
          });

          results.sort((a, b) => {
            const aExact = a.name.toLowerCase() === searchLower ? 1 : 0;
            const bExact = b.name.toLowerCase() === searchLower ? 1 : 0;
            if (aExact !== bExact) return bExact - aExact;
            
            const aStarts = a.name.toLowerCase().startsWith(searchLower) ? 1 : 0;
            const bStarts = b.name.toLowerCase().startsWith(searchLower) ? 1 : 0;
            return bStarts - aStarts;
          });

          set({ results: results.slice(0, 20), isSearching: false });

        } catch (error) {
          console.error('Search error:', error);
          set({ results: [], isSearching: false });
        }
      },

      setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

      clearResults: () => set({ results: [], query: "" })
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => localStorage),
      partialize: () => ({}),
    }
  )
);
