import { dbConnect } from "./dbConnect";

export async function calculateEarnings(parcelId) {

const parcel = await dbConnect("parcels").findOne({parcelId})

let earnings = {};
const total = parcel.baseAmount;

const sameDistrict = parcel.pickupDistrictId === parcel.deliveryDistrictId;

if (sameDistrict) {
  earnings = {
    totalAmount: total,
    companyShare: { percent: 20, amount: total * 0.20 },
    taxAndOthers: { percent: 5, amount: total * 0.05 },
    riders: [
      { role: "rider", riderId: null, percent: 75, amount: total * 0.75, earned: false }
    ],
    type: "same_district",
    computedAt: new Date(),
  };
} else {
  earnings = {
    totalAmount: total,
    companyShare: { percent: 25, amount: total * 0.25 },
    taxAndOthers: { percent: 5, amount: total * 0.05 },
    riders: [
      { role: "pickup_rider", riderId: null, percent: 30, amount: total * 0.35, earned: false },
      { role: "final_rider", riderId: null, percent: 30, amount: total * 0.35, earned: false },
    ],
    type: "cross_district",
    computedAt: new Date(),
  };
}

return earnings;
}