// src/utility/notificationUtils.js
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

/**
 * Utility Function: To create and save a new notification.
 * @param {string} userId - The user's MongoDB ObjectId (as a string).
 * @param {string} role - The user's role ('admin', 'rider', 'merchant').
 * @param {string} message - The main notification message.
 * @param {string} [link='/'] - The redirection link when clicked.
 */
export async function createNotification(userId, role, message, link = "/") {
  try {
    const notifications = await dbConnect("notifications");

    // Ensure userId is a valid ObjectId
    const userObjId = new ObjectId(userId);

    const notificationData = {
      userId: userObjId,
      role: role,
      message: message,
      link: link,
      seen: false, // Default: unseen
      createdAt: new Date(),
    };

    await notifications.insertOne(notificationData);
    // console.log(`Notification created for user ${userId}`);
  } catch (error) {
    // Production-এ console.error 
    console.error("Error creating notification:", error.message);
  }
}
