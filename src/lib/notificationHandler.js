import { ObjectId } from "mongodb";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

export async function addNotification({ userId, message, type = "general" }) {
  if (!userId || !message) throw new Error("userId & message required");

  const notifications = dbConnect(collectionNames.notifications);
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
