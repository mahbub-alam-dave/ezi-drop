// app/api/riders/reject/[parcelId]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { assignRiderForDelivery, assignRiderToWarehouse } from "@/lib/assignRider";

export async function PATCH(req, { params }) {
  const { parcelId } = params;
  const parcels = dbConnect("parcels");

  const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });
  if (!parcel) return NextResponse.json({ error: "Parcel not found" }, { status: 404 });

  // find a new rider
  if (parcel.pickupDistrictId === parcel.deliveryDistrictId) {
    // same district
    await assignRiderForDelivery(parcel, true);
  } 
  else {
      // cross-district delivery
      await assignRiderToWarehouse(parcel, true);
  }


  return NextResponse.json({
    success: true,
    message: "New rider assigned successfully",
    newRiderId: newRider._id,
  });
}
