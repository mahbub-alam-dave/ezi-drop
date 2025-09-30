// /api/chat/start/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const db = dbConnect("CustomerServiceChat");

    const conversation = {
      userId: null, // Or set logged-in user ID
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
