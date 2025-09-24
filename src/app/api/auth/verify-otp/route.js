import { collectionNames, dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp)
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });


    const db = dbConnect(collectionNames.users)

    const user = await db.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (user.otp !== otp) return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    if (new Date() > user.otpExpires) return NextResponse.json({ message: "OTP expired" }, { status: 400 });

    // Mark email as verified and remove OTP
    await db.updateOne(
      { email },
      { $set: { emailVerified: true }, $unset: { otp: "", otpExpires: "" } }
    );

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 });
  }
}
