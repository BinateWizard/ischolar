'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfile(userId: string, data: {
  lastName?: string;
  firstName?: string;
  middleInitial?: string;
  studentNumber?: string;
  campus?: string;
  course?: string;        // added
  yearLevel?: string;     // added
}) {
  if (!userId) throw new Error('Unauthorized');

  const profile = await prisma.profile.update({
    where: { userId },
    data,
  });

  revalidatePath('/profile');
  return profile;
}
