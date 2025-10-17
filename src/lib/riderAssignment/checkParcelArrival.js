// lib/checkParcelArrivals.js
import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect";

export async function checkParcelArrivals() {
  const now = new Date();
  const transfers = dbConnect("transfers");
  const parcels = dbConnect("parcels");

  // 1️⃣ Find all dispatched transfers whose expectedArrival has passed
  const dueTransfers = await transfers
    .find({
      status: "dispatched",
      expectedArrival: { $lte: now },
    })
    .toArray();

  if (!dueTransfers.length) {
    console.log("⏱️ No parcels due for arrival yet.");
    return;
  }

  console.log(`📦 Checking ${dueTransfers.length} dispatched parcels for arrival.`);

  for (const transfer of dueTransfers) {
    try {
      // 2️⃣ Update the transfer status to arrived
      await transfers.updateOne(
        { _id: new ObjectId(transfer._id) },
        {
          $set: {
            status: "arrived",
            arrivedAt: now,
            updatedAt: now,
          },
          $push: {
            events: {
              type: "parcel_arrived_receiver_warehouse",
              role: "system",
              at: now,
              note: `Parcel arrived at ${transfer.toDistrictId} warehouse.`,
            },
          },
        }
      );

      // 3️⃣ Update the corresponding parcel document
      const parcel = await parcels.findOne({
        transferId: new ObjectId(transfer._id),
      });

      if (!parcel) {
        console.warn(`⚠️ No linked parcel found for transfer ${transfer._id}`);
        continue;
      }

      await parcels.updateOne(
        { _id: new ObjectId(parcel._id) },
        {
          $set: {
            status: "arrived_at_receiver_warehouse",
            deliveryType: "to_receiver_final", // 🚚 ready for final delivery
            updatedAt: now,
          },
          $push: {
            events: {
              type: "parcel_arrived_receiver_warehouse",
              role: "system",
              at: now,
              note: `Parcel arrived at ${parcel.deliveryDistrict} warehouse and ready for final delivery.`,
            },
          },
        }
      );

      console.log(
        `✅ Parcel ${parcel.parcelId} marked as arrived in ${parcel.deliveryDistrict}.`
      );
    } catch (err) {
      console.error(
        `❌ Error updating parcel for transfer ${transfer._id}:`,
        err.message
      );
    }
  }

  console.log("🎯 Arrival check completed successfully.");
}
