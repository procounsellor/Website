import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { academicApi } from "@/api/academic";
import type { ExamApiResponse, CollegeApiResponse, CourseApiResponse, AllCounselor } from "@/types/academic";

export interface SearchResult {
  id: string;
  name: string;
  type: 'exam' | 'college' | 'course' | 'counselor';
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
          const [exams, colleges, courses, counselors] = await Promise.all([
            academicApi.getExams().catch(() => []),
            academicApi.getColleges().catch(() => []),
            academicApi.getCourses().catch(() => []),
            academicApi.getAllCounsellors().catch(() => [])
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

          colleges.forEach((college: CollegeApiResponse) => {
            if (college.collegeName?.toLowerCase().includes(searchLower) ||
                college.collegesLocationCity?.toLowerCase().includes(searchLower) ||
                college.collegesLocationState?.toLowerCase().includes(searchLower) ||
                college.collegeType?.toLowerCase().includes(searchLower)) {
              results.push({
                id: college.collegeId,
                name: college.collegeName,
                type: 'college',
                subtitle: `${college.collegesLocationCity}, ${college.collegesLocationState} • ${college.collegeType}`,
                imageUrl: college.logoUrl,
                url: `/colleges/${college.collegeId}`
              });
            }
          });

          courses.forEach((course: CourseApiResponse) => {
            if (course.courseName?.toLowerCase().includes(searchLower) ||
                course.courseType?.toLowerCase().includes(searchLower) ||
                course.duration?.toLowerCase().includes(searchLower)) {
              results.push({
                id: course.courseId,
                name: course.courseName,
                type: 'course',
                subtitle: `Duration: ${course.duration} • ${course.courseType}`,
                imageUrl: course.coursePhotoUrl,
                url: `/courses/${course.courseId}`
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
                type: 'counselor',
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
