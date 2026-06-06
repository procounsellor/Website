import type { User } from '@/types/user'
import { API_CONFIG } from './config'
import { getTrackedSource, isLeadCaptured, markLeadCaptured } from '@/lib/leadSource'

const baseUrl = API_CONFIG.baseUrl

export interface CaptureLeadPayload {
    phoneNumber: string
    firstName?: string
    lastName?: string
    email?: string
    source?: string // QUORA, INSTAGRAM, TWITTER, GOOGLE, DIRECT, ...
    interestedCourseName?: string
    interestedStates?: string[]
    interestedExamName?: string
    interestedCollegeName?: string
    remarks?: string
}

export async function captureLead(payload: CaptureLeadPayload) {
    try {
        const response = await fetch(`${baseUrl}${API_CONFIG.endpoints.captureLead}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to capture lead`)
        }

        const text = await response.text()
        try {
            return JSON.parse(text)
        } catch {
            return text
        }
    } catch (error) {
        console.error('Capture Lead Error:', error)
        throw (error)
    }
}

/**
 * Fire-and-forget lead capture on login.
 * Builds the payload from the logged-in user + the source tracked on first visit.
 * Deduped per phone number on this device — never throws, never blocks login.
 */
export function captureLeadFromUser(user: Partial<User> | null, phone: string) {
    try {
        if (!phone || isLeadCaptured(phone)) return

        const { source, landingPage } = getTrackedSource()

        const payload: CaptureLeadPayload = {
            phoneNumber: phone,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            source,
            interestedCourseName: user?.interestedCourse || '',
            interestedStates: user?.userInterestedStateOfCounsellors || [],
            remarks: `Website login. Landing page: ${landingPage}`
        }

        captureLead(payload)
            .then(() => {
                markLeadCaptured(phone)
                console.log('[ProCounsel] Lead captured for', phone, 'source:', source)
            })
            .catch(() => { }) // silently ignore — lead capture must never affect login
    } catch {
        // ignore
    }
}
