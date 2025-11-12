import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find pending user with this token
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { verificationToken: token }
    });

    if (!pendingUser) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (pendingUser.tokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please sign up again.' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { email: pendingUser.email }
    });

    if (existingProfile) {
      // Clean up pending user
      await prisma.pendingUser.delete({
        where: { id: pendingUser.id }
      });
      
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 400 }
      );
    }

    // Generate unique userId
    const userId = randomBytes(16).toString('hex');

    // Create the actual Profile now that email is verified
    const newProfile = await prisma.profile.create({
      data: {
        userId,
        email: pendingUser.email,
        password: pendingUser.password,
        lastName: pendingUser.lastName,
        firstName: pendingUser.firstName,
        middleInitial: pendingUser.middleInitial,
        role: 'STUDENT',
        verificationStatus: 'VERIFIED',
        emailVerified: new Date(),
      }
    });

    // Delete the pending user
    await prisma.pendingUser.delete({
      where: { id: pendingUser.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        email: newProfile.email,
        name: `${newProfile.firstName} ${newProfile.lastName}`
      }
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
