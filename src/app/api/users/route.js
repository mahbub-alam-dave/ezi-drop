import { NextResponse } from 'next/server';
import { collectionNames, dbConnect } from '@/lib/dbConnect';
// A simple API route to fetch all users from the database.
export async function GET(request) {
  try {
    // Connect to the database and get the users collection
    const usersCollection = dbConnect(collectionNames.users);

    // Find all documents in the collection and convert the cursor to an array
    const users = await usersCollection.find({}).toArray();

    // Return the users as a JSON response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    // Return a 500 error response if something goes wrong
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}


