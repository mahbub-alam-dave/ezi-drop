import { NextResponse } from 'next/server';
import { dbConnect, collectionNames } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { conversationId, readerEmail } = body;

    if (!conversationId || !readerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const messagesCollection = await dbConnect(collectionNames.messages);
    const conversationsCollection = await dbConnect(collectionNames.messages);

    await messagesCollection.updateMany(
      { conversationId, receiverEmail: readerEmail, read: false },
      { $set: { read: true } }
    );

    await conversationsCollection.updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { [`unreadCount.${readerEmail}`]: 0, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
