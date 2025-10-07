import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';

// GET - Get all vault items for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const items = await VaultItem.find({ userId: (session.user as any).id })
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
// POST - Create a new vault item
export async function POST(request: Request) {
  try {
    console.log('API: Starting POST request');
    
    const session = await getServerSession(authOptions);
    console.log('API: Session data:', session);
    console.log('API: User ID:', (session?.user as any).id);

    if (!(session?.user as any).id) {
      console.log('API: Unauthorized - no user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('API: Request body received:', body);

    const { title, username, encryptedPassword, url, notes } = body;

    if (!title || !username || !encryptedPassword) {
      console.log('API: Missing required fields');
      return NextResponse.json(
        { error: 'Title, username, and password are required' },
        { status: 400 }
      );
    }

    console.log('API: Connecting to database');
    await connectDB();

    // FIX: Properly convert string ID to MongoDB ObjectId
    const mongoose = await import('mongoose');
    const userId = new mongoose.Types.ObjectId(session.user.id);

    console.log('API: Creating vault item for user:', userId);
    
    const vaultItem = await VaultItem.create({
      userId: userId,  // Use the properly formatted ObjectId
      title,
      username,
      encryptedPassword,
      url,
      notes,
    });

    console.log('API: Item created successfully:', vaultItem._id);
    
    return NextResponse.json(
      { message: 'Item created successfully', item: vaultItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('API: Error creating vault item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}