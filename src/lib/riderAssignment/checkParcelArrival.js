import { dbConnect } from "./dbConnect";
import { ObjectId } from "mongodb";

/**
 * ✅ Check parcels whose expectedArrival has passed and update them as arrived
 * @param {string} districtId - receiver district id
 * @param {string[]} statusList - optional, default ["dispatched"]
 */
export async function checkParcelArrivals(districtId, statusList = ["dispatched"]) {
  if (!districtId) return;

  const transfers = dbConnect("transfers");
  const now = new Date();

  // 1️⃣ Find parcels in the receiver district whose expectedArrival has passed
  const parcelsToUpdate = await transfers
    .find({
      toDistrictId: districtId,
      status: { $in: statusList },
      expectedArrival: { $lte: now },
    })
    .toArray();

  if (!parcelsToUpdate.length) return;

  // 2️⃣ Update each parcel
  const updates = parcelsToUpdate.map(async (parcel) => {
    await transfers.updateOne(
      { _id: new ObjectId(parcel._id) },
      {
        $set: {
          status: "arrived_at_receiver_warehouse",
          deliveryType: "to_receiver_final",
          updatedAt: now,
        },
        $push: {
          events: {
            type: "arrived_at_receiver_warehouse",
            role: "system",
            by: "system",
            at: now,
            note: "Parcel reached receiver district warehouse.",
          },
        },
      }
    );
  });

  await Promise.all(updates);
  return parcelsToUpdate.map(p => p._id.toString());
}
