import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

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

    // Check if user already exists
    const existingUser = await prisma.profile.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique userId
    const userId = randomBytes(16).toString('hex');

    // Create user
    const profile = await prisma.profile.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        lastName,
        firstName,
        middleInitial: middleInitial || null,
        role: 'STUDENT',
        verificationStatus: 'PENDING_VERIFICATION'
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: profile.userId,
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`
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
