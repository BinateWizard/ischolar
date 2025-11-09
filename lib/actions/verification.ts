"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVerificationStatus() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      verificationDocuments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return profile;
}

export async function uploadVerificationDocument(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  const docType = formData.get("docType") as string;
  const file = formData.get("file") as File;

  if (!file || !docType) {
    throw new Error("Missing required fields");
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed.");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size exceeds 5MB limit");
  }

  // In a real app, you would upload to Supabase Storage or another service
  // For now, we'll store the file info (you'll need to implement actual file upload)
  const fileName = `${profile.id}_${docType}_${Date.now()}_${file.name}`;
  const filePath = `/uploads/verification/${fileName}`;

  // TODO: Implement actual file upload to Supabase Storage
  // const { data: uploadData, error: uploadError } = await supabase.storage
  //   .from('verification-documents')
  //   .upload(filePath, file);

  // Create verification document record
  await prisma.verificationDocument.create({
    data: {
      profileId: profile.id,
      docType,
      fileName: file.name,
      filePath,
      mimeType: file.type,
      fileSize: file.size,
      status: 'PENDING'
    }
  });

  // Update profile status if this is their first document
  if (profile.verificationStatus === 'PENDING_VERIFICATION') {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { verificationStatus: 'UNDER_REVIEW' }
    });

    // Create notification for admins
    const admins = await prisma.profile.findMany({
      where: { role: { in: ['ADMIN', 'REVIEWER'] } }
    });

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'New Verification Submission',
          body: `${profile.firstName} ${profile.lastName} has submitted verification documents for review.`,
          type: 'VERIFICATION_SUBMITTED'
        }
      });
    }
  }

  revalidatePath('/verify-account');
  return { success: true };
}

export async function updateProfileInfo(data: {
  studentNumber: string;
  campus: string;
  course: string;
  yearLevel: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      studentNumber: data.studentNumber,
      campus: data.campus,
      course: data.course,
      yearLevel: data.yearLevel
    }
  });

  revalidatePath('/verify-account');
  revalidatePath('/profile');
  return { success: true };
}

// Admin actions
export async function getVerificationRequests() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!profile || !['ADMIN', 'REVIEWER'].includes(profile.role)) {
    throw new Error("Unauthorized");
  }

  const profiles = await prisma.profile.findMany({
    where: {
      verificationStatus: { in: ['UNDER_REVIEW', 'REJECTED'] }
    },
    include: {
      verificationDocuments: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return profiles;
}

export async function reviewVerificationDocument(
  documentId: string,
  status: 'VALID' | 'INVALID',
  rejectionReason?: string
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  const reviewer = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!reviewer || !['ADMIN', 'REVIEWER'].includes(reviewer.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.verificationDocument.update({
    where: { id: documentId },
    data: {
      status,
      rejectionReason,
      reviewedBy: reviewer.id,
      reviewedAt: new Date()
    }
  });

  revalidatePath('/admin/verifications');
  return { success: true };
}

export async function updateVerificationStatus(
  profileId: string,
  status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED'
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  const reviewer = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (!reviewer || !['ADMIN', 'REVIEWER'].includes(reviewer.role)) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.profile.update({
    where: { id: profileId },
    data: { verificationStatus: status }
  });

  // Send notification to user
  await prisma.notification.create({
    data: {
      userId: profileId,
      title: `Account ${status}`,
      body: status === 'VERIFIED' 
        ? 'Your account has been verified! You can now apply for scholarships.'
        : 'Your verification was rejected. Please check your documents and resubmit.',
      type: 'VERIFICATION_UPDATE'
    }
  });

  // Log the action
  await prisma.auditLog.create({
    data: {
      actorId: reviewer.id,
      action: 'VERIFICATION_STATUS_CHANGE',
      subject: `profile:${profileId}`,
      details: { newStatus: status }
    }
  });

  revalidatePath('/admin/verifications');
  return { success: true };
}
