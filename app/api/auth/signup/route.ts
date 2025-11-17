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

    // Create the profile immediately and mark as pending verification.
    // This accepts any email for now; verification can be performed later.
    const userId = randomBytes(16).toString('hex');

    try {
      await prisma.profile.create({
        data: {
          userId,
          email,
          password: hashedPassword,
          lastName,
          firstName,
          middleInitial: middleInitial || null,
          role: 'STUDENT',
          verificationStatus: 'PENDING_VERIFICATION',
          // emailVerified remains null until the user verifies
        }
      });
    } catch (err) {
      console.error('Failed to create profile:', err);
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    // Do not send verification email at signup time; account is usable immediately.
    return NextResponse.json({ success: true, requiresVerification: false, user: { email, name: `${firstName} ${lastName}` } });
  } catch (error: any) {
    console.error('Signup error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: isDev ? (error?.message || String(error)) : 'Failed to create account' },
      { status: 500 }
    );
  }
}
