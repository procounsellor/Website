import { API_CONFIG } from './config'

const baseUrl = API_CONFIG.baseUrl

/**
 * Study abroad leads (foreign-student-controller).
 *
 *   POST /api/foreignStudent/createForeignStudent
 *
 * This is the table the admin panel's "Study Abroad Leads" page reads
 * (GET /api/admin/getAllForeignStudents), and it is the only place a
 * /study-abroad enquiry is written — one submission, one record.
 *
 * **Deliberately sent with no Authorization header.** The whole point of the
 * landing page is that a visitor fills the form and leaves; asking them to log
 * in first costs far more leads than it saves. Sending a token when we happen
 * to have one would be worse than sending none: signed-in enquiries would land
 * here and everyone else's somewhere else, which is the split this replaced.
 *
 * The endpoint answered 401 to an anonymous POST until the backend's auth
 * filter was opened for it (a GET to the path returned 401 too, so it was the
 * filter and not the handler). Until that ships, the caller falls back to the
 * public CRM capture so no enquiry is lost — see StudyAbroadLeadForm.
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
  /**
   * Everything the form asks that has no column of its own — intake, level,
   * field, budget, city, test status. Unknown properties are ignored by the
   * backend's deserializer today, so this is free to send and starts showing
   * up the moment a column exists for it.
   */
  remarks?: string
}

export async function createForeignStudent(payload: ForeignStudentPayload) {
  const response = await fetch(`${baseUrl}/api/foreignStudent/createForeignStudent`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
