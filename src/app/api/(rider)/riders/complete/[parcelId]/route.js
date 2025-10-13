import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { hashOtp } from "@/lib/otp";

export async function PATCH(req, { params }) {
  try {
    const { parcelId } = params;
    const { secretCode } = await req.json();

    if (!secretCode) {
      return NextResponse.json(
        { success: false, message: "Secret code is required" },
        { status: 400 }
      );
    }

    const parcels = dbConnect("parcels"); // ✅ ensure dbConnect returns awaited collection
    const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });

    if (!parcel) {
      return NextResponse.json(
        { success: false, message: "Parcel not found" },
        { status: 404 }
      );
    }

    // 🔐 Compare hashed codes
    const hashedInput = hashOtp(secretCode);
    console.log("Hashed input:", hashedInput);
    console.log("Stored hash:", parcel.secretCodeHash);

    if (parcel.secretCodeHash !== hashedInput) {
      return NextResponse.json(
        { success: false, message: "Invalid secret code" },
        { status: 400 }
      );
    }

    const now = new Date();

    // ✅ Same district — directly completed
    if (parcel.pickupDistrictId === parcel.deliveryDistrictId) {
      await parcels.updateOne(
        { _id: new ObjectId(parcelId) },
        {
          $set: {
            status: "completed",
            completedAt: now,
            updatedAt: now,
          },
        }
      );
    } else {
      // 🏬 Different districts — send to local warehouse
      await parcels.updateOne(
        { _id: new ObjectId(parcelId) },
        {
          $set: {
            status: "at_local_warehouse",
            updatedAt: now,
          },
        }
      );

      // 🧾 Create transfer document
      const transfers = dbConnect("transfers");
      const transferDoc = {
        parcelId: parcel.parcelId,
        fromDistrictId: parcel.pickupDistrictId,
        toDistrictId: parcel.deliveryDistrictId,
        status: "requested",
        createdBy: { type: "rider", id: parcel.assignedRiderId },
        createdAt: now,
        updatedAt: now,
        events: [
          {
            type: "created",
            by: parcel.assignedRiderId,
            at: now,
          },
        ],
      };

      const { insertedId } = await transfers.insertOne(transferDoc);

      await parcels.updateOne(
        { _id: new ObjectId(parcelId) },
        {
          $set: {
            transferId: insertedId,
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        parcel.pickupDistrictId === parcel.deliveryDistrictId
          ? "Parcel marked as completed"
          : "Parcel sent to local warehouse for transfer",
    });
  } catch (error) {
    console.error("❌ Error in completing parcel:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
