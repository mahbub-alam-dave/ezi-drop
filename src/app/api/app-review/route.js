import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

// ✅ POST: Application Review save

export async function POST(req) {
  try {
    const { userId, review } = await req.json();
    const collection = await dbConnect(collectionNames.reviews);

    const existing = await collection.findOne({ userId });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "You have already reviewed the app.",
      });
    }

    await collection.insertOne({ userId, review });

    return NextResponse.json({ success: true, message: "App review added successfully!" });
  } catch (error) {
    console.error("Error saving app review:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ✅ GET: Check if user already reviewed the app
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const collection = await dbConnect(collectionNames.reviews);
  const existing = await collection.findOne({ userId });

  return NextResponse.json({ reviewed: !!existing });
}
 