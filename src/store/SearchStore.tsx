import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { academicApi } from "@/api/academic";
import {
  getAllCounsellorCoursesForGuest,
  getAllCounsellorCoursesForUser,
} from "@/api/course";
import {
  getAllTestGroupsForGuest,
  getAllTestGroupsForLoggedInUser,
} from "@/api/testGroup";

export interface SearchResult {
  id: string;
  name: string;
  type: 'exam' | 'counsellor' | 'course' | 'test';
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

          const userId = localStorage.getItem("phone") || "";
          const token = localStorage.getItem("jwt") || "";
          const isAuthenticated = Boolean(userId && token);

          const [examsResponse, counselorsResponse, coursesResponse, testsResponse] = await Promise.all([
            academicApi.searchExams({search: query}).catch((err) => {
                console.error("Exam search failed", err);
                return { exams: [] };
            }),
            academicApi.searchAllLoggedOutCounsellors({ search: query }).catch((err) => {
                console.error("Counselor search failed", err);
                return { counsellors: [] };
            }),
            (isAuthenticated
              ? getAllCounsellorCoursesForUser(userId)
              : getAllCounsellorCoursesForGuest()
            ).catch((err) => {
              console.error("Course search failed", err);
              return { data: [] };
            }),
            (isAuthenticated
              ? getAllTestGroupsForLoggedInUser(userId)
              : getAllTestGroupsForGuest()
            ).catch((err) => {
              console.error("Test search failed", err);
              return { testGroups: [] };
            }),
          ]);

          const results: SearchResult[] = [];

          if (examsResponse?.exams && Array.isArray(examsResponse.exams)) {
            examsResponse.exams.forEach((exam: any) => { 
              results.push({
                id: exam.examId,
                name: exam.examName,
                type: 'exam',
                subtitle: `${exam.examLevel} • ${exam.examType}`,
                imageUrl: exam.iconUrl,
                url: `/exams/${exam.examId}`
              });
            });
          }

          if (counselorsResponse?.counsellors && Array.isArray(counselorsResponse.counsellors)) {
            counselorsResponse.counsellors.forEach((counselor: any) => {
              const fullName = `${counselor.firstName} ${counselor.lastName}`;
              results.push({
                id: counselor.counsellorId,
                name: fullName,
                type: 'counsellor',
                subtitle: `${counselor.city} • ${counselor.languagesKnow?.join(', ')}`,
                imageUrl: counselor.photoUrlSmall || undefined,
                url: `/counselors/${counselor.counsellorId}`
              });
            });
          }

          const coursesList = Array.isArray(coursesResponse?.data)
            ? coursesResponse.data
            : Array.isArray(coursesResponse)
              ? coursesResponse
              : [];

          coursesList.forEach((course: any) => {
            const courseName = String(course?.courseName ?? "");
            if (!courseName) return;

            const subtitleParts = [course?.category, course?.counsellorName].filter(Boolean);
            results.push({
              id: String(course?.courseId ?? ""),
              name: courseName,
              type: "course",
              subtitle: subtitleParts.join(" • "),
              imageUrl: course?.courseThumbnailUrl || undefined,
              url: `/courses/detail/${course?.courseId}/user`,
            });
          });

          const testsList = Array.isArray(testsResponse)
            ? testsResponse
            : Array.isArray(testsResponse?.data)
              ? testsResponse.data
              : Array.isArray(testsResponse?.testGroups)
                ? testsResponse.testGroups
                : [];

          testsList.forEach((item: any) => {
            const tg = item?.testGroup ?? item;
            const testGroupId = String(tg?.testGroupId ?? item?.testGroupId ?? "");
            const testName = String(tg?.testGroupName ?? item?.testGroupName ?? "");
            if (!testGroupId || !testName) return;

            results.push({
              id: testGroupId,
              name: testName,
              type: "test",
              subtitle: String(tg?.priceType ?? item?.priceType ?? "").toUpperCase() === "FREE"
                ? "Free"
                : `₹${Number(tg?.price ?? item?.price ?? 0).toLocaleString("en-IN")}`,
              imageUrl: tg?.bannerImagUrl || tg?.bannerImageUrl || item?.bannerImagUrl || item?.bannerImageUrl || undefined,
              url: `/courses/test-group/${testGroupId}`,
            });
          });

          const searchLower = query.toLowerCase();
          const dedupedResults = results.filter((result, index, array) => {
            return array.findIndex((candidate) => candidate.type === result.type && candidate.id === result.id) === index;
          }).filter((result) => {
            return (
              result.name.toLowerCase().includes(searchLower) ||
              (result.subtitle || "").toLowerCase().includes(searchLower)
            );
          });

          dedupedResults.sort((a, b) => {
             const aExact = a.name.toLowerCase() === searchLower ? 1 : 0;
             const bExact = b.name.toLowerCase() === searchLower ? 1 : 0;
             if (aExact !== bExact) return bExact - aExact;
             
             const aStarts = a.name.toLowerCase().startsWith(searchLower) ? 1 : 0;
             const bStarts = b.name.toLowerCase().startsWith(searchLower) ? 1 : 0;
             return bStarts - aStarts;
          });

          set({ results: dedupedResults, isSearching: false });

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