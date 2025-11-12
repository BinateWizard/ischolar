import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, password, lastName, firstName, middleInitial } = await req.json();

    // Validate input
    if (!email || !password || !lastName || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists (in Profile or PendingUser)
    const [existingUser, existingPending] = await Promise.all([
      prisma.profile.findUnique({ where: { email } }),
      prisma.pendingUser.findUnique({ where: { email } })
    ]);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create or update pending user (don't create Profile yet)
    if (existingPending) {
      // Update existing pending user with new token
      await prisma.pendingUser.update({
        where: { email },
        data: {
          password: hashedPassword,
          lastName,
          firstName,
          middleInitial: middleInitial || null,
          verificationToken,
          tokenExpiry,
        }
      });
    } else {
      // Create new pending user
      await prisma.pendingUser.create({
        data: {
          email,
          password: hashedPassword,
          lastName,
          firstName,
          middleInitial: middleInitial || null,
          verificationToken,
          tokenExpiry,
        }
      });
    }

    // Send verification email
    try {
      await sendVerificationEmail(
        email,
        verificationToken,
        `${firstName} ${lastName}`
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      user: {
        email: email,
        name: `${firstName} ${lastName}`
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: isDev ? (error?.message || String(error)) : 'Failed to create account' },
      { status: 500 }
    );
  }
}
