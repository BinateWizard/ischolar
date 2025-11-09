import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, email, lastName, firstName, middleInitial } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if profile exists
    let profile = await prisma.profile.findUnique({
      where: { userId: uid }
    });

    if (!profile) {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId: uid,
          email,
          lastName: lastName || '',
          firstName: firstName || email.split('@')[0],
          middleInitial: middleInitial || null
        }
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Profile sync error:', error);
    
    // Check if it's a database connection error
    if (error.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please ensure MySQL is running.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to sync profile' },
      { status: 500 }
    );
  }
}
