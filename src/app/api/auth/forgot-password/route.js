// src/app/api/auth/forgot-password/route.js
import { dbConnect, collectionNames } from "@/lib/dbConnect";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

/* export async function GET() {
  return new Response(JSON.stringify({ message: "API live" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} */

export async function POST(request) {
  try {
    const { email } = await request.json();
    const db = dbConnect(collectionNames.users);

    console.log(email);

    const user = await db.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600000; // 1 hour

    await db.updateOne(
      { email },
      { $set: { resetPasswordToken: token, resetPasswordExpires: expires } }
    );

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Reset your password here: ${resetUrl}`,
      html: `<a href="${resetUrl}">Reset Password</a>`,
    });

    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



