import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/db";
import { randomInt } from "crypto";
import { transporter } from "@/lib/nodemailer"; // reuse your SMTP transporter

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    await dbConnect(collectionNames.users);

    const otp = randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    const result = await collectionNames.users.updateOne(
      { email },
      { $set: { otp, otpExpires } }
    );

    if (!result.matchedCount) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
