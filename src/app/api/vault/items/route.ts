import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';

// GET - Get all vault items for the user
export async function GET() { // Remove the params parameter
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const items = await VaultItem.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get vault items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new vault item
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, username, encryptedPassword, url, notes } = await request.json();

    if (!title || !username || !encryptedPassword) {
      return NextResponse.json(
        { error: 'Title, username, and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const vaultItem = await VaultItem.create({
      userId: session.user.id,
      title,
      username,
      encryptedPassword,
      url,
      notes,
    });

    return NextResponse.json(
      { message: 'Item created successfully', item: vaultItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}