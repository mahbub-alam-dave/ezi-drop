import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


// POST (save parcel data)
export async function POST(request) {
  try {
    const body = await request.json(); // form data
    const collection = dbConnect("parcels"); // new collection 
    
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Parcel saved successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving parcel:", error);
    return NextResponse.json(
      { message: "Failed to save parcel", error },
      { status: 500 }
    );
  }
}
