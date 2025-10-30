import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const { districtId } = await req.json();
    const session = await getServerSession(authOptions)
    const districtId = session?.user?.districtId;
    const parcels = dbConnect("parcels");

    const result = await parcels
      .find({
        status: "waiting_for_rider",
        riderApprovalStatus: "unavailable",
        $or: [
          { deliveryType: "to_receiver", pickupDistrictId: districtId },
          { deliveryType: "to_warehouse", pickupDistrictId: districtId },
          { deliveryType: "to_receiver_final", deliveryDistrictId: districtId },
        ],
      })
      .toArray();

    return NextResponse.json({ ok: true, parcels: result });
  } catch (error) {
    console.error("Error fetching parcels:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
