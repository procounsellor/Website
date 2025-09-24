import { API_CONFIG } from './config';
import type { Appointment } from '@/types/appointment';

const { baseUrl } = API_CONFIG;

export async function getUserAppointments(userId: string, token: string): Promise<Appointment[]> {
  try {
    const response = await fetch(`${baseUrl}/api/user/getUserAllAppointments?userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: Failed to fetch appointments. Details: ${errorBody}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Get User Appointments Error:', error);
    throw error;
  }
}

export async function getUpcomingAppointments(userId: string, token: string): Promise<Appointment[]> {
  try {
    const response = await fetch(`${baseUrl}/api/user/getUpcomingAppointments?userId=${userId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: Failed to fetch upcoming appointments. Details: ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get Upcoming Appointments Error:', error);
    throw error;
  }
}