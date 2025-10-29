import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function addNotification({ userId, message, type = "general"}) {
    console.log(userId, message)
  if (!userId || !message) throw new Error("userId & message required");

  const notifications = dbConnect("notifications");
  const userObjId = new ObjectId(userId);

  const newNotification = {
    userId: userObjId,
    message,
    type,
    seen: false,
    createdAt: new Date(),
  };

  const result = await notifications.insertOne(newNotification);
  return result.insertedId;
}
