import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VaultItem from '@/models/VaultItem';

// GET - Get single item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itemId = params.id;

    await connectDB();

    const item = await VaultItem.findOne({ _id: itemId, userId: session.user.id });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Get vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itemId = params.id;
    const { title, username, encryptedPassword, url, notes } = await request.json();

    await connectDB();

    // Find the item and verify it belongs to the current user
    const item = await VaultItem.findOne({ _id: itemId, userId: session.user.id });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Update the item
    const updatedItem = await VaultItem.findByIdAndUpdate(
      itemId,
      {
        title,
        username,
        encryptedPassword,
        url,
        notes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: 'Item updated successfully', 
      item: updatedItem 
    });
  } catch (error) {
    console.error('Update vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete item (keep your existing delete function)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itemId = params.id;

    await connectDB();

    const item = await VaultItem.findOne({ _id: itemId, userId: session.user.id });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await VaultItem.findByIdAndDelete(itemId);

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}