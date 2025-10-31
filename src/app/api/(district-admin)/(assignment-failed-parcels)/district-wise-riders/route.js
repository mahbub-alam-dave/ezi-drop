import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { parcelId } = await req.json();
    const parcels = dbConnect("parcels");
    const users = dbConnect("users");

    // Find parcel first
    const parcel = await parcels.findOne({ parcelId });
    if (!parcel) {
      return NextResponse.json({ ok: false, message: "Parcel not found" }, { status: 404 });
    }

    // Determine correct district based on delivery type
    let targetDistrictId;
    if (parcel.deliveryType === "to_receiver" || parcel.deliveryType === "to_warehouse") {
      targetDistrictId = parcel.pickupDistrictId;
    } else if (parcel.deliveryType === "to_receiver_final") {
      targetDistrictId = parcel.deliveryDistrictId;
    } else {
      return NextResponse.json(
        { ok: false, message: "Unsupported delivery type" },
        { status: 400 }
      );
    }

    // Fetch active riders (status: "duty") in that district
    const activeRiders = await users
      .find({
        role: "rider",
        working_status: "duty",
        districtId: targetDistrictId,
      })
      .toArray();

    return NextResponse.json({ ok: true, riders: activeRiders, districtId: targetDistrictId });
  } catch (error) {
    console.error("Error fetching riders by parcel:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
