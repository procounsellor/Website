import { API_CONFIG } from './config';
import type { Appointment, GroupedAppointments } from '@/types/appointments';

const { baseUrl } = API_CONFIG;


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



