import { API_CONFIG } from './config';
import type { CounselorPageInfo } from '@/types/counselor';

const { baseUrl } = API_CONFIG;

export const getCounselorPageInfo = async (): Promise<CounselorPageInfo> => {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor-page/fetch`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch counselor page info.`);
    }

    const result = await response.json();
    if (result && result.points) {
      return result.points;
    } else {
      throw new Error('Invalid API response structure for counselor page info.');
    }

  } catch (error) {
    console.error("Failed to fetch counselor page info:", error);
    throw new Error("Could not load counselor page information. Please try again later.");
  }
};