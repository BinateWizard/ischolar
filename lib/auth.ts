import { cookies } from 'next/headers';
import { cache } from 'react';

/**
 * Get the current authenticated Firebase user on the server.
 * This reads the Firebase ID token from cookies set by the client.
 * Returns null if no valid token.
 * 
 * Note: Firebase Auth is primarily client-side in this setup.
 * For server-side operations, we verify the token or rely on the userId in the session.
 */
export const getCurrentUser = cache(async () => {
  // Firebase Auth in this app is client-side
  // Server components should not directly call this
  // Instead, use the userId from the profile sync API
  return null;
});

/**
 * Get the current session on the server.
 * Cached per request.
 * 
 * Note: With Firebase client-side auth, server doesn't have direct session access.
 * Use client-side useAuth hook instead.
 */
export const getSession = cache(async () => {
  return null;
});

/**
 * Require authentication - throws if no user.
 * 
 * DEPRECATED: With Firebase client-side auth, use the useAuth hook in client components.
 * Server components should be protected by middleware or accept userId as a parameter.
 */
export async function requireAuth() {
  // This function is deprecated with Firebase client-side auth
  // Redirect to signin should be handled by middleware or client-side
  throw new Error('Use client-side useAuth hook for authentication checks');
}
