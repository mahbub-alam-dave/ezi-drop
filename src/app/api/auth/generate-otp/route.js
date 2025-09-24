import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { collectionNames, dbConnect } from "@/lib/dbConnect";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const db = dbConnect(collectionNames.users);

    const otp = randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    const result = await db.updateOne(
      { email },
      { $set: { otp, otpExpires } }
    );

    if (!result.matchedCount) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to generate OTP" }, { status: 500 });
  }
}
