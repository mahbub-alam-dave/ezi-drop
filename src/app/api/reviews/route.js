import { NextResponse } from "next/server";
import { dbConnect, collectionNames } from "@/lib/dbConnect";

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
      status: "pending", // admin will approve
    });

    return NextResponse.json({ success: true, message: "Review submitted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}

// GET: admin fetch all reviews (optionally filter by status)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending/accepted/rejected

    const reviewsCollection = dbConnect(collectionNames.reviews);
    const filter = status ? { status } : {};
    const reviews = await reviewsCollection.find(filter).toArray();

    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// PATCH: admin update review status
export async function PATCH(request) {
  try {
    const { id, action } = await request.json(); // action: accept / reject / delete
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
