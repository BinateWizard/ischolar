"use server";

import { prisma } from "@/lib/prisma";

/**
 * Check if a user role should bypass verification
 */
export function shouldBypassVerification(role: string): boolean {
  return ['ADMIN', 'REVIEWER', 'APPROVER'].includes(role);
}

/**
 * Auto-verify staff accounts (ADMIN, REVIEWER, APPROVER)
 */
export async function autoVerifyStaffAccount(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) return;

  if (shouldBypassVerification(profile.role) && profile.verificationStatus !== 'VERIFIED') {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { verificationStatus: 'VERIFIED' }
    });
  }
}

/**
 * Check if current profile needs verification
 */
export async function needsVerification(userId: string): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) return false;

  // Staff roles don't need verification
  if (shouldBypassVerification(profile.role)) {
    return false;
  }

  // Students need verification if status is not VERIFIED
  return profile.verificationStatus !== 'VERIFIED';
}
