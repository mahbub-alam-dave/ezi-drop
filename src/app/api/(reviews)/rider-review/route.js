import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

// ✅ POST: Add rider review + rating
export async function POST(request) {
  try {
    const { riderId, reviewerId, review, rating } = await request.json();

    if (!riderId || !reviewerId || !review || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const riderReviewCollection = dbConnect(collectionNames.riderReview);
    const existing = await riderReviewCollection.findOne({ riderId });

    const reviewData = { reviewerId, review, rating, date: new Date() };

    if (existing) {
      await riderReviewCollection.updateOne(
        { riderId },
        { $push: { reviews: reviewData } }
      );
    } else {
      await riderReviewCollection.insertOne({
        riderId,
        reviews: [reviewData],
      });
    }

    return NextResponse.json({ success: true, message: "Rider review saved" });
  } catch (error) {
    console.error("Error saving rider review:", error);
    return NextResponse.json({ error: "Failed to save rider review" }, { status: 500 });
  }
}


// ✅ GET: Fetch all rider reviews
export async function GET() {
  try {
    const riderReviewCollection = await dbConnect(collectionNames.riderReview);
    const reviews = await riderReviewCollection.find({}).toArray();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching rider reviews:", error);
    return NextResponse.json({ error: "Failed to fetch rider reviews" }, { status: 500 });
  }
}
