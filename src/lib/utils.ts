import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Encode a counselor ID (phone number) to a URL-safe hash
 */
export function encodeCounselorId(id: string): string {
  if (!id) return '';
  // Use Base64 encoding with URL-safe characters
  const encoded = btoa(id);
  // Make it URL-safe by replacing characters
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a hashed counselor ID back to original ID
 */
export function decodeCounselorId(hash: string): string {
  if (!hash) return '';
  try {
    // Restore Base64 format
    let restored = hash.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (restored.length % 4) {
      restored += '=';
    }
    return atob(restored);
  } catch (error) {
    console.error('Failed to decode counselor ID:', error);
    return '';
  }
}

export function formatAcademicYearLabel(year?: string | number | null, fallback = ''): string {
  if (year === null || year === undefined || year === '') {
    return fallback;
  }

  const normalizedYear = String(year).trim();
  const numericYear = Number(normalizedYear);

  if (!Number.isFinite(numericYear)) {
    return `${normalizedYear} year`;
  }

  const lastTwoDigits = numericYear % 100;
  const lastDigit = numericYear % 10;
  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? 'th'
      : lastDigit === 1
        ? 'st'
        : lastDigit === 2
          ? 'nd'
          : lastDigit === 3
            ? 'rd'
            : 'th';

  return `${normalizedYear}${suffix} year`;
}
