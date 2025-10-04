import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { parcelId, currentRiderId, invitedRiderId } = await req.json();

    const parcelObjId = new ObjectId(parcelId);
    const currentRiderObjId = new ObjectId(currentRiderId);
    const invitedRiderObjId = new ObjectId(invitedRiderId);

    const parcels = await dbConnect("parcels");
    const riders = await dbConnect("rider-applications");

    // ১. inviter rider data
    const invitedRider = await riders.findOne({ _id: invitedRiderObjId });
    if (!invitedRider) {
      return NextResponse.json(
        { message: "Invited rider not found" },
        { status: 404 }
      );
    }

    // ২. percel status check
    const parcel = await parcels.findOne({ _id: parcelObjId });
    if (!parcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    // logic check
    if (
      parcel.assignedRider?.riderId.toString() !== currentRiderId ||
      parcel.assignedRider?.status !== "pending"
    ) {
      return NextResponse.json(
        {
          message:
            "Unauthorized Handover. Parcel is not currently assigned to you or status is not pending.",
        },
        { status: 403 }
      );
    }

    // ৩. handoverInvitedRider
    const updateData = {
      $set: {
        "assignedRider.handoverInvitedRider": {
          riderId: invitedRiderObjId,
          riderName: invitedRider.applicantName,
          status: "invited", 
          invitedAt: new Date(),
          invitedByRiderId: currentRiderObjId,
        },
      },
    };

    const result = await parcels.updateOne(
      {
        _id: parcelObjId,
        "assignedRider.riderId": currentRiderObjId,
      },
      updateData
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Update failed. Parcel or assignment mismatch." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message:
        "Handover invitation sent successfully. Waiting for other rider's acceptance.",
      invitedRider: {
        id: invitedRider._id,
        name: invitedRider.applicantName,
      },
    });
  } catch (error) {
    //  invalid ID format
    if (error.name === "BSONTypeError") {
      return NextResponse.json(
        { error: "Invalid ID format provided." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
