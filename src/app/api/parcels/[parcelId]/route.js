import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    console.log("🔍 Fetching parcel with ID:", id);

    const collection = await dbConnect("parcels");
    
    let parcel;
    
    // Try by ObjectId first
    if (ObjectId.isValid(id)) {
      parcel = await collection.findOne({ _id: new ObjectId(id) });
      console.log("🔍 Searched by ObjectId");
    }
    
    // If not found by ObjectId, try by parcelId
    if (!parcel) {
      parcel = await collection.findOne({ parcelId: id });
      console.log("🔍 Searched by parcelId");
    }

    if (!parcel) {
      console.log("❌ Parcel not found");
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    console.log("✅ Parcel found:", parcel._id);
    return NextResponse.json(parcel);
    
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}