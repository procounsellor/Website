import { useQuery } from "@tanstack/react-query";
import { academicApi } from '@/api/academic';
import type { Counselor, AllCounselor, CounsellorApiResponse } from '@/types/academic';
import { useAuthStore } from '@/store/AuthStore'; 


function transformCounselorData(apiData: CounsellorApiResponse): Counselor {
  const fullName = `${apiData.firstName} ${apiData.lastName}`;
  const specialization = apiData.languagesKnow.slice(0, 2).join(', ');
  const experience = apiData.experience ? 
    (apiData.experience.includes('year') ? apiData.experience : `${apiData.experience} Yrs`) : 
    'N/A';
  
  const imageUrl = apiData.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6B7280&color=ffffff&size=400`;
  
  return {
    id: apiData.counsellorId,
    name: fullName,
    description: specialization,
    experience: experience,
    imageUrl: imageUrl,
    verified: true,
  };
}

function transformAllCounselorData(apiData: AllCounselor): AllCounselor {
  return {
    counsellorId: apiData.counsellorId,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    photoUrlSmall: apiData.photoUrlSmall || null,
    rating: apiData.rating || 0,
    ratePerYear: apiData.ratePerYear || 0,
    experience: apiData.experience || "0",
    languagesKnow: apiData.languagesKnow || [],
    city: apiData.city || "",
    workingDays: apiData.workingDays || [],
    plan: apiData.plan || null,
    subscriptionMode: apiData.subscriptionMode || null,
    numberOfRatings: apiData.numberOfRatings || "0",
    states: apiData.states || [],
    plusAmount: apiData.plusAmount,
    proAmount: apiData.proAmount,
    eliteAmount: apiData.eliteAmount,
  };
}

export function useCounselors(limit?: number) {

  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);

  const {
    data,
    isLoading: loading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["counselors", "default", { role, userId }],
    queryFn: academicApi.getCounsellors,

    select: (apiData) => {
      let transformedData = apiData.map(transformCounselorData);
      if (role === "counselor" && userId) {
        transformedData = transformedData.filter((c) => c.id !== userId);
      }
      return limit ? transformedData.slice(0, limit) : transformedData;
    },
  });

  const error = isError
    ? (queryError as Error)?.message || "Failed to load counselors."
    : null;

  return { data, loading, error, refetch };
}

export function useAllCounselors(limit?: number) {
  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLoading = useAuthStore((state) => state.loading);

  const token = typeof window !== "undefined" ? localStorage.getItem('jwt') : null;

  console.log('🔍 useAllCounselors - Auth State:', {
    userId,
    role,
    isAuthenticated,
    hasToken: !!token,
    authLoading
  });

  const {
    data,
    isLoading: queryLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["counselors", "all", { isAuthenticated, role, userId }],
    queryFn: async () => {
      const currentUserId = useAuthStore.getState().userId;
      const currentRole = useAuthStore.getState().role;
      const currentIsAuthenticated = useAuthStore.getState().isAuthenticated;
      const currentToken = localStorage.getItem('jwt');

      console.log('🚀 Query Function Executing:', {
        currentUserId,
        currentRole,
        currentIsAuthenticated,
        hasToken: !!currentToken
      });

      if (currentIsAuthenticated && currentRole === 'user' && currentUserId && currentToken) {
        console.log('✅ Calling getLoggedInCounsellors for student:', currentUserId);
        return academicApi.getLoggedInCounsellors(currentUserId, currentToken);
      }
      
      console.log('📋 Calling getLoggedOutCounsellors');
      return academicApi.getLoggedOutCounsellors();
    },
    enabled: !authLoading,
    select: (apiData) => {
      let transformedData = apiData.map(transformAllCounselorData);
      if (role === "counselor" && userId) {
        transformedData = transformedData.filter(
          (c) => c.counsellorId !== userId
        );
      }
      return limit ? transformedData.slice(0, limit) : transformedData;
    },
  });

  const error = isError
    ? (queryError as Error)?.message || "Failed to load counselors."
    : null;

  return { data, loading: authLoading || queryLoading, error, refetch };
}

export function useCounselorById(counsellorId: string) {
  const {
    data: counselor,
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["counselor", counsellorId],
    queryFn: () => academicApi.getCounselorById(counsellorId),

    enabled: !!counsellorId,
  });

  const error = isError
    ? (queryError as Error)?.message || "Failed to load counselor data."
    : !counsellorId && !loading
    ? "Counselor ID is not provided."
    : null;

  return { counselor, loading, error };
}