import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { parcelId, riderId, deliveryType, districtAdminName } = await req.json();

    const parcels = dbConnect("parcels");
    const users = dbConnect("users");

    const parcel = await parcels.findOne({ parcelId });
    if (!parcel) {
      return NextResponse.json({ ok: false, message: "Parcel not found" }, { status: 404 });
    }

    const availableRider = await users.findOne({ _id: new ObjectId(riderId), status: "duty" });
    if (!availableRider) {
      return NextResponse.json({ ok: false, message: "Rider not available" }, { status: 400 });
    }

    const now = new Date();

    await parcels.updateOne(
      { _id: new ObjectId(parcel._id) },
      {
        $set: {
          assignedRiderId: availableRider._id,
          status: "pending_rider_approval",
          riderApprovalStatus: "pending",
          riderDeliveryStatus: "assigned",
          adminAssignment: true, // rider can't reject or handover
          deliveryType,
          updatedAt: now,
        },
        $push: {
          events: {
            type: "district_agent_assignment",
            by: districtAdminName,
            role: "district_admin",
            at: now,
            note: `Rider ${availableRider.name} (${availableRider._id}) assigned by district admin for ${deliveryType} delivery.`,
          },
        },
      }
    );

    return NextResponse.json({ ok: true, message: "Rider assigned successfully" });
  } catch (error) {
    console.error("Error assigning rider:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
