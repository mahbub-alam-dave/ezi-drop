import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
    const session = await getServerSession();
    console.log(session?.user?.email, "this is from booking check api")
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." });
    }

    // 1️⃣ Check if user exists
    const user = await dbConnect("users").findOne({ email });
    if (!user) {
      return NextResponse.json.json({ success: false, message: "User not found." });
    }

    // 2️⃣ Check if user has any parcel booking
    const hasParcel = await dbConnect("parcels").findOne({ senderEmail: email });

    if (hasParcel) {
      return NextResponse.json.json({
        success: true,
        eligible: false,
        message: "You’ve already booked a parcel before.",
      });
    }

    // 3️⃣ If no booking yet → eligible for first booking discount
    return NextResponse.json({
      success: true,
      eligible: true,
      message: "You’re eligible for 100% free delivery on your first booking!",
      discount: {
        type: "first_booking",
        amount: "100%",
      },
    });
  } catch (error) {
    console.error("Error checking first parcel status:", error);
    NextResponse.json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    }, { status: 500 });
  }
}