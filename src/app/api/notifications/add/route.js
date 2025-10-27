// src/app/api/notifications/add/route.js
import { ObjectId } from "mongodb";
import { dbConnect, collectionNames } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, message, type } = await req.json();
    if (!userId || !message) return NextResponse.json({ message: "userId & message required" }, { status: 400 });

    const notifications = dbConnect(collectionNames.notifications);
    const userObjId = new ObjectId(userId);

    const newNotification = {
      userId: userObjId,
      message,
      type: type || "general",
      seen: false,
      createdAt: new Date(),
    };

    const result = await notifications.insertOne(newNotification);
    return NextResponse.json({ message: "Notification added", notificationId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
