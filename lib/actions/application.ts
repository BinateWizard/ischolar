"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitApplication(userId: string, data: {
  programCycleId: string;
  gwa: number;
  yearLevel: string;
  course: string;
  campus: string;
  householdIncome?: string;
}) {
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Get the user's profile
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw new Error("Profile not found. Please complete your profile first.");
  }

  // Check if user already has an application for this program cycle
  const existingApplication = await prisma.application.findFirst({
    where: {
      studentId: profile.id,
      programCycleId: data.programCycleId
    }
  });

  if (existingApplication) {
    throw new Error("You have already submitted an application for this scholarship.");
  }

  // Create the application
  const application = await prisma.application.create({
    data: {
      studentId: profile.id,
      programCycleId: data.programCycleId,
      status: "SUBMITTED",
      answers: {
        gwa: data.gwa,
        yearLevel: data.yearLevel,
        course: data.course,
        campus: data.campus,
        householdIncome: data.householdIncome
      },
      submittedAt: new Date(),
    }
  });

  // Update profile with academic information if not already set
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      course: data.course,
      yearLevel: data.yearLevel,
      campus: data.campus,
    }
  });

  revalidatePath('/profile');
  revalidatePath('/status');
  
  return application;
}

export async function getUserApplications(userId: string) {
  if (!userId) {
    return [];
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      applications: {
        include: {
          programCycle: {
            include: {
              program: true
            }
          },
          files: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return profile?.applications || [];
}

export async function uploadApplicationDocument(
  userId: string,
  applicationId: string,
  data: {
    requirementId: string;
    fileUrl: string;
    fileName: string;
  }
) {
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId }
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Verify the application belongs to the user
  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      studentId: profile.id
    }
  });

  if (!application) {
    throw new Error("Application not found");
  }

  // Create the file record
  const file = await prisma.applicationFile.create({
    data: {
      applicationId,
      requirementId: data.requirementId,
      path: data.fileUrl,
      mimeType: "application/pdf", // We'll improve this later
      sizeBytes: BigInt(0), // We'll improve this later
      status: "PENDING"
    }
  });

  revalidatePath(`/status`);
  return file;
}

export async function getAvailablePrograms() {
  const programs = await prisma.programCycle.findMany({
    where: {
      // Get active program cycles
      // You might want to add date filtering here
    },
    include: {
      program: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return programs;
}
