import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

// ✅ POST: Add rider review
export async function POST(request) {
  try {
    const { riderId, reviewerId, review } = await request.json();

    if (!riderId || !reviewerId || !review) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const riderReviewCollection = dbConnect(collectionNames.riderReview);

    // Check if rider already has reviews
    const existing = await riderReviewCollection.findOne({ riderId });

    if (existing) {
      // Push new review to existing rider
      await riderReviewCollection.updateOne(
        { riderId },
        {
          $push: {
            reviews: {
              reviewerId,
              review,
              date: new Date(),
            },
          },
        }
      );
    } else {
      // Create new document for this rider
      await riderReviewCollection.insertOne({
        riderId,
        reviews: [{ reviewerId, review, date: new Date() }],
      });
    }

    return NextResponse.json({ success: true, message: "Rider review saved" });
  } catch (error) {
    console.error("Error saving rider review:", error);
    return NextResponse.json({ error: "Failed to save rider review" }, { status: 500 });
  }
}

// ✅ GET: Get all rider reviews
export async function GET() {
  try {
    const riderReviewCollection = dbConnect(collectionNames.riderReview);
    const reviews = await riderReviewCollection.find({}).toArray();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching rider reviews:", error);
    return NextResponse.json({ error: "Failed to fetch rider reviews" }, { status: 500 });
  }
}
