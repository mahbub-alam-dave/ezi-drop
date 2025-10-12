// app/api/riders/accept/[parcelId]/route.ts
import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function PATCH(req, { params }) {
  const { parcelId } = params;
  const parcels = dbConnect("parcels");

  const parcel = await parcels.findOne({ parcelId });
  if (!parcel) return NextResponse.json({ error: "Parcel not found" }, { status: 404 });

  // update status based on delivery type
  const newStatus =
    parcel.deliveryType === "to_warehouse" ? "in_transit_to_warehouse" : "not_picked";

  await parcels.updateOne(
    { parcelId },
    {
      $set: {
        status: newStatus,
        riderApprovalStatus: "accepted",
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ success: true, message: "Parcel accepted successfully" });
}
