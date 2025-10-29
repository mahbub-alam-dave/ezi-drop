import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { hashOtp } from "@/lib/otp";
import { sendEmail } from "@/lib/email";

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

          // ✅ 2. Send feedback emails to both sender and receiver
    const feedbackLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reviews-and-ratings?parcelId=${parcelId}`;

    const senderEmail = parcel.senderEmail;
    const receiverEmail = parcel.receiverEmail;

    const subject = `Parcel ${parcel.parcelId} Delivered Successfully 🎉`;

    const message = `
      <p>Dear User,</p>
      <p>Your parcel <strong>${parcel.parcelId}</strong> has been successfully delivered to the receiver.</p>
      <p>We’d love to hear your feedback on your experience and the assigned rider.</p>
      <p><a href="${feedbackLink}" style="background-color:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Share Your Review</a></p>
      <p>Thank you for using <strong>EZI Drop</strong>!</p>
    `;

    try {
      // Send to receiver
      if (receiverEmail) {
        await sendEmail(receiverEmail, subject, message);
      }

      // Send to sender
      if (senderEmail) {
        await sendEmail(senderEmail, subject, message);
      }

      console.log(`📧 Feedback emails sent for parcel ${parcel.parcelId}`);
    } catch (error) {
      console.error("❌ Failed to send feedback emails:", error.message);
    }

    // ✅ 3. Respond to client
    return NextResponse.json({
      success: true,
      message: "Parcel marked as completed successfully and emails sent",
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
