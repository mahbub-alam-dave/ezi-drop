import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
   const { parcelId } = await params; // ✅ ঠিকভাবে params destructure করা
    const collection = dbConnect("parcels");
    const parcel = await collection.findOne({ parcelId });

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }
    // console.log(parcel)
    return NextResponse.json(parcel);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}i
