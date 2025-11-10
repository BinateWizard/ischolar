'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Update a user's profile by userId (Firebase UID).
 * Used by client components that have access to Firebase auth.
 */
export async function updateProfile(userId: string, data: {
  lastName?: string;
  firstName?: string;
  middleInitial?: string;
  studentNumber?: string;
  campus?: string;
  course?: string;
  yearLevel?: string;
}) {
  if (!userId) throw new Error('Unauthorized');

  const profile = await prisma.profile.update({
    where: { userId },
    data,
  });

  revalidatePath('/profile');
  return profile;
}

/**
 * Get user profile with applications by userId (Firebase UID).
 * Called from client components that have Firebase auth context.
 */
export async function getUserProfile(userId: string) {
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId },
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
