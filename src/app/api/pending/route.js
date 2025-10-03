import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const riderId = searchParams.get("riderId"); // query riderId 

    if (!riderId) {
      return new Response(JSON.stringify({ success: false, error: "Rider ID is required" }), { status: 400 });
    }

    const ridersCollection = await dbConnect("rider-applications");
    const parcelsCollection = await dbConnect("parcels");

    const rider = await ridersCollection.findOne({ _id: new ObjectId(riderId) });
    if (!rider) {
      return new Response(JSON.stringify({ success: false, error: "Rider not found" }), { status: 404 });
    }

    const riderObjectId = new ObjectId(riderId);

    const allParcels = await parcelsCollection.find({ "assignedRider.riderId": riderObjectId }).toArray();

    const pendingParcels = allParcels.filter(parcel => parcel.assignedRider.status === "pending");
    const completedParcels = allParcels.filter(parcel => parcel.assignedRider.status === "completed");

    return new Response(JSON.stringify({
      success: true,
      data: {
        riderName: rider.applicantName,
        riderStatus: rider.workstatus || "unknown",
        pendingCount: pendingParcels.length,
        completedCount: completedParcels.length,
        pendingParcels,
        completedParcels,
      }
    }), { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
