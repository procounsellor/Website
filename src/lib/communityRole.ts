/**
 * Returns the role string to send with community API calls.
 *
 * ProBuddies whose application is still under review (verified=false) are
 * not yet approved by the platform. The backend rejects community posts
 * from role="proBuddy" when unverified, so we fall back to "user".
 */
export function getCommunityRole(user: { role?: string | null; verified?: boolean } | null | undefined): string {
  if (!user) return 'user';
  if (user.role === 'proBuddy' && user.verified === false) return 'user';
  return user.role || 'user';
}
