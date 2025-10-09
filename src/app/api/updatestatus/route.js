import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { parcelId } = await req.json();

    if (!parcelId) {
      return new Response(JSON.stringify({ success: false, error: "Parcel ID is required" }), {
        status: 400,
      });
    }

    const parcelsCollection = await dbConnect("parcels");
    const ridersCollection = await dbConnect("rider-applications");

    // finding parcels
    const parcel = await parcelsCollection.findOne({ parcelId });
    if (!parcel) {
      return new Response(JSON.stringify({ success: false, error: "Parcel not found" }), {
        status: 404,
      });
    }

    // Parcel status updating
    await parcelsCollection.updateOne(
      { parcelId },
      { $set: { "assignedRider.status": "completed" } }
    );

    const riderId = parcel.assignedRider.riderId;

    //  Rider pending parcels count checking
    const pendingParcels = await parcelsCollection.find({
      "assignedRider.riderId": riderId,
      "assignedRider.status": "pending",
    }).toArray();

    //  Rider status updating
    const newStatus = pendingParcels.length > 0 ? "busy" : "active";
    await ridersCollection.updateOne(
      { _id: new ObjectId(riderId) },
      { $set: { workstatus: newStatus } }
    );

    return new Response(JSON.stringify({ success: true, message: "Parcel updated", newStatus }), {
      status: 200,
    });

  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
