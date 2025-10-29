// app/api/riders/[riderId]/parcels/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req, { params }) {
  // const { riderId } = params;
  const session = await getServerSession(authOptions)
  const riderId = session?.user?.userId
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // 'pending' or 'completed'

//   const db = await getDb();
  const parcels = dbConnect("parcels");

  // 🆕 New Orders waiting for rider approval
  const newOrders = await parcels
    .find({
      assignedRiderId: new ObjectId(riderId),
      status: "pending_rider_approval",
      riderApprovalStatus: "pending",
    })
    .sort({ createdAt: -1 })
    .toArray();

  /* // 📦 Rider’s accepted/completed orders (latest 10)
  const matchQuery = {
    assignedRiderId: new ObjectId(riderId),
    riderApprovalStatus: "accepted",
  };

  if (status === "pending") {
    matchQuery.status = { $ne: "completed" };
  } else if (status === "completed") {
    matchQuery.status = "completed";
  }

  const recentParcels = await parcels
    .find(matchQuery)
    .sort({ updatedAt: -1 })
    .limit(10)
    .toArray(); */
    const baseQuery = { assignedRiderId: new ObjectId(riderId) };

// 1️⃣ Primary query: accepted & not completed
const primaryQuery = {
  ...baseQuery,
  riderApprovalStatus: "accepted",
  status: { $ne: "completed" },
};

let recentParcels = await parcels
  .find(primaryQuery)
  .sort({ updatedAt: -1 })
  .limit(10)
  .toArray();

// 2️⃣ If fewer than 10 results, fill with others
if (recentParcels.length < 10) {
  const remaining = 10 - recentParcels.length;

  // Fallback query: same rider, any other parcels (e.g., completed or other statuses)
  const fallbackQuery = {
    ...baseQuery,
    riderApprovalStatus: "accepted",
    _id: { $nin: recentParcels.map((p) => p._id) }, // avoid duplicates
  };

  const additionalParcels = await parcels
    .find(fallbackQuery)
    .sort({ updatedAt: -1 })
    .limit(remaining)
    .toArray();

  // Merge both lists
  recentParcels = [...recentParcels, ...additionalParcels];
}

  return NextResponse.json({ newOrders, parcels: recentParcels });
}
