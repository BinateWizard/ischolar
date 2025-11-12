import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { checkThresholds } from '@/lib/notifications';

export async function POST() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile to check role
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });

    // Only ADMIN can manually trigger threshold checks
    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Run threshold checks
    const alerts = await checkThresholds();

    return NextResponse.json({
      success: true,
      alertsCreated: alerts.length,
      alerts: alerts.map(a => a.title),
    });
  } catch (error: any) {
    console.error('Threshold check error:', error);
    return NextResponse.json(
      { error: 'Failed to check thresholds' },
      { status: 500 }
    );
  }
}
