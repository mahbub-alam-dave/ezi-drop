import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { generateOtp, hashOtp } from "./otp";
import { assignRiderForDelivery, assignRiderToWarehouse } from "./assignRider";
import { sendEmail } from "./email";

export async function handlePostPaymentFunctionality(parcelId) {
  const parcels = dbConnect("parcels");

  const parcel = await parcels.findOne({ parcelId });
  if (!parcel) {
    console.error("❌ Parcel not found for post-payment:", parcelId);
    return;
  }

  // generate OTP and hash
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiry = new Date(Date.now() + 24 * 3600 * 1000);

  // same-district delivery
  if (parcel.pickupDistrictId === parcel.deliveryDistrictId) {
    // same district
    await assignRiderForDelivery(parcel);

    await parcels.updateOne(
      { _id: parcel._id },
      { $set: { secretCodeHash: otpHash, secretCodeExpiresAt: otpExpiry } }
    );

    if (parcel.receiverEmail) {
      await sendEmail({
        to: parcel.receiverEmail, 
        subject: "Your Delivery Code", 
        text: `Your delivery code: ${otp}. Share this code while rider deliver you the parcel. Track your parcel with trackingId: ${parcel.trackingId}`
    });
    }

    console.log("✅ Same district delivery handled successfully");

  } else {
    // cross-district delivery
    await assignRiderToWarehouse(parcel);

    const warehouse = await dbConnect("wirehouses").findOne({ wirehouseId: parcel.pickupDistrictId });

    await parcels.updateOne(
      { _id: parcel._id },
      {
        $set: {
          wirehouseAddress: wirehouse.address,
          secretCodeHash: otpHash,
          secretCodeExpiresAt: otpExpiry,
        },
      }
    );

    if (warehouse?.contactEmail) {
      await sendEmail({
        to: warehouse.contactEmail,
        subject: `Incoming parcel OTP for ${parcel.trackingId}`,
        text: `Parcel ID: ${parcel.parcelId}\nOTP: ${otp}`
    });
    }

    console.log("📦 Cross-district delivery handled successfully");
  }

  console.log(`✅ Post-payment handled for parcel ${parcelId}`);
}
