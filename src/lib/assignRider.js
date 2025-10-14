import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect";

/**
 * 🔍 Find available rider in a district
 * Optionally exclude a specific rider (for reassignment)
 */
async function findAvailableRider(districtId, excludeRiderId = null) {
  const users = dbConnect("users");

  const query = {
    role: "rider",
    districtId,
    working_status: "duty", // ✅ only active riders
  };

  if (excludeRiderId) {
    query._id = { $ne: new ObjectId(excludeRiderId) }; // exclude current rider
  }

  return await users.findOne(query);
}

/**
 * 🚴 Assign or Reassign Rider (for same-district delivery)
 */
export async function assignRiderForDelivery(parcel, isReassign = false) {
  const parcels = dbConnect("parcels");
  const now = new Date();

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
          riderDeliveryStatus: null,
          updatedAt: now,
        },
        $push: {
          events: {
            type: "rider_unavailable",
            role: "system",
            at: now,
            note: `No available rider found in ${parcel.pickupDistrictId}.`,
          },
        },
      }
    );
    return;
  }

  // 🚀 Assign or reassign
  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "pending_rider_approval",
        riderApprovalStatus: "pending", // 🕐 waiting for rider to accept
        riderDeliveryStatus: "assigned", // 🧭 assigned but not accepted yet
        deliveryType: "to_customer",
        updatedAt: now,
      },
      $push: {
        events: {
          type: isReassign ? "rider_reassigned" : "rider_assigned",
          by: "system",
          role: "system",
          at: now,
          note: `Rider ${availableRider.name} (${availableRider._id}) ${
            isReassign ? "reassigned" : "assigned"
          } for delivery.`,
        },
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
  const now = new Date();

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
          riderDeliveryStatus: null,
          updatedAt: now,
        },
        $push: {
          events: {
            type: "rider_unavailable",
            role: "system",
            at: now,
            note: `No available rider found in ${parcel.pickupDistrictId}.`,
          },
        },
      }
    );
    return;
  }

  // 🚀 Assign (or reassign) for warehouse delivery
  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "pending_rider_approval",
        riderApprovalStatus: "pending",
        riderDeliveryStatus: "assigned",
        deliveryType: "to_warehouse",
        updatedAt: now,
      },
      $push: {
        events: {
          type: isReassign ? "rider_reassigned" : "rider_assigned",
          by: "system",
          role: "system",
          at: now,
          note: `Rider ${availableRider.name} (${availableRider._id}) ${
            isReassign ? "reassigned" : "assigned"
          } for warehouse delivery.`,
        },
      },
    }
  );

  console.log(
    `🚚 Rider ${availableRider.name} ${
      isReassign ? "reassigned" : "assigned"
    } to deliver parcel ${parcel.parcelId} to warehouse`
  );
}
