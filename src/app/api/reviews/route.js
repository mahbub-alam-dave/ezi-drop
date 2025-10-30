import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// POST: user adds review
export async function POST(request) {
  try {
    const { userId, name, photo, rating, comment, type } = await request.json();

    if (!userId || !rating || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const reviewsCollection = dbConnect(collectionNames.reviews);

    await reviewsCollection.insertOne({
      userId,
      name,
      photo,
      rating,
      comment,
      date: new Date(),
      type,
      status: "pending",
    });

    return NextResponse.json({ success: true, message: "Review submitted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}

// GET: fetch all reviews
export async function GET(request) {
  try {
    const reviewsCollection = dbConnect(collectionNames.reviews);
    const reviews = await reviewsCollection.find({}).toArray();
    return NextResponse.json(reviews);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// PATCH: update review status
export async function PATCH(request) {
  try {
    const { id, action } = await request.json();
    const reviewsCollection = dbConnect(collectionNames.reviews);

    if (action === "delete") {
      await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true, message: "Review deleted" });
    }

    await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: action } }
    );

    return NextResponse.json({ success: true, message: `Review ${action}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
