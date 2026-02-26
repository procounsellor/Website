import { API_CONFIG } from './config';
import type { Appointment, GroupedAppointments, OutOfOfficePayload, CounselorAppointment, CancelAppointmentPayload, CounselorAppointmentDetails, OutOfOffice } from '@/types/appointments';
import type { ApiClient, ApiPendingRequest } from '@/types/client';
import type { CounselorProfileData } from '@/types/counselorProfile';
import type { EarningsData, Transaction } from '@/types/earnings';
import toast from 'react-hot-toast';
import type { ApiReviewReceived } from '@/types/counselorDashboard';

const { baseUrl } = API_CONFIG;

export async function getAllAppointments(counsellorId: string, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getCounsellorUpcomingAppointments?counsellorId=${counsellorId}`, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      console.error(response.status, response.statusText)
    }

    const result = await response.json()

    const groupedAppointments: GroupedAppointments = result.reduce((acc: { [x: string]: { [x: string]: Appointment[]; }; }, appt: Appointment) => {
      const date = appt.date;
      const [hour] = appt.startTime.split(":").map(Number);
      const hourKey = hour.toString().padStart(2, "0") + ":00";
      if (!acc[date]) acc[date] = {};
      if (!acc[date][hourKey]) acc[date][hourKey] = [];
      acc[date][hourKey].push(appt);

      return acc;
    }, {} as GroupedAppointments);
    return groupedAppointments
  } catch {
    console.log('failed to fetch appointments data')
  }
}


export async function getOutOfOffice(counsellorId: string, token: string): Promise<OutOfOffice[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getOutOfOfficeByCounsellor?counsellorId=${counsellorId}`, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      console.error(response.status, response.statusText)
    }

    const result = await response.json()
    return result.data;
  } catch {
    console.log('failed to fetch out of office data')
    return [];
  }
}

export async function setOutOfOffice(payload: OutOfOfficePayload, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/outOfOffice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${token}`
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
    // toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    throw error;
  }
}

export interface UpdateOutOfOfficePayload {
  id: string;
  counsellorId: string;
  reason: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export async function updateOutOfOffice(payload: UpdateOutOfOfficePayload, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/updateOutOfOffice`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to update out of office.');
    }

    return result;

  } catch (error) {
    console.error("Update Out of Office Error:", error);
    throw error;
  }
}

export async function deleteOutOfOffice(counsellorId: string, oooId: string, token: string) {
  try {
    const response = await fetch(
      `${baseUrl}/api/counsellor/deleteOutOfOfficeRequest?counsellorId=${counsellorId}&oooId=${oooId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || "Failed to delete out of office.");
    }

    return result;
  } catch (error) {
    console.error("Delete Out of Office Error:", error);
    throw error;
  }
}

export async function getCounselorAppointments(counsellorId: string, token: string): Promise<CounselorAppointment[]> {

  try {
    const response = await fetch(`${baseUrl}/api/counsellor/appointments?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
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

export async function cancelAppointment(payload: CancelAppointmentPayload, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      throw new Error(result.message || 'Failed to cancel the appointment.');
    }

    return result;

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    throw error;
  }
}

export async function getSubscribedClients(counsellorId: string, token: string): Promise<ApiClient[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getSubscribedClients?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscribed clients');
    }

    const responseText = await response.text();
    // Safely handle non-JSON text response
    if (responseText.toLowerCase().includes("no clients")) {
      return [];
    }

    const data: ApiClient[] = JSON.parse(responseText);
    return data;

  } catch (error) {
    console.error("Get Subscribed Clients Error:", error);
    toast.error("Could not load your clients.");
    return [];
  }
}

export async function getPendingRequests(counsellorId: string, token: string): Promise<ApiPendingRequest[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getManualSubscriptionRequestByCounsellorId?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending requests');
    }

    const responseText = await response.text();
    if (responseText.toLowerCase().includes("no clients") || responseText.toLowerCase().includes("no requests")) {
      return [];
    }

    const data: ApiPendingRequest[] = JSON.parse(responseText);
    return data;

  } catch (error) {
    console.error("Get Pending Requests Error:", error);
    toast.error("Could not load pending requests.");
    return [];
  }
}

export async function respondToSubscriptionRequest(requestId: string, action: 'completed' | 'rejected', token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/respondToManualSubscriptionRequest?manualSubscriptionRequestId=${requestId}&action=${action}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
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

export async function getCounselorProfileById(counsellorId: string, token: string): Promise<CounselorProfileData | null> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getCounsellorById?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
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

export async function getEarnings(counsellorId: string, token: string): Promise<EarningsData | null> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/earnings/totalPayout?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch earnings data');
    }

    const data: EarningsData = await response.json();
    return data;

  } catch (error) {
    console.error("Get Earnings Data Error:", error);
    toast.error("Could not load your earnings data.");
    return null;
  }
}

export async function getAllOfflineTransactions(counsellorId: string, token: string): Promise<Transaction[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getAllOfflineTransactionsByCounsellorId?counsellorId=${counsellorId}`, {
      headers: {
        'Accept': 'application/json',
        authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch offline transactions');
    }

    const responseText = await response.text();
    if (!responseText || responseText.toLowerCase().includes("no transactions")) {
      return [];
    }

    const data: Transaction[] = JSON.parse(responseText);
    return data;

  } catch (error) {
    console.error("Get Offline Transactions Error:", error);
    toast.error("Could not load your offline transactions.");
    return [];
  }
}

export async function getReviewsForCounselor(counsellorId: string, token: string): Promise<ApiReviewReceived[]> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getAllReviewsReceivedByCounsellor?counsellorId=${counsellorId}`, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    const responseText = await response.text();
    if (responseText.includes("No reviews")) {
      return [];
    }
    const data: ApiReviewReceived[] = JSON.parse(responseText);
    return data;

  } catch (error) {
    console.error("Get Counselor Reviews Error:", error);
    toast.error("Could not load your reviews.");
    return [];
  }
}

export async function updateCounselorProfile(counsellorId: string, payload: Partial<CounselorProfileData>, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/updateCounsellor?counsellorId=${counsellorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update profile.');
    }

    toast.success('Profile updated successfully!');
    return result;

  } catch (error) {
    console.error("Update Counselor Profile Error:", error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    throw error;
  }
}

export async function uploadCounselorPhoto(counsellorId: string, photoFile: File, token: string) {
  const formData = new FormData();
  formData.append('photo', photoFile);

  try {
    const response = await fetch(`${baseUrl}/api/counsellor/uploadPhoto?counsellorId=${counsellorId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload photo.');
    }

    toast.success('Profile photo updated successfully!');
    return result;

  } catch (error) {
    console.error("Upload Counselor Photo Error:", error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    throw error;
  }
}

export async function getCounselorAppointmentById(counsellorId: string, appointmentId: string, token: string): Promise<CounselorAppointmentDetails> {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getAppointmentById?counsellorId=${counsellorId}&appointmentId=${appointmentId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Failed to fetch appointment details.');
    }

    return await response.json();

  } catch (error) {
    console.error('Get Counselor Appointment By ID Error:', error);
    throw error;
  }
}




export async function getUserById(counsellorId: string, userId: string, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getUserById?counsellorId=${counsellorId}&userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Get User By ID Error:', error);
    toast.error('Could not load user details.');
    throw error;
  }
}

export async function getAllAppointmentsForSpecificUser(counsellorId: string, userId: string, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/getAllAppointmentsForSpecificUser?counsellorId=${counsellorId}&userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user appointments');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Get User Appointments Error:', error);
    toast.error('Could not load user appointments.');
    return [];
  }
}

export async function addNoteToSpecificUser(counsellorId: string, userId: string, noteText: string, token: string) {
  try {
    const response = await fetch(`${baseUrl}/api/counsellor/addNoteToSpecificUser`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        counsellorId,
        userId,
        noteText
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save note');
    }

    const result = await response.json();
    toast.success('Note saved successfully!');
    return result;

  } catch (error) {
    console.error('Add Note Error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to save note.');
    throw error;
  }
}

// export async function getCoursesByCourseId(counsellorId:string){
//   const response = await fetch(`${baseUrl}/`)

// }