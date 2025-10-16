import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    const { email } = params;
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const skip = (page - 1) * limit;

    const collection = dbConnect("parcels");

    const query = {
      senderEmail: email,
      ...(status && { status }),
      ...(search && {
        $or: [
          { parcelId: { $regex: search, $options: "i" } },
          { deliveryDistrict: { $regex: search, $options: "i" } },
          { pickupDistrict: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const total = await collection.countDocuments(query);
    const parcels = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, parcels, total });
  } catch (error) {
    console.error("Error loading user parcels:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
