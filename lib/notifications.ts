import { prisma } from './prisma';

type NotificationType = 
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_DENIED'
  | 'VERIFICATION_PENDING'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'DOCUMENT_REQUIRED'
  | 'THRESHOLD_WARNING'
  | 'SYSTEM_ALERT'
  | 'REMINDER';

interface CreateNotificationParams {
  userId: string;
  title: string;
  body?: string;
  type: NotificationType;
  actionUrl?: string;
  relatedId?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

/**
 * Create a notification for a specific user
 */
export async function createNotification(params: CreateNotificationParams) {
  return await prisma.notification.create({
    data: {
      userId: params.userId,
      title: params.title,
      body: params.body,
      type: params.type,
      actionUrl: params.actionUrl,
      relatedId: params.relatedId,
      priority: params.priority || 'NORMAL',
    },
  });
}

/**
 * Notify all admins, reviewers, and approvers
 */
export async function notifyAdmins(params: Omit<CreateNotificationParams, 'userId'>) {
  const admins = await prisma.profile.findMany({
    where: {
      role: {
        in: ['ADMIN', 'REVIEWER', 'APPROVER'],
      },
    },
    select: { id: true },
  });

  const notifications = admins.map((admin) => ({
    userId: admin.id,
    title: params.title,
    body: params.body,
    type: params.type,
    actionUrl: params.actionUrl,
    relatedId: params.relatedId,
    priority: params.priority || 'NORMAL',
  }));

  return await prisma.notification.createMany({
    data: notifications,
  });
}

/**
 * Notify a specific user
 */
export async function notifyUser(
  userId: string,
  params: Omit<CreateNotificationParams, 'userId'>
) {
  return await createNotification({
    userId,
    ...params,
  });
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  return await prisma.notification.update({
    where: {
      id: notificationId,
      userId: userId, // Ensure user owns this notification
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string) {
  return await prisma.notification.count({
    where: {
      userId: userId,
      isRead: false,
    },
  });
}

/**
 * Check program cycle thresholds and create alerts
 */
export async function checkThresholds() {
  const cycles = await prisma.programCycle.findMany({
    include: {
      program: true,
      _count: {
        select: {
          applications: {
            where: {
              status: 'APPROVED',
            },
          },
        },
      },
    },
  });

  const alerts = [];

  for (const cycle of cycles) {
    const approvedCount = cycle._count.applications;
    const slotLimit = cycle.maxSlots || 0;
    
    if (slotLimit > 0) {
      const percentage = (approvedCount / slotLimit) * 100;

      // Alert at 80% capacity
      if (percentage >= 80 && percentage < 100) {
        alerts.push({
          title: `⚠️ ${cycle.program.name} - ${cycle.ayTerm} approaching capacity`,
          body: `${approvedCount} out of ${slotLimit} slots filled (${percentage.toFixed(1)}%). Only ${slotLimit - approvedCount} slots remaining.`,
          type: 'THRESHOLD_WARNING' as NotificationType,
          actionUrl: `/admin/programs/${cycle.programId}`,
          relatedId: cycle.id,
          priority: 'HIGH' as const,
        });
      }

      // Alert at 100% capacity
      if (percentage >= 100) {
        alerts.push({
          title: `🔴 ${cycle.program.name} - ${cycle.ayTerm} at full capacity`,
          body: `All ${slotLimit} slots have been filled. Consider increasing the slot limit or closing applications.`,
          type: 'THRESHOLD_WARNING' as NotificationType,
          actionUrl: `/admin/programs/${cycle.programId}`,
          relatedId: cycle.id,
          priority: 'URGENT' as const,
        });
      }
    }
  }

  // Notify admins of all alerts
  for (const alert of alerts) {
    await notifyAdmins(alert);
  }

  return alerts;
}

/**
 * Notify about new application
 */
export async function notifyNewApplication(applicationId: string, applicantName: string) {
  await notifyAdmins({
    title: '📝 New Application Submitted',
    body: `${applicantName} has submitted a new scholarship application.`,
    type: 'APPLICATION_SUBMITTED',
    actionUrl: `/admin/applications/${applicationId}`,
    relatedId: applicationId,
    priority: 'NORMAL',
  });
}

/**
 * Notify applicant about application status change
 */
export async function notifyApplicationStatus(
  userId: string,
  applicationId: string,
  status: string,
  programName: string
) {
  let title = '';
  let body = '';
  let type: NotificationType = 'SYSTEM_ALERT';

  switch (status) {
    case 'APPROVED':
      title = '🎉 Application Approved!';
      body = `Congratulations! Your application for ${programName} has been approved.`;
      type = 'APPLICATION_APPROVED';
      break;
    case 'DENIED':
      title = '❌ Application Denied';
      body = `Your application for ${programName} has been denied. Please check the details for more information.`;
      type = 'APPLICATION_DENIED';
      break;
    case 'IN_VERIFICATION':
      title = '🔍 Application Under Verification';
      body = `Your application for ${programName} is currently being verified.`;
      type = 'VERIFICATION_PENDING';
      break;
    case 'FOR_CLARIFICATION':
      title = '⚠️ Clarification Required';
      body = `Your application for ${programName} requires additional information.`;
      type = 'DOCUMENT_REQUIRED';
      break;
  }

  await notifyUser(userId, {
    title,
    body,
    type,
    actionUrl: `/status`,
    relatedId: applicationId,
    priority: status === 'APPROVED' || status === 'DENIED' ? 'HIGH' : 'NORMAL',
  });
}

/**
 * Notify about verification document status
 */
export async function notifyVerificationStatus(
  userId: string,
  status: 'APPROVED' | 'REJECTED',
  docType: string,
  reason?: string
) {
  const title = status === 'APPROVED' 
    ? '✅ Document Verified' 
    : '❌ Document Rejected';
  
  const body = status === 'APPROVED'
    ? `Your ${docType} has been verified successfully.`
    : `Your ${docType} was rejected. Reason: ${reason || 'Please resubmit a valid document.'}`;

  await notifyUser(userId, {
    title,
    body,
    type: status === 'APPROVED' ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
    actionUrl: '/verify-account',
    priority: 'HIGH',
  });
}
