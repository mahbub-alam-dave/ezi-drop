import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const districtId = session?.user?.districtId;

    if (!districtId) {
      return NextResponse.json(
        { ok: false, message: "District ID not found in session" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // optional filter param

    const users = dbConnect("users");

    const query = {
      role: "rider",
      districtId,
    };

    if (status) {
      query.status = status; // apply filter only if provided
    }

    const result = await users.find(query).toArray();

    return NextResponse.json({ ok: true, riders: result });
  } catch (error) {
    console.error("Error fetching riders:", error);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
