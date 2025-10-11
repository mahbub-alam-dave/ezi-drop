import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { assignRiderForDelivery, assignRiderToWarehouse } from "@/lib/rider"; // implement these helper functions
import { generateOtp, hashOtp } from "./otp";
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
    await assignRiderForDelivery(db, parcel);

    await parcels.updateOne(
      { _id: parcel._id },
      { $set: { secretCodeHash: otpHash, secretCodeExpiresAt: otpExpiry } }
    );

    if (parcel.receiverEmail) {
      await sendEmail(parcel.receiverEmail, "Your Delivery Code", `Your delivery code: ${otp}`);
    }

    console.log("✅ Same district delivery handled successfully");

  } else {
    // cross-district delivery
    await assignRiderToWarehouse(db, parcel);

    await parcels.updateOne(
      { _id: parcel._id },
      {
        $set: {
          secretCodeHash: otpHash,
          secretCodeExpiresAt: otpExpiry,
        },
      }
    );

    const warehouse = await dbConnect(wirehouses).findOne({ wirehouseId: parcel.pickupDistrictId });
    if (warehouse?.contactEmail) {
      await sendEmail(
        warehouse.contactEmail,
        `Incoming parcel OTP for ${parcel.trackingId}`,
        `Parcel ID: ${parcel.parcelId}\nOTP: ${otp}`
      );
    }

    console.log("📦 Cross-district delivery handled successfully");
  }

  console.log(`✅ Post-payment handled for parcel ${parcelId}`);
}
