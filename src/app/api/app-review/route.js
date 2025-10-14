import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

// ✅ POST: Add app/company review + rating
export async function POST(request) {
  try {
    const { userId, review, rating } = await request.json();

    if (!userId || !review || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const reviewsCollection = await dbConnect(collectionNames.reviews);

    const existing = await reviewsCollection.findOne({ userId });
    if (existing) {
      return NextResponse.json({ message: "You already reviewed the app." });
    }

    await reviewsCollection.insertOne({
      userId,
      review,
      rating,
      date: new Date(),
    });

    return NextResponse.json({ success: true, message: "App review saved" });
  } catch (error) {
    console.error("Error saving app review:", error);
    return NextResponse.json({ error: "Failed to save app review" }, { status: 500 });
  }
}

// ✅ GET: Fetch all app reviews
export async function GET() {
  try {
    const reviewsCollection = await dbConnect(collectionNames.reviews);
    const reviews = await reviewsCollection.find({}).toArray();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
