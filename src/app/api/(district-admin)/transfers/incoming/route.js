import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { checkParcelArrivals } from "@/lib/riderAssignment/checkParcelArrival";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = dbConnect("users");
    const transfers = dbConnect("transfers");

    const user = await users.findOne({ _id: new ObjectId(session.user.userId) });
    if (!user || !user.districtId)
      return NextResponse.json({ error: "No district assigned" }, { status: 400 });

    const districtId = user.districtId;

    // 🔔 Check and update parcels whose expectedArrival has passed
    await checkParcelArrivals(districtId);

    // 4️⃣ Fetch all dispatched + arrived parcels
    const parcels = await transfers
      .find({
        toDistrictId: districtId,
        status: { $in: ["dispatched", "arrived"] },
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ parcels });
  } catch (err) {
    console.error("❌ Error fetching parcels:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
