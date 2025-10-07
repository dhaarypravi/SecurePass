import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const items = await VaultItem.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('-encryptedPassword -__v -userId'); // Exclude sensitive fields

    return NextResponse.json({ 
      items: items.map(item => ({
        ...item.toObject(),
        _id: item._id.toString(),
      }))
    });
  } catch (error) {
    console.error('Export vault error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}