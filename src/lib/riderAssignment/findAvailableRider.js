import { ObjectId } from "mongodb";

const { dbConnect } = require("../dbConnect");

export async function findAvailableRider(districtId, excludeRiderId = null) {
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