import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { assignRiderForDelivery, assignRiderToWarehouse } from "@/lib/rider"; // implement these helper functions
import { generateOtp, hashOtp } from "./otp";
import { sendEmail } from "./email";

export async function handlePostPayment(parcelId) {
  const parcels = dbConnect("parcels");

  const parcel = await parcels.findOne({ parcelId });
  if (!parcel) {
    console.error("❌ Parcel not found for post-payment:", parcelId);
    return;
  }

  // generate OTP and hash
  const otp = generateOtp();
  const hash = hashOtp(otp);
  const expires = new Date(Date.now() + 24 * 3600 * 1000);

  // same-district delivery
  if (parcel.senderDistrict === parcel.receiverDistrict) {
    await assignRiderForDelivery(parcel.senderDistrict, parcel._id);
    await parcels.updateOne(
      { parcelId },
      { $set: { status: "rider_assigned", secretCodeHash: hash, secretCodeExpiresAt: expires } }
    );

    // assign rider for same district
    await assignRiderForDelivery(parcel)

    // send to receiver
    if (parcel.receiverEmail) {
      await sendEmail(parcel.receiverEmail, "Your Delivery Code", `Your delivery code is: ${otp}`);
    }

  } else {
    // cross-district
    await assignRiderToWarehouse(parcel.senderDistrict, parcel._id);
    await parcels.updateOne(
      { parcelId },
      { $set: { status: "out_for_pickup_to_warehouse", secretCodeHash: hash, secretCodeExpiresAt: expires } }
    );

    await assignRiderToWarehouse(parcel)

    // find warehouse contact
    const warehouse = await dbConnect("warehouses").findOne({
      districtId: parcel.senderDistrictId,
    });
    if (warehouse?.contactEmail) {
      await sendEmail(
        warehouse.contactEmail,
        `Parcel incoming for warehouse ${parcel.senderDistrict}`,
        `Your OTP for this incoming parcel: ${otp}`
      );
    }
  }

  console.log(`✅ Post-payment handled for parcel ${parcelId}`);
}
