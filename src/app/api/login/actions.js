"use server";

import { dbConnect } from "@/lib/mongodb";

export async function handleLogin(userId) {
  const notifications = await dbConnect("notifications");
  await notifications.insertOne({
    userId,
    message: "You have successfully logged in.",
    seen: false,
    createdAt: new Date(),
  });
}
