import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect";

/**
 * 🔁 Helper to find available rider in a district
 * Optionally exclude a specific rider (for reassignment)
 */
async function findAvailableRider(districtId, excludeRiderId = null) {
  const users = dbConnect("users");

  const query = {
    role: "rider",
    districtId,
    working_status: "duty",
  };

  if (excludeRiderId) {
    query._id = { $ne: new ObjectId(excludeRiderId) }; // exclude current rider
  }

  const availableRider = await users.findOne(query);
  return availableRider;
}

/**
 * 🚴 Assign or Reassign Rider (for same-district delivery)
 */
export async function assignRiderForDelivery(parcel, isReassign = false) {
  const parcels = dbConnect("parcels");

  // 🧭 Find a rider
  const excludeRiderId = isReassign ? parcel.assignedRiderId : null;
  const availableRider = await findAvailableRider(parcel.pickupDistrictId, excludeRiderId);

  if (!availableRider) {
    console.warn(`⚠️ No available rider for district ${parcel.pickupDistrictId}`);
    await parcels.updateOne(
      { _id: new ObjectId(parcel._id) },
      {
        $set: {
          status: "waiting_for_rider",
          riderApprovalStatus: "unavailable",
          updatedAt: new Date(),
        },
      }
    );
    return;
  }

  // 🚀 Assign (or reassign)
  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "pending_rider_approval",
        riderApprovalStatus: "pending",
        deliveryType: "to_customer",
        updatedAt: new Date(),
      },
    }
  );

  console.log(
    `✅ Rider ${availableRider.name} ${
      isReassign ? "reassigned" : "assigned"
    } to parcel ${parcel.parcelId}`
  );
}

/**
 * 🏢 Assign or Reassign Rider (for cross-district delivery to warehouse)
 */
export async function assignRiderToWarehouse(parcel, isReassign = false) {
  const parcels = dbConnect("parcels");

  // 🧭 Find a rider under sender district
  const excludeRiderId = isReassign ? parcel.assignedRiderId : null;
  const availableRider = await findAvailableRider(parcel.pickupDistrictId, excludeRiderId);

  if (!availableRider) {
    console.warn(`⚠️ No available rider for sender district ${parcel.pickupDistrictId}`);
    await parcels.updateOne(
      { _id: new ObjectId(parcel._id) },
      {
        $set: {
          status: "waiting_for_rider",
          riderApprovalStatus: "unavailable",
          updatedAt: new Date(),
        },
      }
    );
    return;
  }

  // 🚀 Assign (or reassign)
  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "pending_rider_approval",
        riderApprovalStatus: "pending",
        deliveryType: "to_warehouse",
        updatedAt: new Date(),
      },
    }
  );

  console.log(
    `🚚 Rider ${availableRider.name} ${
      isReassign ? "reassigned" : "assigned"
    } to deliver parcel ${parcel.parcelId} to warehouse`
  );
}
