// app/api/transfers/route.js
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    // 1️⃣ Verify session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Connect DB
    const transfers = dbConnect("transfers");
    const users = dbConnect("users");

    // 3️⃣ Find the logged-in user’s districtId
    const user = await users.findOne({ _id: new ObjectId(session.user.userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const adminDistrictId = user.districtId;
    if (!adminDistrictId) {
      return NextResponse.json(
        { error: "No district assigned for admin" },
        { status: 400 }
      );
    }

    // 4️⃣ Fetch incoming parcels (status = dispatched)
    const parcels = await transfers
      .find({
        toDistrictId: adminDistrictId,
        status: "dispatched",
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ parcels });
  } catch (err) {
    console.error("❌ Error fetching parcels:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
