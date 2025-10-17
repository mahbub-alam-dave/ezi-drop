import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { hashOtp } from "@/lib/otp";

export async function PATCH(req, { params }) {
  try {
    const { parcelId } = params;
    const { secretCode } = await req.json();

    console.log(secretCode)

    if (!secretCode) {
      return NextResponse.json(
        { success: false, message: "Secret code is required" },
        { status: 400 }
      );
    }

    const parcels =  dbConnect("parcels");
    const parcel = await parcels.findOne({ _id: new ObjectId(parcelId) });

    if (!parcel) {
      return NextResponse.json(
        { success: false, message: "Parcel not found" },
        { status: 404 }
      );
    }

    // 🔐 Verify secret code
    const hashedInput = hashOtp(secretCode);
    console.log(parcel.secretCodeHash, hashedInput)
    if (parcel.secretCodeHash !== hashedInput) {
      return NextResponse.json(
        { success: false, message: "Invalid secret code" },
        { status: 400 }
      );
    }

    const now = new Date();
    const events = [];

    /**
     * ✅ Case 1: Same district — mark as completed
     */
    if (parcel.pickupDistrictId === parcel.deliveryDistrictId || parcel.deliveryType === "to_receiver_final") {
      await parcels.updateOne(
        { _id: new ObjectId(parcelId) },
        {
          $set: {
            status: "completed",
            riderDeliveryStatus: "completed",
            completedAt: now,
            updatedAt: now,
          },
          $push: {
            events: {
              type: "delivery_completed",
              by: parcel.assignedRiderId,
              role: "rider",
              at: now,
              note: "Parcel delivered successfully to the receiver",
            },
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Parcel marked as completed successfully",
      });
    }

    /**
     * 🏢 Case 2: Cross-district delivery — send to local warehouse
     */
    const transfers = dbConnect("transfers");

    // 🧾 Create transfer request
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
          type: "transfer_requested",
          by: parcel.assignedRiderId,
          at: now,
          note: "Rider delivered parcel to local warehouse for transfer",
        },
      ],
    };

    const { insertedId } = await transfers.insertOne(transferDoc);

    // 🧩 Update parcel status
    await parcels.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          status: "at_local_warehouse",
          riderDeliveryStatus: "delivered_to_warehouse",
          transferId: insertedId,
          updatedAt: now,
        },
        $push: {
          events: {
            type: "delivered_to_local_warehouse",
            by: parcel.assignedRiderId,
            role: "rider",
            at: now,
            note: "Parcel dropped at local warehouse for transfer",
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Parcel sent to local warehouse for transfer",
    });
  } catch (error) {
    console.error("❌ Error in completing parcel:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while completing parcel",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
