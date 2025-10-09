import { NextResponse } from 'next/server';
import { dbConnect, collectionNames } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    const messagesCollection = await dbConnect(collectionNames.messages);

    const messages = await messagesCollection
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { conversationId, senderEmail, senderRole, receiverEmail, content } = body;

    if (!conversationId || !senderEmail || !receiverEmail || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const messagesCollection = await dbConnect(collectionNames.messages);
    const conversationsCollection = await dbConnect(collectionNames.messages);

    const newMessage = {
      conversationId,
      senderEmail,
      senderRole,
      receiverEmail,
      content,
      messageType: 'text',
      read: false,
      timestamp: new Date()
    };

    const messageResult = await messagesCollection.insertOne(newMessage);

    await conversationsCollection.updateOne(
      { _id: new ObjectId(conversationId) },
      { 
        $set: { lastMessage: content, lastMessageTime: new Date(), updatedAt: new Date() },
        $inc: { [`unreadCount.${receiverEmail}`]: 1 }
      }
    );

    return NextResponse.json({ message: { ...newMessage, _id: messageResult.insertedId }, success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
