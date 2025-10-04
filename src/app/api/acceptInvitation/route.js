import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { parcelId, riderId } = await req.json();
    const parcels = await dbConnect("parcels");

    const updateQuery = {
      $set: {
        "assignedRider.status": "pending",
        "assignedRider.acceptedAt": new Date(),

        "assignedRider.handoverInvitedRider": null,
      },

      $unset: {
        "assignedRider.autoAssignedAt": "",
      },
    };

    const result = await parcels.updateOne(
      {
        _id: new ObjectId(parcelId),
        "assignedRider.riderId": new ObjectId(riderId), // নিশ্চিত করা যে রাইডারই একসেপ্ট করছে
      },
      updateQuery
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Parcel or assignment not found for this rider" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Assignment/Handover accepted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
