import { collectionNames, dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';


// A simple API route to fetch all reviews from the database.
export async function GET(request) {
  try {
    // Connect to the database and get the reviews collection
    const reviewsCollection = dbConnect(collectionNames.reviews);

    // Find all documents in the collection and convert the cursor to an array
    const reviews = await reviewsCollection.find({}).toArray();

    // Return the reviews as a JSON response
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    // Return a 500 error response if something goes wrong
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}