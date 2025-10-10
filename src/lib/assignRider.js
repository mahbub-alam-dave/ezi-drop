
import { dbConnect } from "./dbConnect";

// =========================
// 1️⃣ Assign Rider (same district)
// =========================
export async function assignRiderForDelivery(db, parcel) {
  const riders = dbConnect("users"); // assuming riders are stored in users collection
  const parcels = dbConnect("parcels");

  // find a rider under the same district
  const availableRider = await riders.findOne({
    role: "rider",
    districtId: parcel.sender.districtId,
    isActive: true,
    currentLoad: { $lt: 10 } // example rule: max 10 parcels
  });

  if (!availableRider) {
    console.warn("⚠️ No rider available for district", parcel.sender.districtId);
    return;
  }

  // assign parcel to rider
  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "assigned_to_rider",
        updatedAt: new Date(),
      },
    }
  );

  console.log(`✅ Rider ${availableRider.name} assigned to parcel ${parcel.parcelId}`);
}


// =========================
// 2️⃣ Assign Rider (cross district — deliver to warehouse)
// =========================
export async function assignRiderToWarehouse(db, parcel) {
  const riders = dbConnect("users");
  const parcels = dbConnect("parcels");

  // find a rider under the sender district
  const availableRider = await riders.findOne({
    role: "rider",
    districtId: parcel.sender.districtId,
    isActive: true,
    currentLoad: { $lt: 10 },
  });

  if (!availableRider) {
    console.warn("⚠️ No rider available for sender district", parcel.sender.districtId);
    return;
  }

  // assign the rider to deliver to warehouse
  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "out_for_pickup_to_warehouse",
        updatedAt: new Date(),
      },
    }
  );

  console.log(`🚚 Rider ${availableRider.name} assigned to deliver parcel ${parcel.parcelId} to warehouse`);
}