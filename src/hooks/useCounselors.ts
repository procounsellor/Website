import { useState, useEffect } from 'react';
import { academicApi } from '@/api/academic';
import type { Counselor, AllCounselor, CounsellorApiResponse } from '@/types/academic';


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
    states: apiData.states || []
  };
}


export function useCounselors(limit?: number) {
  const [data, setData] = useState<Counselor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiData = await academicApi.getCounsellors();
        const transformedData = apiData.map(transformCounselorData);
        
 
        const finalData = limit ? transformedData.slice(0, limit) : transformedData;
        
        setData(finalData);
      } catch (err) {
        console.error('Error fetching counselors:', err);
        setError('Failed to load counselors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, [limit]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useAllCounselors(limit?: number) {
  const [data, setData] = useState<AllCounselor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiData = await academicApi.getAllCounsellors();
        const transformedData = apiData.map(transformAllCounselorData);
        
        const finalData = limit ? transformedData.slice(0, limit) : transformedData;
        
        setData(finalData);
      } catch (err) {
        console.error('Error fetching all counselors:', err);
        setError('Failed to load counselors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, [limit]);

  return { data, loading, error, refetch: () => window.location.reload() };
}

export function useCounselorById(counsellorId: string) {
  const [counselor, setCounselor] = useState<AllCounselor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!counsellorId) {
        setLoading(false);
        setError("Counselor ID is not provided.");
        return;
    };

    const fetchCounselor = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiData = await academicApi.getCounselorById(counsellorId);
        if (apiData) {
            const transformedData = transformAllCounselorData(apiData);
            setCounselor(transformedData);
        } else {
            setError('Counselor not found.');
        }

      } catch (err) {
        console.error('Error fetching counselor:', err);
        setError('Failed to load counselor data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounselor();
  }, [counsellorId]);

  return { counselor, loading, error };
}
