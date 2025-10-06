import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


async function applyPenalty(riderId, points) {
  const riders = await dbConnect("rider-applications");
  await riders.updateOne(
    { _id: new ObjectId(riderId) },
    { $inc: { penaltyPoints: points } } // -100 points added
  );
}

export async function POST(req) {
  try {
    const { parcelId, riderId } = await req.json();
    const parcels = await dbConnect("parcels");

    const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });
    if (!parcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    
    if (parcel.assignedRider.status === "auto_assigned") {
      await applyPenalty(riderId, -100);
    }

    const result = await parcels.updateOne(
      {
        _id: new ObjectId(parcelId),
      },
      {
        $unset: {
          assignedRider: "", 
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Parcel not found or rider mismatch" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Assignment/Handover rejected, parcel reassigned",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
