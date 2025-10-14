import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req, { params }) {

    const session = await getServerSession(authOptions)

  const { parcelId } = params;
  const transfers = dbConnect("transfers");
  const parcels = dbConnect("parcels");

  const now = new Date();

  // 1️⃣ Update transfer record
  const result = await transfers.updateOne(
    { parcelId },
    {
      $set: {
        status: "dispatched",
        dispatchedAt: now,
        updatedAt: now,
      },
      $push: {
        events: {
          type: "dispatched",
          by: session?.user?.userId,
          role: "district_admin",
          at: now,
          note: "Parcel dispatched from local warehouse to destination district.",
        },
      },
    }
  );

  // 2️⃣ Update main parcel record
  await parcels.updateOne(
    { parcelId },
    {
      $set: {
        status: "in_transit", // or "dispatched", depending on your naming convention
        updatedAt: now,
      },
      $push: {
        events: {
          type: "dispatched",
          by: session?.user?.userId,
          role: "district_admin",
          at: now,
          note: "Parcel left sender district and is in transit to destination.",
        },
      },
    }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { success: false, message: "No transfer record found for this parcel." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Parcel dispatched successfully.",
  });
}
