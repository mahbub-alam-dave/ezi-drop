// src/app/api/notifications/clear/route.js
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, action, notificationId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const notifications = dbConnect("notifications");
    const userObjId = new ObjectId(userId);

    if (action === "mark_all_seen") {
      // "Mark All As Read"
      await notifications.updateMany(
        { userId: userObjId, seen: false },
        { $set: { seen: true } }
      );
      return NextResponse.json({ message: "All marked as seen" });
    } else if (action === "clear_all") {
      // "Clear Notifications" (Delete all)
      await notifications.deleteMany({ userId: userObjId });
      return NextResponse.json({ message: "All notifications cleared" });
    } else if (action === "delete_individual" && notificationId) {
      // Delete individual
      await notifications.deleteOne({
        _id: new ObjectId(notificationId),
        userId: userObjId,
      });
      return NextResponse.json({ message: "Notification deleted" });
    } else {
      return NextResponse.json(
        { message: "Invalid action or missing notificationId" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
