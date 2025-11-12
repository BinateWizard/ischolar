import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ count: 0 });
    }

    // Count unread notifications
    const count = await prisma.notification.count({
      where: {
        userId: profile.id,
        isRead: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Unread count error:', error);
    return NextResponse.json({ count: 0 });
  }
}
