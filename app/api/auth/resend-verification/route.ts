import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find pending user
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email }
    });

    if (!pendingUser) {
      // Check if already verified
      const profile = await prisma.profile.findUnique({
        where: { email }
      });
      
      if (profile) {
        return NextResponse.json(
          { error: 'Email is already verified. Please sign in.' },
          { status: 400 }
        );
      }
      
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a verification email has been sent'
      });
    }

    // Generate new token
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update pending user with new token
    await prisma.pendingUser.update({
      where: { email },
      data: {
        verificationToken,
        tokenExpiry,
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(
        email,
        verificationToken,
        `${pendingUser.firstName} ${pendingUser.lastName}`
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
