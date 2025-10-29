// src/app/api/notifications/route.js
import { ObjectId } from "mongodb";
import { dbConnect, collectionNames } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ message: "userId required" }, { status: 400 });

  try {
    const notifications = dbConnect(collectionNames.notifications);
    const userObjId = new ObjectId(userId);

    const allNotifications = await notifications
      .find({ userId: userObjId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const unseenCount = await notifications.countDocuments({ userId: userObjId, seen: false });

    return NextResponse.json({ notifications: allNotifications, unseenCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
