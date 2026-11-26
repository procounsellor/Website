import type { User } from '@/types/user'
import { API_CONFIG } from './config'
import { getTrackedSource, isLeadCaptured, markLeadCaptured } from '@/lib/leadSource'
import { formatPredictorRemark, getPredictorSearch } from '@/lib/predictorIntent'
import { formatCounsellingRemark, getCounsellingIntent } from '@/lib/counsellingIntent'

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

class LeadHttpError extends Error {
    readonly status: number
    constructor(status: number) {
        super(`HTTP ${status}: Failed to capture lead`)
        this.status = status
    }
}

async function postLead(payload: CaptureLeadPayload) {
    const response = await fetch(`${baseUrl}${API_CONFIG.endpoints.captureLead}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        throw new LeadHttpError(response.status)
    }

    const text = await response.text()
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

/** A 4xx means the lead itself was refused; retrying the same payload won't help. */
const isRetryable = (error: unknown) =>
    !(error instanceof LeadHttpError && error.status >= 400 && error.status < 500)

const RETRY_DELAYS_MS = [1500, 4000]

/**
 * Send a lead to the CRM.
 *
 * A network error or 5xx (the backend restarting, or down: it was off for two
 * days in Nov 2026 and every lead in that window was lost) is retried twice.
 * If it still fails, the lead is kept on this device and re-sent on the
 * visitor's next page load (flushPendingLeads), then the error is re-thrown so
 * the form can offer the phone number instead.
 */
export async function captureLead(payload: CaptureLeadPayload) {
    let lastError: unknown
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
        try {
            const result = await postLead(payload)
            removePendingLead(payload.phoneNumber)
            return result
        } catch (error) {
            lastError = error
            if (!isRetryable(error) || attempt === RETRY_DELAYS_MS.length) break
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
        }
    }
    console.error('Capture Lead Error:', lastError)
    if (isRetryable(lastError)) savePendingLead(payload)
    throw lastError
}

// ---------------------------------------------------------------------------
// Leads that could not be sent, kept on this device until the backend answers.

const PENDING_KEY = 'pc-pending-leads'
const PENDING_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

type PendingLead = { payload: CaptureLeadPayload; savedAt: number }

function readPending(): PendingLead[] {
    try {
        const raw = localStorage.getItem(PENDING_KEY)
        const list = raw ? (JSON.parse(raw) as PendingLead[]) : []
        return Array.isArray(list) ? list.filter((p) => p?.payload?.phoneNumber) : []
    } catch {
        return []
    }
}

function writePending(list: PendingLead[]) {
    try {
        if (list.length) localStorage.setItem(PENDING_KEY, JSON.stringify(list))
        else localStorage.removeItem(PENDING_KEY)
    } catch {
        // storage blocked (private mode): nothing more we can do on this device
    }
}

function savePendingLead(payload: CaptureLeadPayload) {
    // One entry per phone, newest wins (the backend upserts by phone anyway).
    const others = readPending().filter((p) => p.payload.phoneNumber !== payload.phoneNumber)
    writePending([...others, { payload, savedAt: Date.now() }])
}

function removePendingLead(phone: string) {
    const list = readPending()
    const rest = list.filter((p) => p.payload.phoneNumber !== phone)
    if (rest.length !== list.length) writePending(rest)
}

/**
 * Re-send leads that failed on an earlier visit. Called once per page load;
 * each lead is tried once (no retries), and stays queued if it fails again.
 */
export async function flushPendingLeads(): Promise<void> {
    const now = Date.now()
    const list = readPending().filter((p) => now - p.savedAt < PENDING_MAX_AGE_MS)
    writePending(list)
    for (const { payload } of list) {
        try {
            await postLead(payload)
            removePendingLead(payload.phoneNumber)
            markLeadCaptured(payload.phoneNumber)
            console.log('[ProCounsel] Sent a lead saved from an earlier visit')
        } catch (error) {
            if (!isRetryable(error)) removePendingLead(payload.phoneNumber)
        }
    }
}

/**
 * Fire-and-forget lead capture on login.
 * Builds the payload from the logged-in user + the source tracked on first visit.
 * Deduped per phone number on this device — never throws, never blocks login.
 *
 * The backend upserts by phoneNumber, so pass `{ update: true }` to re-send the
 * lead with richer data (e.g. after onboarding fills in the course, or profile
 * completion fills in the name/email). `extra` fields override the user-derived
 * ones in the payload.
 */
export function captureLeadFromUser(
    user: Partial<User> | null,
    phone: string,
    opts?: { update?: boolean; extra?: Partial<CaptureLeadPayload> }
) {
    try {
        if (!phone) {
            console.warn('[ProCounsel] Lead capture skipped: no phone number')
            return
        }
        if (!opts?.update && isLeadCaptured(phone)) {
            console.log('[ProCounsel] Lead capture skipped: already captured for', phone)
            return
        }

        const { source, landingPage } = getTrackedSource()
        const predictorSearch = getPredictorSearch()
        // Which category counselling page they clicked "Get counselling" on, if
        // any. This is the strongest statement of intent we have — they told us
        // what they want help with — so it leads the remark.
        const counsellingIntent = getCounsellingIntent()

        const payload: CaptureLeadPayload = {
            phoneNumber: phone,
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            source,
            interestedCourseName: user?.interestedCourse || '',
            interestedStates: user?.userInterestedStateOfCounsellors || [],
            remarks: [
                counsellingIntent ? formatCounsellingRemark(counsellingIntent) : 'Website login',
                `Landing page: ${landingPage}`,
                predictorSearch ? formatPredictorRemark(predictorSearch) : '',
            ]
                .filter(Boolean)
                .join('. ')
        }

        // A stated counselling category is a better course signal than anything
        // on the user record, but opts.extra below still wins.
        if (counsellingIntent) {
            payload.interestedCourseName = counsellingIntent.name
        }

        // The exam they last ran a predictor for is a stronger signal of intent
        // than anything on the user record, but never overrides opts.extra below.
        if (predictorSearch) {
            payload.interestedExamName = predictorSearch.exam
        }

        // Richer data (from onboarding / profile completion) wins over store values
        if (opts?.extra) {
            const cleaned = Object.fromEntries(
                Object.entries(opts.extra).filter(
                    ([, value]) => value !== undefined && value !== null && value !== ''
                )
            ) as Partial<CaptureLeadPayload>
            Object.assign(payload, cleaned)
        }

        console.log(`[ProCounsel] ${opts?.update ? 'Updating' : 'Capturing'} lead:`, payload)

        captureLead(payload)
            .then((response) => {
                markLeadCaptured(phone)
                console.log('[ProCounsel] Lead capture response:', response)
            })
            .catch((err) => {
                // log loudly but never affect login
                console.error('[ProCounsel] Lead capture FAILED:', err)
            })
    } catch (err) {
        console.error('[ProCounsel] Lead capture error:', err)
    }
}

/**
 * The course an SSC (school) student is filed under in the CRM.
 *
 * The backend's own course list already ships this tile as
 * `SSC (8th/9th/10th)`; the lead desk filters on short names, so the lead
 * carries the short one and the class goes in the remark.
 */
export const SSC_COURSE_NAME = 'SSC'

export interface SchoolStudentLead {
    phoneNumber: string
    firstName?: string
    lastName?: string
    school?: string
    className?: string
}

/**
 * Capture an SSC student as a lead.
 *
 * School students never reach the normal login capture: `verifyOtp` answers
 * `role: "schoolStudent"` and returns before it, and signup deletes their
 * `users` row, so there is no profile for `captureLeadFromUser` to read. They
 * were therefore the one role the CRM never saw — which is the opposite of what
 * they are worth, since an 8th/9th/10th student is a multi-year relationship.
 *
 * Everything the normal path gives a lead (first-touch source, landing page,
 * per-phone dedupe) still applies; only the course and the remark differ.
 */
export function captureSchoolStudentLead(
    lead: SchoolStudentLead,
    opts?: { update?: boolean }
) {
    const phone = lead.phoneNumber?.trim()
    if (!phone) {
        console.warn('[ProCounsel] SSC lead capture skipped: no phone number')
        return
    }

    const { landingPage } = getTrackedSource()
    const remarks = [
        `${SSC_COURSE_NAME} student`,
        lead.className ? `Class: ${lead.className}` : '',
        lead.school ? `School: ${lead.school}` : '',
        `Landing page: ${landingPage}`,
    ]
        .filter(Boolean)
        .join('. ')

    captureLeadFromUser(
        { firstName: lead.firstName, lastName: lead.lastName } as Partial<User>,
        phone,
        {
            update: opts?.update,
            extra: {
                interestedCourseName: SSC_COURSE_NAME,
                remarks,
            },
        }
    )
}
