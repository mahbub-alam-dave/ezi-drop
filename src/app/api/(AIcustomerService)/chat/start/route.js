// /api/chat/start/route.js
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req) {
    const session = await getServerSession(authOptions);

    
  try {
    const db = dbConnect("CustomerServiceChat");

    const user = db.findOne({email: session.user.email})

    const conversation = {
      userId: user._id, // Or set logged-in user ID
      userEmail: user.email,
      startedAt: new Date(),
      closed: false,
      messages: [
        {
          role: "system",
          content: "👋 Welcome to Ezi-Drop Support! How can I help you today?",
          timestamp: new Date(),
        },
      ],
    };

    const result = await db.insertOne(conversation);

    return NextResponse.json({
      conversationId: result.insertedId,
      reply: conversation.messages[0].content,
    });
  } catch (err) {
    console.error("Start chat error:", err);
    return NextResponse.json(
      { error: "Failed to start chat" },
      { status: 500 }
    );
  }
}
