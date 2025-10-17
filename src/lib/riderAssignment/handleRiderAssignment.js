import { ObjectId } from "mongodb";
import { dbConnect } from "../dbConnect"
import { findAvailableRider }  from "./findAvailableRider";

export default async function handleRiderAssignment(parcel, deliveryType, isReassign = false) {
  const parcels = dbConnect("parcels");
  const now = new Date();
  const excludeRiderId = isReassign ? parcel.assignedRiderId : null;

    let districtForAssignment;

  if (deliveryType === "to_warehouse" || deliveryType === "to_customer") {
    districtForAssignment = parcel.pickupDistrictId; // pickup-side
  } else if (deliveryType === "to_receiver_final") {
    districtForAssignment = parcel.deliveryDistrictId; // receiver-side
  } else {
    throw new Error(`Unknown delivery type: ${deliveryType}`);
  }


  const availableRider = await findAvailableRider(districtForAssignment, excludeRiderId);
  if (!availableRider) {
    await parcels.updateOne(
      { _id: new ObjectId(parcel._id) },
      {
        $set: {
          status: "waiting_for_rider",
          riderApprovalStatus: "unavailable",
          updatedAt: now,
        },
        $push: {
          events: {
            type: "rider_unavailable",
            role: "system",
            at: now,
            note: `No available rider for ${deliveryType} in ${parcel.pickupDistrictId}.`,
          },
        },
      }
    );
    return null;
  }


  await parcels.updateOne(
    { _id: new ObjectId(parcel._id) },
    {
      $set: {
        assignedRiderId: availableRider._id,
        status: "pending_rider_approval",
        riderApprovalStatus: "pending",
        riderDeliveryStatus: "assigned",
        deliveryType,
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
          } for ${deliveryType} delivery.`,
        },
      },
    }
  );

  return availableRider;
}
