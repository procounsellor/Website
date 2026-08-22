import { API_CONFIG } from "./config";
import { getToken } from "@/lib/tokenManager";

const { baseUrl } = API_CONFIG;

/**
 * Saves a student's generated Mettle report so they can open it again later.
 *
 *   POST /api/shared/postPsychometricReport   (multipart)
 *        userId=<phone>  file=<report.pdf>
 *
 * The saved link comes back on the login/profile response as
 * `user.pyschometricReportPdfLink` (the API's own spelling) — read it straight
 * off the store user; a value there means they have already taken the test.
 */
export async function uploadPsychometricReport(userId: string, file: File) {
  const token = getToken();
  const form = new FormData();
  form.append("userId", userId);
  form.append("file", file);

  const response = await fetch(`${baseUrl}/api/shared/postPsychometricReport`, {
    method: "POST",
    // No Content-Type header — the browser must set the multipart boundary.
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });

  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Plain-text response is fine.
  }

  if (!response.ok) {
    const message =
      body && typeof body === "object" && typeof (body as Record<string, unknown>).message === "string"
        ? ((body as Record<string, unknown>).message as string)
        : `Upload failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

/**
 * Saves the report to the student's device.
 *
 * The PDF lives on cloud storage, so a plain `download` attribute is ignored
 * (cross-origin) and the browser just opens it. Pulling the bytes first gives a
 * real save; if the bucket refuses the cross-origin read we open it instead so
 * the button always does something.
 */
export async function downloadReport(link: string, filename = "mettle-career-report.pdf") {
  try {
    const response = await fetch(link);
    if (!response.ok) throw new Error("fetch failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    window.open(link, "_blank", "noopener,noreferrer");
  }
}

