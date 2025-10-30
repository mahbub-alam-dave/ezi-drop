import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const { districtId, deliveryType } = await req.json();
    const session = await getServerSession(authOptions)
    const districtId = session?.user?.districtId;
    
    const riders = dbConnect("users"); // assuming your riders are stored in users collection

    const result = await riders
      .find({
        role: "rider",
        status: "duty",
        $or: [
          { districtId: districtId },
        ],
      })
      .toArray();

    return NextResponse.json({ ok: true, riders: result });
  } catch (error) {
    console.error("Error fetching riders:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
