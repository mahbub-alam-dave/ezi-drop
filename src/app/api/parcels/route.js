import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
// Get Data
export async function GET() {
  const collection = dbConnect("parcels");
  const percels = await collection.find().toArray();
  return new Response(
    JSON.stringify({ success: true, data: percels }, null, 2),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

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
