import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { secret } = await request.json();

    if (!secret) {
      return NextResponse.json(
        { error: 'Secret is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Enable 2FA for the user
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        twoFactorSecret: secret,
        isTwoFactorEnabled: true,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Two-factor authentication enabled successfully',
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { error: 'Failed to enable 2FA' },
      { status: 500 }
    );
  }
}
