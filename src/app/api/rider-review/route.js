import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

// ✅ POST: Rider Review save
export async function POST(req) {
  try {
    const { riderId, reviewerId, review } = await req.json();
    const collection = await dbConnect(collectionNames.riderReview);

    const existing = await collection.findOne({ riderId });

    if (existing) {
      await collection.updateOne(
        { riderId },
        {
          $push: {
            reviews: { reviewerId, review },
          },
        }
      );
    } else {
      await collection.insertOne({
        riderId,
        reviews: [{ reviewerId, review }],
      });
    }

    return NextResponse.json({ success: true, message: "Rider review added successfully!" });
  } catch (error) {
    console.error("Error saving rider review:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
