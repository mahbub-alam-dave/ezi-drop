import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// Update user data
export async function POST(req) {
  try {
    // 1. Get JSON body
    const updateData = await req.json();

    if (!updateData.email) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // 2. Connect DB
    const db = dbConnect("users")

    // 3. Update document
    await db.updateOne({email: updateData.email}, {$set: updateData}
    );

    const updatedUser = await db.findOne({ email: updateData.email });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Return updated doc
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
