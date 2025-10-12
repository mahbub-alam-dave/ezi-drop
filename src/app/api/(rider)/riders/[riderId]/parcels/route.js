// app/api/riders/[riderId]/parcels/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  const { riderId } = params;
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

  // 📦 Rider’s accepted/completed orders (latest 10)
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
    .toArray();

  return NextResponse.json({ newOrders, parcels: recentParcels });
}
