import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  // ✅ Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in first." },
      { status: 401 }
    );
  }

  try {
    const db = dbConnect("service_areas");

    // Fetch all districts
    const serviceAreas = await db
      .find({})
      .toArray();

    return NextResponse.json({ districts: serviceAreas });
  } catch (err) {
    console.error("Error fetching service areas:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
