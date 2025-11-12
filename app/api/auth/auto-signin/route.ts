import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the user
    const profile = await prisma.profile.findUnique({
      where: { email }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate a temporary auto-signin token
    const autoSigninToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store token in profile
    await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        verificationToken: autoSigninToken,
        tokenExpiry
      }
    });

    return NextResponse.json({
      success: true,
      token: autoSigninToken
    });
  } catch (error: any) {
    console.error('Auto-signin token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signin token' },
      { status: 500 }
    );
  }
}
