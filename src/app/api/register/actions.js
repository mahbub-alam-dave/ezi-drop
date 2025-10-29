"use server";

import { dbConnect } from "@/lib/mongodb";

export async function handleRegister(userId) {
  const notifications = await dbConnect("notifications");
  await notifications.insertOne({
    userId,
    message: "Your account has been created successfully.",
    seen: false,
    createdAt: new Date(),
  });
}
