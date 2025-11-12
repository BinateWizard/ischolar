import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check role
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email }
    });

    // Allow ADMIN, REVIEWER, and APPROVER roles
    if (!profile || !['ADMIN', 'REVIEWER', 'APPROVER'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch dashboard statistics
    const [
      totalUsers,
      totalApplications,
      pendingApplications,
      approvedApplications,
      pendingVerifications,
      activePrograms,
      recentUsers,
      recentApplications
    ] = await Promise.all([
      // Total users
      prisma.profile.count(),

      // Total applications
      prisma.application.count(),

      // Pending applications
      prisma.application.count({
        where: { status: 'SUBMITTED' }
      }),

      // Approved applications
      prisma.application.count({
        where: { status: 'APPROVED' }
      }),

      // Pending verifications
      prisma.profile.count({
        where: { verificationStatus: 'PENDING_VERIFICATION' }
      }),

      // Active programs
      prisma.program.count({
        where: { isActive: true }
      }),

      // Recent users (last 5)
      prisma.profile.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true
        }
      }),

      // Recent applications (last 5)
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          programCycle: {
            include: {
              program: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
    ]);

    // Format recent users
    const formattedRecentUsers = recentUsers.map(user => ({
      id: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    }));

    // Format recent applications
    const formattedRecentApplications = recentApplications.map(app => ({
      id: app.id,
      applicantName: `${app.student.firstName} ${app.student.lastName}`,
      program: app.programCycle.program.name,
      status: app.status,
      createdAt: app.createdAt.toISOString()
    }));

    return NextResponse.json({
      totalUsers,
      totalApplications,
      pendingApplications,
      approvedApplications,
      pendingVerifications,
      activePrograms,
      recentUsers: formattedRecentUsers,
      recentApplications: formattedRecentApplications
    });

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
