// pages/api/auth/forgot-password.js
import { dbConnect, collectionNames } from "@/lib/dbConnect";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  const db = dbConnect(collectionNames.users);

  const user = await db.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour

  await db.updateOne(
    { email },
    { $set: { resetPasswordToken: token, resetPasswordExpires: expires } }
  );

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    text: `Reset your password here: ${resetUrl}`,
    html: `<a href="${resetUrl}">Reset Password</a>`,
  });

  res.status(200).json({ message: "Password reset email sent" });
}
