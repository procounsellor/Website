import { API_CONFIG } from './config'
import { getToken } from '@/lib/tokenManager'

const baseUrl = API_CONFIG.baseUrl

/**
 * Study abroad leads (foreign-student-controller).
 *
 *   POST /api/foreignStudent/createForeignStudent
 *
 * This is the table the admin panel's "Study Abroad Leads" page reads
 * (GET /api/admin/getAllForeignStudents), so a lead has to land here to be
 * worked by the calling desk.
 *
 * IMPORTANT: the endpoint sits outside the backend's public `/api/shared/**`
 * namespace and answers 401 without a JWT — verified against the live API,
 * where an unauthenticated POST is rejected and `/api/shared/createForeignStudent`
 * does not exist. A logged-out visitor on /study-abroad therefore cannot reach
 * it, which is why the page ALSO posts the same enquiry to the public
 * /api/leads/captureLead: that one always records the lead, so nothing is lost
 * while this endpoint is closed.
 *
 * Once the backend allows an anonymous POST (or exposes a `/api/shared` twin),
 * nothing here needs to change — the call already runs on every submission and
 * will simply start succeeding.
 */
export interface ForeignStudentPayload {
  name: string
  /** 10-digit Indian mobile number, digits only. */
  phone: string
  email: string
  /** What the student has completed so far, e.g. "12th", "Bachelor's". */
  qualification: string
  /** One country, or several joined with ", " — the backend stores free text. */
  interestedCountry: string
  /** Four-digit year they want to start, e.g. "2027". */
  startYear: string
}

export async function createForeignStudent(payload: ForeignStudentPayload) {
  const token = getToken()

  const response = await fetch(`${baseUrl}/api/foreignStudent/createForeignStudent`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to create study abroad lead`)
  }

  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
