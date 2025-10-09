import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    const { parcelId } = params;

    // Ensure DB connection
    const parcelsCollection = dbConnect("parcels");

    // Fetch the parcel data
    const updatedData = await parcelsCollection.findOne({ parcelId });

    if (!updatedData) {
      return NextResponse.json({ success: false, message: "Parcel not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedData }, { status: 200 });
  } catch (err) {
    console.error("Payment success API error:", err);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
