import { NextResponse } from 'next/server';
import { dbConnect, collectionNames } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const userRole = searchParams.get('role');

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const conversationsCollection = await dbConnect(collectionNames.messages);

    const conversations = await conversationsCollection
      .find({ 'participants.email': userEmail })
      .sort({ lastMessageTime: -1 })
      .toArray();

    // Ensure unreadCount exists
    conversations.forEach(conv => {
      if (!conv.unreadCount) conv.unreadCount = {};
      if (!conv.unreadCount[userEmail]) conv.unreadCount[userEmail] = 0;
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { participants, orderId } = body;

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json({ error: 'Participants array is required' }, { status: 400 });
    }

    const conversationsCollection = await dbConnect(collectionNames.messages);

    const participantEmails = participants.map(p => p.email).sort();
    const existingConversation = await conversationsCollection.findOne({
      'participants.email': { $all: participantEmails }
    });

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation });
    }

    const newConversation = {
      participants,
      lastMessage: '',
      lastMessageTime: new Date(),
      orderId: orderId || null,
      status: 'active',
      unreadCount: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    participants.forEach(p => {
      newConversation.unreadCount[p.email] = 0;
    });

    const result = await conversationsCollection.insertOne(newConversation);

    return NextResponse.json({ 
      conversation: { ...newConversation, _id: result.insertedId } 
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
