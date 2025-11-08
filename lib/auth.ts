import { createSupabaseServerClient } from './supabase/server';
import { cache } from 'react';

/**
 * Get the current authenticated user on the server.
 * Cached per request to avoid multiple calls.
 * Returns null if no session.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Get the current session on the server.
 * Cached per request.
 */
export const getSession = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
});

/**
 * Require authentication - throws if no user.
 * Use in Server Components/Actions that must have auth.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
