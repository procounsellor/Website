import { API_CONFIG } from './config';
import type { Appointment, GroupedAppointments, OutOfOfficePayload, CounselorAppointment, CancelAppointmentPayload } from '@/types/appointments';
import type { ApiClient } from '@/types/client';
import type { CounselorProfileData } from '@/types/counselorProfile';
import toast from 'react-hot-toast';

const { baseUrl } = API_CONFIG;
const temp = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NDcwOTg4NjY5IiwiaWF0IjoxNzUxNjYwNDE4LCJleHAiOjE3ODMxOTY0MTh9.MtEeXnjSTrh3DFFYc-F6aUO9F8BdH7PgcXPE4uYThu4'

export async function getAllAppointments(counsellorId: string) {
    try {
        const response = await fetch(`${baseUrl}/api/counsellor/getCounsellorUpcomingAppointments?counsellorId=${counsellorId}`, {
            headers: {
                Accept: 'application/json',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NDcwOTg4NjY5IiwiaWF0IjoxNzUxNjYwNDE4LCJleHAiOjE3ODMxOTY0MTh9.MtEeXnjSTrh3DFFYc-F6aUO9F8BdH7PgcXPE4uYThu4'
            }
        })

        if (!response.ok) {
            console.error(response.status, response.statusText)
        }

        const result = await response.json()

        const groupedAppointments:GroupedAppointments = result.reduce((acc: { [x: string]: { [x: string]: Appointment[]; }; }, appt:Appointment) => {
            const date = appt.date;
            const [hour] = appt.startTime.split(":").map(Number);
            const hourKey = hour.toString().padStart(2, "0") + ":00";
            if (!acc[date]) acc[date] = {};
            if (!acc[date][hourKey]) acc[date][hourKey] = [];
            acc[date][hourKey].push(appt);

            return acc;
        }, {} as GroupedAppointments);
        console.log(groupedAppointments)
        return groupedAppointments
    } catch {
        console.log('failed to fetch appointments data')
    }
}


export async function getOutOfOffice(counsellorId: string) {
    try {
        const response = await fetch(`${baseUrl}/api/counsellor/getOutOfOfficeByCounsellor?counsellorId=${counsellorId}`, {
            headers: {
                Accept: 'application/json',
                authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NDcwOTg4NjY5IiwiaWF0IjoxNzUxNjYwNDE4LCJleHAiOjE3ODMxOTY0MTh9.MtEeXnjSTrh3DFFYc-F6aUO9F8BdH7PgcXPE4uYThu4'
            }
        })

        if (!response.ok) {
            console.error(response.status, response.statusText)
        }

        const result = await response.json()
        console.log(result)
        return result.data
    } catch {
        console.log('failed to fetch out of office data')
    }
}

export async function setOutOfOffice(payload: OutOfOfficePayload) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/outOfOffice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${temp}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to set out of office.');
    }

    toast.success(result.message);
    return result;

  } catch (error) {
    console.error("Set Out of Office Error:", error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    throw error;
  }
}

export async function getCounselorAppointments(counsellorId: string): Promise<CounselorAppointment[]> {

  try {
    const response = await fetch(`${baseUrl}/api/counsellor/appointments?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${temp}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    const data: Appointment[] = await response.json();
    return data;

  } catch (error) {
    console.error("Get Counselor Appointments Error:", error);
    throw error;
  }
}

export async function cancelAppointment(payload: CancelAppointmentPayload) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${temp}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to cancel the appointment.');
    }

    toast.success(result.message || 'Appointment cancelled successfully!');
    return result;

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    throw error;
  }
}

export async function getSubscribedClients(counsellorId: string): Promise<ApiClient[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getSubscribedClients?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${temp}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscribed clients');
    }
    
    const data: ApiClient[] = await response.json();
    return data;

  } catch (error) {
    console.error("Get Subscribed Clients Error:", error);
    toast.error("Could not load your clients.");
    return [];
  }
}

export async function getPendingRequests(counsellorId: string): Promise<ApiClient[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getManualSubscriptionRequestByCounsellorId?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${temp}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending requests');
    }
    
    const data: ApiClient[] = await response.json();
    return data;

  } catch (error) {
    console.error("Get Pending Requests Error:", error);
    toast.error("Could not load pending requests.");
    return [];
  }
}

export async function respondToSubscriptionRequest(requestId: string, action: 'completed' | 'rejected') {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/respondToManualSubscriptionRequest?manualSubscriptionRequestId=${requestId}&action=${action}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${temp}`
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Failed to respond to request.`);
    }
    
    return result;

  } catch (error) {
    console.error("Respond to Request Error:", error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    throw error;
  }
}

export async function getCounselorProfileById(counsellorId: string): Promise<CounselorProfileData | null> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getCounsellorById?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${temp}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch counselor profile');
    }
    
    const data: CounselorProfileData = await response.json();
    return data;

  } catch (error) {
    console.error("Get Counselor Profile Error:", error);
    toast.error("Could not load counselor profile.");
    return null;
  }
}