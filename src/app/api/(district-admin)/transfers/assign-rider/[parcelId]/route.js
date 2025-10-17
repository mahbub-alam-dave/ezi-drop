import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { assignRiderForFinalDelivery } from "@/lib/assignRider";

export async function PATCH(req, { params }) {
  try {
    const { parcelId } = params;
    const parcels = dbConnect("parcels");

    // 1️⃣ Find the parcel
    const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });
    if (!parcel) {
      return NextResponse.json(
        { success: false, message: "Parcel not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Ensure the parcel is ready for final delivery
    if (parcel.status !== "arrived_at_receiver_warehouse") {
      return NextResponse.json(
        { success: false, message: "Parcel not ready for final delivery" },
        { status: 400 }
      );
    }

    // 3️⃣ Assign a rider for final delivery
    const assignedRider = await assignRiderForFinalDelivery(parcel, false);

    if (!assignedRider) {
      return NextResponse.json({
        success: false,
        message: "No available rider found for final delivery.",
      });
    }

    // 4️⃣ Add a final delivery log
await parcels.updateOne(
  { _id: new ObjectId(parcelId) },
  {
    $push: {
      events: {
        type: "rider_assignment_triggered",
        role: "district_admin",
        at: new Date(),
        note: `Receiver district admin triggered rider assignment for final delivery.`,
      },
    },
  }
);


    return NextResponse.json({
      success: true,
      message: `Rider ${assignedRider.name} assigned for final delivery.`,
      riderId: assignedRider._id,
    });
  } catch (error) {
    console.error("❌ Error assigning final delivery rider:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
