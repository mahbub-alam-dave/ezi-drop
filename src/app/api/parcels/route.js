import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// helper function to generate unique parcelId
function generateParcelId() {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `EziDrop${timestamp}${randomStr}`;
}

// Get Data
export async function GET() {
  const collection = dbConnect("parcels");
  const parcels = await collection.find().toArray();
  return new Response(
    JSON.stringify({ success: true, data: parcels }, null, 2),
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
    const collection = dbConnect("parcels");

    const newParcel = {
      ...body,
      payment: "panding",
      status:"panding",
      parcelId: generateParcelId(),  // unique parcel ID
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newParcel);
    return NextResponse.json(
      {
        message: "Parcel saved successfully",
        id: result.insertedId,
        parcelId: newParcel.parcelId, // return generated ID
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving parcel:", error);
    return NextResponse.json(
      { message: "Failed to save parcel", error },
      { status: 500 }
    );
  }
}
