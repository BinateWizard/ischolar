'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Get or create a Profile for the current user.
 * Called after sign-up or sign-in to ensure Prisma DB has a profile record.
 */
export async function syncUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Check if profile exists
  let profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    // Create profile from Supabase user metadata
    const lastName = user.user_metadata?.last_name || '';
    const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'User';
    const middleInitial = user.user_metadata?.middle_initial || null;
    
    profile = await prisma.profile.create({
      data: {
        userId: user.id,
        email: user.email!,
        lastName,
        firstName,
        middleInitial,
      },
    });
  }

  return profile;
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(data: {
  lastName?: string;
  firstName?: string;
  middleInitial?: string;
  studentNumber?: string;
  campus?: string;
  course?: string;
  yearLevel?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const profile = await prisma.profile.update({
    where: { userId: user.id },
    data,
  });

  revalidatePath('/profile');
  return profile;
}

/**
 * Get current user's profile with applications.
 */
export async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      applications: {
        include: {
          programCycle: {
            include: {
              program: true,
            },
          },
          files: {
            include: {
              requirement: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      notifications: {
        where: { isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  return profile;
}
