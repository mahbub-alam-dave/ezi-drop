import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const { parcelId } = params;
    const parcels = dbConnect("parcels");

    // 🔍 Find parcel by parcelId
    const parcel = await parcels.findOne({ parcelId });
    if (!parcel) {
      return NextResponse.json(
        { success: false, message: "Parcel not found" },
        { status: 404 }
      );
    }

    // 🕓 Timestamp
    const now = new Date();

    // 🔁 Determine new status and delivery status
    let newStatus, newRiderDeliveryStatus, eventNote;

    if (parcel.deliveryType === "to_warehouse") {
      newStatus = "in_transit_to_warehouse";
      newRiderDeliveryStatus = "in_transit_to_warehouse";
      eventNote = "Rider accepted parcel for delivery to local warehouse.";
    } 

    else if(parcel.deliveryType === "to_receiver_final") {
      newStatus = "awaiting_pickup_from_warehouse";
      newRiderDeliveryStatus = "assigned_for_final_delivery";
      eventNote = "Rider accepted parcel to pickup form the wirehouse and deliver to the receiver"
    }
    
    else {
      newStatus = "awaiting_pickup"; // Rider accepted but not yet picked up
      newRiderDeliveryStatus = "assigned";
      eventNote = "Rider accepted parcel for direct delivery.";
    }

    // ✅ Update parcel
    await parcels.updateOne(
      { parcelId },
      {
        $set: {
          status: newStatus,
          riderApprovalStatus: "accepted",
          riderDeliveryStatus: newRiderDeliveryStatus,
          updatedAt: now,
        },
        $push: {
          events: {
            type: "rider_accepted",
            by: parcel.assignedRiderId,
            role: "rider",
            at: now,
            note: eventNote,
          },
        },
      }
    );

    console.log(`✅ Rider accepted parcel ${parcel.parcelId}`);

    return NextResponse.json({
      success: true,
      message: "Parcel accepted successfully by rider",
      data: {
        status: newStatus,
        riderApprovalStatus: "accepted",
        riderDeliveryStatus: newRiderDeliveryStatus,
      },
    });
  } catch (error) {
    console.error("❌ Error in rider acceptance:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while rider accepting parcel",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
