import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { generateOtp, hashOtp } from "./otp";
import { assignRiderForDelivery, assignRiderToWarehouse } from "./assignRider";
import { sendEmail } from "./email";

export async function handlePostPaymentFunctionality(parcelId) {
  try {
    const parcels = dbConnect("parcels");

    const parcel = await parcels.findOne({ parcelId });
    if (!parcel) {
      console.error("❌ Parcel not found for post-payment:", parcelId);
      return;
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiry = new Date(Date.now() + 24 * 3600 * 1000);

    let warehouse = null;
    let assignedRider = null;

    if (parcel.pickupDistrictId === parcel.deliveryDistrictId) {
      // same-district
      assignedRider = await assignRiderForDelivery(parcel);
    } else {
      // cross-district
      assignedRider = await assignRiderToWarehouse(parcel);
      // warehouse = await dbConnect("wirehouses").findOne({ wirehouseId: parcel.pickupDistrictId });
      pickupWarehouse = await dbConnect("wirehouses").findOne({ wirehouseId: parcel.pickupDistrictId });
      deliverWarehouse = await dbConnect("wirehouses").findOne({ wirehouseId: parcel.deliveryDistrictId });
    }

    if (!assignedRider) {
      console.warn("⚠️ No rider assigned after payment for parcel:", parcelId);
    }

    // Update parcel with OTP, warehouse info, timestamps, and event
    await parcels.updateOne(
      { _id: parcel._id },
      {
        $set: {
          secretCodeHash: otpHash,
          secretCodeExpiresAt: otpExpiry,
          // wirehouseAddress: warehouse?.address || "",
          pickupWirehouse: {location: pickupWarehouse?.address || "", lon: pickupWarehouse?.coords[0] || "", lat: pickupWarehouse?.coords[1] || ""},
          deliveryWirehouse: {location: deliverWarehouse?.address || "", lon: deliverWarehouse?.coords[0] || "", lat: deliverWarehouse?.coords[1] || ""},
          updatedAt: new Date(),
        },
        $push: {
          events: [
            {
              type: "post_payment_handled",
              by: "system",
              at: new Date(),
              note: `OTP generated and rider assigned.`,
            },
            assignedRider && {
              type: "rider_assigned_post_payment",
              by: assignedRider._id,
              role: "rider",
              at: new Date(),
              note: `Rider ${assignedRider.name} assigned after payment.`,
            },
          ].filter(Boolean),
        },
      }
    );

    // Send email
    if (parcel.pickupDistrictId === parcel.deliveryDistrictId && parcel.receiverEmail) {
      await sendEmail({
        to: parcel.receiverEmail,
        subject: "Your Delivery Code",
        text: `Your delivery code: ${otp}. Track your parcel with trackingId: ${parcel.trackingId}`,
      });
    } 
    
    if (parcel.pickupDistrictId !== parcel.deliveryDistrictId && warehouse?.contactEmail) {
      await sendEmail({
        to: "dakterkhujun@gmail.com",
        subject: `Incoming parcel OTP for ${parcel.trackingId}`,
        text: `Parcel ID: ${parcel.parcelId}\nOTP: ${otp}`,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`Generated OTP for parcel ${parcel.parcelId}: ${otp}`);
    }

    console.log(`✅ Post-payment handled for parcel ${parcelId}`);
  } catch (error) {
    console.error("❌ Error in post-payment handling:", error);
  }
}
