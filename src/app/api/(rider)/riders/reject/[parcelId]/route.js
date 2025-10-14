// app/api/riders/reject/[parcelId]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { assignRiderForDelivery, assignRiderToWarehouse } from "@/lib/assignRider";

export async function PATCH(req, { params }) {
  try {
    const { parcelId } = params;
    const parcels = dbConnect("parcels");

    // 🔍 Find the parcel
    const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });
    if (!parcel) {
      return NextResponse.json({ success: false, message: "Parcel not found" }, { status: 404 });
    }

    const now = new Date();

    // 🛑 Mark current rider as rejected
    await parcels.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          riderApprovalStatus: "rejected",
          updatedAt: now,
        },
        $push: {
          events: {
            type: "rider_rejected",
            by: parcel.assignedRiderId,
            role: "rider",
            at: now,
            note: "Rider rejected the parcel assignment.",
          },
        },
      }
    );

    // 🔁 Reassign to a new rider
    let reassignedRider = null;

    if (parcel.pickupDistrictId === parcel.deliveryDistrictId) {
      reassignedRider = await assignRiderForDelivery(parcel, true);
    } else {
      reassignedRider = await assignRiderToWarehouse(parcel, true);
    }

    if (!reassignedRider) {
      return NextResponse.json({
        success: false,
        message: "No available rider found for reassignment.",
      });
    }

    // 🧾 Log the reassignment event
    await parcels.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $push: {
          events: {
            type: "rider_reassigned",
            by: "system",
            role: "system",
            at: now,
            note: `Parcel reassigned to rider ${reassignedRider?.name} (${reassignedRider?._id}).`,
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Parcel reassigned to a new rider successfully.",
      newRiderId: reassignedRider?._id,
    });
  } catch (error) {
    console.error("❌ Error in rider rejection:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
