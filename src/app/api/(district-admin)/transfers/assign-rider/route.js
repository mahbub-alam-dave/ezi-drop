import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const { parcelId } = await req.json();
    if (!parcelId) {
      return NextResponse.json({ error: "Parcel ID is required" }, { status: 400 });
    }

    const transfers =  dbConnect("transfers");
    const parcels =  dbConnect("parcels");
    const users =  dbConnect("users");

    // 1️⃣ Find the transfer
    const transfer = await transfers.findOne({ parcelId });
    if (!transfer) {
      return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
    }

    // 2️⃣ Find an available rider in the toDistrict
    const availableRider = await users.findOne({
      role: "rider",
      districtId: transfer.toDistrictId,
      status: "active", // optional filter
    });

    if (!availableRider) {
      return NextResponse.json(
        { error: "No active rider found in this district" },
        { status: 404 }
      );
    }

    // 3️⃣ Update the transfer status and assign the rider
    await transfers.updateOne(
      { _id: new ObjectId(transfer._id) },
      {
        $set: {
          status: "rider_assigned",
          "assignedRider.id": availableRider._id,
          "assignedRider.name": availableRider.name,
          "assignedRider.contact": availableRider.phone || "",
          updatedAt: new Date(),
        },
        $push: {
          events: {
            type: "rider_assigned",
            by: availableRider._id,
            at: new Date(),
            note: `Rider ${availableRider.name} assigned for final delivery`,
          },
        },
      }
    );

    // 4️⃣ Update the parcel status too
    await parcels.updateOne(
      { parcelId },
      {
        $set: {
          status: "out_for_delivery",
          riderId: availableRider._id,
          updatedAt: new Date(),
        },
      }
    );

    // 5️⃣ Return success response
    return NextResponse.json({
      success: true,
      message: "Rider assigned successfully",
      rider: {
        id: availableRider._id,
        name: availableRider.name,
        districtId: availableRider.districtId,
      },
    });
  } catch (error) {
    console.error("Error assigning rider:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
