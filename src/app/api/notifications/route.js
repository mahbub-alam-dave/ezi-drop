// src/app/api/notifications/route.js
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const notifications = dbConnect("notifications");
    const userObjId = new ObjectId(userId);

    // Fetch all notifications for the user
    const allNotifications = await notifications
      .find({ userId: userObjId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50) // Limit to the last 50 notifications
      .toArray();

    // Count unseen notifications
    const unseenCount = await notifications.countDocuments({
      userId: userObjId,
      seen: false,
    });

    return NextResponse.json({
      notifications: allNotifications,
      unseenCount: unseenCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
