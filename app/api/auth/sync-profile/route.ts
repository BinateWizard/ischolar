import { NextResponse } from 'next/server';
import { syncUserProfile } from '@/lib/actions/profile';

export async function POST() {
  try {
    await syncUserProfile();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    );
  }
}
